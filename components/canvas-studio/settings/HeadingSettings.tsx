import React from 'react';
import { HeadingBlock } from '../types';
import SegmentedControl from '../ui/SegmentedControl';
import ColorInput from '../ui/ColorInput';
import NumberInput from '../ui/NumberInput';

interface HeadingSettingsProps {
    block: HeadingBlock;
    updateBlock: (id: string, content: Partial<HeadingBlock['content']>) => void;
}

const HeadingSettings: React.FC<HeadingSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <input
                    type="text"
                    value={block.content.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-2 block">Level</label>
                <SegmentedControl
                    options={['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}
                    selected={block.content.level}
                    onSelect={(val) => updateBlock(block.id, { level: val as HeadingBlock['content']['level'] })}
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
                value={block.content.maxWidth || 1200}
                onChange={(value) => updateBlock(block.id, { maxWidth: value })}
                unit="px"
                min={100}
                max={1200}
            />
        </div>
    );
};

export default HeadingSettings;