import React, { useState, useEffect, useCallback } from 'react';
import { Theme } from '../../App';
import ThemeToggleButton from '../ThemeToggleButton';
import UserProfilePopover from '../UserProfilePopover';
import { SettingsTab } from '../SettingsModal';
import { ChevronLeft, ChevronRight, Undo, Redo, Monitor, Tablet, Smartphone, PanelLeftOpen, PanelRightOpen } from 'lucide-react';
import CanvasLeftSidebar from './CanvasLeftSidebar';
import Canvas from './Canvas';
import CanvasRightSidebar from './CanvasRightSidebar';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { BlockType, CanvasBlock, Page } from './types';
import PageTabs from './ui/PageTabs';
import { useHistory } from './hooks/useHistory';

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
            return { id, type, x: 50, y: 50, width: 400, height: 80, content: { text: 'Your Heading Here', level: 'h2', textAlign: 'center', color: '#18181b', maxWidth: 600 } };
        case 'Paragraph':
            return { id, type, x: 50, y: 50, width: 400, height: 120, content: { text: 'This is a paragraph...', fontSize: '16px', textAlign: 'left', color: '#3f3f46', maxWidth: 600 } };
        case 'Button':
            return { id, type, x: 50, y: 50, width: 200, height: 80, content: { text: 'Click Me', url: '#', backgroundColor: '#2563eb', textColor: '#ffffff' } };
        case 'Image':
            return { id, type, x: 50, y: 50, width: 500, height: 300, content: { src: 'https://via.placeholder.com/500x300', alt: 'Placeholder', width: 100 } };
        case 'Social':
            return { id, type, x: 50, y: 50, width: 200, height: 80, content: { instagram: '#', facebook: '#', linkedin: '#' } };
        case 'Spacer':
            return { id, type, x: 50, y: 50, width: 500, height: 50, content: { height: 50 } };
        case 'Divider':
            return { id, type, x: 50, y: 50, width: 500, height: 40, content: { thickness: 1, color: '#e5e7eb', marginY: 16 } };
        case 'Video':
            return { id, type, x: 50, y: 50, width: 500, height: 300, content: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', aspectRatio: '16/9', width: 100 } };
        case 'Icon':
            return { id, type, x: 50, y: 50, width: 100, height: 100, content: { iconName: 'Smile', size: 48, color: '#18181b' } };
        case 'Text':
            return { id, type, x: 50, y: 50, width: 300, height: 150, content: { text: 'This is a text box. You can add more content here.', fontSize: '16px', textAlign: 'left', color: '#18181b', backgroundColor: 'transparent', padding: 16, borderRadius: 8 } };
        case 'Map':
            return { id, type, x: 50, y: 50, width: 500, height: 400, content: { address: 'New York, NY', zoom: 13 } };
        default:
            throw new Error(`Unknown block type: ${type}`);
    }
};

