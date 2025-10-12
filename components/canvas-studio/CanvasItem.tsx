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
    onResizeStart: (e: React.MouseEvent, blockId: string, handle: string) => void;
}

const getHandleClasses = (handle: string) => {
    switch (handle) {
        case 'top-left': return 'top-0 left-0 cursor-nwse-resize';
        case 'top-right': return 'top-0 right-0 cursor-nesw-resize';
        case 'bottom-left': return 'bottom-0 left-0 cursor-nesw-resize';
        case 'bottom-right': return 'bottom-0 right-0 cursor-nwse-resize';
        case 'top': return 'top-0 left-1/2 -translate-x-1/2 cursor-ns-resize';
        case 'bottom': return 'bottom-0 left-1/2 -translate-x-1/2 cursor-ns-resize';
        case 'left': return 'left-0 top-1/2 -translate-y-1/2 cursor-ew-resize';
        case 'right': return 'right-0 top-1/2 -translate-y-1/2 cursor-ew-resize';
        default: return '';
    }
};

const CanvasItem: React.FC<CanvasItemProps> = ({ block, isSelected, onClick, onResizeStart }) => {
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
        zIndex: isSelected ? 10 : 1,
    };

    const renderBlock = () => {
        switch (block.type) {
            case 'Heading': return <HeadingBlock block={block} />;
            case 'Paragraph': return <ParagraphBlock block={block} />;
            case 'Image': return <ImageBlock block={block} />;
            case 'Button': return <ButtonBlock block={block} />;
            case 'Social': return <SocialBlock block={block} />;
            case 'Spacer': return <SpacerBlock block={block} />;
            case 'Divider': return <DividerBlock block={block} />;
            case 'Video': return <VideoBlock block={block} />;
            case 'Icon': return <IconBlock block={block} />;
            default: return <div>Unknown block type</div>;
        }
    };

    const resizeHandles = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right'];

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={`group border-2 ${isSelected ? 'border-blue-500' : 'border-transparent hover:border-blue-500/50'}`}
        >
            <div 
                {...attributes} 
                {...listeners} 
                className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full p-1.5 cursor-grab bg-blue-500 text-white rounded-full z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
                <Move size={14} />
            </div>
            <div className="w-full h-full">{renderBlock()}</div>
            {isSelected && (
                <>
                    {resizeHandles.map(handle => (
                        <div
                            key={handle}
                            className={`absolute bg-white border-2 border-blue-500 rounded-full w-3 h-3 -m-1.5 z-20 ${getHandleClasses(handle)}`}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                onResizeStart(e, block.id, handle);
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default CanvasItem;