import React from 'react';
import { Search, ChevronDown, Type, Image as ImageIcon, Link, MousePointerClick } from 'lucide-react';
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

const CanvasLeftSidebar = () => {
    const toolboxItems: { type: BlockType; icon: React.ReactNode; label: string }[] = [
        { type: 'Text', icon: <Type size={24} />, label: 'Text' },
        { type: 'Image', icon: <ImageIcon size={24} />, label: 'Image' },
        { type: 'Button', icon: <MousePointerClick size={24} />, label: 'Button' },
        { type: 'Social', icon: <Link size={24} />, label: 'Social Links' },
    ];

    return (
        <aside className="w-80 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold mb-4">Components</h2>
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input type="text" placeholder="Search components..." className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div className="flex-grow p-2 overflow-y-auto custom-scrollbar">
                <AccordionSection title="Basic Blocks" defaultOpen>
                    <div className="grid grid-cols-2 gap-2">
                        {toolboxItems.map(item => (
                            <ToolboxItem key={item.type} type={item.type} icon={item.icon} label={item.label} />
                        ))}
                    </div>
                </AccordionSection>
            </div>
        </aside>
    );
};

export default CanvasLeftSidebar;