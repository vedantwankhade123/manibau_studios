import React from 'react';
import { ShapeBlock } from '../types';
import NumberInput from '../ui/NumberInput';
import ColorInput from '../ui/ColorInput';

interface ShapeSettingsProps {
    block: ShapeBlock;
    updateBlock: (id: string, content: Partial<ShapeBlock['content']>) => void;
}

const ShapeSettings: React.FC<ShapeSettingsProps> = ({ block, updateBlock }) => {
    const shapeOptions = ['rectangle', 'circle', 'oval', 'triangle', 'star', 'rhombus'];
    const showBorderRadius = block.content.shapeType === 'rectangle';
    const showBorderSettings = ['rectangle', 'circle', 'oval'].includes(block.content.shapeType);

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Shape</label>
                <select
                    value={block.content.shapeType}
                    onChange={(e) => updateBlock(block.id, { shapeType: e.target.value as ShapeBlock['content']['shapeType'] })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {shapeOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                    ))}
                </select>
            </div>
            <ColorInput
                label="Fill Color"
                color={block.content.backgroundColor}
                onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
            />
            {showBorderSettings && (
                <>
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
                </>
            )}
            {showBorderRadius && (
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