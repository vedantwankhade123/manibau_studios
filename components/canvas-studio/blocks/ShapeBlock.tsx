import React from 'react';
import { ShapeBlock as ShapeBlockType } from '../types';

interface ShapeBlockProps {
    block: ShapeBlockType;
}

const ShapeBlock: React.FC<ShapeBlockProps> = ({ block }) => {
    const { shapeType, backgroundColor, borderColor, borderWidth, borderRadius } = block.content;
    
    const style: React.CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundColor: backgroundColor,
    };

    switch (shapeType) {
        case 'rectangle':
            style.border = `${borderWidth}px solid ${borderColor}`;
            style.borderRadius = `${borderRadius}px`;
            break;
        case 'circle':
            style.border = `${borderWidth}px solid ${borderColor}`;
            style.borderRadius = '50%';
            break;
        case 'oval':
            style.border = `${borderWidth}px solid ${borderColor}`;
            style.borderRadius = '50%';
            break;
        case 'triangle':
            style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            break;
        case 'star':
            style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
            break;
        case 'rhombus':
            style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
            break;
    }

    return (
        <div style={style} />
    );
};

export default ShapeBlock;