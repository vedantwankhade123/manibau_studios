import React from 'react';
import { MapBlock } from '../types';
import NumberInput from '../ui/NumberInput';

interface MapSettingsProps {
    block: MapBlock;
    updateBlock: (id: string, content: Partial<MapBlock['content']>) => void;
}

const MapSettings: React.FC<MapSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Address or Location</label>
                <input
                    type="text"
                    value={block.content.address}
                    onChange={(e) => updateBlock(block.id, { address: e.target.value })}
                    placeholder="e.g., 1600 Amphitheatre Parkway, Mountain View, CA"
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <NumberInput
                label="Zoom Level"
                value={block.content.zoom}
                onChange={(value) => updateBlock(block.id, { zoom: value })}
                min={1}
                max={20}
            />
        </div>
    );
};

export default MapSettings;