import React from 'react';
import { ParagraphBlock, Page } from '../types';
import SegmentedControl from '../ui/SegmentedControl';
import ColorInput from '../ui/ColorInput';
import NumberInput from '../ui/NumberInput';
import LinkSettings from '../ui/LinkSettings';

interface ParagraphSettingsProps {
    block: ParagraphBlock;
    updateBlock: (id: string, content: Partial<ParagraphBlock['content']>) => void;
    pages: Page[];
}

const ParagraphSettings: React.FC<ParagraphSettingsProps> = ({ block, updateBlock, pages }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <textarea
                    value={block.content.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-2 block">Font Size</label>
                <input
                    type="text"
                    value={block.content.fontSize}
                    onChange={(e) => updateBlock(block.id, { fontSize: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-2 block">Text Align</label>
                <SegmentedControl
                    options={['left', 'center', 'right']}
                    selected={block.content.textAlign}
                    onSelect={(val) => updateBlock(block.id, { textAlign: val as 'left' | 'center' | 'right' })}
                />
            </div>
            <ColorInput
                label="Color"
                color={block.content.color}
                onChange={(color) => updateBlock(block.id, { color })}
            />
            <NumberInput
                label="Max Width"
                value={block.content.maxWidth || 800}
                onChange={(value) => updateBlock(block.id, { maxWidth: value })}
                unit="px"
                min={100}
                max={1200}
            />
            <LinkSettings
                link={block.content.link}
                onLinkChange={(link) => updateBlock(block.id, { link })}
                pages={pages}
            />
        </div>
    );
};

export default ParagraphSettings;