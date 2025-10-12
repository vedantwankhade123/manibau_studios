import React from 'react';
import { ImageBlock as ImageBlockType } from '../types';

interface ImageBlockProps {
    block: ImageBlockType;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block }) => {
    const { src, alt } = block.content;
    return (
        <div className="p-2">
            <img src={src} alt={alt} className="w-full h-auto rounded-md" />
        </div>
    );
};

export default ImageBlock;