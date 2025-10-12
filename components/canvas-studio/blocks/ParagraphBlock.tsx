import React from 'react';
import { ParagraphBlock as ParagraphBlockType } from '../types';

interface ParagraphBlockProps {
    block: ParagraphBlockType;
    onNavigate?: (pageId: string) => void;
}

const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ block, onNavigate }) => {
    const { text, fontSize, textAlign, color, maxWidth, link } = block.content;
    
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

    const paragraphElement = (
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

    if (link && link.type === 'page') {
        return <button onClick={() => onNavigate && onNavigate(link.value)} className="w-full h-full">{paragraphElement}</button>;
    }

    return paragraphElement;
};

export default ParagraphBlock;