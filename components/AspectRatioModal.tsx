import React from 'react';

const aspectRatios: { value: string; label: string }[] = [
  { value: '1:1', label: 'Square (1:1)' },
  { value: '4:3', label: 'Landscape (4:3)' },
  { value: '16:9', label: 'Widescreen (16:9)' },
  { value: '3:4', label: 'Portrait (3:4)' },
  { value: '9:16', label: 'Story (9:16)' },
];

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface AspectRatioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAspectRatio: string;
  onSelectAspectRatio: (aspect: string) => void;
}

const AspectRatioModal: React.FC<AspectRatioModalProps> = ({ isOpen, onClose, currentAspectRatio, onSelectAspectRatio }) => {
  if (!isOpen) return null;

  const handleSelect = (aspect: string) => {
    onSelectAspectRatio(aspect);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg sm:text-xl font-bold">Select Aspect Ratio</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="p-3 sm:p-4 grid grid-cols-2 gap-2 sm:gap-3">
          {aspectRatios.map(ar => (
            <button
              key={ar.value}
              onClick={() => handleSelect(ar.value)}
              className={`py-3 sm:py-4 rounded-lg text-center text-sm sm:text-base font-semibold border transition-colors ${
                currentAspectRatio === ar.value
                  ? 'bg-zinc-700 border-zinc-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-gray-300 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              {ar.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AspectRatioModal;