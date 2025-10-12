import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { X } from 'lucide-react';

interface PageSettingsModalProps {
    page: Page | null;
    onClose: () => void;
    onSave: (id: string, newName: string, newPath: string) => void;
}

const PageSettingsModal: React.FC<PageSettingsModalProps> = ({ page, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [path, setPath] = useState('');

    useEffect(() => {
        if (page) {
            setName(page.name);
            setPath(page.path || '');
        }
    }, [page]);

    if (!page) return null;

    const sanitizePath = (input: string) => {
        let sanitized = input.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-/_]/g, '');
        if (sanitized && !sanitized.startsWith('/')) {
            sanitized = '/' + sanitized;
        }
        return sanitized;
    };

    const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPath(e.target.value);
    };
    
    const handlePathBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPath(sanitizePath(e.target.value));
    };

    const handleSave = () => {
        onSave(page.id, name.trim(), sanitizePath(path));
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-lg font-bold">Page Settings</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover-bg-zinc-700"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block text-zinc-600 dark:text-zinc-400">Page Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block text-zinc-600 dark:text-zinc-400">Page Path (URL)</label>
                        <input
                            type="text"
                            value={path}
                            onChange={handlePathChange}
                            onBlur={handlePathBlur}
                            placeholder="/about-us"
                            className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-zinc-400 mt-1">e.g., /contact. Will be auto-formatted.</p>
                    </div>
                </div>
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-semibold text-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageSettingsModal;