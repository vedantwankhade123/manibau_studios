import React from 'react';
import { Instagram, Facebook, Linkedin } from 'lucide-react';

const Canvas = () => {
    return (
        <div className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 shadow-lg rounded-lg">
                {/* Header */}
                <div className="p-8 bg-gradient-to-br from-blue-50/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-lg">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" />
                                <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-bold text-xl">etsymil</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <a href="#" className="p-2 bg-white/50 dark:bg-zinc-800/50 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-white/50 dark:bg-zinc-800/50 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><Facebook size={18} /></a>
                            <a href="#" className="p-2 bg-white/50 dark:bg-zinc-800/50 rounded-full text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"><Linkedin size={18} /></a>
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Free Trial 3 Days to Unlock All-Access Pass</h1>
                        <p className="text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto mb-6">
                            Unlock unlimited access to all our premium features and a vast library of templates. Start creating stunning emails with ease today!
                        </p>
                        <button className="bg-green-600 text-white font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition-colors ring-4 ring-green-500/30">
                            Take My Free Trial 3 Days
                        </button>
                    </div>
                </div>

                {/* Image Section */}
                <div className="p-8">
                    <div className="relative rounded-lg overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop" alt="Team working" className="w-full h-auto" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8">
                            <div className="text-center text-white max-w-md">
                                <h2 className="text-2xl font-bold mb-2">Text promotion here</h2>
                                <p className="mb-4 text-zinc-200">In diam at est eget dui sapien. Elementum eget sed purus enim tempor hac urna nibh.</p>
                                <button className="bg-white text-black font-semibold px-5 py-2 rounded-md hover:bg-zinc-200 transition-colors">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Section */}
                <div className="px-8 pb-8 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    <p>Massa eros eget dui sapien est adipiscing. Tellus massa consectetur sed eleifend. Nunc risus sollicitudin risus a tincidunt ornare quam quis. Sem.</p>
                    <p className="mt-4">Pellentesque odio pellentesque odio ullamcorper. Massa sit amet sem. Suspendisse quisque egestas aenean scelerisque. Pellentesque odio pellentesque odio ullamcorper. Massa sit amet sem.</p>
                </div>
            </div>
        </div>
    );
};

export default Canvas;