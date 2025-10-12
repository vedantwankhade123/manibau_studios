export type BlockType = 'Heading' | 'Paragraph' | 'Button' | 'Image' | 'Social' | 'Spacer' | 'Divider' | 'Video' | 'Icon' | 'Text' | 'Map' | 'Shape';

export interface Block {
    id: string;
    type: BlockType;
    content: any;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface HeadingBlock extends Block {
    type: 'Heading';
    content: {
        text: string;
        level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        textAlign: 'left' | 'center' | 'right';
        color: string;
        maxWidth?: number;
        link?: {
            type: 'page';
            value: string;
        };
    };
}

export interface ParagraphBlock extends Block {
    type: 'Paragraph';
    content: {
        text: string;
        fontSize: string;
        textAlign: 'left' | 'center' | 'right';
        color: string;
        maxWidth?: number;
        link?: {
            type: 'page';
            value: string;
        };
    };
}

export interface ButtonBlock extends Block {
    type: 'Button';
    content: {
        text: string;
        link?: {
            type: 'page';
            value: string; // page ID
        };
        backgroundColor: string;
        textColor: string;
    };
}

export interface ImageBlock extends Block {
    type: 'Image';
    content: {
        src: string;
        alt: string;
        width: number;
        borderRadius: number;
        link?: {
            type: 'page';
            value: string;
        };
    };
}

export interface SocialBlock extends Block {
    type: 'Social';
    content: {
        instagram: string;
        facebook: string;
        linkedin: string;
    };
}

export interface SpacerBlock extends Block {
    type: 'Spacer';
    content: {
        height: number;
    };
}

export interface DividerBlock extends Block {
    type: 'Divider';
    content: {
        thickness: number;
        color: string;
        marginY: number;
    };
}

export interface VideoBlock extends Block {
    type: 'Video';
    content: {
        url: string;
        aspectRatio: '16/9' | '4/3' | '1/1';
        width: number;
        borderRadius: number;
        link?: {
            type: 'page';
            value: string;
        };
    };
}

export interface IconBlock extends Block {
    type: 'Icon';
    content: {
        iconName: string;
        size: number;
        color: string;
    };
}

export interface TextBlock extends Block {
    type: 'Text';
    content: {
        text: string;
        fontSize: number;
        fontFamily: string;
        fontWeight: 'normal' | 'bold';
        lineHeight: number;
        letterSpacing: number;
        textAlign: 'left' | 'center' | 'right';
        color: string;
        backgroundColor: string;
        padding: number;
        borderRadius: number;
    };
}

export interface MapBlock extends Block {
    type: 'Map';
    content: {
        address: string;
        zoom: number;
    };
}

export interface ShapeBlock extends Block {
    type: 'Shape';
    content: {
        shapeType: 'rectangle' | 'circle' | 'ellipse' | 'triangle' | 'star' | 'rhombus' | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'arrow-down';
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        borderRadius: number;
    };
}

export type CanvasBlock = HeadingBlock | ParagraphBlock | ButtonBlock | ImageBlock | SocialBlock | SpacerBlock | DividerBlock | VideoBlock | IconBlock | TextBlock | MapBlock | ShapeBlock;

export interface Page {
  id: string;
  name: string;
  path?: string;
  blocks: CanvasBlock[];
}