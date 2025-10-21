import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Tool } from '../types';
import { Project } from './Dashboard';
import { Theme } from '../App';
import ThemeToggleButton from './ThemeToggleButton';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { KeyRound, Sparkles, LayoutTemplate } from 'lucide-react';
import MenuButton from './MenuButton';

// --- Icon Components ---
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const GenerateIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>);
const SketchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
const VideoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const CodeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>);
const ChevronLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /> </svg> );
const ChevronRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /> </svg> );
const DotsVerticalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>);
const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>);
const LibraryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>);
const FilterIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>);
const ChevronDownIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>);

interface LibraryProps {
  projects: Project[];
  setActiveTool: (tool: Tool) => void;
  onLoadProject: (projectId: string) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customApiKey: string | null;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onOpenSettings: (tab?: 'account') => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newName: string) => void;
  onDeleteMultipleProjects: (projectIds: string[]) => void;
}

const toolInfo: { [key in Tool]?: { name: string; icon: React.ReactNode; gradient: string } } = {
  [Tool.CHAT_WITH_AI]: { name: 'AI Studio', icon: <Sparkles size={48} />, gradient: 'from-purple-500 to-pink-500' },
  [Tool.CANVAS_STUDIO]: { name: 'Canvas Studio', icon: <LayoutTemplate size={48} />, gradient: 'from-indigo-500 to-blue-500' },
  [Tool.GENERATE]: { name: 'Image Studio', icon: <GenerateIcon />, gradient: 'from-blue-500 to-purple-600' },
  [Tool.VIDEO_STUDIO]: { name: 'Video Studio', icon: <VideoIcon />, gradient: 'from-red-500 to-orange-500' },
  [Tool.SKETCH_STUDIO]: { name: 'Sketch Studio', icon: <SketchIcon />, gradient: 'from-yellow-400 to-amber-500' },
  [Tool.DEV_DRAFT]: { name: 'Developer Studio', icon: <CodeIcon />, gradient: 'from-green-500 to-teal-500' },
};

