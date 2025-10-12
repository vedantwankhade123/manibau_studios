import React, { useState, useRef, useEffect } from 'react';
import UserInfoDisplay from './UserInfoDisplay';
import { Settings, X, KeyRound, LogOut } from 'lucide-react';
import { useSession } from '../src/contexts/SessionContext';

const UserIconSmall = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

interface UserProfilePopoverProps {
  onOpenSettings: (tab?: 'account') => void;
  onLogout: () => void;
}

const UserProfilePopover: React.FC<UserProfilePopoverProps> = ({ onOpenSettings, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { profile, session } = useSession();
  const hasApiKey = !!profile?.gemini_api_key;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleManageAccount = () => {
    onOpenSettings('account');
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsOpen(false);
  };

  const user = {
      name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || session?.user?.email || 'User',
      email: session?.user?.email || '',
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button onClick={() => setIsOpen(!isOpen)} aria-haspopup="true" aria-expanded={isOpen}>
        <UserInfoDisplay
          name={user.name}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-black rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">My Account</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <UserIconSmall />
            </div>
            <div>
                <p className="font-semibold text-zinc-800 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm px-3 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
                <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <KeyRound size={16} /> API Key
                </span>
                {hasApiKey ? (
                    <span className="font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-xs">Active</span>
                ) : (
                    <button onClick={() => onOpenSettings('account')} className="font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800/50">Not Set</button>
                )}
            </div>
            <button 
              onClick={handleManageAccount}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg font-semibold text-sm"
            >
              <Settings size={16} />
              Manage Account
            </button>
            <button 
              onClick={handleLogoutClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-lg font-semibold text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePopover;