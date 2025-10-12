import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BlockType } from './types';

interface ToolboxItemProps {
    type: BlockType;
    icon: React.ReactNode;
    label: string;
    onAddItem: (type: BlockType) => void;
}

const ToolboxItem: React.FC<ToolboxItemProps> = ({ type, icon, label, onAddItem }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: `toolbox-item-${type}`,
        data: { type },
        activationConstraint: {
            distance: 8, // User must drag more than 8px to start a drag
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={() => onAddItem(type)}
            className="w-full aspect-square flex flex-col items-center justify-center gap-1 p-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-grab hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:shadow-md transition-all"
        >
            <div className="text-zinc-500 dark:text-zinc-400">{icon}</div>
            <span className="text-xs font-medium text-center leading-tight">{label}</span>
        </div>
    );
};

export default ToolboxItem;