import React from 'react';

interface SegmentedControlProps {
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selected, onSelect }) => {
    return (
        <div className="flex items-center w-full bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
            {options.map(option => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={`w-full text-center px-3 py-1 text-sm font-semibold rounded transition-colors ${
                        selected === option
                            ? 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 shadow-sm'
                            : 'text-zinc-500 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-700/50'
                    }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default SegmentedControl;