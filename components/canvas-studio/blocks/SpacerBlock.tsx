import React from 'react';
import { SpacerBlock as SpacerBlockType } from '../types';

interface SpacerBlockProps {
    block: SpacerBlockType;
}

const SpacerBlock: React.FC<SpacerBlockProps> = ({ block }) => {
    const { height } = block.content;
    return (
        <div style={{ height: `${height}px` }} />
    );
};

export default SpacerBlock;