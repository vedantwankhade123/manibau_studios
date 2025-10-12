import React from 'react';
import { ButtonBlock as ButtonBlockType } from '../types';

interface ButtonBlockProps {
    block: ButtonBlockType;
    onNavigate?: (pageId: string) => void;
}

const ButtonBlock: React.FC<ButtonBlockProps> = ({ block, onNavigate }) => {
    const { text, link, backgroundColor, textColor } = block.content;

    const commonClasses = "inline-block px-6 py-3 font-semibold rounded-md transition-colors";

    if (link.type === 'page') {
        return (
            <div className="p-4 text-center">
                <button
                    onClick={() => onNavigate && onNavigate(link.value)}
                    style={{ backgroundColor, color: textColor }}
                    className={commonClasses}
                >
                    {text}
                </button>
            </div>
        );
    }

    // Default to URL link
    return (
        <div className="p-4 text-center">
            <a
                href={link.value}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.preventDefault()} // Prevent actual navigation inside the editor
                style={{ backgroundColor, color: textColor }}
                className={commonClasses}
            >
                {text}
            </a>
        </div>
    );
};

export default ButtonBlock;