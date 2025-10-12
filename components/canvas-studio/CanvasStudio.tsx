import React, { useState } from 'react';
import { Theme } from '../../App';
import ThemeToggleButton from '../ThemeToggleButton';
import UserProfilePopover from '../UserProfilePopover';
import { SettingsTab } from '../SettingsModal';
import { ChevronLeft, ChevronRight, Undo, Redo, Monitor, Tablet, Smartphone, PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import CanvasLeftSidebar from './CanvasLeftSidebar';
import Canvas from './Canvas';
import CanvasRightSidebar from './CanvasRightSidebar';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { BlockType, CanvasBlock } from './types';

interface CanvasStudioProps {
  onToggleNotifications: () => void;
  unreadCount: number;
  onToggleCommandPalette: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  onOpenSettings: (tab?: SettingsTab) => void;
  customApiKey: string | null;
  onLogout: () => void;
}

const createNewBlock = (type: BlockType): CanvasBlock => {
    const id = `${type}-${Date.now()}`;
    switch (type) {
        case 'Heading':
            return { id, type, content: { text: 'Your Heading Here', level: 'h2', textAlign: 'center', color: '#18181b' } };
        case 'Paragraph':
            return { id, type, content: { text: 'This is a paragraph. You can edit this text in the properties panel on the right.', fontSize: '16px', textAlign: 'left', color: '#3f3f46' } };
        case 'Button':
            return { id, type, content: { text: 'Click Me', url: '#', backgroundColor: '#2563eb', textColor: '#ffffff' } };
        case 'Image':
            return { id, type, content: { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800', alt: 'Team working' } };
        case 'Social':
            return { id, type, content: { instagram: '#', facebook: '#', linkedin: '#' } };
        case 'Spacer':
            return { id, type, content: { height: 50 } };
        case 'Divider':
            return { id, type, content: { thickness: 1, color: '#e5e7eb', marginY: 16 } };
        case 'Video':
            return { id, type, content: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', aspectRatio: '16/9' } };
        case 'Icon':
            return { id, type, content: { iconName: 'Smile', size: 48, color: '#18181b' } };
        default:
            throw new Error(`Unknown block type: ${type}`);
    }
};

const CanvasStudio: React.FC<CanvasStudioProps> = (props) => {
    const { theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, onOpenSettings, onLogout } = props;
    const [blocks, setBlocks] = useState<CanvasBlock[]>([]);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id.toString().startsWith('toolbox-item-') && over?.id === 'canvas-droppable-area') {
            const type = active.data.current?.type as BlockType;
            if (type) {
                const newBlock = createNewBlock(type);
                setBlocks(prev => [...prev, newBlock]);
                setSelectedBlockId(newBlock.id);
            }
            return;
        }

        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex(b => b.id === active.id);
            const newIndex = blocks.findIndex(b => b.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                setBlocks(arrayMove(blocks, oldIndex, newIndex));
            }
        }
    };

    const updateBlockContent = (id: string, content: any) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b));
    };

    const deleteBlock = (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
        if (selectedBlockId === id) {
            setSelectedBlockId(null);
        }
    };

    const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

    return (
        <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex items-center gap-2 text-sm">
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors"
                        >
                            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                        </button>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">Canvas Studio</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggleButton theme={theme} setTheme={setTheme} />
                        <UserProfilePopover onOpenSettings={onOpenSettings} onLogout={onLogout} />
                    </div>
                </header>

                <div className="flex-grow flex min-h-0">
                    <CanvasLeftSidebar isCollapsed={!isLeftSidebarOpen} onToggle={() => setIsLeftSidebarOpen(false)} />
                    <div className="flex-1 flex flex-col">
                        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                                {!isLeftSidebarOpen && (
                                    <button onClick={() => setIsLeftSidebarOpen(true)} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                        <PanelLeftOpen size={18} />
                                    </button>
                                )}
                                <button className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"><Undo size={18} /></button>
                                <button className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400"><Redo size={18} /></button>
                            </div>
                            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
                                <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded ${device === 'desktop' ? 'text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50'}`}><Monitor size={18}/></button>
                                <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded ${device === 'tablet' ? 'text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50'}`}><Tablet size={18}/></button>
                                <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded ${device === 'mobile' ? 'text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-700 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50'}`}><Smartphone size={18}/></button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-sm font-semibold px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                                    Publish
                                </button>
                                {!isRightSidebarOpen && (
                                    <button onClick={() => setIsRightSidebarOpen(true)} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                        <PanelRightOpen size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <Canvas blocks={blocks} selectedBlockId={selectedBlockId} onSelectBlock={setSelectedBlockId} device={device} />
                    </div>
                    <CanvasRightSidebar selectedBlock={selectedBlock} updateBlock={updateBlockContent} deleteBlock={deleteBlock} isCollapsed={!isRightSidebarOpen} onToggle={() => setIsRightSidebarOpen(false)} />
                </div>
            </div>
        </DndContext>
    );
};

export default CanvasStudio;