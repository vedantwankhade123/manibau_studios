import React from 'react';
import { VideoBlock as VideoBlockType } from '../types';

interface VideoBlockProps {
    block: VideoBlockType;
    onNavigate?: (pageId: string) => void;
}

interface ProcessedUrl {
    src: string;
    type: 'iframe' | 'video';
}

const processVideoUrl = (videoUrl: string): ProcessedUrl => {
    try {
        const urlObj = new URL(videoUrl);
        // Check for YouTube
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            const videoId = urlObj.hostname.includes('youtu.be')
                ? urlObj.pathname.slice(1)
                : urlObj.searchParams.get('v');
            if (videoId) {
                return { src: `https://www.youtube.com/embed/${videoId}`, type: 'iframe' };
            }
        }
        // Check for direct video files
        if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.endsWith('.ogg')) {
            return { src: videoUrl, type: 'video' };
        }
    } catch (e) {
        // Invalid URL, but we can still try to render it if it's a direct link
        if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.endsWith('.ogg')) {
             return { src: videoUrl, type: 'video' };
        }
    }
    // Default or if it's some other embeddable service
    return { src: videoUrl, type: 'iframe' };
};


const VideoBlock: React.FC<VideoBlockProps> = ({ block, onNavigate }) => {
    const { url, aspectRatio, width, borderRadius, link } = block.content;
    const processedUrl = processVideoUrl(url);

    const videoPlayer = (
        <div className="overflow-hidden" style={{ width: `${width}%`, borderRadius: `${borderRadius}px` }}>
            <div style={{ aspectRatio }}>
                {processedUrl.type === 'iframe' ? (
                    <iframe
                        src={processedUrl.src}
                        title="Embedded Video"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <video
                        src={processedUrl.src}
                        controls
                        loop
                        className="w-full h-full object-cover bg-black"
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
        </div>
    );

    if (link && link.type === 'page') {
        return (
            <button onClick={() => onNavigate && onNavigate(link.value)} className="w-full h-full p-2 flex justify-center">
                {videoPlayer}
            </button>
        );
    }

    return (
        <div className="p-2 flex justify-center">
            {videoPlayer}
        </div>
    );
};

export default VideoBlock;