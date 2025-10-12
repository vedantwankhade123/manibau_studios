import React from 'react';
import { TextBlock as TextBlockType } from '../types';

interface TextBlockProps {
    block: TextBlockType;
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
    const { text, fontSize, textAlign, color, backgroundColor, padding, borderRadius } = block.content;
    
    const style: React.CSSProperties = {
        fontSize,
        textAlign,
        color,
        backgroundColor,
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`,
        width: '100%',
        height: '100%',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    };

    return (
        <div style={style}>
            {text}
        </div>
    );
};

export default TextBlock;