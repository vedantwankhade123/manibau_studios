import React from 'react';
import { ParagraphBlock as ParagraphBlockType } from '../types';

interface ParagraphBlockProps {
    block: ParagraphBlockType;
}

const ParagraphBlock: React.FC<ParagraphBlockProps> = ({ block }) => {
    const { text, fontSize, textAlign, color } = block.content;
    return (
        <p
            style={{
                fontSize,
                textAlign,
                color,
            }}
            className="p-4 whitespace-pre-wrap"
        >
            {text}
        </p>
    );
};

export default ParagraphBlock;