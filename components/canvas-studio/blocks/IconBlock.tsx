import React from 'react';
import { IconBlock as IconBlockType } from '../types';
import IconRenderer from '../ui/IconRenderer';

interface IconBlockProps {
    block: IconBlockType;
}

const IconBlock: React.FC<IconBlockProps> = ({ block }) => {
    const { iconName, size, color } = block.content;
    return (
        <div className="p-4 flex justify-center items-center">
            <IconRenderer name={iconName} size={size} color={color} />
        </div>
    );
};

export default IconBlock;