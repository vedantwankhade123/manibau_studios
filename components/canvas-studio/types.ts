export type BlockType = 'Heading' | 'Paragraph' | 'Button' | 'Image' | 'Social' | 'Spacer' | 'Divider' | 'Video' | 'Icon';

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
    };
}

export interface ButtonBlock extends Block {
    type: 'Button';
    content: {
        text: string;
        url: string;
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

export type CanvasBlock = HeadingBlock | ParagraphBlock | ButtonBlock | ImageBlock | SocialBlock | SpacerBlock | DividerBlock | VideoBlock | IconBlock;

export interface Page {
  id: string;
  name: string;
  blocks: CanvasBlock[];
}