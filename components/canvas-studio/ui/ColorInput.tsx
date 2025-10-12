import React from 'react';
import { Palette } from 'lucide-react';

interface ColorInputProps {
    label: string;
    color: string;
    onChange?: (color: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, color, onChange }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{label}</label>
                <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <Palette size={14} />
                    Surprise Me
                </button>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative w-10 h-10">
                    <div className="w-full h-full rounded-md border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: color }} />
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onChange && onChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                <input
                    type="text"
                    value={color.toUpperCase()}
                    readOnly
                    className="flex-grow bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm font-mono focus:outline-none"
                />
                <div className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm">
                    100%
                </div>
            </div>
        </div>
    );
};

export default ColorInput;