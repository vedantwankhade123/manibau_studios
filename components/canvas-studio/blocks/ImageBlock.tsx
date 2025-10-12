import React from 'react';
import { ImageBlock as ImageBlockType } from '../types';

interface ImageBlockProps {
    block: ImageBlockType;
    onNavigate?: (pageId: string) => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, onNavigate }) => {
    const { src, alt, width, borderRadius, link } = block.content;
    
    const image = <img src={src} alt={alt} className="h-auto w-full" style={{ borderRadius: `${borderRadius}px` }} />;

    if (link && link.type === 'page') {
        return (
            <button onClick={() => onNavigate && onNavigate(link.value)} className="w-full h-full p-2 flex justify-center">
                <div style={{ width: `${width}%` }}>{image}</div>
            </button>
        );
    }

    return (
        <div className="p-2 flex justify-center">
            <div style={{ width: `${width}%` }}>{image}</div>
        </div>
    );
};

export default ImageBlock;