import React from 'react';
import { VideoBlock as VideoBlockType } from '../types';

interface VideoBlockProps {
    block: VideoBlockType;
    onNavigate?: (pageId: string) => void;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ block, onNavigate }) => {
    const { url, aspectRatio, width, borderRadius, link } = block.content;

    const getEmbedUrl = (videoUrl: string) => {
        try {
            const urlObj = new URL(videoUrl);
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                const videoId = urlObj.hostname.includes('youtu.be')
                    ? urlObj.pathname.slice(1)
                    : urlObj.searchParams.get('v');
                return `https://www.youtube.com/embed/${videoId}`;
            }
        } catch (e) {
            // Invalid URL
        }
        return videoUrl;
    };

    const videoPlayer = (
        <div className="overflow-hidden" style={{ width: `${width}%`, borderRadius: `${borderRadius}px` }}>
            <div style={{ aspectRatio }}>
                <iframe
                    src={getEmbedUrl(url)}
                    title="Embedded Video"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );

    if (link) {
        if (link.type === 'page') {
            return (
                <button onClick={() => onNavigate && onNavigate(link.value)} className="w-full h-full p-2 flex justify-center">
                    {videoPlayer}
                </button>
            );
        }
        return (
            <a href={link.value} target="_blank" rel="noopener noreferrer" className="w-full h-full p-2 flex justify-center" onClick={(e) => e.preventDefault()}>
                {videoPlayer}
            </a>
        );
    }

    return (
        <div className="p-2 flex justify-center">
            {videoPlayer}
        </div>
    );
};

export default VideoBlock;