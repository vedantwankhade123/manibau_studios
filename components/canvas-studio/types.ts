export type BlockType = 'Text' | 'Button' | 'Image' | 'Social';

export interface Block {
    id: string;
    type: BlockType;
    content: any;
}

export interface TextBlock extends Block {
    type: 'Text';
    content: {
        text: string;
        fontSize: string;
        fontWeight: string;
        textAlign: 'left' | 'center' | 'right';
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

export type CanvasBlock = TextBlock | ButtonBlock | ImageBlock | SocialBlock;