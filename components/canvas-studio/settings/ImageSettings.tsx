import React from 'react';
import { ImageBlock } from '../types';
import NumberInput from '../ui/NumberInput';

interface ImageSettingsProps {
    block: ImageBlock;
    updateBlock: (id: string, content: Partial<ImageBlock['content']>) => void;
}

const ImageSettings: React.FC<ImageSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Image URL</label>
                <input
                    type="text"
                    value={block.content.src}
                    onChange={(e) => updateBlock(block.id, { src: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-2 block">Alt Text</label>
                <input
                    type="text"
                    value={block.content.alt}
                    onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <NumberInput
                label="Width"
                value={block.content.width}
                onChange={(value) => updateBlock(block.id, { width: value })}
                unit="%"
                min={10}
                max={100}
            />
        </div>
    );
};

export default ImageSettings;