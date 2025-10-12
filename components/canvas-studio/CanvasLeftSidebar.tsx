import React, { useState } from 'react';
import { ChevronDown, Type, Pilcrow, Image as ImageIcon, Link, MousePointerClick, Minus, Divide, Video, Star, PanelLeftClose, Text, Map, Square } from 'lucide-react';
import ToolboxItem from './ToolboxItem';
import { BlockType } from './types';

interface AccordionSectionProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children, isOpen, onToggle }) => (
    <div>
        <button onClick={onToggle} className="flex items-center justify-between p-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md w-full text-left">
            <span className="font-semibold text-sm">{title}</span>
            <ChevronDown size={18} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
            <div className="p-2">
                {children}
            </div>
        )}
    </div>
);

interface CanvasLeftSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    onAddItem: (type: BlockType) => void;
}

const CanvasLeftSidebar: React.FC<CanvasLeftSidebarProps> = ({ isCollapsed, onToggle, onAddItem }) => {
    const [openSection, setOpenSection] = useState('Typography');

    const sections = [
        { title: 'Typography', items: [
            { type: 'Heading' as BlockType, icon: <Type size={20} />, label: 'Heading' },
            { type: 'Paragraph' as BlockType, icon: <Pilcrow size={20} />, label: 'Paragraph' },
            { type: 'Text' as BlockType, icon: <Text size={20} />, label: 'Text Box' },
        ]},
        { title: 'Layout', items: [
            { type: 'Spacer' as BlockType, icon: <Minus size={20} />, label: 'Spacer' },
            { type: 'Divider' as BlockType, icon: <Divide size={20} />, label: 'Divider' },
        ]},
        { title: 'Media', items: [
            { type: 'Image' as BlockType, icon: <ImageIcon size={20} />, label: 'Image' },
            { type: 'Video' as BlockType, icon: <Video size={20} />, label: 'Video' },
            { type: 'Icon' as BlockType, icon: <Star size={20} />, label: 'Icon' },
        ]},
        { title: 'Shapes', items: [
            { type: 'Shape' as BlockType, icon: <Square size={20} />, label: 'Shape' },
        ]},
        { title: 'Actions', items: [
            { type: 'Button' as BlockType, icon: <MousePointerClick size={20} />, label: 'Button' },
            { type: 'Social' as BlockType, icon: <Link size={20} />, label: 'Social Links' },
            { type: 'Map' as BlockType, icon: <Map size={20} />, label: 'Map' },
        ]},
    ];

    return (
        <aside className={`flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0' : 'w-64'}`}>
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-lg font-bold">Components</h2>
                <button onClick={onToggle} className="p-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">
                    <PanelLeftClose size={20} />
                </button>
            </div>
            <div className="flex-grow p-2 overflow-y-auto custom-scrollbar">
                {sections.map(section => (
                    <AccordionSection
                        key={section.title}
                        title={section.title}
                        isOpen={openSection === section.title}
                        onToggle={() => setOpenSection(openSection === section.title ? '' : section.title)}
                    >
                        <div className="grid grid-cols-3 gap-2">
                            {section.items.map(item => (
                                <ToolboxItem key={item.type} type={item.type} icon={item.icon} label={item.label} onAddItem={onAddItem} />
                            ))}
                        </div>
                    </AccordionSection>
                ))}
            </div>
        </aside>
    );
};

export default CanvasLeftSidebar;