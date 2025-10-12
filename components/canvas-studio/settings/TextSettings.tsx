import React from 'react';
import { TextBlock } from '../types';
import SegmentedControl from '../ui/SegmentedControl';

interface TextSettingsProps {
    block: TextBlock;
    updateBlock: (id: string, content: Partial<TextBlock['content']>) => void;
}

const TextSettings: React.FC<TextSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <textarea
                    value={block.content.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
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
                <label className="text-sm font-medium mb-2 block">Font Weight</label>
                <SegmentedControl
                    options={['normal', 'bold']}
                    selected={block.content.fontWeight}
                    onSelect={(val) => updateBlock(block.id, { fontWeight: val })}
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
        </div>
    );
};

export default TextSettings;