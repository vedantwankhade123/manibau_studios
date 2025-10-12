import React from 'react';
import { VideoBlock } from '../types';
import SegmentedControl from '../ui/SegmentedControl';
import NumberInput from '../ui/NumberInput';

interface VideoSettingsProps {
    block: VideoBlock;
    updateBlock: (id: string, content: Partial<VideoBlock['content']>) => void;
}

const VideoSettings: React.FC<VideoSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Video URL (YouTube)</label>
                <input
                    type="text"
                    value={block.content.url}
                    onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="text-sm font-medium mb-2 block">Aspect Ratio</label>
                <SegmentedControl
                    options={['16/9', '4/3', '1/1']}
                    selected={block.content.aspectRatio}
                    onSelect={(val) => updateBlock(block.id, { aspectRatio: val as VideoBlock['content']['aspectRatio'] })}
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

export default VideoSettings;