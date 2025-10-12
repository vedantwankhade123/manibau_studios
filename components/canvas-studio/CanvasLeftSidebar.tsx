import React from 'react';
import { Search, ChevronDown, Square, Image as ImageIcon, Link, Minus, Columns, MousePointerClick } from 'lucide-react';

const DraggableItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <div className="w-full aspect-square flex flex-col items-center justify-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg cursor-grab hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:shadow-md transition-all">
        <div className="text-zinc-500 dark:text-zinc-400">{icon}</div>
        <span className="text-xs font-medium">{label}</span>
    </div>
);

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
    return (
        <aside className="w-80 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold mb-4">Customize Content</h2>
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input type="text" placeholder="Search..." className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div className="flex-grow p-2 overflow-y-auto custom-scrollbar">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200 mb-4">
                    <p>Drag a block below into the preview canvas. Start with a text block at the top</p>
                    <button className="font-semibold underline mt-1">Got it, I understand</button>
                </div>

                <AccordionSection title="Text & Media" defaultOpen>
                    <div className="grid grid-cols-2 gap-2">
                        {/* Placeholder for actual draggable items */}
                    </div>
                </AccordionSection>

                <AccordionSection title="Clickable Media" defaultOpen>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableItem icon={<Square size={24} />} label="Button" />
                        <DraggableItem icon={<ImageIcon size={24} />} label="Banner Half" />
                        <DraggableItem icon={<ImageIcon size={24} />} label="Banner Full" />
                        <DraggableItem icon={<Link size={24} />} label="Social Follow" />
                    </div>
                </AccordionSection>

                <AccordionSection title="Divider & Signature">
                     <div className="grid grid-cols-2 gap-2">
                        <DraggableItem icon={<Minus size={24} />} label="Divider" />
                    </div>
                </AccordionSection>

                <AccordionSection title="Rows & Columns">
                     <div className="grid grid-cols-2 gap-2">
                        <DraggableItem icon={<Columns size={24} />} label="Columns" />
                    </div>
                </AccordionSection>

                <AccordionSection title="Interactive">
                     <div className="grid grid-cols-2 gap-2">
                        <DraggableItem icon={<MousePointerClick size={24} />} label="Interactive" />
                    </div>
                </AccordionSection>
            </div>
        </aside>
    );
};

export default CanvasLeftSidebar;