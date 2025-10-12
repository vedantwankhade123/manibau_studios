import React from 'react';

interface ImagePlaceholderProps {
  aspectRatio?: string;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ aspectRatio = '1:1' }) => {
  // This mapping is necessary for Tailwind's JIT compiler to detect the classes.
  const aspectRatioClassMap: { [key: string]: string } = {
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
    '4:3': 'aspect-[4/3]',
    '9:16': 'aspect-[9/16]',
    '16:9': 'aspect-[16/9]',
  };
  const aspectRatioClass = aspectRatioClassMap[aspectRatio] || 'aspect-square';

  return (
    <div
      className={`
        relative 
        w-full 
        ${aspectRatioClass}
        bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900
        border border-zinc-200 dark:border-zinc-700
        rounded-lg 
        overflow-hidden
        before:absolute 
        before:inset-0
        before:-translate-x-full
        before:animate-[shimmer_2s_infinite]
        before:bg-gradient-to-r 
        before:from-transparent 
        before:via-gray-300/50
        dark:before:via-gray-700/50
        before:to-transparent
      `}
    >
    </div>
  );
};

export default ImagePlaceholder;