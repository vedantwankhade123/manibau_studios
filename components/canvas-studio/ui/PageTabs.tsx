import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Page } from '../types';

interface PageTabsProps {
    pages: Page[];
    activePageId: string;
    onSelectPage: (id: string) => void;
    onAddPage: () => void;
    onDeletePage: (id: string) => void;
    onRenamePage: (id: string, newName: string) => void;
}

const PageTabs: React.FC<PageTabsProps> = ({ pages, activePageId, onSelectPage, onAddPage, onDeletePage, onRenamePage }) => {
    const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

    useEffect(() => {
        if (renamingPageId) {
            const page = pages.find(p => p.id === renamingPageId);
            setRenameValue(page?.name || '');
        }
    }, [renamingPageId, pages]);

    const handleRename = () => {
        if (renamingPageId && renameValue.trim()) {
            onRenamePage(renamingPageId, renameValue.trim());
        }
        setRenamingPageId(null);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
                {pages.map(page => (
                    <div key={page.id} className="relative group">
                        {renamingPageId === page.id ? (
                            <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={handleRename}
                                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                                autoFocus
                                className="px-3 py-1 text-sm bg-white dark:bg-zinc-700 rounded outline-none ring-2 ring-blue-500"
                            />
                        ) : (
                            <button
                                onClick={() => onSelectPage(page.id)}
                                onDoubleClick={() => setRenamingPageId(page.id)}
                                className={`px-3 py-1 text-sm rounded transition-colors ${
                                    activePageId === page.id
                                        ? 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-sm'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50'
                                }`}
                            >
                                {page.name}
                            </button>
                        )}
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
    );
};

export default PageTabs;