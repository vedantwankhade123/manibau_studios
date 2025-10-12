import React from 'react';
import { ButtonBlock } from '../types';
import ColorInput from '../ui/ColorInput';

interface ButtonSettingsProps {
    block: ButtonBlock;
    updateBlock: (id: string, content: Partial<ButtonBlock['content']>) => void;
}

const ButtonSettings: React.FC<ButtonSettingsProps> = ({ block, updateBlock }) => {
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
                <label className="text-sm font-medium mb-2 block">URL</label>
                <input
                    type="text"
                    value={block.content.url}
                    onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
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