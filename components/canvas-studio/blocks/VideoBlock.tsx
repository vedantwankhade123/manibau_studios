import React from 'react';
import { VideoBlock as VideoBlockType } from '../types';

interface VideoBlockProps {
    block: VideoBlockType;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ block }) => {
    const { url, aspectRatio, width } = block.content;

    const getEmbedUrl = (videoUrl: string) => {
        try {
            const urlObj = new URL(videoUrl);
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
                const videoId = urlObj.hostname.includes('youtu.be')
                    ? urlObj.pathname.slice(1)
                    : urlObj.searchParams.get('v');
                return `https://www.youtube.com/embed/${videoId}`;
            }
            // Add other video providers like Vimeo if needed
        } catch (e) {
            // Invalid URL
        }
        return videoUrl;
    };

    return (
        <div className="p-2 flex justify-center">
            <div className="overflow-hidden rounded-md" style={{ width: `${width}%` }}>
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
        </div>
    );
};

export default VideoBlock;