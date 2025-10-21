import React, { useState, useRef, useEffect } from 'react';
import { generateVideo } from '../services/geminiService';
import PromptInput from './PromptInput';
import { Tool } from '../types';
import { Project } from './Dashboard';
import { Theme } from '../App';
import ThemeToggleButton from './ThemeToggleButton';
import { SettingsTab } from './SettingsModal';
import { KeyRound } from 'lucide-react';
import MenuButton from './MenuButton';

interface ConversationTurn {
  id: number;
  prompt: string;
  videoUrl: string | null;
  isLoading: boolean;
  loadingStatus: string | null;
  error: string | null;
  showWatermark?: boolean;
}

interface VideoGeneratorProps {
  setActiveTool: (tool: Tool) => void;
  onToggleNotifications: () => void;
  unreadCount: number;
  onToggleCommandPalette: () => void;
  onAddProject: (project: Omit<Project, 'id' | 'timestamp'>) => string;
  onUpdateProject: (projectId: string, updatedData: Partial<Omit<Project, 'id'>>) => void;
  loadedProject: Project | null;
  onProjectLoaded: () => void;
  customApiKey: string | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onOpenSettings: (tab?: SettingsTab) => void;
}

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

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ChevronLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /> </svg> );
const ChevronRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /> </svg> );

const examplePrompts = [
  {
    title: 'Futuristic City Drone Shot',
    prompt: 'A breathtaking drone shot flying through a futuristic city at sunset, with flying vehicles and neon-lit skyscrapers.'
  },
  {
    title: 'Rushing Mountain Stream',
    prompt: 'A cinematic, slow-motion shot of crystal clear water rushing over mossy rocks in a mountain stream.'
  },
  {
    title: 'Cozy Cafe Ambiance',
    prompt: 'A cozy cafe interior, soft warm lighting, steam rising from a coffee cup on a wooden table, with gentle rain outside the window.'
  },
  {
    title: 'Dog Running on a Beach',
    prompt: 'A golden retriever joyfully running on a sunny beach in slow motion, splashing in the water, with a wide smile.'
  }
];

const ActionButton: React.FC<{ onClick?: () => void; children: React.ReactNode; href?: string; download?: string; disabled?: boolean; title?: string; }> = ({ children, ...props }) => {
  const commonClasses = "flex items-center justify-center w-10 h-10 bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:border-zinc-200 dark:disabled:border-zinc-800 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-zinc-700 dark:text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black";
  if (props.href) {
    return <a {...props} className={commonClasses}>{children}</a>
  }
  return <button type="button" {...props} className={commonClasses}>{children}</button>
}

const VideoPlaceholder: React.FC<{ status: string }> = ({ status }) => {
  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden flex flex-col items-center justify-center p-4 text-center">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-700/50 to-transparent"></div>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 dark:border-gray-400 mb-4"></div>
      <p className="font-semibold text-zinc-800 dark:text-gray-300">{status}</p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Video generation can take a few minutes. Please wait.</p>
    </div>
  );
};

const GeneratedVideo: React.FC<{ src: string; alt: string; showWatermark?: boolean }> = ({ src, alt, showWatermark }) => {
  return (
    <div className="relative flex flex-col gap-3">
      <video src={src} controls autoPlay loop className="rounded-lg w-full h-auto object-contain shadow-lg dark:shadow-black/30 bg-black" />
        {showWatermark && (
            <div className="absolute bottom-12 right-2 bg-black/50 text-white/80 text-[10px] px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none flex items-center gap-1">
                <span className="font-semibold">Made With</span>
                <span className="font-poppins font-bold tracking-wider">MANIBAU</span>
                <span className="font-poppins font-bold tracking-wider text-gray-300">STUDIOS</span>
            </div>
        )}
      <div className="flex items-center justify-end gap-3">
        <ActionButton href={src} download={`${alt.substring(0, 20)}.mp4`} title="Download Video">
          <DownloadIcon />
        </ActionButton>
      </div>
    </div>
  );
};


