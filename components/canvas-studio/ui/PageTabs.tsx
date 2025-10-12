import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Page } from '../types';
import PageSettingsModal from './PageSettingsModal';

interface PageTabsProps {
    pages: Page[];
    activePageId: string;
    onSelectPage: (id: string) => void;
    onAddPage: () => void;
    onDeletePage: (id: string) => void;
    onUpdatePage: (id: string, newName: string, newPath: string) => void;
}

const PageTabs: React.FC<PageTabsProps> = ({ pages, activePageId, onSelectPage, onAddPage, onDeletePage, onUpdatePage }) => {
    const [editingPage, setEditingPage] = useState<Page | null>(null);

    const handleSaveSettings = (id: string, newName: string, newPath: string) => {
        onUpdatePage(id, newName, newPath);
        setEditingPage(null);
    };

    const handleRightClick = (e: React.MouseEvent, page: Page) => {
        e.preventDefault();
        setEditingPage(page);
    };

    return (
        <>
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
                    {pages.map(page => (
                        <div key={page.id} className="relative group">
                            <button
                                onClick={() => onSelectPage(page.id)}
                                onContextMenu={(e) => handleRightClick(e, page)}
                                title="Right-click for settings"
                                className={`px-3 py-1 text-sm rounded transition-colors flex items-center gap-1.5 ${
                                    activePageId === page.id
                                        ? 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-sm'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50'
                                }`}
                            >
                                {page.name}
                            </button>
                            {pages.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Are you sure you want to delete the page "${page.name}"?`)) {
                                            onDeletePage(page.id);
                                        }
                                    }}
                                    className="absolute -top-1 -right-1 bg-zinc-300 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300 rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button onClick={onAddPage} className="p-2 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400">
                    <Plus size={16} />
                </button>
            </div>
            <PageSettingsModal 
                page={editingPage}
                onClose={() => setEditingPage(null)}
                onSave={handleSaveSettings}
            />
        </>
    );
};

export default PageTabs;