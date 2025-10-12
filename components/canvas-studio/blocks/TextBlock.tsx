import React from 'react';
import { TextBlock as TextBlockType } from '../types';

interface TextBlockProps {
    block: TextBlockType;
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
    const { text, fontSize, fontWeight, textAlign } = block.content;
    return (
        <p
            style={{
                fontSize,
                fontWeight,
                textAlign,
            }}
            className="p-4"
        >
            {text}
        </p>
    );
};

export default TextBlock;