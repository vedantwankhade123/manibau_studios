import React from 'react';
import { IconBlock } from '../types';
import NumberInput from '../ui/NumberInput';
import ColorInput from '../ui/ColorInput';

interface IconSettingsProps {
    block: IconBlock;
    updateBlock: (id: string, content: Partial<IconBlock['content']>) => void;
}

const IconSettings: React.FC<IconSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Icon Name (from Lucide)</label>
                <input
                    type="text"
                    value={block.content.iconName}
                    onChange={(e) => updateBlock(block.id, { iconName: e.target.value })}
                    placeholder="e.g., Home, CheckCircle"
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                 <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline mt-1 block">Browse icons</a>
            </div>
            <NumberInput
                label="Size"
                value={block.content.size}
                onChange={(value) => updateBlock(block.id, { size: value })}
                unit="px"
                min={12}
                max={128}
            />
            <ColorInput
                label="Color"
                color={block.content.color}
                onChange={(color) => updateBlock(block.id, { color })}
            />
        </div>
    );
};

export default IconSettings;