import React, { useState } from 'react';

interface VariationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceImageUrl: string;
  prompt: string;
  onGenerate: (prompt: string, numberOfVariations: number) => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const VariationsModal: React.FC<VariationsModalProps> = ({ isOpen, onClose, sourceImageUrl, prompt, onGenerate }) => {
  const [numVariations, setNumVariations] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerateClick = () => {
    setIsLoading(true);
    // onGenerate is async but we don't need to await it here, the modal will close.
    onGenerate(prompt, numVariations);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold">Generate Variations</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Source Image</p>
              <img src={sourceImageUrl} alt="Source for variations" className="rounded-lg w-32 h-32 object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Source Prompt</p>
              <p className="bg-zinc-100 dark:bg-zinc-800/50 p-3 rounded-lg text-zinc-700 dark:text-gray-300 text-sm max-h-24 overflow-y-auto custom-scrollbar">{prompt}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Number of Variations</p>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setNumVariations(num)}
                  className={`py-3 rounded-lg text-lg font-bold border transition-colors ${numVariations === num ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-gray-300 hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-bold py-3 px-4 rounded-lg transition-colors hover:bg-zinc-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                <span>Generating...</span>
              </>
            ) : (
              `Generate ${numVariations} Variation${numVariations > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariationsModal;