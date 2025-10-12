
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white tracking-wider">
            Gemini Image <span className="text-gray-500 dark:text-gray-400">Studio</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;