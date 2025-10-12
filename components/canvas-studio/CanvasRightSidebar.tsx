import React from 'react';
import { ChevronDown, MoreHorizontal, MoveLeft, MoveRight, Cake, Palette } from 'lucide-react';
import SegmentedControl from './ui/SegmentedControl';
import Switch from './ui/Switch';
import ColorInput from './ui/ColorInput';
import IconPicker from './ui/IconPicker';

const PropertySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">{title}</h3>
        {children}
    </div>
);

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
    <label htmlFor={htmlFor} className="text-sm font-medium mb-2 block">{children}</label>
);

const CanvasRightSidebar = () => {
    return (
        <aside className="w-80 flex-shrink-0 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <h2 className="text-base font-bold">Button Settings</h2>
                <button className="p-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"><MoreHorizontal size={20} /></button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto custom-scrollbar space-y-6">
                <PropertySection title="Primary Button">
                    <div className="space-y-4">
                        <div>
                            <Label>Size</Label>
                            <SegmentedControl
                                options={['Small', 'Medium', 'Large']}
                                selected="Large"
                                onSelect={() => {}}
                            />
                        </div>
                        <div>
                            <Label>Style</Label>
                            <SegmentedControl
                                options={['Square', 'Rounded', 'Pill']}
                                selected="Rounded"
                                onSelect={() => {}}
                            />
                        </div>
                    </div>
                </PropertySection>

                <PropertySection title="Content">
                    <div className="space-y-4">
                        <Switch label="Show Leading Icon" />
                        <Switch label="Show Content" checked />
                        <div>
                            <Label htmlFor="button-label">Label</Label>
                            <input
                                id="button-label"
                                type="text"
                                value="Take My Free Trial 3 Days"
                                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                readOnly
                            />
                        </div>
                        <Switch label="Show Trailing Icon" checked />
                        <div>
                            <Label>Icon</Label>
                            <IconPicker selectedIcon={<Cake size={16} />} />
                        </div>
                         <div>
                            <Label>Style Icon</Label>
                            <SegmentedControl
                                options={['Fill', 'Outline']}
                                selected="Fill"
                                onSelect={() => {}}
                            />
                        </div>
                    </div>
                </PropertySection>

                <PropertySection title="Colors">
                    <div className="space-y-4">
                        <ColorInput label="Color Button" color="#4DB62C" />
                        <ColorInput label="Color Text & Icon" color="#FFFFFF" />
                    </div>
                </PropertySection>

                <button className="w-full text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-2 rounded-md">
                    + Add Secondary Button
                </button>
            </div>
        </aside>
    );
};

export default CanvasRightSidebar;