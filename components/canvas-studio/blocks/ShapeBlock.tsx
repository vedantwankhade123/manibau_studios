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
        backgroundColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: shapeType === 'circle' ? '50%' : `${borderRadius}px`,
    };

    return (
        <div style={style} />
    );
};

export default ShapeBlock;