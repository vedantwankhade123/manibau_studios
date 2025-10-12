import React from 'react';

interface SwitchProps {
    label: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ label, checked = false, onChange }) => {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <button
                role="switch"
                aria-checked={checked}
                onClick={() => onChange && onChange(!checked)}
                className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
                    checked ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'
                }`}
            >
                <span
                    aria-hidden="true"
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );
};

export default Switch;