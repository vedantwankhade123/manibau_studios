import React from 'react';
import { Page } from '../types';
import SegmentedControl from './SegmentedControl';

interface LinkSettingsProps {
    link: { type: 'url' | 'page'; value: string; };
    onLinkChange: (link: { type: 'url' | 'page'; value: string; }) => void;
    pages: Page[];
}

const LinkSettings: React.FC<LinkSettingsProps> = ({ link, onLinkChange, pages }) => {
    return (
        <div className="space-y-4 p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h4 className="text-sm font-semibold">Link</h4>
            <div>
                <label className="text-sm font-medium mb-2 block">Link Type</label>
                <SegmentedControl
                    options={['url', 'page']}
                    selected={link.type}
                    onSelect={(val) => onLinkChange({ type: val as 'url' | 'page', value: '' })}
                />
            </div>
            {link.type === 'url' ? (
                <div>
                    <label className="text-sm font-medium mb-2 block">URL</label>
                    <input
                        type="text"
                        value={link.value}
                        onChange={(e) => onLinkChange({ ...link, value: e.target.value })}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            ) : (
                <div>
                    <label className="text-sm font-medium mb-2 block">Select Page</label>
                    <select
                        value={link.value}
                        onChange={(e) => onLinkChange({ ...link, value: e.target.value })}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a page...</option>
                        {pages.map(page => (
                            <option key={page.id} value={page.id}>{page.name}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default LinkSettings;