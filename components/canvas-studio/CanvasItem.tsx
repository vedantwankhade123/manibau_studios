import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Move } from 'lucide-react';
import { CanvasBlock } from './types';
import ImageBlock from './blocks/ImageBlock';
import ButtonBlock from './blocks/ButtonBlock';
import SocialBlock from './blocks/SocialBlock';
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import SpacerBlock from './blocks/SpacerBlock';
import DividerBlock from './blocks/DividerBlock';
import VideoBlock from './blocks/VideoBlock';
import IconBlock from './blocks/IconBlock';

interface CanvasItemProps {
    block: CanvasBlock;
    isSelected: boolean;
    onClick: () => void;
}

const CanvasItem: React.FC<CanvasItemProps> = ({ block, isSelected, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
    } = useDraggable({ id: block.id });

    const style = {
        position: 'absolute' as const,
        top: block.y,
        left: block.x,
        width: block.width,
        height: block.height,
        transform: CSS.Translate.toString(transform),
    };

    const renderBlock = () => {
        switch (block.type) {
            case 'Heading':
                return <HeadingBlock block={block} />;
            case 'Paragraph':
                return <ParagraphBlock block={block} />;
            case 'Image':
                return <ImageBlock block={block} />;
            case 'Button':
                return <ButtonBlock block={block} />;
            case 'Social':
                return <SocialBlock block={block} />;
            case 'Spacer':
                return <SpacerBlock block={block} />;
            case 'Divider':
                return <DividerBlock block={block} />;
            case 'Video':
                return <VideoBlock block={block} />;
            case 'Icon':
                return <IconBlock block={block} />;
            default:
                return <div>Unknown block type</div>;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={`group border-2 ${isSelected ? 'border-blue-500' : 'border-transparent hover:border-blue-500/50'}`}
        >
            <div {...attributes} {...listeners} className="absolute -top-3 -left-3 p-1.5 cursor-grab opacity-0 group-hover:opacity-100 bg-blue-500 text-white rounded-full z-10 transition-opacity">
                <Move size={14} />
            </div>
            <div className="w-full h-full">{renderBlock()}</div>
        </div>
    );
};

export default CanvasItem;