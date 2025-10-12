import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Content } from "@google/genai";
import { generateWebsite, WebsiteFile, fileToBase64 } from '../services/geminiService';
import Spinner from './Spinner';
import PromptInput, { PromptInputRef } from './PromptInput';
import { Tool } from '../types';
import { Project } from './Dashboard';
import { Theme } from '../App';
import ThemeToggleButton from './ThemeToggleButton';
import UserProfilePopover from './UserProfilePopover';
import { SettingsTab } from './SettingsModal';
import { KeyRound } from 'lucide-react';

// Declare highlight.js, JSZip, and html2canvas for TypeScript
declare const hljs: any;
declare const JSZip: any;
declare const html2canvas: any;
// Declare js-beautify for code formatting
declare const js_beautify: (code: string, options?: any) => string;
declare const css_beautify: (code: string, options?: any) => string;
declare const html_beautify: (code: string, options?: any) => string;

interface DevDraftProps {
  setActiveTool: (tool: Tool) => void;
  onToggleNotifications: () => void;
  unreadCount: number;
  onToggleCommandPalette: () => void;
  projects: Project[];
  onRenameProject: (projectId: string, newName: string) => void;
  onDeleteProject: (projectId: string) => void;
  onAddProject: (project: Omit<Project, 'id' | 'timestamp'>) => string;
  onUpdateProject: (projectId: string, updatedData: Partial<Omit<Project, 'id'>>) => void;
  loadedProject: Project | null;
  onProjectLoaded: () => void;
  customApiKey: string | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  onOpenSettings: (tab?: SettingsTab) => void;
  onSaveApiKey: (apiKey: string) => Promise<void>;
  onLogout: () => void;
}

type ConversationTurn = {
  role: 'user' | 'model';
  text: string;
  sentImages?: { url: string; name: string }[];
};

type WorkspaceView = 'code' | 'preview';
type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

const suggestionPrompts = [
  { title: 'Portfolio Website', prompt: 'Create a modern, single-page portfolio for a photographer named Jane Doe. Include a hero section, an "About Me" section, a gallery, and a contact form.' },
  { title: 'SaaS Pricing Table', prompt: 'Create a pricing page with three tiers: Basic, Pro, and Enterprise. Each tier should have a list of features and a call-to-action button.' },
  { title: 'E-commerce Product Page', prompt: 'Build a product page for a minimalist watch. It should have a large product image, description, price, and an "Add to Cart" button.' },
  { title: '"Link in Bio" Page', prompt: 'Build a simple "link in bio" page for a social media profile, with a profile picture, name, and a list of links.' },
  { title: 'Blog Layout', prompt: 'Design a clean and simple layout for a travel blog, with a header, a list of recent posts with thumbnails, and a footer.' },
  { title: 'Weather App UI', prompt: 'Design the UI for a weather app. It should show the current temperature, a weather icon, the city name, and a 5-day forecast.' },
  { title: 'Login Form', prompt: 'Generate a stylish login form with email and password fields, a "Forgot Password" link, and a prominent login button. Center it on the page.' },
  { title: 'Recipe Card', prompt: 'Generate a recipe card for "Chocolate Chip Cookies" with a title, an image placeholder, an ingredients list, and step-by-step instructions.' },
];

const getElementSelector = (el: Element): string => {
    if (el.tagName.toLowerCase() === 'body') {
        return 'body';
    }
    if (el.id) {
        if (/^[a-zA-Z][\w-]*$/.test(el.id)) {
            return `#${el.id}`;
        }
    }
    
    const path: string[] = [];
    let currentEl: Element | null = el;

    while (currentEl && currentEl.parentElement && currentEl.tagName.toLowerCase() !== 'body') {
        const parent = currentEl.parentElement;
        const siblings = Array.from(parent.children);
        const index = siblings.indexOf(currentEl) + 1;

        let selector = `${currentEl.tagName.toLowerCase()}:nth-child(${index})`;
        path.unshift(selector);
        currentEl = parent;
    }

    return `body > ${path.join(' > ')}`;
};


// --- Icon Components ---

const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </button>
);

const NotificationBell: React.FC<{ onClick: () => void; notificationCount: number; }> = ({ onClick, notificationCount }) => (
    <button onClick={onClick} className="relative p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notificationCount > 0 && (
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
        )}
    </button>
);

const UserIcon = () => (
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center flex-shrink-0 border border-zinc-300 dark:border-zinc-600 shadow-sm">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  </div>
);

