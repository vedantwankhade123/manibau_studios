import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ImageGenerator from './components/ImageGenerator';
import DevDraft from './components/ImageEditor';
import Dashboard from './components/Dashboard';
import { Tool } from './types';
import SettingsModal, { SettingsTab } from './components/SettingsModal';
import CommandPalette from './components/CommandPalette';
import { Project } from './components/Dashboard';
import { setUserApiKey } from './services/geminiService';
import SketchGenerator from './components/SketchGenerator';
import Library from './components/Library';
import VideoGenerator from './components/VideoGenerator';
import ChatWithAi from './components/ChatWithAi';
import CanvasStudio from './components/canvas-studio/CanvasStudio';
import TermsOfService from './src/pages/TermsOfService';
import PrivacyPolicy from './src/pages/PrivacyPolicy';
import LandingPage from './components/LandingPage';

export type Theme = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';

// --- Routing Configuration ---
const toolToPath: Record<Tool, string> = {
    [Tool.DASHBOARD]: 'dashboard',
    [Tool.CHAT_WITH_AI]: 'ai-studio',
    [Tool.GENERATE]: 'image-studio',
    [Tool.DEV_DRAFT]: 'developer-studio',
    [Tool.SKETCH_STUDIO]: 'sketch-studio',
    [Tool.LIBRARY]: 'library',
    [Tool.VIDEO_STUDIO]: 'video-studio',
    [Tool.CANVAS_STUDIO]: 'canvas-studio',
};

const pathToTool: Record<string, Tool> = Object.entries(toolToPath).reduce((acc, [key, value]) => {
    acc[value] = key as Tool;
    return acc;
}, {} as Record<string, Tool>);

const getToolFromPath = (path: string): Tool | null => {
    if (path.startsWith('/app/')) {
        const slug = path.substring(5); // length of '/app/'
        return pathToTool[slug] || null;
    }
    return null;
};
// --- End Routing Configuration ---

