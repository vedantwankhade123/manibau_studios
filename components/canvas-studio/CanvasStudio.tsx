import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Theme } from '../../App';
import ThemeToggleButton from '../ThemeToggleButton';
import UserProfilePopover from '../UserProfilePopover';
import { SettingsTab } from '../SettingsModal';
import { ChevronLeft, Undo, Redo, Monitor, Tablet, Smartphone, PanelLeftOpen, PanelRightOpen, Search, Type, Pilcrow, Image as ImageIcon, Link as LinkIcon, MousePointerClick, Minus, Divide, Video, Star, Text, Map, Square, Download } from 'lucide-react';
import CanvasLeftSidebar from './CanvasLeftSidebar';
import Canvas from './Canvas';
import CanvasRightSidebar from './CanvasRightSidebar';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { BlockType, CanvasBlock, Page } from './types';
import PageTabs from './ui/PageTabs';
import { useHistory } from './hooks/useHistory';
import ContextMenu from './ContextMenu';
import PageSettingsModal from './ui/PageSettingsModal';
import ExportModal from './ui/ExportModal';
import { generateHtmlForPage } from './utils/exportUtils';

// Block component imports for drag overlay
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import ImageBlock from './blocks/ImageBlock';
import ButtonBlock from './blocks/ButtonBlock';
import SocialBlock from './blocks/SocialBlock';
import SpacerBlock from './blocks/SpacerBlock';
import DividerBlock from './blocks/DividerBlock';
import VideoBlock from './blocks/VideoBlock';
import IconBlock from './blocks/IconBlock';
import TextBlock from './blocks/TextBlock';
import MapBlock from './blocks/MapBlock';
import ShapeBlock from './blocks/ShapeBlock';

declare const html2canvas: any;

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

const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <Search size={18} />
    </button>
);

const NotificationBell: React.FC<{ onClick: () => void; notificationCount: number; }> = ({ onClick, notificationCount }) => (
    <button onClick={onClick} className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
        )}
    </button>
);

