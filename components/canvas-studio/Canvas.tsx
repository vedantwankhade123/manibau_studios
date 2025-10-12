import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CanvasBlock } from './types';
import CanvasItem from './CanvasItem';

interface CanvasProps {
    blocks: CanvasBlock[];
    selectedBlockId: string | null;
    onSelectBlock: (id: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ blocks, selectedBlockId, onSelectBlock }) => {
    const { setNodeRef } = useDroppable({
        id: 'canvas-droppable-area',
    });

    return (
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-8 overflow-y-auto custom-scrollbar">
            <div
                ref={setNodeRef}
                className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 shadow-lg rounded-lg min-h-[600px]"
            >
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    {blocks.length > 0 ? (
                        blocks.map(block => (
                            <CanvasItem
                                key={block.id}
                                block={block}
                                isSelected={selectedBlockId === block.id}
                                onClick={() => onSelectBlock(block.id)}
                            />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-full text-center text-zinc-400 p-8">
                            <p>Drag components from the left sidebar to start building your page.</p>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

export default Canvas;