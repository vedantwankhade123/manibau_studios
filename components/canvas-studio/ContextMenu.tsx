import React, { useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Trash2 } from 'lucide-react';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onReorder: (direction: 'front' | 'back' | 'forward' | 'backward') => void;
    onDelete: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onReorder, onDelete }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const menuItems = [
        { label: 'Bring Forward', icon: <ArrowUp size={16} />, action: () => onReorder('forward') },
        { label: 'Send Backward', icon: <ArrowDown size={16} />, action: () => onReorder('backward') },
        { label: 'Bring to Front', icon: <ChevronsUp size={16} />, action: () => onReorder('front') },
        { label: 'Send to Back', icon: <ChevronsDown size={16} />, action: () => onReorder('back') },
        { label: 'Delete', icon: <Trash2 size={16} />, action: onDelete, isDestructive: true },
    ];

    return (
        <div
            ref={menuRef}
            style={{ top: y, left: x }}
            className="absolute z-50 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700 p-1 animate-fade-in-down"
        >
            {menuItems.map(item => (
                <button
                    key={item.label}
                    onClick={() => { item.action(); onClose(); }}
                    className={`w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                        item.isDestructive
                            ? 'text-red-500 hover:bg-red-500/10'
                            : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                    }`}
                >
                    {item.icon}
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default ContextMenu;