const createNewBlock = (type: BlockType): CanvasBlock => {
    const id = `${type}-${Date.now()}`;
    switch (type) {
        case 'Heading':
            return { id, type, x: 50, y: 50, width: 400, height: 80, content: { text: 'Your Heading Here', level: 'h2', textAlign: 'center', color: '#18181b', maxWidth: 600 } };
        case 'Paragraph':
            return { id, type, x: 50, y: 50, width: 400, height: 120, content: { text: 'This is a paragraph...', fontSize: '16px', textAlign: 'left', color: '#3f3f46', maxWidth: 600 } };
        case 'Button':
            return { id, type, x: 50, y: 50, width: 200, height: 80, content: { text: 'Click Me', backgroundColor: '#2563eb', textColor: '#ffffff' } };
        case 'Image':
            return { id, type, x: 50, y: 50, width: 500, height: 300, content: { src: 'https://via.placeholder.com/500x300', alt: 'Placeholder', width: 100, borderRadius: 8 } };
        case 'Social':
            return { id, type, x: 50, y: 50, width: 200, height: 80, content: { instagram: '#', facebook: '#', linkedin: '#' } };
        case 'Spacer':
            return { id, type, x: 50, y: 50, width: 500, height: 50, content: { height: 50 } };
        case 'Divider':
            return { id, type, x: 50, y: 50, width: 500, height: 40, content: { thickness: 1, color: '#e5e7eb', marginY: 16 } };
        case 'Video':
            return { id, type, x: 50, y: 50, width: 500, height: 300, content: { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', aspectRatio: '16/9', width: 100, borderRadius: 8 } };
        case 'Icon':
            return { id, type, x: 50, y: 50, width: 100, height: 100, content: { iconName: 'Smile', size: 48, color: '#18181b' } };
        case 'Text':
            return { id, type, x: 50, y: 50, width: 300, height: 150, content: { text: 'This is a text box. You can add more content here.', fontSize: 16, fontFamily: 'Inter', fontWeight: 'normal', lineHeight: 1.5, letterSpacing: 0, textAlign: 'left', color: '#18181b', backgroundColor: 'transparent', padding: 16, borderRadius: 8 } };
        case 'Map':
            return { id, type, x: 50, y: 50, width: 500, height: 400, content: { address: 'New York, NY', zoom: 13 } };
        case 'Shape':
            return { id, type, x: 50, y: 50, width: 200, height: 200, content: { shapeType: 'rectangle', backgroundColor: '#3b82f6', borderColor: '#1e40af', borderWidth: 0, borderRadius: 8 } };
        default:
            throw new Error(`Unknown block type: ${type}`);
    }
};

const CanvasStudio: React.FC<CanvasStudioProps> = (props) => {
    const { theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, onOpenSettings, onLogout, onToggleCommandPalette, onToggleNotifications, unreadCount } = props;
    
    const { state: pages, setState: setPagesHistory, undo, redo, canUndo, canRedo } = useHistory<Page[]>([
        { id: `page-${Date.now()}`, name: 'Home', blocks: [] }
    ]);

    const [activePageId, setActivePageId] = useState<string>(pages[0].id);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#FFFFFF');
    const [resizingState, setResizingState] = useState<{ blockId: string; handle: string; initialX: number; initialY: number; initialWidth: number; initialHeight: number; initialBlockX: number; initialBlockY: number; } | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; blockId: string; } | null>(null);
    const [dragStartCoords, setDragStartCoords] = useState<{ x: number; y: number } | null>(null);
    const [activeDragItem, setActiveDragItem] = useState<CanvasBlock | { type: BlockType } | null>(null);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    
    const canvasRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const activePage = pages.find(p => p.id === activePageId);
    const activeBlocks = activePage?.blocks || [];

    const canvasHeight = useMemo(() => {
        if (activeBlocks.length === 0) return 800; // Default height
        const lowestPoint = Math.max(...activeBlocks.map(b => b.y + b.height));
        return Math.max(lowestPoint + 100, 800); // Add padding and ensure min height
    }, [activeBlocks]);

    const handleAddBlockOnClick = (type: BlockType) => {
        const newBlock = createNewBlock(type);
        setPagesHistory(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: [...p.blocks, newBlock] } : p));
        setSelectedBlockId(newBlock.id);
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active, activatorEvent } = event;
        
        if (activatorEvent instanceof MouseEvent || activatorEvent instanceof PointerEvent || ('touches' in activatorEvent && (activatorEvent as TouchEvent).touches.length > 0)) {
            const eventCoord = 'touches' in activatorEvent ? (activatorEvent as TouchEvent).touches[0] : activatorEvent;
            setDragStartCoords({ x: eventCoord.clientX, y: eventCoord.clientY });
        }

        const type = active.data.current?.type as BlockType;
        if (type) {
            setActiveDragItem({ type });
        } else {
            const block = activeBlocks.find(b => b.id === active.id);
            if (block) {
                setActiveDragItem(block);
            }
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over, delta } = event;

        if (active.id.toString().startsWith('toolbox-item-') && over?.id === 'canvas-droppable-area' && dragStartCoords) {
            const type = active.data.current?.type as BlockType;
            if (type) {
                const canvasRect = over.rect;
                const finalX = dragStartCoords.x + delta.x;
                const finalY = dragStartCoords.y + delta.y;

                let newBlockX = finalX - canvasRect.left;
                let newBlockY = finalY - canvasRect.top;

                const newBlock = createNewBlock(type);
                newBlockX -= newBlock.width / 2;
                newBlockY -= newBlock.height / 2;

                newBlock.x = Math.max(0, Math.min(newBlockX, canvasRect.width - newBlock.width));
                newBlock.y = Math.max(0, Math.min(newBlockY, canvasHeight - newBlock.height));

                setPagesHistory(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: [...p.blocks, newBlock] } : p));
                setSelectedBlockId(newBlock.id);
            }
        } else if (!active.id.toString().startsWith('toolbox-item-')) {
            setPagesHistory(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: p.blocks.map(b => b.id === active.id ? { ...b, x: b.x + delta.x, y: b.y + delta.y } : b) } : p));
        }
        
        setDragStartCoords(null);
        setActiveDragItem(null);
    };

    const updateBlockContent = useCallback((id: string, content: any) => {
        setPagesHistory(currentPages => currentPages.map(p => 
            p.id === activePageId 
                ? { ...p, blocks: p.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b) } 
                : p
        ), true);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = window.setTimeout(() => {
            setPagesHistory(currentPages => [...currentPages]);
        }, 800);
    }, [activePageId, setPagesHistory]);

    const deleteBlock = (id: string) => {
        setPagesHistory(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: p.blocks.filter(b => b.id !== id) } : p));
        if (selectedBlockId === id) setSelectedBlockId(null);
    };

    const reorderBlock = (blockId: string, direction: 'front' | 'back' | 'forward' | 'backward') => {
        setPagesHistory(prev => prev.map(p => {
            if (p.id !== activePageId) return p;
            const blocks = [...p.blocks];
            const index = blocks.findIndex(b => b.id === blockId);
            if (index === -1) return p;
            const [item] = blocks.splice(index, 1);
            if (direction === 'forward') blocks.splice(Math.min(index + 1, blocks.length), 0, item);
            else if (direction === 'backward') blocks.splice(Math.max(index - 1, 0), 0, item);
            else if (direction === 'front') blocks.push(item);
            else if (direction === 'back') blocks.unshift(item);
            return { ...p, blocks };
        }));
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

    const handleUpdatePage = (id: string, newName: string, newPath: string) => {
        setPagesHistory(prev => prev.map(p => p.id === id ? { ...p, name: newName, path: newPath } : p));
        setEditingPage(null);
    };

    const handleNavigate = (pageId: string) => {
        if (pages.find(p => p.id === pageId)) {
            setActivePageId(pageId);
        } else {
            console.warn(`Attempted to navigate to non-existent page ID: ${pageId}`);
        }
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
        setPagesHistory(prevPages => prevPages.map(p => p.id === activePageId ? { ...p, blocks: p.blocks.map(b => {
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
        })} : p), true);
    }, [resizingState, activePageId, setPagesHistory]);

    const handleMouseUp = useCallback(() => {
        if (resizingState) {
            setPagesHistory(currentPages => [...currentPages]);
            setResizingState(null);
        }
    }, [resizingState, setPagesHistory]);

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

    const handleContextMenu = (e: React.MouseEvent, blockId: string) => {
        e.preventDefault();
        setSelectedBlockId(blockId);
        setContextMenu({ x: e.clientX, y: e.clientY, blockId });
    };

    const handleExportCode = async () => {
        if (!activePage) return;
        const htmlContent = generateHtmlForPage(activePage, canvasBackgroundColor, canvasHeight, device);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activePage.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportImage = async () => {
        if (!canvasRef.current || typeof html2canvas === 'undefined') {
            alert("Canvas is not available or screenshot library not loaded.");
            return;
        }
        try {
            const canvas = await html2canvas(canvasRef.current, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: canvasBackgroundColor,
            });
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = `${activePage?.name || 'canvas'}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error capturing screenshot:", error);
            alert("Failed to capture screenshot.");
        }
    };

    const selectedBlock = activeBlocks.find(b => b.id === selectedBlockId) || null;

    const renderBlockComponent = (block: CanvasBlock) => {
        switch (block.type) {
            case 'Heading': return <HeadingBlock block={block} />;
            case 'Paragraph': return <ParagraphBlock block={block} />;
            case 'Image': return <ImageBlock block={block} />;
            case 'Button': return <ButtonBlock block={block} />;
            case 'Social': return <SocialBlock block={block} />;
            case 'Spacer': return <SpacerBlock block={block} />;
            case 'Divider': return <DividerBlock block={block} />;
            case 'Video': return <VideoBlock block={block} />;
            case 'Icon': return <IconBlock block={block} />;
            case 'Text': return <TextBlock block={block} />;
            case 'Map': return <MapBlock block={block} />;
            case 'Shape': return <ShapeBlock block={block} />;
            default: return <div>Unknown block type</div>;
        }
    };

    const toolboxItems = {
        'Heading': { icon: <Type size={20} />, label: 'Heading' },
        'Paragraph': { icon: <Pilcrow size={20} />, label: 'Paragraph' },
        'Text': { icon: <Text size={20} />, label: 'Text Box' },
        'Spacer': { icon: <Minus size={20} />, label: 'Spacer' },
        'Divider': { icon: <Divide size={20} />, label: 'Divider' },
        'Image': { icon: <ImageIcon size={20} />, label: 'Image' },
        'Video': { icon: <Video size={20} />, label: 'Video' },
        'Icon': { icon: <Star size={20} />, label: 'Icon' },
        'Button': { icon: <MousePointerClick size={20} />, label: 'Button' },
        'Social': { icon: <LinkIcon size={20} />, label: 'Social Links' },
        'Map': { icon: <Map size={20} />, label: 'Map' },
        'Shape': { icon: <Square size={20} />, label: 'Shape' },
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
            <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"><ChevronLeft /></button>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold">Canvas Studio</h1>
                            <span className="text-xs bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 font-semibold px-1.5 py-0.5 rounded-full">BETA</span>
                        </div>
                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700"></div>
                        <div className="flex items-center gap-2 text-sm">
                            {!isLeftSidebarOpen && <button onClick={() => setIsLeftSidebarOpen(true)} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><PanelLeftOpen size={18} /></button>}
                            <button onClick={undo} disabled={!canUndo} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:text-zinc-300 dark:disabled:text-zinc-600"><Undo size={18} /></button>
                            <button onClick={redo} disabled={!canRedo} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:text-zinc-300 dark:disabled:text-zinc-600"><Redo size={18} /></button>
                        </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <PageTabs 
                            pages={pages} 
                            activePageId={activePageId} 
                            onSelectPage={setActivePageId} 
                            onAddPage={addPage} 
                            onDeletePage={deletePage} 
                            onEditPage={setEditingPage}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsExportModalOpen(true)} title="Export Page" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"><Download size={18} /></button>
                        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
                            <label className="text-xs font-medium text-zinc-500 px-2">BG</label>
                            <input type="color" value={canvasBackgroundColor} onChange={(e) => setCanvasBackgroundColor(e.target.value)} className="w-6 h-6 p-0 border-none rounded bg-transparent cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
                            <button onClick={() => setDevice('desktop')} className={`p-1.5 rounded ${device === 'desktop' ? 'bg-white dark:bg-zinc-700' : ''}`}><Monitor size={18}/></button>
                            <button onClick={() => setDevice('tablet')} className={`p-1.5 rounded ${device === 'tablet' ? 'bg-white dark:bg-zinc-700' : ''}`}><Tablet size={18}/></button>
                            <button onClick={() => setDevice('mobile')} className={`p-1.5 rounded ${device === 'mobile' ? 'bg-white dark:bg-zinc-700' : ''}`}><Smartphone size={18}/></button>
                        </div>
                        <SearchButton onClick={onToggleCommandPalette} />
                        <NotificationBell onClick={onToggleNotifications} notificationCount={unreadCount} />
                        <ThemeToggleButton theme={theme} setTheme={setTheme} />
                        <UserProfilePopover onOpenSettings={onOpenSettings} onLogout={onLogout} />
                        {!isRightSidebarOpen && <button onClick={() => setIsRightSidebarOpen(true)} className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500"><PanelRightOpen size={18} /></button>}
                    </div>
                </header>
                <div className="flex-grow flex min-h-0">
                    <CanvasLeftSidebar isCollapsed={!isLeftSidebarOpen} onToggle={() => setIsLeftSidebarOpen(false)} onAddItem={handleAddBlockOnClick} />
                    <div className="flex-1 flex flex-col min-w-0">
                        <Canvas 
                            ref={canvasRef}
                            blocks={activeBlocks} 
                            selectedBlockId={selectedBlockId} 
                            onSelectBlock={setSelectedBlockId} 
                            onDeselectAll={() => setSelectedBlockId(null)}
                            device={device} 
                            backgroundColor={canvasBackgroundColor}
                            onResizeStart={handleResizeStart}
                            onContextMenu={handleContextMenu}
                            onNavigate={handleNavigate}
                            canvasHeight={canvasHeight}
                        />
                    </div>
                    <CanvasRightSidebar blocks={activeBlocks} selectedBlock={selectedBlock} onSelectBlock={setSelectedBlockId} updateBlock={updateBlockContent} deleteBlock={deleteBlock} reorderBlock={reorderBlock} isCollapsed={!isRightSidebarOpen} onToggle={() => setIsRightSidebarOpen(false)} pages={pages} />
                </div>
                {contextMenu && (
                    <ContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={() => setContextMenu(null)}
                        onReorder={(direction) => reorderBlock(contextMenu.blockId, direction)}
                        onDelete={() => deleteBlock(contextMenu.blockId)}
                    />
                )}
                {editingPage && createPortal(
                    <PageSettingsModal 
                        page={editingPage}
                        onClose={() => setEditingPage(null)}
                        onSave={handleUpdatePage}
                    />,
                    document.body
                )}
                {isExportModalOpen && createPortal(
                    <ExportModal
                        isOpen={isExportModalOpen}
                        onClose={() => setIsExportModalOpen(false)}
                        onExportCode={handleExportCode}
                        onExportImage={handleExportImage}
                    />,
                    document.body
                )}
            </div>
            <DragOverlay dropAnimation={null}>
                {activeDragItem ? (
                    'width' in activeDragItem ? (
                        <div style={{ width: activeDragItem.width, height: activeDragItem.height, opacity: 0.8, pointerEvents: 'none' }}>
                            {renderBlockComponent(activeDragItem)}
                        </div>
                    ) : (
                        (() => {
                            const item = toolboxItems[activeDragItem.type as keyof typeof toolboxItems];
                            return (
                                <div className="w-24 h-24 flex flex-col items-center justify-center gap-1 p-1 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg shadow-lg">
                                    {item.icon}
                                    <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                                </div>
                            );
                        })()
                    )
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default CanvasStudio;