import React from 'react';
import { DividerBlock as DividerBlockType } from '../types';

interface DividerBlockProps {
    block: DividerBlockType;
}

const DividerBlock: React.FC<DividerBlockProps> = ({ block }) => {
    const { thickness, color, marginY } = block.content;
    return (
        <div style={{ padding: `${marginY}px 16px` }}>
            <hr style={{ borderTopWidth: `${thickness}px`, borderColor: color }} />
        </div>
    );
};

export default DividerBlock;