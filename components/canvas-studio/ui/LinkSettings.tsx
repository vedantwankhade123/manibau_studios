import React from 'react';
import { Page } from '../types';

interface LinkSettingsProps {
    link?: { type: 'page'; value: string; };
    onLinkChange: (link?: { type: 'page'; value: string; }) => void;
    pages: Page[];
}

const LinkSettings: React.FC<LinkSettingsProps> = ({ link, onLinkChange, pages }) => {
    const handlePageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pageId = e.target.value;
        if (pageId) {
            onLinkChange({ type: 'page', value: pageId });
        } else {
            onLinkChange(undefined); // Remove the link
        }
    };

    return (
        <div className="space-y-2 p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <h4 className="text-sm font-semibold">Link to Page</h4>
            <select
                value={link?.value || ''}
                onChange={handlePageSelect}
                className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">None</option>
                {pages.map(page => (
                    <option key={page.id} value={page.id}>{page.name}</option>
                ))}
            </select>
        </div>
    );
};

export default LinkSettings;