import React from 'react';
import { CanvasBlock } from './types';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface LayersPanelProps {
    blocks: CanvasBlock[];
    selectedBlockId: string | null;
    onSelectBlock: (id: string) => void;
    onReorderBlock: (id: string, direction: 'front' | 'back' | 'forward' | 'backward') => void;
    onDeleteBlock: (id: string) => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ blocks, selectedBlockId, onSelectBlock, onReorderBlock, onDeleteBlock }) => {
    const reversedBlocks = [...blocks].reverse(); // Reverse to show top layer first

    return (
        <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Layers</h3>
            {reversedBlocks.length > 0 ? (
                <div className="space-y-2">
                    {reversedBlocks.map((block, index) => (
                        <div
                            key={block.id}
                            onClick={() => onSelectBlock(block.id)}
                            className={`group p-2 rounded-md cursor-pointer transition-colors flex items-center justify-between ${selectedBlockId === block.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className="text-xs font-mono text-zinc-400">{reversedBlocks.length - index}</span>
                                <span className="text-sm font-medium truncate">{block.type}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                <button onClick={(e) => { e.stopPropagation(); onReorderBlock(block.id, 'forward'); }} title="Bring Forward" className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><ArrowUp size={14} /></button>
                                <button onClick={(e) => { e.stopPropagation(); onReorderBlock(block.id, 'backward'); }} title="Send Backward" className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"><ArrowDown size={14} /></button>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteBlock(block.id); }} title="Delete" className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-zinc-400 text-center py-4">No layers on this page.</p>
            )}
        </div>
    );
};

export default LayersPanel;