import React from 'react';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

interface UserInfoDisplayProps {
  name: string;
}

const UserInfoDisplay: React.FC<UserInfoDisplayProps> = ({ name }) => {
  return (
    <div className="flex items-center gap-3 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-full p-2">
      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
        <UserIcon />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-white truncate max-w-[120px]">{name}</p>
      </div>
    </div>
  );
};

export default UserInfoDisplay;