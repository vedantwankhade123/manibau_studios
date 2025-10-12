import React from 'react';
import { ShapeBlock } from '../types';
import NumberInput from '../ui/NumberInput';
import ColorInput from '../ui/ColorInput';
import SegmentedControl from '../ui/SegmentedControl';

interface ShapeSettingsProps {
    block: ShapeBlock;
    updateBlock: (id: string, content: Partial<ShapeBlock['content']>) => void;
}

const ShapeSettings: React.FC<ShapeSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Shape</label>
                <SegmentedControl
                    options={['rectangle', 'circle']}
                    selected={block.content.shapeType}
                    onSelect={(val) => updateBlock(block.id, { shapeType: val as 'rectangle' | 'circle' })}
                />
            </div>
            <ColorInput
                label="Fill Color"
                color={block.content.backgroundColor}
                onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
            />
            <ColorInput
                label="Border Color"
                color={block.content.borderColor}
                onChange={(color) => updateBlock(block.id, { borderColor: color })}
            />
            <NumberInput
                label="Border Width"
                value={block.content.borderWidth}
                onChange={(value) => updateBlock(block.id, { borderWidth: value })}
                unit="px"
                min={0}
                max={20}
            />
            {block.content.shapeType === 'rectangle' && (
                <NumberInput
                    label="Border Radius"
                    value={block.content.borderRadius}
                    onChange={(value) => updateBlock(block.id, { borderRadius: value })}
                    unit="px"
                    min={0}
                    max={100}
                />
            )}
        </div>
    );
};

export default ShapeSettings;