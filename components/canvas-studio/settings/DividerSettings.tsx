import React from 'react';
import { DividerBlock } from '../types';
import NumberInput from '../ui/NumberInput';
import ColorInput from '../ui/ColorInput';

interface DividerSettingsProps {
    block: DividerBlock;
    updateBlock: (id: string, content: Partial<DividerBlock['content']>) => void;
}

const DividerSettings: React.FC<DividerSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <NumberInput
                label="Thickness"
                value={block.content.thickness}
                onChange={(value) => updateBlock(block.id, { thickness: value })}
                unit="px"
                min={1}
                max={20}
            />
            <NumberInput
                label="Vertical Margin"
                value={block.content.marginY}
                onChange={(value) => updateBlock(block.id, { marginY: value })}
                unit="px"
                min={0}
                max={100}
            />
            <ColorInput
                label="Color"
                color={block.content.color}
                onChange={(color) => updateBlock(block.id, { color })}
            />
        </div>
    );
};

export default DividerSettings;