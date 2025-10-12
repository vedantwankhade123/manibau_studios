import React from 'react';
import { SocialBlock } from '../types';

interface SocialSettingsProps {
    block: SocialBlock;
    updateBlock: (id: string, content: Partial<SocialBlock['content']>) => void;
}

const SocialSettings: React.FC<SocialSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Instagram URL</label>
                <input
                    type="text"
                    value={block.content.instagram}
                    onChange={(e) => updateBlock(block.id, { instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-2 block">Facebook URL</label>
                <input
                    type="text"
                    value={block.content.facebook}
                    onChange={(e) => updateBlock(block.id, { facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-2 block">LinkedIn URL</label>
                <input
                    type="text"
                    value={block.content.linkedin}
                    onChange={(e) => updateBlock(block.id, { linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};

export default SocialSettings;