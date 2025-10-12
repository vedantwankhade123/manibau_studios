import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BlockType } from './types';

interface ToolboxItemProps {
    type: BlockType;
    icon: React.ReactNode;
    label: string;
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ type, icon, label }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `toolbox-item-${type}`,
        data: { type },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="w-full aspect-square flex flex-col items-center justify-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-grab hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:shadow-md transition-all"
        >
            <div className="text-zinc-500 dark:text-zinc-400">{icon}</div>
            <span className="text-xs font-medium">{label}</span>
        </div>
    );
};

export default ToolboxItem;