const CanvasStudio: React.FC<CanvasStudioProps> = (props) => {
    const { theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, onOpenSettings, onLogout } = props;
    
    const { state: pages, setState: setPagesHistory, undo, redo, canUndo, canRedo } = useHistory<Page[]>([
        { id: `page-${Date.now()}`, name: 'Home', blocks: [] }
    ]);
    const [displayPages, setDisplayPages] = useState(pages);

    useEffect(() => {
        setDisplayPages(pages);
    }, [pages]);

    const [activePageId, setActivePageId] = useState<string>(pages[0].id);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#FFFFFF');
    const [resizingState, setResizingState] = useState<{ blockId: string; handle: string; initialX: number; initialY: number; initialWidth: number; initialHeight: number; initialBlockX: number; initialBlockY: number; } | null>(null);

    const activePage = displayPages.find(p => p.id === activePageId);
    const activeBlocks = activePage?.blocks || [];

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;
        if (active.id.toString().startsWith('toolbox-item-') && over?.id === 'canvas-droppable-area') {
            const type = active.data.current?.type as BlockType;
            if (type) {
                const newBlock = createNewBlock(type);
                setPagesHistory(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: [...p.blocks, newBlock] } : p));
                setSelectedBlockId(newBlock.id);
            }
            return;
        }
        if (!active.id.toString().startsWith('toolbox-item-')) {
            setPagesHistory(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: p.blocks.map(b => b.id === active.id ? { ...b, x: b.x + delta.x, y: b.y + delta.y } : b) } : p));
        }
    };

    const updateBlockContent = (id: string, content: any) => {
        setPagesHistory(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: p.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b) } : p));
    };

    const deleteBlock = (id: string) => {
        setPagesHistory(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: p.blocks.filter(b => b.id !== id) } : p));
        if (selectedBlockId === id) setSelectedBlockId(null);
    };

    const addPage = () => {
        const newPage: Page = { id: `page-${Date.now()}`, name: `Page ${pages.length + 1}`, blocks: [] };
        setPagesHistory(prev => [...prev, newPage]);
        setActivePageId(newPage.id);
    };

    const deletePage = (id: string) => {
        setPagesHistory(prev => {
            const newPages = prev.filter(p => p.id !== id);
            if (activePageId === id) setActivePageId(newPages[0]?.id || '');
            return newPages;
        });
    };

    const handleResizeStart = (e: React.MouseEvent, blockId: string, handle: string) => {
        e.preventDefault();
        const block = activeBlocks.find(b => b.id === blockId);
        if (!block) return;
        setResizingState({ blockId, handle, initialX: e.clientX, initialY: e.clientY, initialWidth: block.width, initialHeight: block.height, initialBlockX: block.x, initialBlockY: block.y });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!resizingState) return;
        const { blockId, handle, initialX, initialY, initialWidth, initialHeight, initialBlockX, initialBlockY } = resizingState;
        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;

        setDisplayPages(prevPages => prevPages.map(p => p.id === activePageId ? { ...p, blocks: p.blocks.map(b => {
            if (b.id === blockId) {
                const newBlock = { ...b };
                if (handle.includes('right')) newBlock.width = Math.max(20, initialWidth + deltaX);
                if (handle.includes('bottom')) newBlock.height = Math.max(20, initialHeight + deltaY);
                if (handle.includes('left')) {
                    newBlock.width = Math.max(20, initialWidth - deltaX);
                    newBlock.x = initialBlockX + deltaX;
                }
                if (handle.includes('top')) {
                    newBlock.height = Math.max(20, initialHeight - deltaY);
                    newBlock.y = initialBlockY + deltaY;
                }
                return newBlock;
            }
            return b;
        })} : p));
    }, [resizingState, activePageId]);

    const handleMouseUp = useCallback(() => {
        if (resizingState) {
            setPagesHistory(displayPages);
            setResizingState(null);
        }
    }, [resizingState, displayPages, setPagesHistory]);

    useEffect(() => {
        if (resizingState) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp, { once: true });
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingState, handleMouseMove, handleMouseUp]);

    const selectedBlock = activeBlocks.find(b => b.id === selectedBlockId) || null;

    const handleDeselectAll = () => {
        setSelectedBlockId(null);
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex items-center gap-2 text-sm">
                        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"><ChevronLeft /></button>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">Canvas Studio</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggleButton theme={theme} setTheme={setTheme} />
                        <UserProfilePopover onOpenSettings={onOpenSettings} onLogout={onLogout} />
                    </div>
                </header>
                <div className="flex-grow flex min-h-0">
                    <CanvasLeftSidebar isCollapsed={!isLeftSidebarOpen} onToggle={() => setIsLeftSidebarOpen(false)} />
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="relative flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <div className="flex items-center gap-2">
                                {!isLeftSidebarOpen && <button onClick={() => setIsLeftSidebarOpen(true)} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><PanelLeftOpen size={18} /></button>}
                                <button onClick={undo} disabled={!canUndo} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:text-zinc-300 dark:disabled:text-zinc-600"><Undo size={18} /></button>
                                <button onClick={redo} disabled={!canRedo} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:text-zinc-300 dark:disabled:text-zinc-600"><Redo size={18} /></button>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2"><PageTabs pages={pages} activePageId={activePageId} onSelectPage={setActivePageId} onAddPage={addPage} onDeletePage={deletePage} /></div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
                                    <label className="text-xs font-medium text-zinc-500 px-2">BG</label>
                                    <input type="color" value={canvasBackgroundColor} onChange={(e) => setCanvasBackgroundColor(e.target.value)} className="w-6 h-6 p-0 border-none rounded bg-transparent cursor-pointer" />
                                </div>
                                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
                                    <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white dark:bg-zinc-700' : ''}`}><Monitor size={18}/></button>
                                    <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded ${device === 'tablet' ? 'bg-white dark:bg-zinc-700' : ''}`}><Tablet size={18}/></button>
                                    <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white dark:bg-zinc-700' : ''}`}><Smartphone size={18}/></button>
                                </div>
                                <button className="text-sm font-semibold px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Publish</button>
                                {!isRightSidebarOpen && <button onClick={() => setIsRightSidebarOpen(true)} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><PanelRightOpen size={18} /></button>}
                            </div>
                        </div>
                        <Canvas 
                            blocks={activeBlocks} 
                            selectedBlockId={selectedBlockId} 
                            onSelectBlock={setSelectedBlockId} 
                            onDeselectAll={handleDeselectAll}
                            device={device} 
                            backgroundColor={canvasBackgroundColor}
                            onResizeStart={handleResizeStart}
                        />
                    </div>
                    <CanvasRightSidebar selectedBlock={selectedBlock} updateBlock={updateBlockContent} deleteBlock={deleteBlock} isCollapsed={!isRightSidebarOpen} onToggle={() => setIsRightSidebarOpen(false)} />
                </div>
            </div>
        </DndContext>
    );
};

export default CanvasStudio;