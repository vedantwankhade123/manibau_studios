import React from 'react';
const logoUrl = '/image-assets/MANIBAU Studios Logo.png';
import { Tool } from '../types';
import { Sparkles, LayoutTemplate } from 'lucide-react';

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const GenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const SketchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const LibraryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

interface SidebarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  isCollapsed: boolean;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool, isCollapsed, onLogout, onOpenSettings }) => {
  const navItems = [
    { id: Tool.DASHBOARD, label: 'Dashboard', icon: <DashboardIcon /> },
    { id: Tool.CHAT_WITH_AI, label: 'AI Studio', icon: <Sparkles /> },
    { id: Tool.LIBRARY, label: 'Library', icon: <LibraryIcon /> },
    { id: Tool.CANVAS_STUDIO, label: 'Canvas Studio', icon: <LayoutTemplate />, beta: true },
    { id: Tool.GENERATE, label: 'Image Studio', icon: <GenerateIcon /> },
    { id: Tool.VIDEO_STUDIO, label: 'Video Studio', icon: <VideoIcon /> },
    { id: Tool.SKETCH_STUDIO, label: 'Sketch Studio', icon: <SketchIcon /> },
    { id: Tool.DEV_DRAFT, label: 'Developer Studio', icon: <CodeIcon /> },
  ];
  
  const baseClasses = "flex items-center w-full text-left py-2 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black";
  const activeClasses = "bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-white shadow-lg rounded-full";
  const inactiveClasses = "text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-black dark:hover:text-white rounded-lg";
  const navItemPadding = isCollapsed ? 'justify-center' : 'px-3 gap-2';

  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-30 bg-white dark:bg-zinc-900 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-24' : 'w-80'}`}>
      <div className="p-4 flex flex-col h-full overflow-y-auto custom-scrollbar">
        <div className="flex items-center mb-6 h-14">
            <div className={`flex items-center gap-3 transform transition-transform duration-300 ease-in-out ${isCollapsed ? 'translate-x-4' : 'translate-x-0'}`}>
                <img src={logoUrl} alt="MANIBAU Studios Logo" className="h-8 w-8 flex-shrink-0 filter dark:invert-0 invert drop-shadow-lg animate-rotate-once" />
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}>
                    <div className="whitespace-nowrap">
                        <h1 className="text-xl font-bold text-black dark:text-white tracking-wider font-poppins">
                            <span>MANIBAU</span>
                            <span className="text-gray-500 dark:text-gray-400"> STUDIOS</span>
                        </h1>
                    </div>
                </div>
            </div>
        </div>

        <nav className="flex flex-col gap-3 flex-grow">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTool(item.id)}
              className={`${baseClasses} ${activeTool === item.id ? activeClasses : inactiveClasses} ${navItemPadding}`}
              aria-current={activeTool === item.id ? 'page' : undefined}
              title={item.label}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <div className={`overflow-hidden transition-all duration-200 ease-in-out flex items-center gap-2 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                  <span className="whitespace-nowrap">{item.label}</span>
                  {(item as any).beta && <span className="text-xs bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 font-semibold px-1.5 py-0.5 rounded-full">BETA</span>}
              </div>
            </button>
          ))}
        </nav>

        <div className="flex-shrink-0 flex flex-col gap-3">
          <button
            onClick={onOpenSettings}
            className={`${baseClasses} ${inactiveClasses} ${navItemPadding}`}
            title="Settings"
          >
            <div className="flex-shrink-0"><SettingsIcon /></div>
            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                <span className="whitespace-nowrap">Settings</span>
            </div>
          </button>
          <button
            onClick={onLogout}
            className={`${baseClasses} ${inactiveClasses} ${navItemPadding}`}
            title="Logout"
          >
            <div className="flex-shrink-0"><LogoutIcon /></div>
            <div className={`overflow-hidden transition-all duration-200 ease-in-out ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'}`}>
                <span className="whitespace-nowrap">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;