import React from 'react';
import { MoreHorizontal, Trash2, PanelRightClose } from 'lucide-react';
import { CanvasBlock } from './types';
import ImageSettings from './settings/ImageSettings';
import ButtonSettings from './settings/ButtonSettings';
import SocialSettings from './settings/SocialSettings';
import HeadingSettings from './settings/HeadingSettings';
import ParagraphSettings from './settings/ParagraphSettings';
import SpacerSettings from './settings/SpacerSettings';
import DividerSettings from './settings/DividerSettings';
import VideoSettings from './settings/VideoSettings';
import IconSettings from './settings/IconSettings';

interface CanvasRightSidebarProps {
    selectedBlock: CanvasBlock | null;
    updateBlock: (id: string, content: any) => void;
    deleteBlock: (id: string) => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

const CanvasRightSidebar: React.FC<CanvasRightSidebarProps> = ({ selectedBlock, updateBlock, deleteBlock, isCollapsed, onToggle }) => {
    const renderSettings = () => {
        if (!selectedBlock) {
            return (
                <div className="text-center text-zinc-500 dark:text-zinc-400 p-8">
                    <p>Select a block on the canvas to see its properties.</p>
                </div>
            );
        }

        switch (selectedBlock.type) {
            case 'Heading':
                return <HeadingSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Paragraph':
                return <ParagraphSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Image':
                return <ImageSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Button':
                return <ButtonSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Social':
                return <SocialSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Spacer':
                return <SpacerSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Divider':
                return <DividerSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Video':
                return <VideoSettings block={selectedBlock} updateBlock={updateBlock} />;
            case 'Icon':
                return <IconSettings block={selectedBlock} updateBlock={updateBlock} />;
            default:
                return <p>No settings available for this block type.</p>;
        }
    };

    if (isCollapsed) {
        return null; // The toggle button is in the main CanvasStudio component now
    }

    return (
        <aside className={`flex-shrink-0 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0' : 'w-72'}`}>
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <h2 className="text-base font-bold">{selectedBlock ? `${selectedBlock.type} Settings` : 'Properties'}</h2>
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