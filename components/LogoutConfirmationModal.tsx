import React from 'react';

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-zinc-800 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
            <LogoutIcon className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Log Out?</h3>
          <p className="mt-2 text-sm text-gray-400">
            Are you sure you want to log out of your account?
          </p>
        </div>
        <div className="flex gap-3 p-4 bg-zinc-900/50 border-t border-zinc-800 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg font-semibold bg-zinc-700 hover:bg-zinc-600 text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:bg-red-400"
          >
            {isLoading ? 'Logging out...' : `Log Out`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;