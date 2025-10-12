import React from 'react';
import { SocialBlock as SocialBlockType } from '../types';
import { Instagram, Facebook, Linkedin } from 'lucide-react';

interface SocialBlockProps {
    block: SocialBlockType;
}

const SocialBlock: React.FC<SocialBlockProps> = ({ block }) => {
    const { instagram, facebook, linkedin } = block.content;
    return (
        <div className="p-4 flex justify-center items-center gap-4">
            {instagram && <a href={instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><Instagram size={18} /></a>}
            {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><Facebook size={18} /></a>}
            {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><Linkedin size={18} /></a>}
        </div>
    );
};

export default SocialBlock;