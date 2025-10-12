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

    return (
        <div className="p-4">
            <div style={wrapperStyle}>
                <Tag
                    style={{
                        textAlign,
                        color,
                    }}
                    className="font-bold w-full"
                >
                    {text}
                </Tag>
            </div>
        </div>
    );
};

export default HeadingBlock;