import React from 'react';
import { ButtonBlock as ButtonBlockType } from '../types';

interface ButtonBlockProps {
    block: ButtonBlockType;
}

const ButtonBlock: React.FC<ButtonBlockProps> = ({ block }) => {
    const { text, url, backgroundColor, textColor } = block.content;
    return (
        <div className="p-4 text-center">
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor, color: textColor }}
                className="inline-block px-6 py-3 font-semibold rounded-md transition-colors"
            >
                {text}
            </a>
        </div>
    );
};

export default ButtonBlock;