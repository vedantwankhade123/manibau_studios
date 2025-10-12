import React from 'react';

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemCount: number;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemCount, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-zinc-800 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
            <TrashIcon className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Delete {itemCount} Project{itemCount > 1 ? 's' : ''}?</h3>
          <p className="mt-2 text-sm text-gray-400">
            Are you sure you want to delete the selected project(s)? This action cannot be undone.
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
            {isLoading ? 'Deleting...' : `Delete`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;