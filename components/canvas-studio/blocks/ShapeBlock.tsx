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
        case 'ellipse':
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
        case 'arrow-right':
            style.clipPath = 'polygon(0% 35%, 75% 35%, 75% 15%, 100% 50%, 75% 85%, 75% 65%, 0% 65%)';
            break;
        case 'arrow-left':
            style.clipPath = 'polygon(100% 35%, 25% 35%, 25% 15%, 0% 50%, 25% 85%, 25% 65%, 100% 65%)';
            break;
        case 'arrow-up':
            style.clipPath = 'polygon(35% 100%, 35% 25%, 15% 25%, 50% 0%, 85% 25%, 65% 25%, 65% 100%)';
            break;
        case 'arrow-down':
            style.clipPath = 'polygon(35% 0%, 35% 75%, 15% 75%, 50% 100%, 85% 75%, 65% 75%, 65% 0%)';
            break;
    }

    return (
        <div style={style} />
    );
};

export default ShapeBlock;