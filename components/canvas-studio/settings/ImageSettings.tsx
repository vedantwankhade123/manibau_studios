import React from 'react';
import { ImageBlock, Page } from '../types';
import NumberInput from '../ui/NumberInput';
import LinkSettings from '../ui/LinkSettings';

interface ImageSettingsProps {
    block: ImageBlock;
    updateBlock: (id: string, content: Partial<ImageBlock['content']>) => void;
    pages: Page[];
}

const ImageSettings: React.FC<ImageSettingsProps> = ({ block, updateBlock, pages }) => {
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
            <NumberInput
                label="Border Radius"
                value={block.content.borderRadius}
                onChange={(value) => updateBlock(block.id, { borderRadius: value })}
                unit="px"
                min={0}
                max={200}
            />
            <LinkSettings
                link={block.content.link || { type: 'url', value: '' }}
                onLinkChange={(link) => updateBlock(block.id, { link })}
                pages={pages}
            />
        </div>
    );
};

export default ImageSettings;