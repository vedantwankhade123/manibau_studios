import React from 'react';
import { Search, ChevronDown, Type, Pilcrow, Image as ImageIcon, Link, MousePointerClick, Minus, Divide, Video, Star, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import ToolboxItem from './ToolboxItem';
import { BlockType } from './types';

const AccordionSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen }) => (
    <details className="group" open={defaultOpen}>
        <summary className="flex items-center justify-between p-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">
            <span className="font-semibold text-sm">{title}</span>
            <ChevronDown size={18} className="text-zinc-500 group-open:rotate-180 transition-transform" />
        </summary>
        <div className="p-2">
            {children}
        </div>
    </details>
);

interface CanvasLeftSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const CanvasLeftSidebar: React.FC<CanvasLeftSidebarProps> = ({ isCollapsed, onToggle }) => {
    const typographyItems: { type: BlockType; icon: React.ReactNode; label: string }[] = [
        { type: 'Heading', icon: <Type size={24} />, label: 'Heading' },
        { type: 'Paragraph', icon: <Pilcrow size={24} />, label: 'Paragraph' },
    ];
    const layoutItems: { type: BlockType; icon: React.ReactNode; label: string }[] = [
        { type: 'Spacer', icon: <Minus size={24} />, label: 'Spacer' },
        { type: 'Divider', icon: <Divide size={24} />, label: 'Divider' },
    ];
    const mediaItems: { type: BlockType; icon: React.ReactNode; label: string }[] = [
        { type: 'Image', icon: <ImageIcon size={24} />, label: 'Image' },
        { type: 'Video', icon: <Video size={24} />, label: 'Video' },
        { type: 'Icon', icon: <Star size={24} />, label: 'Icon' },
    ];
    const actionItems: { type: BlockType; icon: React.ReactNode; label: string }[] = [
        { type: 'Button', icon: <MousePointerClick size={24} />, label: 'Button' },
        { type: 'Social', icon: <Link size={24} />, label: 'Social Links' },
    ];

    return (
        <aside className={`flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0' : 'w-72'}`}>
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-bold">Components</h2>
                <button onClick={onToggle} className="p-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">
                    <PanelLeftClose size={20} />
                </button>
            </div>
            <div className="flex-grow p-2 overflow-y-auto custom-scrollbar">
                <AccordionSection title="Typography" defaultOpen>
                    <div className="grid grid-cols-2 gap-2">
                        {typographyItems.map(item => (
                            <ToolboxItem key={item.type} type={item.type} icon={item.icon} label={item.label} />
                        ))}
                    </div>
                </AccordionSection>
                <AccordionSection title="Layout">
                    <div className="grid grid-cols-2 gap-2">
                        {layoutItems.map(item => (
                            <ToolboxItem key={item.type} type={item.type} icon={item.icon} label={item.label} />
                        ))}
                    </div>
                </AccordionSection>
                <AccordionSection title="Media">
                    <div className="grid grid-cols-2 gap-2">
                        {mediaItems.map(item => (
                            <ToolboxItem key={item.type} type={item.type} icon={item.icon} label={item.label} />
                        ))}
                    </div>
                </AccordionSection>
                 <AccordionSection title="Actions">
                    <div className="grid grid-cols-2 gap-2">
                        {actionItems.map(item => (
                            <ToolboxItem key={item.type} type={item.type} icon={item.icon} label={item.label} />
                        ))}
                    </div>
                </AccordionSection>
            </div>
        </aside>
    );
};

export default CanvasLeftSidebar;