const AIIcon = () => (
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-800 to-black dark:from-zinc-900 dark:to-black flex items-center justify-center flex-shrink-0 border border-zinc-700 dark:border-zinc-700 shadow-sm">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 dark:text-gray-400" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 7l5 5l-5 5" />
      <line x1="12" y1="19" x2="19" y2="19" />
    </svg>
  </div>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const DesktopIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const TabletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const MobileIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M17 21h-2a2 2 0 01-2-2v-1a2 2 0 012-2h2a2 2 0 012 2v1a2 2 0 01-2 2zM9 21H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2h-2" /></svg>);
const ElementSelectorIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v4c0 .6.4 1 1 1h4"/>
    <path d="M3 21v-4c0-.6.4-1 1-1h4"/>
    <path d="M21 3v4c0 .6-.4 1-1 1h-4"/>
    <path d="M21 21v-4c0-.6-.4-1 1-1h-4"/>
    <path d="m9 9 5 12 1.8-5.2L21 14Z"/>
</svg>);
const ExternalLinkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>);
const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const ZipIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21V11.5a1.5 1.5 0 00-1.5-1.5H18V5.5A1.5 1.5 0 0016.5 4h-4A1.5 1.5 0 0011 5.5V10H8.5A1.5 1.5 0 007 11.5V21" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5h14M11 5.5V4a1 1 0 00-1-1H6a1 1 0 00-1 1v14a1 1 0 001 1h4" /></svg>);
const ImageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>);
const FileIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const RefreshIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /> </svg> );
const CopyIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /> <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H4z" /> </svg> );
const CheckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /> </svg> );
const CloudIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>);
const ProjectsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>);
const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>);
const DotsVerticalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>);
const LightbulbIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> </svg>);
const ChevronLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /> </svg> );
const ChevronRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /> </svg> );
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>);

const getFileLanguage = (fileName: string | null): string => {
  if (!fileName) return 'plaintext';
  const extension = fileName.split('.').pop();
  switch (extension) {
    case 'html': return 'html';
    case 'css': return 'css';
    case 'js': return 'javascript';
    case 'json': return 'json';
    case 'md': return 'markdown';
    default: return 'plaintext';
  }
};

const ExportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  files: WebsiteFile[];
  iframePreviewRef: React.RefObject<HTMLIFrameElement>;
}> = ({ isOpen, onClose, files, iframePreviewRef }) => {
  const [isCapturing, setIsCapturing] = useState(false);

  if (!isOpen) return null;

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    if (files.length === 0 || typeof JSZip === 'undefined') {
      alert("No files to download or ZIP library not loaded.");
      return;
    }
    const zip = new JSZip();
    files.forEach(file => {
      zip.file(file.name, file.content);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAsImage = async () => {
    if (!iframePreviewRef.current?.contentWindow?.document.body || typeof html2canvas === 'undefined') {
      alert("Preview is not available or screenshot library not loaded.");
      return;
    }
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(iframePreviewRef.current.contentWindow.document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff', // Set a background for transparency
      });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'website-design.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      alert("Failed to capture website screenshot.");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-xl shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold">Export Project</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Export as Code</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 bg-zinc-100/50 dark:bg-zinc-900/50">
              {files.map(file => (
                <div key={file.name} className="flex justify-between items-center bg-zinc-200/50 dark:bg-zinc-800/50 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <FileIcon />
                    <span className="font-mono text-sm">{file.name}</span>
                  </div>
                  <button onClick={() => handleDownloadFile(file.name, file.content)} title={`Download ${file.name}`} className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    <DownloadIcon />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleDownloadZip} className="w-full flex justify-center items-center gap-2 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 hover:from-zinc-700 hover:to-zinc-800 mt-3">
              <ZipIcon />
              Download All (.zip)
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Export as Design</h3>
            <button onClick={handleDownloadAsImage} disabled={isCapturing} className="w-full flex justify-center items-center gap-2 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 hover:from-zinc-700 hover:to-zinc-800 disabled:opacity-50 disabled:cursor-wait disabled:hover:from-zinc-800">
              {isCapturing ? (
                <>
                  <Spinner />
                  <span>Capturing...</span>
                </>
              ) : (
                <>
                  <ImageIcon />
                  <span>Download as Image (.png)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SaveProjectModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold">Save Project</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"><CloseIcon /></button>
                </div>
                <div className="p-6 space-y-4">
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Project Name</label>
                    <input
                        id="projectName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., My Awesome Portfolio"
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg p-2.5 focus:ring-gray-500 focus:border-gray-500"
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={onClose} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg font-semibold">Cancel</button>
                        <button onClick={handleSave} disabled={!name.trim()} className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-semibold disabled:opacity-50">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    onLoad: (projectId: string) => void;
    onDelete: (projectId: string) => void;
    onRename: (projectId: string, newName: string) => void;
}> = ({ isOpen, onClose, projects, onLoad, onDelete, onRename }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    if (!isOpen) return null;

    const filteredProjects = projects.filter(p => p.tool === Tool.DEV_DRAFT && p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleStartRename = (project: Project) => {
        setRenamingProjectId(project.id);
        setRenameValue(project.name);
        setActiveMenu(null);
    };

    const handleConfirmRename = () => {
        if (renamingProjectId && renameValue.trim()) {
            onRename(renamingProjectId, renameValue.trim());
        }
        setRenamingProjectId(null);
        setRenameValue('');
    };
    
    const handleDelete = (projectId: string) => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            onDelete(projectId);
        }
        setActiveMenu(null);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl h-[70vh] shadow-2xl flex flex-col">
                <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold flex items-center gap-2"><ProjectsIcon /> My Projects</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"><CloseIcon /></button>
                </div>
                <div className="p-4 flex-shrink-0">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg p-2.5 text-zinc-800 dark:text-white focus:ring-gray-500 focus:border-gray-500"
                    />
                </div>
                <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
                    {filteredProjects.length > 0 ? (
                        <div className="space-y-3">
                            {filteredProjects.map(p => (
                                <div key={p.id} className="bg-zinc-200/50 dark:bg-zinc-800/50 p-3 rounded-lg flex items-center justify-between">
                                    {renamingProjectId === p.id ? (
                                        <input
                                            type="text"
                                            value={renameValue}
                                            onChange={e => setRenameValue(e.target.value)}
                                            onBlur={handleConfirmRename}
                                            onKeyDown={e => e.key === 'Enter' && handleConfirmRename()}
                                            autoFocus
                                            className="bg-zinc-300 dark:bg-zinc-700 border border-zinc-400 dark:border-zinc-600 rounded p-1 flex-grow text-zinc-800 dark:text-white"
                                        />
                                    ) : (
                                        <div>
                                            <p className="font-semibold text-zinc-800 dark:text-gray-200">{p.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500">{p.timestamp}</p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onLoad(p.id)} className="px-4 py-1.5 bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600 rounded-lg text-sm font-semibold">Load</button>
                                        <div className="relative" ref={menuRef}>
                                            <button onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)} className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-700">
                                                <DotsVerticalIcon />
                                            </button>
                                            {activeMenu === p.id && (
                                                <div className="absolute right-0 top-full mt-2 w-40 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-10 py-1">
                                                    <button onClick={() => handleStartRename(p)} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                                                        <PencilIcon /> Rename
                                                    </button>
                                                    <button onClick={() => handleDelete(p.id)} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 dark:text-red-400 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                                                        <TrashIcon /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 dark:text-gray-500 py-10">
                            <p>No projects found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const GeneratingAnimation: React.FC = () => {
    const messages = useMemo(() => [
        "Thinking...",
        "Drafting a plan...",
        "Structuring the code...",
        "Generating files...",
    ], []);

    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => {
                if (prevIndex < messages.length - 1) {
                    return prevIndex + 1;
                }
                return prevIndex; 
            });
        }, 2000); 

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="generating-text-animation font-medium">
            {messages[messageIndex]}<span className="typing-cursor">|</span>
        </div>
    );
};


const DevDraft: React.FC<DevDraftProps> = ({ setActiveTool, onToggleNotifications, unreadCount, onToggleCommandPalette, projects, onRenameProject, onDeleteProject, onAddProject, onUpdateProject, loadedProject, onProjectLoaded, customApiKey, theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, onOpenSettings, onSaveApiKey, onLogout }) => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [files, setFiles] = useState<WebsiteFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>('code');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingContent, setTypingContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [isSelectorModeActive, setIsSelectorModeActive] = useState<boolean>(false);
  const [selectedElementSelector, setSelectedElementSelector] = useState<string | null>(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const promptInputRef = useRef<PromptInputRef>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const scrollableCodeContainerRef = useRef<HTMLPreElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSaveNotification) {
        const timer = setTimeout(() => {
            setShowSaveNotification(false);
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [showSaveNotification]);

  useEffect(() => {
    if (loadedProject && loadedProject.tool === Tool.DEV_DRAFT) {
      setCurrentProjectId(loadedProject.id);
      setConversation(loadedProject.conversation || []);
      setFiles(loadedProject.files || []);
      const htmlFile = loadedProject.files.find((f: any) => f.name.endsWith('.html'));
      setActiveFile(htmlFile ? htmlFile.name : (loadedProject.files[0] as any)?.name || null);
      setWorkspaceView('preview');
      onProjectLoaded();
    }
  }, [loadedProject, onProjectLoaded]);

  const activeFileContent = useMemo(() => {
    return files.find(f => f.name === activeFile)?.content || '';
  }, [files, activeFile]);

  const displayedCode = isTyping ? typingContent : activeFileContent;

  const lineCount = useMemo(() => {
    if (!activeFileContent) return 0;
    return displayedCode.split('\n').length;
  }, [displayedCode, activeFileContent]);

  const handleCopyCode = () => {
    if (!activeFileContent) return;
    navigator.clipboard.writeText(activeFileContent).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
        alert('Failed to copy code to clipboard.');
    });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  useEffect(() => {
    if (workspaceView === 'code' && codeRef.current) {
      const codeText = displayedCode || "Select a file to view its code.";
      if (typeof hljs !== 'undefined') {
        const language = getFileLanguage(activeFile);
        const highlighted = hljs.getLanguage(language)
          ? hljs.highlight(codeText, { language, ignoreIllegals: true }).value
          : codeText; 

        const finalHtml = isTyping
          ? `${highlighted}<span class="typing-cursor">|</span>`
          : highlighted;

        codeRef.current.innerHTML = finalHtml;

        if (isTyping && scrollableCodeContainerRef.current) {
          scrollableCodeContainerRef.current.scrollTop = scrollableCodeContainerRef.current.scrollHeight;
        }

      } else {
        codeRef.current.textContent = codeText + (isTyping ? '|' : '');
      }
    }
  }, [displayedCode, activeFile, isTyping, workspaceView]);

    const iframeSrcDoc = useMemo(() => {
    let htmlFile = files.find(f => f.name === 'index.html') || files.find(f => f.name.endsWith('.html'));
    if (!htmlFile) return '<p style="color: #1f2937; font-family: sans-serif; text-align: center; padding-top: 2rem;">No HTML file found to display.</p>';

    let htmlContent = htmlFile.content;

    const cssFiles = files.filter(f => f.name.endsWith('.css'));
    const jsFiles = files.filter(f => f.name.endsWith('.js'));

    const styleTags = cssFiles.map(file => `<style>\n${file.content}\n</style>`).join('\n');
    const scriptTags = jsFiles.map(file => `<script type="module">\n${file.content}\n</script>`).join('\n');

    htmlContent = htmlContent.replace('</head>', `${styleTags}\n</head>`);
    htmlContent = htmlContent.replace('</body>', `${scriptTags}\n</body>`);

    return htmlContent;
  }, [files]);


  useEffect(() => {
    const iframe = previewIframeRef.current;
    if (!iframe) return;

    let lastHovered: HTMLElement | null = null;
    
    // These handlers are defined inside the useEffect closure, so they have access
    // to the correct state setters (setSelectedElementSelector, etc.) from the current render.
    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!(target instanceof HTMLElement) || target === lastHovered || target.id === 'element-selector-styles') return;
        lastHovered?.classList.remove('_-hover-highlight');
        target.classList.add('_-hover-highlight');
        lastHovered = target;
    };
    
    const handleMouseOut = () => {
        if (lastHovered) {
            lastHovered.classList.remove('_-hover-highlight');
            lastHovered = null;
        }
    };

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target as HTMLElement;
        if (!target) return;
        
        handleMouseOut(); // Clear any lingering hover highlights

        const selector = getElementSelector(target);
        if (selector) {
            setSelectedElementSelector(selector);
        }
        setIsSelectorModeActive(false);
    };
    
    // This is the function that will run when the iframe is loaded.
    const setupIframeListeners = () => {
        const doc = iframe.contentWindow?.document;
        if (!doc?.body) return;

        // Clean up any previous listeners to prevent duplicates
        doc.body.removeEventListener('mouseover', handleMouseOver);
        doc.body.removeEventListener('mouseout', handleMouseOut);
        doc.body.removeEventListener('click', handleClick, { capture: true });
        doc.body.classList.remove('selector-active');

        // Inject styles for highlighting
        if (!doc.getElementById('element-selector-styles')) {
            const styleElement = doc.createElement('style');
            styleElement.id = 'element-selector-styles';
            styleElement.innerHTML = `
                ._-hover-highlight { outline: 2px dashed #6366f1 !important; outline-offset: 2px; cursor: crosshair !important; background-color: rgba(99, 102, 241, 0.1) !important; }
                ._-selected-highlight { outline: 2px solid #a855f7 !important; outline-offset: 2px; box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.3); }
                body.selector-active * { pointer-events: auto !important; }
            `;
            doc.head.appendChild(styleElement);
        }

        // Apply highlight for the currently selected element
        doc.querySelector('._-selected-highlight')?.classList.remove('_-selected-highlight');
        if (selectedElementSelector) {
            try {
                const el = doc.querySelector(selectedElementSelector);
                if (el) el.classList.add('_-selected-highlight');
            } catch (e) { console.error("Invalid selector for highlighting:", selectedElementSelector); }
        }

        // Add listeners only if selector mode is active
        if (isSelectorModeActive) {
            doc.body.classList.add('selector-active');
            doc.body.addEventListener('mouseover', handleMouseOver);
            doc.body.addEventListener('mouseout', handleMouseOut);
            doc.body.addEventListener('click', handleClick, { capture: true });
        }
    };
    
    // Attach the setup function to the iframe's load event
    iframe.addEventListener('load', setupIframeListeners);
    
    // Also run setup if the iframe is already loaded (for toggling selector mode)
    if (iframe.contentDocument?.readyState === 'complete') {
        setupIframeListeners();
    }
    
    // The cleanup function for the useEffect hook
    return () => {
        iframe.removeEventListener('load', setupIframeListeners);
        const doc = iframe.contentWindow?.document;
        // Clean up listeners when the component unmounts or the effect re-runs
        if (doc?.body) {
            doc.body.removeEventListener('mouseover', handleMouseOver);
            doc.body.removeEventListener('mouseout', handleMouseOut);
            doc.body.removeEventListener('click', handleClick, { capture: true });
            doc.body.classList.remove('selector-active');
        }
    };
  }, [isSelectorModeActive, iframeSrcDoc, selectedElementSelector]); // Re-run when mode changes, iframe reloads, or selection changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
            setIsSuggestionsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const typeCode = (fullCode: string, onComplete: () => void) => {
    setIsTyping(true);
    setTypingContent('');
    let i = 0;
    const chunkSize = 8;
    const typingInterval = 15;

    const type = () => {
      if (i < fullCode.length) {
        const nextChunk = fullCode.substring(i, i + chunkSize);
        setTypingContent(prev => prev + nextChunk);
        i += chunkSize;
        setTimeout(type, typingInterval);
      } else {
        setTypingContent(fullCode);
        setIsTyping(false);
        onComplete();
      }
    };
    setTimeout(type, typingInterval);
  };

  const handleSubmit = async (prompt: string, attachedFiles: File[]) => {
    if (!prompt.trim() && attachedFiles.length === 0) return;

    if (!customApiKey) {
      onOpenSettings('account');
      return;
    }

    const isTargetedEdit = !!selectedElementSelector;

    // 1. Create the prompt for UI display (clean, no code)
    const displayPrompt = isTargetedEdit
      ? `Edit element "${selectedElementSelector}": ${prompt}`
      : prompt;

    // 2. Create the full prompt for the AI (with context)
    let promptForAI = isTargetedEdit
      ? `Using the element selected with the CSS selector "${selectedElementSelector}", perform the following change: ${prompt}`
      : prompt;

    if (isTargetedEdit && files.length > 0) {
      const fileContext = files.map(f => `File: ${f.name}\n\`\`\`\n${f.content}\n\`\`\``).join('\n\n---\n\n');
      promptForAI = `Here are the current files for the website:\n\n${fileContext}\n\n---\n\nNow, please perform this edit: ${promptForAI}`;
    }

    setLoading(true);
    setError(null);
    setIsTyping(false);

    const prevConversation = [...conversation];

    // 3. Update UI with the clean prompt
    const sentImagesForState = await Promise.all(
      attachedFiles.map(file =>
        new Promise<{ url: string; name: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ url: reader.result as string, name: file.name });
          reader.readAsDataURL(file);
        })
      )
    );
    const newUserTurn: ConversationTurn = { role: 'user', text: displayPrompt, sentImages: sentImagesForState };
    setConversation(prev => [...prev, newUserTurn]);

    // 4. Build the history for the AI API call
    const historyForAI: Content[] = prevConversation.map(turn => ({
      role: turn.role,
      parts: [{ text: turn.text }]
    }));
    
    const currentUserTurnForAI: Content = {
      role: 'user',
      parts: [{ text: promptForAI }]
    };

    if (attachedFiles.length > 0) {
      const imageParts = await Promise.all(
        attachedFiles.map(async (file) => {
          const base64Data = await fileToBase64(file);
          return { inlineData: { data: base64Data, mimeType: file.type } };
        })
      );
      currentUserTurnForAI.parts.unshift(...imageParts);
    }
    
    historyForAI.push(currentUserTurnForAI);
    
    try {
      // 5. Call the API with the full context
      const { plan, files: generatedFiles } = await generateWebsite(historyForAI, isTargetedEdit);

      // Clear selector after use
      if (isTargetedEdit) {
        setSelectedElementSelector(null);
      }

      const planModelTurn: ConversationTurn = { role: 'model', text: plan };
      const newConversation = [...prevConversation, newUserTurn, planModelTurn];
      setConversation(newConversation);

      const beautifyOptions = {
        indent_size: 2,
        space_in_empty_paren: true,
      };

      const formattedFiles = generatedFiles.map(file => {
        const extension = file.name.split('.').pop();
        let formattedContent = file.content;
        try {
          switch (extension) {
            case 'html':
              if (typeof html_beautify !== 'undefined') {
                formattedContent = html_beautify(file.content, beautifyOptions);
              }
              break;
            case 'css':
              if (typeof css_beautify !== 'undefined') {
                formattedContent = css_beautify(file.content, beautifyOptions);
              }
              break;
            case 'js':
              if (typeof js_beautify !== 'undefined') {
                formattedContent = js_beautify(file.content, beautifyOptions);
              }
              break;
          }
        } catch (formatError) {
          console.error(`Could not format ${file.name}:`, formatError);
        }
        return { ...file, content: formattedContent };
      });
      
      const finalFiles = isTargetedEdit
        ? (() => {
            const filesMap = new Map(files.map(f => [f.name, f]));
            formattedFiles.forEach(file => filesMap.set(file.name, file));
            return Array.from(filesMap.values());
          })()
        : formattedFiles;

      setFiles(finalFiles);

      if (currentProjectId) {
        onUpdateProject(currentProjectId, {
          conversation: newConversation,
          files: finalFiles,
        });
        setShowSaveNotification(true);
      }
      
      const isNewProject = conversation.filter(c => c.role === 'model').length <= 1;

      if (isNewProject && formattedFiles.length > 0) {
        // Animate for new projects
        const htmlFile = formattedFiles.find(f => f.name.endsWith('.html'));
        const fileToAnimate = htmlFile || formattedFiles[0];
        setActiveFile(fileToAnimate.name);
        setWorkspaceView('code');
        typeCode(fileToAnimate.content, () => {
            setWorkspaceView('preview');
        });
      } else {
          // For modifications, just update and show preview.
          // If any files were returned, make the first one active.
          if (formattedFiles.length > 0) {
              setActiveFile(formattedFiles[0].name);
          }
          setWorkspaceView('preview');
          // Force a re-render of the iframe to show changes.
          handleRefresh();
      }


    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      const errorModelTurn: ConversationTurn = { role: 'model', text: "Sorry, I couldn't process that request." };
      setConversation(prev => [...prev, errorModelTurn]);
    } finally {
      setLoading(false);
    }
  };


  const handleOpenInNewTab = () => {
    const blob = new Blob([iframeSrcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleRefresh = () => {
    setPreviewKey(k => k + 1);
  };

  const handleLoadProject = (projectId: string) => {
      const projectToLoad = projects.find(p => p.id === projectId);
      if (projectToLoad) {
          setFiles(projectToLoad.files);
          const htmlFile = projectToLoad.files.find((f: any) => f.name.endsWith('.html'));
          setActiveFile(htmlFile ? htmlFile.name : (projectToLoad.files[0] as any)?.name || null);
          setConversation(projectToLoad.conversation || []);
          setError(null);
          setWorkspaceView('preview');
          setIsProjectsModalOpen(false);
          setCurrentProjectId(projectId);
      }
  };

  const handleSaveProject = (name: string) => {
      if (files.length === 0) {
        alert("There are no files to save.");
        return;
      }
      const newProjectId = onAddProject({
        name,
        files,
        conversation,
        tool: Tool.DEV_DRAFT,
      });
      if (newProjectId) {
        setCurrentProjectId(newProjectId);
        setShowSaveNotification(true);
      }
      setIsSaveModalOpen(false);
  };
    
  const handleNewProject = () => {
    if (files.length > 0 && window.confirm("Are you sure you want to start a new project? Any unsaved changes will be lost.")) {
        setFiles([]);
        setConversation([]);
        setActiveFile(null);
        setError(null);
        setWorkspaceView('code');
        setCurrentProjectId(null);
    } else if (files.length === 0) {
        // If there's no project, just clear everything without confirm
        setFiles([]);
        setConversation([]);
        setActiveFile(null);
        setError(null);
        setWorkspaceView('code');
        setCurrentProjectId(null);
    }
  };

  const deviceWidths: Record<PreviewDevice, string> = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px] shadow-2xl ring-1 ring-black/10 dark:ring-white/10 rounded-lg',
    mobile: 'w-[375px] h-[667px] shadow-2xl ring-1 ring-black/10 dark:ring-white/10 rounded-lg',
  };
  
  const HeaderButton: React.FC<{onClick: () => void; disabled?: boolean; title: string; children: React.ReactNode; iconOnly?: boolean;}> = ({ onClick, disabled, title, children, iconOnly }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`text-xs rounded-full transition-colors bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed ${iconOnly ? 'p-2' : 'flex items-center gap-1.5 px-2 py-1'}`}
    >
        {children}
    </button>
  );

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <header className="flex-shrink-0 flex items-center justify-between bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-xl border border-zinc-200 dark:border-zinc-800 py-2 px-3">
        <div className="flex items-center gap-2">
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </button>
            <h1 className="text-base font-bold">Developer Studio</h1>
        </div>
        <div className="flex items-center gap-3">
            {showSaveNotification && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 animate-fade-in-down">
                    <CheckCircleIcon />
                    <span>Saved</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleNewProject}
                    title="New Project"
                    className="text-xs rounded-full transition-colors px-3 py-1.5 font-semibold bg-zinc-800 text-white dark:bg-white dark:text-black hover:bg-zinc-700 dark:hover:bg-zinc-200"
                >
                    New
                </button>
                <HeaderButton onClick={() => setIsProjectsModalOpen(true)} title="My Projects" iconOnly>
                    <ProjectsIcon />
                </HeaderButton>
                <HeaderButton onClick={() => setIsSaveModalOpen(true)} disabled={files.length === 0 || !!currentProjectId} title={currentProjectId ? "Project is auto-saved" : "Save Project"}>
                    <CloudIcon />
                </HeaderButton>
                <HeaderButton onClick={() => setIsExportModalOpen(true)} disabled={files.length === 0} title="Export Project" iconOnly>
                    <DownloadIcon />
                </HeaderButton>
            </div>
            <div className="flex items-center gap-2">
                {!customApiKey && (
                  <button onClick={() => onOpenSettings('account')} className="flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50">
                    <KeyRound size={16} />
                    <span>Add API Key</span>
                  </button>
                )}
                <ThemeToggleButton theme={theme} setTheme={setTheme} />
                <SearchButton onClick={onToggleCommandPalette} />
                <NotificationBell onClick={onToggleNotifications} notificationCount={unreadCount} />
                <UserProfilePopover onOpenSettings={onOpenSettings} onLogout={onLogout} />
            </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-4 min-h-0">
        {/* Left Panel: Chat */}
        <div className="flex flex-col bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-xl border border-zinc-200 dark:border-zinc-800 lg:col-span-3 min-h-0">
            <div className="flex-grow p-4 overflow-y-auto custom-scrollbar">
                {conversation.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 h-full">
                    <div className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4">
                        <CodeIcon />
                    </div>
                    <h2 className="text-2xl font-semibold text-zinc-800 dark:text-gray-300 mb-2">Developer Studio</h2>
                    <p className="max-w-md">Describe the website you want to build, or attach a design to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                    {conversation.map((turn, index) => (
                        <div key={index} className={`flex gap-3 items-start ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {turn.role === 'model' && <AIIcon />}
                        <div className={`px-4 py-3 rounded-2xl max-w-md ${
                            turn.role === 'user' 
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-gray-200' 
                            : 'bg-zinc-100/30 dark:bg-zinc-800/30 backdrop-blur-lg border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-gray-300 shadow-lg'
                        }`}>
                            {turn.sentImages && turn.sentImages.length > 0 && (
                            <div className={`flex flex-wrap gap-2 ${turn.text ? 'mb-2' : ''}`}>
                                {turn.sentImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt={image.name}
                                    className={`rounded-lg object-cover ${turn.sentImages.length === 1 ? 'max-h-32' : 'h-16 w-16'}`}
                                />
                                ))}
                            </div>
                            )}
                            {turn.text && <p className="whitespace-pre-wrap">{turn.text}</p>}
                        </div>
                        {turn.role === 'user' && <UserIcon />}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start items-start gap-3">
                            <AIIcon />
                            <div className="px-4 py-3 rounded-2xl bg-zinc-100/30 dark:bg-zinc-800/30 backdrop-blur-lg border border-zinc-200 dark:border-zinc-700 shadow-lg">
                                <GeneratingAnimation />
                            </div>
                        </div>
                    )}
                    {error && <div className="flex justify-start items-start gap-3"><AIIcon /><p className="text-red-500 dark:text-red-400 p-2 bg-red-100 dark:bg-red-900/20 rounded-lg max-w-md">{error}</p></div>}
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                 {selectedElementSelector && (
                    <div className="mb-3 flex items-center justify-between text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1.5 rounded-lg">
                        <span className="font-mono truncate" title={selectedElementSelector}>Editing: {selectedElementSelector}</span>
                        <button onClick={() => {
                            setSelectedElementSelector(null);
                        }} className="p-1 -mr-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50">
                            <CloseIcon />
                        </button>
                    </div>
                )}
                <div className="flex items-center gap-4 mb-3">
                    <div className="relative" ref={suggestionsRef}>
                        <button
                            onClick={() => setIsSuggestionsOpen(p => !p)}
                            disabled={loading}
                            className="flex items-center gap-2 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-full text-left text-sm text-zinc-700 dark:text-gray-300 hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-black dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <LightbulbIcon />
                            <span>Try an example...</span>
                        </button>

                        {isSuggestionsOpen && (
                            <div className="absolute bottom-full mb-2 w-80 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-lg z-10 py-2">
                                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                    {suggestionPrompts.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                promptInputRef.current?.setPromptText(p.prompt);
                                                setIsSuggestionsOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <p className="font-semibold text-zinc-800 dark:text-gray-200">{p.title}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{p.prompt}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <PromptInput
                    ref={promptInputRef}
                    onGenerate={handleSubmit}
                    isLoading={loading}
                    placeholder="Describe your website..."
                />
            </div>
        </div>

        {/* Right Panel: Code & Preview */}
        <div className="flex flex-col bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden lg:col-span-7">
            <div className="flex-shrink-0 flex items-center justify-between p-2 border-b border-zinc-200 dark:border-zinc-800 gap-2">
                <div className="bg-zinc-200 dark:bg-zinc-800 p-1 rounded-full flex items-center">
                    <button onClick={() => setWorkspaceView('code')} className={`px-3 py-1 text-sm rounded-full transition-colors ${workspaceView === 'code' ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-zinc-300/50 dark:hover:bg-zinc-800/50 hover:text-black dark:hover:text-white'}`}>Code</button>
                    <button onClick={() => setWorkspaceView('preview')} className={`px-3 py-1 text-sm rounded-full transition-colors ${workspaceView === 'preview' ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-zinc-300/50 dark:hover:bg-zinc-800/50 hover:text-black dark:hover:text-white'}`}>Preview</button>
                </div>

                {workspaceView === 'preview' && (
                  <>
                    <div className="hidden md:flex items-center gap-1 bg-zinc-200 dark:bg-zinc-800 p-1 rounded-full">
                    <button
                        onClick={() => { setIsSelectorModeActive(prev => !prev); }}
                        title="Select element to edit"
                        className={`p-1.5 rounded-full transition-colors ${
                            isSelectorModeActive
                                ? 'bg-purple-500 text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50'
                        }`}
                        >
                        <ElementSelectorIcon />
                    </button>
                    <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                    {(['desktop', 'tablet', 'mobile'] as PreviewDevice[]).map(device => (
                        <button key={device} onClick={() => setPreviewDevice(device)} title={device.charAt(0).toUpperCase() + device.slice(1)} className={`p-1.5 rounded-full transition-colors ${previewDevice === device ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-zinc-300/50 dark:hover:bg-zinc-800/50 hover:text-black dark:hover:text-white'}`}>
                        {device === 'desktop' && <DesktopIcon />}
                        {device === 'tablet' && <TabletIcon />}
                        {device === 'mobile' && <MobileIcon />}
                        </button>
                    ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleRefresh} disabled={files.length === 0} title="Refresh Preview" className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed">
                        <RefreshIcon />
                      </button>
                      <button onClick={handleOpenInNewTab} disabled={files.length === 0} title="Open in New Tab" className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed">
                        <ExternalLinkIcon />
                      </button>
                    </div>
                  </>
                )}
            </div>

            {workspaceView === 'code' ? (
            <div className="flex flex-col flex-grow min-h-0">
                <div className="flex-shrink-0 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50">
                <div className="flex items-center overflow-x-auto custom-scrollbar">
                    {files.map(file => (
                    <button
                        key={file.name}
                        onClick={() => {
                        if (isTyping) return;
                        setActiveFile(file.name)
                        }}
                        className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors ${activeFile === file.name ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'} ${isTyping ? 'cursor-not-allowed' : ''}`}
                    >
                        {file.name}
                    </button>
                    ))}
                </div>
                {activeFile && (
                    <div className="px-4 text-sm text-gray-400 dark:text-gray-500 font-mono flex-shrink-0">
                    Lines: {lineCount}
                    </div>
                )}
                </div>
                <div className="flex-grow overflow-auto relative bg-white dark:bg-black">
                {activeFile && (
                    <button
                    onClick={handleCopyCode}
                    disabled={!activeFileContent || isCopied}
                    className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 text-sm rounded-full transition-colors bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-gray-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white disabled:opacity-70 disabled:cursor-default"
                    title={isCopied ? 'Copied!' : `Copy ${activeFile}`}
                    >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                )}
                <pre ref={scrollableCodeContainerRef} className="absolute inset-0 p-4 text-sm text-gray-700 dark:text-gray-300 font-mono overflow-auto custom-scrollbar whitespace-pre-wrap break-words">
                    <code ref={codeRef} className={`language-${getFileLanguage(activeFile)}`}>
                    {/* Content is managed by useEffect with innerHTML */}
                    </code>
                </pre>
                </div>
            </div>
            ) : (
            <div className="flex-grow p-4 flex flex-col justify-center items-center overflow-auto custom-scrollbar bg-zinc-100/50 dark:bg-zinc-900/50">
                {files.length === 0 ? (
                <div className="text-center text-gray-400 dark:text-gray-500">
                    <h3 className="text-xl font-semibold text-zinc-800 dark:text-gray-400">Preview will appear here</h3>
                    <p className="mt-1">Once code is generated, you'll see the live website.</p>
                </div>
                ) : (
                <div className={`transition-all duration-300 ease-in-out ${deviceWidths[previewDevice]} overflow-hidden`}>
                    <iframe
                    key={previewKey}
                    ref={previewIframeRef}
                    srcDoc={iframeSrcDoc}
                    title="Website Preview"
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin"
                    />
                </div>
                )}
            </div>
            )}
        </div>
      </div>
      {isProjectsModalOpen && (
        <ProjectsModal
            isOpen={isProjectsModalOpen}
            onClose={() => setIsProjectsModalOpen(false)}
            projects={projects}
            onLoad={handleLoadProject}
            onDelete={onDeleteProject}
            onRename={onRenameProject}
        />
      )}
      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          files={files}
          iframePreviewRef={previewIframeRef}
        />
      )}
      {isSaveModalOpen && (
        <SaveProjectModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            onSave={handleSaveProject}
        />
      )}
    </div>
  );
};

export default DevDraft;