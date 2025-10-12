
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, icon, ...props }) => {
  return (
    <button
      {...props}
      className="w-full flex justify-center items-center gap-2 bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:border-zinc-200 dark:disabled:border-zinc-800 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-zinc-800 dark:text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;