import React from 'react';
import { KeyRound } from 'lucide-react';

interface RemoveApiKeyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const RemoveApiKeyConfirmationModal: React.FC<RemoveApiKeyConfirmationModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-zinc-800 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
            <KeyRound className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Remove API Key?</h3>
          <p className="mt-2 text-sm text-gray-400">
            Are you sure you want to remove your API key? This action is immediate and cannot be undone.
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
            {isLoading ? 'Removing...' : `Remove`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveApiKeyConfirmationModal;