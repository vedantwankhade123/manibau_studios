import React from 'react';

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

interface MenuButtonProps {
    onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors lg:hidden"
        aria-label="Open menu"
    >
        <MenuIcon />
    </button>
);

export default MenuButton;