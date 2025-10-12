import { Page, CanvasBlock } from '../types';

const blockToHtml = (block: CanvasBlock): string => {
    const wrapperStyle = `position: absolute; top: ${block.y}px; left: ${block.x}px; width: ${block.width}px; height: ${block.height}px; box-sizing: border-box;`;
    let innerContent = '';

    switch (block.type) {
        case 'Heading': {
            const { text, level, textAlign, color } = block.content;
            const sizeMap = { h1: '3rem', h2: '2.25rem', h3: '1.875rem', h4: '1.5rem', h5: '1.25rem', h6: '1rem' };
            innerContent = `<div style="display: flex; align-items: center; justify-content: ${textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center'}; width: 100%; height: 100%; padding: 16px;"><${level} style="margin:0; font-family: sans-serif; font-weight: bold; text-align: ${textAlign}; color: ${color}; font-size: ${sizeMap[level]};">${text}</${level}></div>`;
            break;
        }
        case 'Paragraph': {
            const { text, fontSize, textAlign, color } = block.content;
            innerContent = `<p style="margin:0; padding: 16px; font-family: sans-serif; font-size: ${fontSize}; text-align: ${textAlign}; color: ${color}; white-space: pre-wrap; word-break: break-word;">${text}</p>`;
            break;
        }
        case 'Text': {
            const { text, fontSize, fontFamily, fontWeight, lineHeight, letterSpacing, textAlign, color, backgroundColor, padding, borderRadius } = block.content;
            const textStyle = `font-size: ${fontSize}px; font-family: ${fontFamily}, sans-serif; font-weight: ${fontWeight}; line-height: ${lineHeight}; letter-spacing: ${letterSpacing}px; text-align: ${textAlign}; color: ${color}; background-color: ${backgroundColor}; padding: ${padding}px; border-radius: ${borderRadius}px; width: 100%; height: 100%; box-sizing: border-box; white-space: pre-wrap; word-break: break-word; overflow: auto;`;
            innerContent = `<div style="${textStyle}">${text}</div>`;
            break;
        }
        case 'Image': {
            const { src, alt, borderRadius } = block.content;
            innerContent = `<img src="${src}" alt="${alt}" style="width: 100%; height: 100%; object-fit: cover; border-radius: ${borderRadius}px;" />`;
            break;
        }
        case 'Button': {
            const { text, link, backgroundColor, textColor } = block.content;
            const href = link.type === 'url' ? link.value : '#'; // Page links won't work in single file export
            innerContent = `<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;"><a href="${href}" target="_blank" rel="noopener noreferrer" style="padding: 12px 24px; font-family: sans-serif; font-weight: 600; border-radius: 6px; background-color: ${backgroundColor}; color: ${textColor}; text-decoration: none;">${text}</a></div>`;
            break;
        }
        case 'Spacer': {
            innerContent = ``;
            break;
        }
        case 'Divider': {
            const { thickness, color } = block.content;
            innerContent = `<div style="display: flex; align-items: center; width: 100%; height: 100%;"><hr style="width: 100%; border: none; border-top: ${thickness}px solid ${color};" /></div>`;
            break;
        }
        default:
            innerContent = `<div style="width: 100%; height: 100%; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; font-family: sans-serif; color: #999; font-size: 12px; box-sizing: border-box;">${block.type} Block</div>`;
    }

    return `<div style="${wrapperStyle}">${innerContent}</div>`;
};

export const generateHtmlForPage = (page: Page, backgroundColor: string, canvasHeight: number, device: 'desktop' | 'tablet' | 'mobile'): string => {
    const deviceWidths = { desktop: '1200px', tablet: '768px', mobile: '375px' };

    const bodyStyles = `margin: 0; background-color: #f4f4f5; display: flex; justify-content: center; align-items: flex-start; padding: 2rem; min-height: 100vh; box-sizing: border-box;`;
    const canvasStyles = `position: relative; width: 100%; max-width: ${deviceWidths[device]}; height: ${canvasHeight}px; margin: 0; overflow: hidden; background-color: ${backgroundColor}; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-radius: 0.5rem;`;

    const blockElements = page.blocks.map(blockToHtml).join('\n');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${page.name}</title>
        </head>
        <body style="${bodyStyles}">
            <div style="${canvasStyles}">
                ${blockElements}
            </div>
        </body>
        </html>
    `;
};