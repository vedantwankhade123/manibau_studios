import React, { useEffect } from 'react';
import { ButtonBlock, Page } from '../types';
import ColorInput from '../ui/ColorInput';
import SegmentedControl from '../ui/SegmentedControl';

interface ButtonSettingsProps {
    block: ButtonBlock;
    updateBlock: (id: string, content: Partial<ButtonBlock['content']>) => void;
    pages: Page[];
}

const ButtonSettings: React.FC<ButtonSettingsProps> = ({ block, updateBlock, pages }) => {
    
    useEffect(() => {
        // One-time migration for old data structure
        if ((block.content as any).url) {
            updateBlock(block.id, {
                link: { type: 'url', value: (block.content as any).url },
                url: undefined,
            } as any);
        } else if (!block.content.link) {
            // Initialize link object if it doesn't exist
            updateBlock(block.id, {
                link: { type: 'url', value: '#' }
            });
        }
    }, [block.id, block.content, updateBlock]);

    if (!block.content.link) {
        return null; // Don't render until migration/initialization is complete
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Button Text</label>
                <input
                    type="text"
                    value={block.content.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-2 block">Link Type</label>
                <SegmentedControl
                    options={['url', 'page']}
                    selected={block.content.link.type}
                    onSelect={(val) => updateBlock(block.id, { link: { ...block.content.link, type: val as 'url' | 'page' } })}
                />
            </div>
            {block.content.link.type === 'url' ? (
                <div>
                    <label className="text-sm font-medium mb-2 block">URL</label>
                    <input
                        type="text"
                        value={block.content.link.value}
                        onChange={(e) => updateBlock(block.id, { link: { ...block.content.link, value: e.target.value } })}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            ) : (
                <div>
                    <label className="text-sm font-medium mb-2 block">Select Page</label>
                    <select
                        value={block.content.link.value}
                        onChange={(e) => updateBlock(block.id, { link: { ...block.content.link, value: e.target.value } })}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a page...</option>
                        {pages.map(page => (
                            <option key={page.id} value={page.id}>{page.name}</option>
                        ))}
                    </select>
                </div>
            )}
            <ColorInput
                label="Background Color"
                color={block.content.backgroundColor}
                onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
            />
            <ColorInput
                label="Text Color"
                color={block.content.textColor}
                onChange={(color) => updateBlock(block.id, { textColor: color })}
            />
        </div>
    );
};

export default ButtonSettings;