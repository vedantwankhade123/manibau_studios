import React from 'react';
import { MapBlock as MapBlockType } from '../types';

interface MapBlockProps {
    block: MapBlockType;
}

const MapBlock: React.FC<MapBlockProps> = ({ block }) => {
    const { address, zoom } = block.content;
    const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="w-full h-full">
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={embedUrl}
                title={`Map of ${address}`}
            ></iframe>
        </div>
    );
};

export default MapBlock;