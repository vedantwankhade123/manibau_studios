import React from 'react';

interface ColorInputProps {
    label: string;
    color: string;
    onChange?: (color: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, color, onChange }) => {
    return (
        <div>
            <label className="text-sm font-medium mb-2 block">{label}</label>
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
                    onChange={(e) => onChange && onChange(e.target.value)}
                    className="flex-grow bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm font-mono focus:outline-none"
                />
            </div>
        </div>
    );
};

export default ColorInput;