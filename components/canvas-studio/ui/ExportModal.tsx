import React, { useState } from 'react';
import { X, Download, Image as ImageIcon } from 'lucide-react';
import Spinner from '../../Spinner';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExportImage: () => Promise<void>;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExportImage }) => {
    const [isExportingImage, setIsExportingImage] = useState(false);

    if (!isOpen) return null;

    const handleExportImage = async () => {
        setIsExportingImage(true);
        await onExportImage();
        setIsExportingImage(false);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-lg font-bold flex items-center gap-2"><Download size={20} /> Export Page</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <button
                        onClick={handleExportImage}
                        disabled={isExportingImage}
                        className="w-full flex items-center gap-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        {isExportingImage ? <Spinner /> : <ImageIcon size={24} className="flex-shrink-0" />}
                        <div className="text-left">
                            <p className="font-semibold">Download as Image</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Export the current page as a high-quality .png image.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;