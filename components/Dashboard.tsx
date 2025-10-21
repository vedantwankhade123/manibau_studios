import React, { useState, useMemo, useEffect } from 'react';
import { Tool } from '../types';
import DashboardProjectsModal from './DashboardProjectsModal';
import { Theme } from '../App';
import ThemeToggleButton from './ThemeToggleButton';
import { PartyPopper, Video, KeyRound, Sparkles, LayoutTemplate, Home } from 'lucide-react';
import MenuButton from './MenuButton';

interface WebsiteFile {
  name: string;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  files: WebsiteFile[] | any;
  timestamp: string;
  tool: Tool;
  conversation?: any;
  previewUrl?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

const ASSETS_URL = '/image-assets';

const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    </button>
);

const NotificationBell: React.FC<{ onClick: () => void; notificationCount: number; }> = ({ onClick, notificationCount }) => (
    <button onClick={onClick} className="relative p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {notificationCount > 0 && (
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
        )}
    </button>
);

// --- Icon components for cards ---
const GenerateIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>);
const VideoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const SketchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
const CodeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>);

const ChevronLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /> </svg> );
const ChevronRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /> </svg> );

const toolCardsData = [
    { tool: Tool.CHAT_WITH_AI, title: "AI Studio", description: "Have a conversation with a powerful AI assistant.", icon: <Sparkles strokeWidth={1} /> },
    { tool: Tool.CANVAS_STUDIO, title: "Canvas Studio", description: "Visually design websites with a drag-and-drop editor.", icon: <LayoutTemplate strokeWidth={1} /> },
    { tool: Tool.GENERATE, title: "Image Studio", description: "Generate and edit stunning visuals with AI.", icon: <GenerateIcon /> },
    { tool: Tool.VIDEO_STUDIO, title: "Video Studio", description: "Create captivating videos from text prompts.", icon: <VideoIcon /> },
    { tool: Tool.SKETCH_STUDIO, title: "Sketch Studio", description: "Turn your drawings into detailed images.", icon: <SketchIcon /> },
    { tool: Tool.DEV_DRAFT, title: "Developer Studio", description: "Describe a website and watch the code come to life.", icon: <CodeIcon /> },
];

interface DashboardProps {
  setActiveTool: (tool: Tool) => void;
  onToggleNotifications: () => void;
  unreadCount: number;
  onToggleCommandPalette: () => void;
  projects: Project[];
  onRenameProject: (projectId: string, newName: string) => void;
  onDeleteProject: (projectId: string) => void;
  onLoadProject: (projectId: string) => void;
  customApiKey: string | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onOpenSettings: (tab?: 'account') => void;
  onGoToLanding: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTool, onToggleNotifications, unreadCount, onToggleCommandPalette, projects, onRenameProject, onDeleteProject, onLoadProject, customApiKey, theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, setIsMobileMenuOpen, onOpenSettings, onGoToLanding }) => {
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const banners = useMemo(() => [
    {
        id: 'welcome',
        title: "Welcome Back, Creator!",
        description: "Your next masterpiece is just a prompt away. What will you create today?",
        icon: <PartyPopper size={32} className="text-pink-400" />,
        gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
        extraElements: (
            <>
                <Sparkles size={24} className="absolute top-4 right-20 text-white/30 animate-float-1" style={{ animationDuration: '15s' }} />
                <Video size={20} className="absolute bottom-4 left-10 text-white/30 animate-float-2" style={{ animationDuration: '20s' }} />
                <div className="w-16 h-16 absolute bottom-10 right-10 text-white/30 animate-float-3" style={{ animationDuration: '25s' }}><GenerateIcon /></div>
            </>
        )
    },
    {
        id: 'canvas',
        title: "New: Canvas Studio (BETA)",
        description: "Design beautiful websites with a drag-and-drop editor.",
        icon: <LayoutTemplate size={32} className="text-indigo-300" />,
        gradient: 'bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500',
        action: () => setActiveTool(Tool.CANVAS_STUDIO),
        buttonText: 'Launch Canvas Studio',
    },
    {
        id: 'apikey',
        title: "Configure Your API Key",
        description: "Add your Gemini API key in the settings to unlock all features.",
        icon: <KeyRound size={32} className="text-yellow-300" />,
        gradient: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500',
        action: () => onOpenSettings('account'),
        buttonText: 'Configure API Key',
    },
    {
        id: 'ai_studio',
        title: "Converse with AI Studio",
        description: "Brainstorm ideas, write content, and get instant answers.",
        icon: <Sparkles size={32} className="text-purple-300" />,
        gradient: 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400',
        action: () => setActiveTool(Tool.CHAT_WITH_AI),
        buttonText: 'Open AI Studio',
    },
    {
        id: 'sketch_studio',
        title: "Create with Sketch Studio",
        description: "Transform your simple drawings into detailed, beautiful images.",
        icon: <div className="w-8 h-8 text-yellow-300"><SketchIcon /></div>,
        gradient: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500',
        action: () => setActiveTool(Tool.SKETCH_STUDIO),
        buttonText: 'Start Sketching',
    },
    {
        id: 'video_studio',
        title: "Produce with Video Studio",
        description: "Generate captivating short videos from simple text prompts.",
        icon: <div className="w-8 h-8 text-red-300"><VideoIcon /></div>,
        videoSources: [
            '/image-assets/dashboard/banners/video-studio-1.mp4',
            '/image-assets/dashboard/banners/video-studio-2.mp4',
            '/image-assets/dashboard/banners/video-studio-3.mp4',
        ],
        action: () => setActiveTool(Tool.VIDEO_STUDIO),
        buttonText: 'Create Video',
    },
    {
        id: 'image',
        title: "Explore Image Studio",
        description: "Generate breathtaking images and art with simple text prompts.",
        icon: <div className="w-8 h-8 text-blue-400"><GenerateIcon /></div>,
        imgSrc: `${ASSETS_URL}/dashboard/banners/image-studio.jpeg`,
        source: "MANIBAU Studios",
    },
  ], [setActiveTool, onOpenSettings]);

  useEffect(() => {
      const interval = setInterval(() => {
          setActiveIndex(prevIndex => (prevIndex + 1) % banners.length);
      }, 5000); // Slide every 5 seconds

      return () => clearInterval(interval);
  }, [banners.length]);

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
            <h1 className="text-lg font-bold">Dashboard</h1>
            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1"></div>
            <button onClick={onGoToLanding} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                <Home size={18} />
                <span className="hidden sm:inline">Home</span>
            </button>
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

      <main className="flex-grow p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-7xl space-y-12 mx-auto">
            <div className="relative w-full h-60 md:h-52 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <div
                    className="flex h-full transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                    {banners.map((banner, index) => (
                        <div key={index} className={`relative w-full h-full flex-shrink-0 p-6 md:p-8 lg:p-12 flex flex-col justify-center overflow-hidden`}>
                            {(banner as any).videoSources ? (
                                <div className="absolute inset-0 grid grid-cols-3">
                                    {(banner as any).videoSources.map((src: string, i: number) => (
                                        <video key={i} src={src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                                    ))}
                                </div>
                            ) : banner.gradient ? (
                                <>
                                    <div className={`absolute inset-0 ${banner.gradient} bg-[length:400%_400%] animate-animated-gradient`} />
                                    {banner.id === 'welcome' && (
                                        <>
                                            <div className="absolute top-0 left-1/4 w-72 h-72 bg-pink-500/50 rounded-full filter blur-3xl animate-welcome-glow-1"></div>
                                            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/50 rounded-full filter blur-3xl animate-welcome-glow-2"></div>
                                        </>
                                    )}
                                    {(banner as any).extraElements}
                                </>
                            ) : banner.imgSrc ? (
                                <img src={banner.imgSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (banner as any).videoSrc ? (
                                <video src={(banner as any).videoSrc} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
                            ) : null}
                            <div className="absolute inset-0 bg-black/30"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 dark:bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 dark:border-black/20">
                                        {banner.icon}
                                    </div>
                                    <div>
                                        <h1 key={`${index}-title`} className="text-xl sm:text-2xl font-bold text-white animate-fade-in-up">{banner.title}</h1>
                                        <p key={`${index}-desc`} className="text-sm sm:text-md text-gray-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>{banner.description}</p>
                                    </div>
                                </div>
                                {(banner as any).action && (
                                    <button onClick={(banner as any).action} className="mt-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                        {(banner as any).buttonText}
                                    </button>
                                )}
                            </div>
                            {banner.source && (
                                <div className="absolute bottom-2 right-3 text-white/50 text-[10px] font-semibold bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
                                    Source: {banner.source}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-white w-6' : 'bg-white/50'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {!customApiKey && (
              <div className="md:hidden bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-500/30 p-4 rounded-2xl flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Add Your API Key</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300/80">Unlock all AI features by adding your Gemini API key in the settings.</p>
                </div>
                <button onClick={() => onOpenSettings('account')} className="ml-auto flex-shrink-0 bg-yellow-500 text-white font-semibold px-3 py-1.5 rounded-full text-sm hover:bg-yellow-600 transition-colors">
                  Add Key
                </button>
              </div>
            )}

            {/* Tools Section */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {toolCardsData.map(tool => (
                        <div key={tool.title} className="shine-effect rounded-2xl group border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 p-6 flex flex-col justify-between">
                            <div className="absolute -right-2 -bottom-2 text-zinc-400 dark:text-zinc-600 opacity-40 w-24 h-24 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                {tool.icon}
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-zinc-800 dark:text-white">{tool.title}</h3>
                                <p className="text-sm text-zinc-600 dark:text-gray-300 mt-1">{tool.description}</p>
                            </div>
                            <div className="relative z-10 mt-4">
                                <button onClick={() => setActiveTool(tool.tool)} className="bg-zinc-800 text-white dark:bg-white/10 dark:backdrop-blur border border-transparent dark:border-white/20 font-semibold px-5 py-2 rounded-full hover:bg-zinc-700 dark:hover:bg-white/20 transition-colors self-start text-sm">
                                    Launch
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Projects Section */}
            {projects.length > 0 && (
            <section>
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-zinc-800 dark:text-gray-300">Recent Projects</h2>
                <button onClick={() => setIsProjectsModalOpen(true)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-semibold">
                    View All
                </button>
                </div>
                <div className="space-y-3">
                    {projects.slice(0, 4).map(project => (
                    <div
                        key={project.id}
                        className="w-full flex items-center justify-between bg-zinc-100/50 dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800"
                    >
                        <div className="flex-1 min-w-0">
                        <p className="font-semibold text-zinc-800 dark:text-white truncate">{project.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{project.timestamp}</p>
                        </div>
                        <button onClick={() => onLoadProject(project.id)} className="ml-4 flex-shrink-0 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-white font-semibold px-4 py-1.5 rounded-full hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors self-start text-xs">
                        Open
                        </button>
                    </div>
                    ))}
                </div>
            </section>
            )}
        </div>
      </main>

      <DashboardProjectsModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        projects={projects}
        onRename={onRenameProject}
        onDelete={onDeleteProject}
        onLoad={(projectId) => onLoadProject(projectId)}
      />
    </div>
  );
};

export default Dashboard;