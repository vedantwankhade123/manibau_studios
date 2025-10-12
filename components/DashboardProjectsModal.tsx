import React, { useState, useEffect, useRef } from 'react';
import { Project } from './Dashboard';
import { Tool } from '../types';

// JSZip is loaded from a script tag in index.html
declare const JSZip: any;

interface DashboardProjectsModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    onLoad: (projectId: string) => void;
    onDelete: (projectId: string) => void;
    onRename: (projectId: string, newName: string) => void;
}

// --- Icon Components ---
const ProjectsIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>);
const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>);
const DotsVerticalIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>);
const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>);

const DashboardProjectsModal: React.FC<DashboardProjectsModalProps> = ({ isOpen, onClose, projects, onLoad, onDelete, onRename }) => {
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

    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

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

    const handleDownload = async (project: Project) => {
        setActiveMenu(null);
        if (typeof JSZip === 'undefined') {
          alert("ZIP library not loaded.");
          return;
        }
        if (project.files.length === 0) {
            alert("This project has no code files to download.");
            return;
        }
        const zip = new JSZip();
        project.files.forEach(file => {
          zip.file(file.name, file.content);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.replace(/\s+/g, '_')}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl h-[70vh] shadow-2xl flex flex-col">
                <div className="flex-shrink-0 flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold flex items-center gap-2"><ProjectsIcon /> All Projects</h2>
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
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-10 py-1">
                                                    <button onClick={() => handleStartRename(p)} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                                                        <PencilIcon /> Rename
                                                    </button>
                                                    <button onClick={() => handleDownload(p)} disabled={p.files.length === 0} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-700 dark:text-gray-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed">
                                                        <DownloadIcon /> Download (.zip)
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

export default DashboardProjectsModal;