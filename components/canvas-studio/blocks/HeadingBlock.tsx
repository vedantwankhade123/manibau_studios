import React from 'react';
import { HeadingBlock as HeadingBlockType } from '../types';

interface HeadingBlockProps {
    block: HeadingBlockType;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({ block }) => {
    const { text, level, textAlign, color, maxWidth } = block.content;
    const Tag = level;

    const wrapperStyle: React.CSSProperties = {
        maxWidth: maxWidth ? `${maxWidth}px` : 'none',
    };
    if (textAlign === 'center') {
        wrapperStyle.marginLeft = 'auto';
        wrapperStyle.marginRight = 'auto';
    } else if (textAlign === 'right') {
        wrapperStyle.marginLeft = 'auto';
        wrapperStyle.marginRight = '0';
    } else {
        wrapperStyle.marginLeft = '0';
        wrapperStyle.marginRight = 'auto';
    }

    const sizeClasses = {
        h1: 'text-4xl',
        h2: 'text-3xl',
        h3: 'text-2xl',
        h4: 'text-xl',
        h5: 'text-lg',
        h6: 'text-base',
    };

    return (
        <div className="p-4">
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
};

export default HeadingBlock;