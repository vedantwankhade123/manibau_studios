import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
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
        transition,
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
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
            className={`relative group border-2 ${isSelected ? 'border-blue-500' : 'border-transparent hover:border-blue-500/50'}`}
        >
            <div {...attributes} {...listeners} className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 cursor-grab opacity-0 group-hover:opacity-100 bg-zinc-200 dark:bg-zinc-700 rounded">
                <GripVertical size={16} />
            </div>
            {renderBlock()}
        </div>
    );
};

export default CanvasItem;