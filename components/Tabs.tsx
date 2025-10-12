
import React from 'react';
import { Tool } from '../types';

interface TabsProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTool, setActiveTool }) => {
  const tabs = [
    { id: Tool.GENERATE, label: 'Generate Image' },
    // FIX: Removed the "Edit Image" tab. 'Tool.EDIT' does not exist in the Tool enum,
    // and image editing is handled within the main image generation flow.
    // { id: Tool.EDIT, label: 'Edit Image' },
  ];

  const baseClasses = "w-full text-center px-4 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800";
  const activeClasses = "bg-gray-200 dark:bg-gray-800 text-zinc-900 dark:text-white shadow-md";
  const inactiveClasses = "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-600";

  return (
    <div className="grid grid-cols-1 gap-4 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTool(tab.id)}
          className={`${baseClasses} ${activeTool === tab.id ? activeClasses : inactiveClasses}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;