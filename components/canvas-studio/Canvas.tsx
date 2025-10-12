import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CanvasBlock } from './types';
import CanvasItem from './CanvasItem';

interface CanvasProps {
    blocks: CanvasBlock[];
    selectedBlockId: string | null;
    onSelectBlock: (id: string) => void;
    onDeselectAll: () => void;
    device: 'desktop' | 'tablet' | 'mobile';
    backgroundColor: string;
    onResizeStart: (e: React.MouseEvent, blockId: string, handle: string) => void;
    onContextMenu: (e: React.MouseEvent, blockId: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ blocks, selectedBlockId, onSelectBlock, onDeselectAll, device, backgroundColor, onResizeStart, onContextMenu }) => {
    const { setNodeRef } = useDroppable({
        id: 'canvas-droppable-area',
    });

    const deviceStyles = {
        desktop: { width: '100%', minHeight: '100%', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', borderRadius: '0.5rem' },
        tablet: { width: '768px', height: '1024px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', borderRadius: '0.75rem' },
        mobile: { width: '375px', height: '667px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', borderRadius: '1rem' },
    };

    return (
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-8 overflow-auto custom-scrollbar flex justify-center" onClick={onDeselectAll}>
            <div
                ref={setNodeRef}
                className="mx-auto transition-all duration-300 ease-in-out relative"
                style={{ ...deviceStyles[device], backgroundColor }}
                onClick={(e) => e.stopPropagation()}
            >
                {blocks.length > 0 ? (
                    blocks.map(block => (
                        <CanvasItem
                            key={block.id}
                            block={block}
                            isSelected={selectedBlockId === block.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectBlock(block.id);
                            }}
                            onResizeStart={onResizeStart}
                            onContextMenu={onContextMenu}
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-zinc-400 p-8" onClick={onDeselectAll}>
                        <p>Drag components from the left sidebar to start building your page.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Canvas;