const Library: React.FC<LibraryProps> = ({ projects, onLoadProject, setActiveTool, theme, setTheme, customApiKey, isSidebarCollapsed, setIsSidebarCollapsed, setIsMobileMenuOpen, onOpenSettings, onDeleteProject, onRenameProject, onDeleteMultipleProjects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<Tool | 'ALL'>('ALL');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setActiveMenu(null);
        }
        if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
            setIsFilterOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = activeFilter === 'ALL' || p.tool === activeFilter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [projects, searchQuery, activeFilter]);

  const filters: { id: Tool | 'ALL'; name: string }[] = [
    { id: 'ALL', name: 'All Projects' },
    { id: Tool.CHAT_WITH_AI, name: 'AI Studio' },
    { id: Tool.CANVAS_STUDIO, name: 'Canvas Studio' },
    { id: Tool.GENERATE, name: 'Image' },
    { id: Tool.VIDEO_STUDIO, name: 'Video' },
    { id: Tool.SKETCH_STUDIO, name: 'Sketch' },
    { id: Tool.DEV_DRAFT, name: 'Developer' },
  ];

  const handleStartRename = (project: Project) => {
    setRenamingProjectId(project.id);
    setRenameValue(project.name);
    setActiveMenu(null);
  };

  const handleConfirmRename = () => {
      if (renamingProjectId && renameValue.trim()) {
          onRenameProject(renamingProjectId, renameValue.trim());
      }
      setRenamingProjectId(null);
      setRenameValue('');
  };
  
  const handleDelete = (project: Project) => {
      setProjectToDelete(project);
      setActiveMenu(null);
  };

  const confirmDeleteSingleProject = () => {
    if (projectToDelete) {
        onDeleteProject(projectToDelete.id);
        setProjectToDelete(null);
    }
  };

  const handleToggleSelect = (projectId: string) => {
    setSelectedProjects(prev => 
        prev.includes(projectId) 
            ? prev.filter(id => id !== projectId) 
            : [...prev, projectId]
    );
  };

  const handleSelectAll = () => {
      if (selectedProjects.length === filteredProjects.length) {
          setSelectedProjects([]);
      } else {
          setSelectedProjects(filteredProjects.map(p => p.id));
      }
  };

  const handleDeleteSelected = () => {
      if (selectedProjects.length === 0) return;
      setIsDeleteModalOpen(true);
  };

  const confirmDeleteSelected = () => {
    onDeleteMultipleProjects(selectedProjects);
    setIsDeleteModalOpen(false);
    setIsDeleteMode(false);
    setSelectedProjects([]);
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
            <h1 className="text-lg font-bold">My Library</h1>
        </div>
        <div className="flex items-center gap-2">
            {!customApiKey && (
              <button onClick={() => onOpenSettings('account')} className="flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50">
                <KeyRound size={16} />
                <span>Add API Key</span>
              </button>
            )}
            <ThemeToggleButton theme={theme} setTheme={setTheme} />
        </div>
      </header>
      
      <div className="flex-grow p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-7xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by project name..."
              className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full py-2.5 pl-10 pr-4 text-zinc-800 dark:text-white focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="relative" ref={filterRef}>
                <button onClick={() => setIsFilterOpen(p => !p)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-zinc-200 dark:bg-zinc-800 rounded-full border border-zinc-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-zinc-300 dark:hover:bg-zinc-700">
                    <FilterIcon />
                    <span>{filters.find(f => f.id === activeFilter)?.name || 'Filter'}</span>
                    <ChevronDownIcon />
                </button>
                {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-10 py-1">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => {
                                    setActiveFilter(filter.id);
                                    setIsFilterOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                            >
                                {filter.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {isDeleteMode ? (
                <div className="flex items-center gap-3">
                    <button onClick={handleSelectAll} className="px-4 py-2 text-sm font-semibold bg-zinc-700 hover:bg-zinc-600 text-white rounded-full transition-colors">
                        {selectedProjects.length === filteredProjects.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button 
                        onClick={handleDeleteSelected} 
                        disabled={selectedProjects.length === 0} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                    >
                        <TrashIcon />
                        Delete ({selectedProjects.length})
                    </button>
                    <button 
                        onClick={() => { setIsDeleteMode(false); setSelectedProjects([]); }} 
                        className="p-2 text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                    >
                        <XIcon/>
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsDeleteMode(true)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"><TrashIcon/></button>
            )}
          </div>
        </div>
        
        <main className="w-full max-w-7xl mx-auto flex-grow">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map(p => {
                const info = toolInfo[p.tool];
                const isSelected = selectedProjects.includes(p.id);
                return (
                  <div key={p.id} className={`relative group transition-all ${isDeleteMode ? 'cursor-pointer' : ''}`} onClick={isDeleteMode ? () => handleToggleSelect(p.id) : undefined}>
                    {isDeleteMode && (
                        <div className={`absolute top-3 right-3 z-10 p-1 rounded-full transition-all ${isSelected ? 'bg-purple-600 text-white' : 'bg-white/50 dark:bg-black/50 backdrop-blur-sm'}`}>
                            {isSelected ? <CheckCircleIcon /> : <div className="h-6 w-6 border-2 border-gray-400 rounded-full"></div>}
                        </div>
                    )}
                    <div className={`bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'ring-2 ring-purple-500 border-transparent' : 'border-zinc-200 dark:border-zinc-800'}`}>
                      <div onClick={!isDeleteMode ? () => onLoadProject(p.id) : undefined} className={`relative aspect-video bg-gradient-to-br ${info?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white/50 ${!isDeleteMode ? 'cursor-pointer' : ''}`}>
                        {p.previewUrl ? (
                          p.tool === Tool.VIDEO_STUDIO ? (
                            <video src={p.previewUrl} muted loop autoPlay playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img src={p.previewUrl} alt={p.name} className="w-full h-full object-cover" />
                          )
                        ) : (
                          info?.icon
                        )}
                      </div>
                      <div className="p-4">
                        {renamingProjectId === p.id ? (
                          <input
                              type="text"
                              value={renameValue}
                              onChange={e => setRenameValue(e.target.value)}
                              onBlur={handleConfirmRename}
                              onKeyDown={e => e.key === 'Enter' && handleConfirmRename()}
                              autoFocus
                              className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded p-1 text-zinc-800 dark:text-white"
                          />
                        ) : (
                          <p className="font-semibold text-zinc-800 dark:text-white truncate group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">{p.name}</p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <span className={`text-xs font-semibold text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${info?.gradient || 'from-gray-400 to-gray-500'}`}>
                            {info?.name || 'Project'}
                          </span>
                          <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-400 dark:text-gray-500">{p.timestamp}</p>
                              <div className="relative" ref={menuRef}>
                                  <button onClick={() => setActiveMenu(activeMenu === p.id ? null : p.id)} className="p-1 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <DotsVerticalIcon />
                                  </button>
                                  {activeMenu === p.id && (
                                      <div className="absolute right-0 bottom-full mb-2 w-40 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-10 py-1">
                                          <button onClick={() => handleStartRename(p)} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                                              <PencilIcon /> Rename
                                          </button>
                                          <button onClick={() => handleDelete(p)} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 dark:text-red-400 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                                              <TrashIcon /> Delete
                                          </button>
                                      </div>
                                  )}
                              </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 py-20">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-full text-zinc-400 dark:text-zinc-600 mb-4">
                <LibraryIcon />
              </div>
              <h3 className="text-xl font-semibold text-zinc-800 dark:text-gray-300">No Projects Found</h3>
              <p className="max-w-xs mt-1">Your search or filter returned no results. Try adjusting your criteria or create a new project in one of our studios!</p>
            </div>
          )}
        </main>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteSelected}
        itemCount={selectedProjects.length}
      />
      <DeleteConfirmationModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDeleteSingleProject}
        itemCount={1}
        itemName={projectToDelete?.name}
      />
    </div>
  );
};

export default Library;