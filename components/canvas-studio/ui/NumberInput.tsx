import React from 'react';

interface NumberInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    unit?: string;
    min?: number;
    max?: number;
    step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, unit, min, max, step }) => {
    return (
        <div>
            <label className="text-sm font-medium mb-2 block">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="range"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value, 10))}
                    min={min}
                    max={max}
                    step={step}
                    className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-1">
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                        min={min}
                        max={max}
                        className="w-12 bg-transparent text-sm text-right focus:outline-none"
                    />
                    {unit && <span className="text-sm text-zinc-400 ml-1">{unit}</span>}
                </div>
            </div>
        </div>
    );
};

export default NumberInput;