const VideoGenerator: React.FC<VideoGeneratorProps> = ({ setActiveTool, onToggleNotifications, unreadCount, onToggleCommandPalette, onAddProject, onUpdateProject, loadedProject, onProjectLoaded, customApiKey, theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, setIsMobileMenuOpen, onOpenSettings }) => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isGenerating = conversation.length > 0 && conversation[conversation.length - 1].isLoading;

  useEffect(() => {
    if (loadedProject && loadedProject.tool === Tool.VIDEO_STUDIO) {
      setConversation(loadedProject.conversation || []);
      setCurrentProjectId(loadedProject.id);
      onProjectLoaded();
    }
  }, [loadedProject, onProjectLoaded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleGenerate = async (prompt: string) => {
    if (!prompt.trim()) return;

    if (!customApiKey) {
      onOpenSettings('account');
      return;
    }
    
    const prevConversation = [...conversation];

    const newTurn: ConversationTurn = {
      id: Date.now(),
      prompt,
      videoUrl: null,
      isLoading: true,
      loadingStatus: 'Initializing...',
      error: null,
      showWatermark: false,
    };

    setConversation(prev => [...prev, newTurn]);

    try {
      const onStatusUpdate = (status: string) => {
        setConversation(prev => prev.map(turn => turn.id === newTurn.id ? { ...turn, loadingStatus: status } : turn));
      };
      
      const url = await generateVideo(prompt, onStatusUpdate);
      
      const finalTurn = { ...newTurn, videoUrl: url, isLoading: false };
      const newConversation = [...prevConversation, finalTurn];
      setConversation(newConversation);
      
      if (currentProjectId) {
        onUpdateProject(currentProjectId, {
          conversation: newConversation,
          name: prompt,
        });
      } else {
        const newProjectId = onAddProject({
          name: prompt.substring(0, 40) + (prompt.length > 40 ? '...' : ''),
          tool: Tool.VIDEO_STUDIO,
          conversation: newConversation,
          files: [],
        });
        if (newProjectId) {
          setCurrentProjectId(newProjectId);
        }
      }
    } catch (e: any) {
      setConversation(prev => prev.map(turn => turn.id === newTurn.id ? { ...turn, error: e.message || 'An unexpected error occurred.', isLoading: false } : turn));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <MenuButton onClick={() => setIsMobileMenuOpen(true)} />
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors hidden lg:block"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
          <h1 className="text-lg font-bold">Video Studio</h1>
        </div>
        <div className="flex items-center gap-2">
            {!customApiKey && (
              <button onClick={() => onOpenSettings('account')} className="flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 p-2 md:px-3 md:py-1.5">
                <KeyRound size={16} />
                <span className="hidden md:inline">Add API Key</span>
              </button>
            )}
            <ThemeToggleButton theme={theme} setTheme={setTheme} />
            <SearchButton onClick={onToggleCommandPalette} />
            <NotificationBell onClick={onToggleNotifications} notificationCount={unreadCount} />
        </div>
      </header>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400" style={{ minHeight: 'calc(100vh - 20rem)' }}>
              <div className="w-14 h-14 p-2 text-gray-400 dark:text-gray-600 mt-5 mb-1">
                <VideoIcon />
              </div>
              <h2 className="text-2xl font-semibold text-zinc-800 dark:text-gray-300 mb-2">Bring Your Ideas to Motion</h2>
              <p className="max-w-md mb-8">Describe the video you want to create. The more detailed your prompt, the better the result.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                {examplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerate(p.prompt)}
                    className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2 sm:p-3 rounded-lg text-left hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
                  >
                    <p className="font-semibold text-sm sm:text-base text-zinc-800 dark:text-gray-200 leading-tight">{p.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-snug hidden sm:line-clamp-2">{p.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {conversation.map(turn => (
                <div key={turn.id} className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-gray-200 rounded-lg p-3 max-w-lg">
                      {turn.prompt && <p className="whitespace-pre-wrap">{turn.prompt}</p>}
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="w-full max-w-xl">
                      {turn.isLoading && turn.loadingStatus && (
                         <VideoPlaceholder status={turn.loadingStatus} />
                      )}
                      {turn.error && <p className="text-red-500 dark:text-red-400 text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">{turn.error}</p>}
                      {turn.videoUrl && (
                        <GeneratedVideo
                          src={turn.videoUrl}
                          alt={turn.prompt}
                          showWatermark={turn.showWatermark}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <PromptInput
            onGenerate={(prompt) => handleGenerate(prompt)}
            isLoading={isGenerating}
            placeholder="A cinematic shot of a robot surfing on a data wave..."
            disableAttachments={true}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;