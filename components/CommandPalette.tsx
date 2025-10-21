import React, { useState, useEffect, useMemo } from 'react';
import { Project } from './Dashboard';
import { Tool } from '../types';
import { SETTINGS_CONFIG, SettingsTab } from './SettingsModal';
import { Sparkles, LayoutTemplate } from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    setActiveTool: (tool: Tool) => void;
    onOpenSettings: (tab: SettingsTab) => void;
}

type Command = {
    type: 'tool' | 'project' | 'action' | 'setting';
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
};

// --- Icon Components ---
const DashboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>);
const GenerateIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>);
const SketchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
const CodeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>);
// Fix: Add a VideoIcon for the new command palette entry.
const VideoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const LibraryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>);
const ProjectsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>);

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, projects, setActiveTool, onOpenSettings }) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const commands: Command[] = useMemo(() => {
        const toolCommands: Command[] = [
            { type: 'tool', id: 'dashboard', title: 'Go to Dashboard', description: 'Navigate to the main dashboard', icon: <DashboardIcon />, action: () => setActiveTool(Tool.DASHBOARD) },
            { type: 'tool', id: 'chat_with_ai', title: 'Go to AI Studio', description: 'Have a conversation with the AI', icon: <Sparkles />, action: () => setActiveTool(Tool.CHAT_WITH_AI) },
            { type: 'tool', id: 'library', title: 'Go to Library', description: 'View all your projects', icon: <LibraryIcon />, action: () => setActiveTool(Tool.LIBRARY) },
            { type: 'tool', id: 'canvas_studio', title: 'Go to Canvas Studio', description: 'Design websites with a drag-and-drop editor', icon: <LayoutTemplate />, action: () => setActiveTool(Tool.CANVAS_STUDIO) },
            { type: 'tool', id: 'image_studio', title: 'Go to Image Studio', description: 'Generate and edit images', icon: <GenerateIcon />, action: () => setActiveTool(Tool.GENERATE) },
            { type: 'tool', id: 'video_studio', title: 'Go to Video Studio', description: 'Generate videos from text prompts', icon: <VideoIcon />, action: () => setActiveTool(Tool.VIDEO_STUDIO) },
            { type: 'tool', id: 'sketch_studio', title: 'Go to Sketch Studio', description: 'Create images from drawings', icon: <SketchIcon />, action: () => setActiveTool(Tool.SKETCH_STUDIO) },
            { type: 'tool', id: 'dev_studio', title: 'Go to Developer Studio', description: 'Build and edit websites', icon: <CodeIcon />, action: () => setActiveTool(Tool.DEV_DRAFT) },
        ];

        const projectCommands: Command[] = projects.map(p => ({
            type: 'project',
            id: p.id,
            title: `Open project: ${p.name}`,
            description: `Last updated: ${p.timestamp}`,
            icon: <ProjectsIcon />,
            action: () => setActiveTool(p.tool),
        }));

        const settingsCommands: Command[] = SETTINGS_CONFIG.map(setting => ({
            type: 'setting',
            id: `setting_${setting.id}`,
            title: `Settings: ${setting.label}`,
            description: `Go to ${setting.description} settings`,
            icon: setting.icon,
            action: () => onOpenSettings(setting.id)
        }));
        
        const actionCommands: Command[] = [];

        return [...toolCommands, ...projectCommands, ...actionCommands, ...settingsCommands];
    }, [projects, setActiveTool, onOpenSettings]);

    const filteredCommands = useMemo(() => {
        if (!query) return commands;
        const lowerQuery = query.toLowerCase();
        return commands.filter(cmd => 
            cmd.title.toLowerCase().includes(lowerQuery) || 
            cmd.description.toLowerCase().includes(lowerQuery)
        );
    }, [query, commands]);
    
    useEffect(() => {
        if (isOpen) {
            setActiveIndex(0);
        }
    }, [isOpen, query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(i => (i + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const command = filteredCommands[activeIndex];
                if (command) {
                    command.action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeIndex, filteredCommands, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4" onClick={onClose}>
            <div 
                className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Type a command or search..."
                        autoFocus
                        className="w-full bg-transparent text-lg text-zinc-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none"
                    />
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
                    {filteredCommands.length > 0 ? (
                        <ul className="space-y-1">
                            {filteredCommands.map((cmd, index) => (
                                <li key={cmd.id}>
                                    <button 
                                        onClick={() => { cmd.action(); onClose(); }}
                                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${activeIndex === index ? 'bg-zinc-200 dark:bg-zinc-800' : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'}`}
                                    >
                                        <div className="text-gray-500 dark:text-gray-400">{cmd.icon}</div>
                                        <div>
                                            <p className="font-semibold text-zinc-800 dark:text-gray-200">{cmd.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500">{cmd.description}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <p>No results found for "{query}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;