const App: React.FC = () => {
  const [showLandingPage, setShowLandingPage] = useState(!window.location.pathname.startsWith('/app'));
  const [activeTool, setActiveTool] = useState<Tool>(() => {
    const tool = getToolFromPath(window.location.pathname);
    return tool || Tool.DASHBOARD;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<SettingsTab>('general');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [viewingLegalPage, setViewingLegalPage] = useState<'terms' | 'privacy' | null>(null);
  
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  const [customApiKey, setCustomApiKey] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loadedProject, setLoadedProject] = useState<Project | null>(null);

  useEffect(() => {
    const handlePopState = () => {
        const path = window.location.pathname;
        if (path.startsWith('/app')) {
            setShowLandingPage(false);
            const tool = getToolFromPath(path);
            setActiveTool(tool || Tool.DASHBOARD);
        } else {
            setShowLandingPage(true);
        }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleEnterApp = () => {
      const path = `/app/${toolToPath[Tool.DASHBOARD]}`;
      if (window.location.pathname !== path) {
          window.history.pushState({ tool: Tool.DASHBOARD }, '', path);
      }
      setShowLandingPage(false);
      setActiveTool(Tool.DASHBOARD);
  };

  const handleGoToLanding = () => {
      if (window.location.pathname !== '/') {
          window.history.pushState({ path: '/' }, '', '/');
      }
      setShowLandingPage(true);
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('geminiApiKey');
    if (savedKey) {
        setCustomApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    const newKey = key.trim() || null;
    setCustomApiKey(newKey);
    if (newKey) {
        localStorage.setItem('geminiApiKey', newKey);
    } else {
        localStorage.removeItem('geminiApiKey');
    }
  };

  // Load projects from localStorage
  useEffect(() => {
    try {
      const localData = localStorage.getItem('manibau-projects');
      if (localData) {
        const parsedProjects: Omit<Project, 'timestamp'>[] = JSON.parse(localData);
        const formattedProjects = parsedProjects.map(p => ({
          ...p,
          timestamp: new Date(p.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        })).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        setProjects(formattedProjects);
      } else {
        setProjects([]);
      }
    } catch (e) {
      console.error("Failed to load projects from local storage", e);
      setProjects([]);
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    try {
      const projectsToSave = projects.map(({ timestamp, ...rest }) => rest);
      localStorage.setItem('manibau-projects', JSON.stringify(projectsToSave));
    } catch (e) {
      console.error("Failed to save projects to local storage", e);
    }
  }, [projects]);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    setTheme(savedTheme || 'dark');
    const savedFontSize = localStorage.getItem('fontSize') as FontSize | null;
    if (savedFontSize) setFontSize(savedFontSize);
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    setHighContrast(savedHighContrast);
    const savedReduceMotion = localStorage.getItem('reduceMotion') === 'true';
    setReduceMotion(savedReduceMotion);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    document.documentElement.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    document.documentElement.classList.add(`font-size-${fontSize}`);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('highContrast', String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('reduceMotion', String(reduceMotion));
  }, [reduceMotion]);

  useEffect(() => {
    setUserApiKey(customApiKey);
  }, [customApiKey]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const path = `/app/${toolToPath[activeTool]}`;
    const title = `${Object.keys(Tool)[Object.values(Tool).indexOf(activeTool)]
        .split('_')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ')} | Manibau Studios`;
    
    document.title = title;
    if (window.location.pathname !== path && !showLandingPage) {
        window.history.pushState({ tool: activeTool }, title, path);
    }
  }, [activeTool, showLandingPage]);

  const handleAddProject = (projectData: Omit<Project, 'id' | 'timestamp'>): string => {
    const now = new Date();
    const newProject: Project = {
      ...projectData,
      id: crypto.randomUUID(),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      timestamp: now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject.id;
  };

  const handleUpdateProject = (projectId: string, updatedData: Partial<Omit<Project, 'id'>>) => {
    const now = new Date();
    setProjects(prev => prev.map(p => 
        p.id === projectId 
        ? { ...p, ...updatedData, updated_at: now.toISOString(), timestamp: now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) } 
        : p
    ));
  };

  const handleLoadProject = (projectId: string) => {
    const projectToLoad = projects.find(p => p.id === projectId);
    if (projectToLoad) {
        const path = `/app/${toolToPath[projectToLoad.tool]}`;
        if (window.location.pathname !== path) {
            window.history.pushState({ tool: projectToLoad.tool }, '', path);
        }
        setActiveTool(projectToLoad.tool);
        setLoadedProject(projectToLoad);
    }
  };
  
  const handleRenameProject = (projectId: string, newName: string) => {
    handleUpdateProject(projectId, { name: newName });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleDeleteMultipleProjects = (projectIds: string[]) => {
    if (projectIds.length === 0) return;
    setProjects(prev => prev.filter(p => !projectIds.includes(p.id)));
  };

  const handleOpenSettings = (tab: SettingsTab = 'general') => {
    setSettingsInitialTab(tab);
    setIsSettingsOpen(true);
  };

  const handleSetActiveTool = (tool: Tool) => {
    const path = `/app/${toolToPath[tool]}`;
    if (window.location.pathname !== path) {
        window.history.pushState({ tool }, '', path);
    }
    setLoadedProject(null);
    setActiveTool(tool);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (window.innerWidth >= 1024) {
        setIsSidebarCollapsed(false);
    } else {
        setIsSidebarCollapsed(true);
    }
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarCollapsed(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeTool === Tool.DEV_DRAFT || activeTool === Tool.CANVAS_STUDIO) {
      setIsSidebarCollapsed(true);
    }
  }, [activeTool]);

  if (showLandingPage) {
    return <LandingPage onGetStarted={handleEnterApp} />;
  }

  if (viewingLegalPage === 'terms') {
    return <TermsOfService onGoBack={() => setViewingLegalPage(null)} />;
  }
  if (viewingLegalPage === 'privacy') {
    return <PrivacyPolicy onGoBack={() => setViewingLegalPage(null)} />;
  }

  const renderTool = () => {
    const commonProps = { 
        setActiveTool: handleSetActiveTool,
        onToggleCommandPalette: () => setIsCommandPaletteOpen(p => !p),
        projects,
        onRenameProject: handleRenameProject,
        onDeleteProject: handleDeleteProject,
        onAddProject: handleAddProject,
        onUpdateProject: handleUpdateProject,
        onProjectLoaded: () => setLoadedProject(null),
        customApiKey,
        theme,
        setTheme,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        setIsMobileMenuOpen,
        onOpenSettings: handleOpenSettings,
        onSaveApiKey: handleSaveApiKey,
        onGoToLanding: handleGoToLanding,
    };
    switch (activeTool) {
      case Tool.CHAT_WITH_AI: return <ChatWithAi {...commonProps} loadedProject={loadedProject} />;
      case Tool.GENERATE: return <ImageGenerator {...commonProps} loadedProject={loadedProject} />;
      case Tool.VIDEO_STUDIO: return <VideoGenerator {...commonProps} loadedProject={loadedProject} />;
      case Tool.SKETCH_STUDIO: return <SketchGenerator {...commonProps} loadedProject={loadedProject} />;
      case Tool.DEV_DRAFT: return <DevDraft {...commonProps} loadedProject={loadedProject} />;
      case Tool.LIBRARY: return <Library {...commonProps} onLoadProject={handleLoadProject} onDeleteMultipleProjects={handleDeleteMultipleProjects} />;
      case Tool.CANVAS_STUDIO: return <CanvasStudio {...commonProps} />;
      case Tool.DASHBOARD: default: return <Dashboard {...commonProps} onLoadProject={handleLoadProject} />;
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-black text-zinc-900 dark:text-gray-200 font-sans relative overflow-hidden">
      <main className="absolute inset-0 h-full w-full bg-gradient-to-br from-gray-50 dark:from-zinc-900 to-white dark:to-black">
        <div className={`h-full w-full transition-all duration-300 ease-in-out lg:${isSidebarCollapsed ? 'pl-24' : 'pl-80'}`}>
          <div className="h-full flex flex-col">
            <div className="flex-grow h-0">{renderTool()}</div>
          </div>
        </div>
      </main>
      <Sidebar activeTool={activeTool} setActiveTool={handleSetActiveTool} isCollapsed={isSidebarCollapsed} onOpenSettings={() => handleOpenSettings()} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} onGoToLanding={handleGoToLanding} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={theme} 
        setTheme={setTheme} 
        customApiKey={customApiKey} 
        setCustomApiKey={handleSaveApiKey} 
        initialTab={settingsInitialTab} 
        fontSize={fontSize} 
        setFontSize={setFontSize} 
        highContrast={highContrast} 
        setHighContrast={setHighContrast} 
        reduceMotion={reduceMotion} 
        setReduceMotion={setReduceMotion}
        onViewTerms={() => setViewingLegalPage('terms')}
        onViewPrivacy={() => setViewingLegalPage('privacy')}
      />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} projects={projects} setActiveTool={handleSetActiveTool} onOpenSettings={handleOpenSettings} />
    </div>
  );
};

export default App;