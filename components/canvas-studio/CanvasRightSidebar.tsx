import React from 'react';
import { Trash2, PanelRightClose } from 'lucide-react';
import { CanvasBlock, Page } from './types';
import ImageSettings from './settings/ImageSettings';
import ButtonSettings from './settings/ButtonSettings';
import SocialSettings from './settings/SocialSettings';
import HeadingSettings from './settings/HeadingSettings';
import ParagraphSettings from './settings/ParagraphSettings';
import SpacerSettings from './settings/SpacerSettings';
import DividerSettings from './settings/DividerSettings';
import VideoSettings from './settings/VideoSettings';
import IconSettings from './settings/IconSettings';
import TextSettings from './settings/TextSettings';
import MapSettings from './settings/MapSettings';
import ShapeSettings from './settings/ShapeSettings';
import LayersPanel from './LayersPanel';

interface CanvasRightSidebarProps {
    blocks: CanvasBlock[];
    selectedBlock: CanvasBlock | null;
    onSelectBlock: (id: string) => void;
    updateBlock: (id: string, content: any) => void;
    deleteBlock: (id: string) => void;
    reorderBlock: (id: string, direction: 'front' | 'back' | 'forward' | 'backward') => void;
    isCollapsed: boolean;
    onToggle: () => void;
    pages: Page[];
}

const CanvasRightSidebar: React.FC<CanvasRightSidebarProps> = ({ blocks, selectedBlock, onSelectBlock, updateBlock, deleteBlock, reorderBlock, isCollapsed, onToggle, pages }) => {
    const renderSettings = () => {
        if (!selectedBlock) {
            return <LayersPanel blocks={blocks} selectedBlockId={null} onSelectBlock={onSelectBlock} onReorderBlock={reorderBlock} onDeleteBlock={deleteBlock} />;
        }

        switch (selectedBlock.type) {
            case 'Heading':
                return <HeadingSettings block={selectedBlock} updateBlock={updateBlock} pages={pages} />;
            case 'Paragraph':
                return <ParagraphSettings block={selectedBlock} updateBlock={updateBlock} pages={pages} />;
            case 'Image':
                return <ImageSettings block={selectedBlock} updateBlock={updateBlock} pages={pages} />;
            case 'Button':
                return <ButtonSettings block={selectedBlock} updateBlock={updateBlock} pages={pages} />;
            case 'Social':
                return <SocialSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Spacer':
                return <SpacerSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Divider':
                return <DividerSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Video':
                return <VideoSettings block={selectedBlock} updateBlock={updateBlock} pages={pages} />;
            case 'Icon':
                return <IconSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Text':
                return <TextSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Map':
                return <MapSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Shape':
                return <ShapeSettings block={selectedBlock} updateBlock={updateBlock} />;
            default:
                return <p>No settings available for this block type.</p>;
        }
    };

    if (isCollapsed) {
        return null;
    }

    return (
        <aside className={`flex-shrink-0 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0' : 'w-80'}`}>
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <h2 className="text-base font-bold">{selectedBlock ? `${selectedBlock.type} Settings` : 'Layers & Properties'}</h2>
                <button onClick={onToggle} className="p-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">
                    <PanelRightClose size={20} />
                </button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-6">
                {renderSettings()}
            </div>
            {selectedBlock && (
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={() => deleteBlock(selectedBlock.id)}
                        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-500/10 py-2 rounded-md transition-colors"
                    >
                        <Trash2 size={16} />
                        Delete Block
                    </button>
                </div>
            )}
        </aside>
    );
};

export default CanvasRightSidebar;