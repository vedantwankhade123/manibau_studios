import React from 'react';
import { ChevronDown } from 'lucide-react';

interface IconPickerProps {
    selectedIcon: React.ReactNode;
    onSelect?: () => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
    return (
        <button 
            onClick={onSelect}
            className="w-full flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700"
        >
            <div className="flex items-center gap-2">
                {selectedIcon}
                <span>Cake</span>
            </div>
            <ChevronDown size={16} className="text-zinc-500" />
        </button>
    );
};

export default IconPicker;