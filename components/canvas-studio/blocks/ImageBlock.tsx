import React from 'react';
import { ImageBlock as ImageBlockType } from '../types';

interface ImageBlockProps {
    block: ImageBlockType;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block }) => {
    const { src, alt, width } = block.content;
    return (
        <div className="p-2 flex justify-center">
            <img src={src} alt={alt} className="h-auto rounded-md" style={{ width: `${width}%` }} />
        </div>
    );
};

export default ImageBlock;