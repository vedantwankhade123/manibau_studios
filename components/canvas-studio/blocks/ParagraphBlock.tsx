import React from 'react';
import { ParagraphBlock as ParagraphBlockType } from '../types';

interface ParagraphBlockProps {
    block: ParagraphBlockType;
}

const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ block }) => {
    const { text, fontSize, textAlign, color, maxWidth } = block.content;
    
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
                <p
                    style={{
                        fontSize,
                        textAlign,
                        color,
                    }}
                    className="whitespace-pre-wrap w-full"
                >
                    {text}
                </p>
            </div>
        </div>
    );
};

export default ParagraphBlock;