import React from 'react';
import { Theme } from '../../App';
import ThemeToggleButton from '../ThemeToggleButton';
import UserProfilePopover from '../UserProfilePopover';
import { SettingsTab } from '../SettingsModal';
import { ChevronLeft, ChevronRight, KeyRound, Undo, Redo, Monitor, Tablet, Smartphone, Share2, ChevronDown } from 'lucide-react';
import CanvasLeftSidebar from './CanvasLeftSidebar';
import Canvas from './Canvas';
import CanvasRightSidebar from './CanvasRightSidebar';

interface CanvasStudioProps {
  onToggleNotifications: () => void;
  unreadCount: number;
  onToggleCommandPalette: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  onOpenSettings: (tab?: SettingsTab) => void;
  customApiKey: string | null;
  onLogout: () => void;
}

const CanvasStudio: React.FC<CanvasStudioProps> = (props) => {
    const { theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, onOpenSettings, onLogout } = props;

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            {/* Main Header */}
            <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2 text-sm">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors"
                        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                    </button>
                    <span className="text-gray-400">Create</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-400">Select Template</span>
                    <span className="text-gray-400">/</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Customize Content</span>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggleButton theme={theme} setTheme={setTheme} />
                    <UserProfilePopover onOpenSettings={onOpenSettings} onLogout={onLogout} />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-grow flex min-h-0">
                {/* Left Sidebar (Component Library) */}
                <CanvasLeftSidebar />

                {/* Center Canvas */}
                <div className="flex-1 flex flex-col">
                    {/* Canvas Header */}
                    <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"><Undo size={18} /></button>
                            <button className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"><Redo size={18} /></button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-500">My Draft</span>
                            <span className="text-sm text-zinc-400">/</span>
                            <button className="flex items-center gap-1 text-sm font-semibold">
                                Promotion Mail Template #14
                                <ChevronDown size={16} />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
                                <button className="p-1.5 rounded text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-700 shadow-sm"><Monitor size={18}/></button>
                                <button className="p-1.5 rounded text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50"><Tablet size={18}/></button>
                                <button className="p-1.5 rounded text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50"><Smartphone size={18}/></button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                    <Share2 size={16} />
                                    Share
                                </button>
                                <button className="text-sm font-semibold px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                                    Publish Mail
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Canvas Itself */}
                    <Canvas />
                </div>

                {/* Right Sidebar (Property Inspector) */}
                <CanvasRightSidebar />
            </div>
        </div>
    );
};

export default CanvasStudio;