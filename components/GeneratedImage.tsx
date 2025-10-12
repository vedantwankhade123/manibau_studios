import React, { useState, useEffect } from 'react';

interface GeneratedImageProps {
  src: string;
  alt: string;
  onEdit: (src: string) => void;
  onGenerateVariations: (prompt: string, sourceImageUrl: string) => void;
  layout?: 'default' | 'overlay';
  showWatermark?: boolean;
  showActions?: boolean;
}

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const VariationsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ActionButton: React.FC<{ onClick?: () => void; children: React.ReactNode; href?: string; download?: string; disabled?: boolean; title?: string; }> = ({ children, ...props }) => {
  const commonClasses = "flex items-center justify-center w-10 h-10 bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:border-zinc-200 dark:disabled:border-zinc-800 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-zinc-700 dark:text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black";
  if (props.href) {
    return <a {...props} className={commonClasses}>{children}</a>
  }
  return <button type="button" {...props} className={commonClasses}>{children}</button>
}

const ActionButtonOverlay: React.FC<{ onClick?: () => void; children: React.ReactNode; href?: string; download?: string; disabled?: boolean; title?: string; }> = ({ children, ...props }) => {
  const commonClasses = "flex items-center justify-center w-8 h-8 bg-black/50 backdrop-blur border border-white/20 hover:bg-black/70 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50";
  if (props.href) {
    return <a {...props} className={commonClasses}>{children}</a>
  }
  return <button type="button" {...props} className={commonClasses}>{children}</button>
}

const Watermark: React.FC = () => (
    <div className="absolute bottom-2 right-2 bg-black/50 text-white/80 text-[10px] px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none flex items-center gap-1">
        <span className="font-semibold">Made With</span>
        <span className="font-poppins font-bold tracking-wider">MANIBAU</span>
        <span className="font-poppins font-bold tracking-wider text-gray-300">STUDIOS</span>
    </div>
);

const GeneratedImage: React.FC<GeneratedImageProps> = ({ src, alt, onEdit, onGenerateVariations, layout = 'default', showWatermark, showActions = true }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (navigator.share && navigator.canShare) {
      const dummyFile = new File([''], 'test.png', { type: 'image/png' });
      if (navigator.canShare({ files: [dummyFile] })) {
        setCanShare(true);
      }
    }
  }, []);

  const handleCopy = async () => {
    if (!navigator.clipboard?.write) {
      alert("Clipboard API not supported on this browser.");
      return;
    }
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy image:', error);
      alert('Failed to copy image to clipboard.');
    }
  };

  const handleShare = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const file = new File([blob], 'generated-image.png', { type: blob.type });

      await navigator.share({
        files: [file],
        title: 'Image generated by MANIBAU Studios',
        text: alt,
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing image:', error);
        alert('Failed to share image.');
      }
    }
  };

  if (layout === 'overlay') {
    return (
      <div className="relative group rounded-lg overflow-hidden">
        <img src={src} alt={alt} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" />
        {showActions && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ActionButtonOverlay onClick={() => onGenerateVariations(alt, src)} title="Generate Variations">
                <VariationsIcon />
              </ActionButtonOverlay>
              <ActionButtonOverlay onClick={() => onEdit(src)} title="Edit Image">
                <EditIcon />
              </ActionButtonOverlay>
              <ActionButtonOverlay href={src} download="generated-image.png" title="Download Image">
                <DownloadIcon />
              </ActionButtonOverlay>
              {canShare && (
                <ActionButtonOverlay onClick={handleShare} title="Share Image">
                  <ShareIcon />
                </ActionButtonOverlay>
              )}
              <ActionButtonOverlay onClick={handleCopy} disabled={isCopied} title={isCopied ? 'Copied!' : 'Copy Image'}>
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </ActionButtonOverlay>
            </div>
          </>
        )}
        {showWatermark && <Watermark />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
        <div className="relative">
            <img src={src} alt={alt} className={`rounded-lg w-full h-auto object-contain shadow-lg dark:shadow-black/30 ${showActions ? 'cursor-pointer' : ''}`} onClick={() => showActions && onEdit(src)} />
            {showWatermark && <Watermark />}
        </div>
      {showActions && (
        <div className="flex items-center justify-end gap-3">
          <ActionButton onClick={() => onGenerateVariations(alt, src)} title="Generate Variations">
            <VariationsIcon />
          </ActionButton>
          <ActionButton onClick={() => onEdit(src)} title="Edit Image">
            <EditIcon />
          </ActionButton>
          <ActionButton href={src} download="generated-image.png" title="Download Image">
            <DownloadIcon />
          </ActionButton>
          {canShare && (
            <ActionButton onClick={handleShare} title="Share Image">
              <ShareIcon />
            </ActionButton>
          )}
          <ActionButton onClick={handleCopy} disabled={isCopied} title={isCopied ? 'Copied!' : 'Copy Image'}>
            {isCopied ? <CheckIcon /> : <CopyIcon />}
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default GeneratedImage;