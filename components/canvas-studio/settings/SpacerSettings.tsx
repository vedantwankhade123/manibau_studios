import React from 'react';
import { SpacerBlock } from '../types';
import NumberInput from '../ui/NumberInput';

interface SpacerSettingsProps {
    block: SpacerBlock;
    updateBlock: (id: string, content: Partial<SpacerBlock['content']>) => void;
}

const SpacerSettings: React.FC<SpacerSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <NumberInput
                label="Height"
                value={block.content.height}
                onChange={(value) => updateBlock(block.id, { height: value })}
                unit="px"
                min={10}
                max={500}
                step={1}
            />
        </div>
    );
};

export default SpacerSettings;