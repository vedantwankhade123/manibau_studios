import React from 'react';
import { HeadingBlock as HeadingBlockType } from '../types';

interface HeadingBlockProps {
    block: HeadingBlockType;
    onNavigate?: (pageId: string) => void;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({ block, onNavigate }) => {
    const { text, level, textAlign, color, maxWidth, link } = block.content;
    const Tag = level;

    const wrapperStyle: React.CSSProperties = {
        maxWidth: maxWidth ? `${maxWidth}px` : 'none',
        width: '100%',
    };

    const sizeClasses = {
        h1: 'text-4xl',
        h2: 'text-3xl',
        h3: 'text-2xl',
        h4: 'text-xl',
        h5: 'text-lg',
        h6: 'text-base',
    };

    const alignmentClasses = {
        left: 'items-center justify-start',
        center: 'items-center justify-center',
        right: 'items-center justify-end',
    };

    const headingElement = (
        <div className={`w-full h-full p-4 flex ${alignmentClasses[textAlign]}`}>
            <div style={wrapperStyle}>
                <Tag
                    style={{
                        textAlign,
                        color,
                    }}
                    className={`font-bold w-full ${sizeClasses[level]}`}
                >
                    {text}
                </Tag>
            </div>
        </div>
    );

    if (link) {
        if (link.type === 'page') {
            return <button onClick={() => onNavigate && onNavigate(link.value)} className="w-full h-full">{headingElement}</button>;
        }
        return <a href={link.value} target="_blank" rel="noopener noreferrer" className="w-full h-full" onClick={(e) => e.preventDefault()}>{headingElement}</a>;
    }

    return headingElement;
};

export default HeadingBlock;