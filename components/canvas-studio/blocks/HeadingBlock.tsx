import React from 'react';
import { HeadingBlock as HeadingBlockType } from '../types';

interface HeadingBlockProps {
    block: HeadingBlockType;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({ block }) => {
    const { text, level, textAlign, color } = block.content;
    const Tag = level;
    return (
        <div className="p-4">
            <Tag
                style={{
                    textAlign,
                    color,
                }}
                className="font-bold"
            >
                {text}
            </Tag>
        </div>
    );
};

export default HeadingBlock;