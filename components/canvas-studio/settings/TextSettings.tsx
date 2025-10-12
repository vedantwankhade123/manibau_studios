import React from 'react';
import { TextBlock } from '../types';
import SegmentedControl from '../ui/SegmentedControl';
import ColorInput from '../ui/ColorInput';
import NumberInput from '../ui/NumberInput';

interface TextSettingsProps {
    block: TextBlock;
    updateBlock: (id: string, content: Partial<TextBlock['content']>) => void;
}

const fontFamilies = ['Inter', 'Poppins', 'Arial', 'Georgia', 'Courier New', 'Verdana'];

const TextSettings: React.FC<TextSettingsProps> = ({ block, updateBlock }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <textarea
                    value={block.content.text}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Font Family</label>
                    <select
                        value={block.content.fontFamily}
                        onChange={(e) => updateBlock(block.id, { fontFamily: e.target.value })}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium mb-2 block">Font Weight</label>
                    <SegmentedControl
                        options={['normal', 'bold']}
                        selected={block.content.fontWeight}
                        onSelect={(val) => updateBlock(block.id, { fontWeight: val as 'normal' | 'bold' })}
                    />
                </div>
            </div>

            <NumberInput
                label="Font Size"
                value={block.content.fontSize}
                onChange={(value) => updateBlock(block.id, { fontSize: value })}
                unit="px"
                min={8}
                max={128}
            />

            <div className="grid grid-cols-2 gap-4">
                <NumberInput
                    label="Line Height"
                    value={block.content.lineHeight}
                    onChange={(value) => updateBlock(block.id, { lineHeight: value })}
                    min={1}
                    max={3}
                    step={0.1}
                />
                <NumberInput
                    label="Letter Spacing"
                    value={block.content.letterSpacing}
                    onChange={(value) => updateBlock(block.id, { letterSpacing: value })}
                    unit="px"
                    min={-5}
                    max={10}
                    step={0.5}
                />
            </div>

            <div>
                <label className="text-sm font-medium mb-2 block">Text Align</label>
                <SegmentedControl
                    options={['left', 'center', 'right']}
                    selected={block.content.textAlign}
                    onSelect={(val) => updateBlock(block.id, { textAlign: val as 'left' | 'center' | 'right' })}
                />
            </div>
            <ColorInput
                label="Text Color"
                color={block.content.color}
                onChange={(color) => updateBlock(block.id, { color })}
            />
            <ColorInput
                label="Background Color"
                color={block.content.backgroundColor}
                onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
            />
            <NumberInput
                label="Padding"
                value={block.content.padding}
                onChange={(value) => updateBlock(block.id, { padding: value })}
                unit="px"
                min={0}
                max={50}
            />
            <NumberInput
                label="Border Radius"
                value={block.content.borderRadius}
                onChange={(value) => updateBlock(block.id, { borderRadius: value })}
                unit="px"
                min={0}
                max={50}
            />
        </div>
    );
};

export default TextSettings;