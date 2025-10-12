import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CanvasBlock } from './types';
import CanvasItem from './CanvasItem';

interface CanvasProps {
    blocks: CanvasBlock[];
    selectedBlockId: string | null;
    onSelectBlock: (id: string) => void;
    device: 'desktop' | 'tablet' | 'mobile';
}

const Canvas: React.FC<CanvasProps> = ({ blocks, selectedBlockId, onSelectBlock, device }) => {
    const { setNodeRef } = useDroppable({
        id: 'canvas-droppable-area',
    });

    const deviceStyles = {
        desktop: { width: '1280px', minHeight: '100%', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', borderRadius: '0.5rem' },
        tablet: { width: '768px', height: '1024px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', borderRadius: '0.75rem' },
        mobile: { width: '375px', height: '667px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', borderRadius: '1rem' },
    };

    return (
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-8 overflow-auto custom-scrollbar flex justify-start">
            <div
                ref={setNodeRef}
                className="mx-auto bg-white dark:bg-zinc-900 transition-all duration-300 ease-in-out"
                style={deviceStyles[device]}
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