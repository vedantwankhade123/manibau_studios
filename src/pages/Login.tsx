import React, { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import AuthForm from './AuthForm';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
const logoUrl = '/image-assets/MANIBAU Studios Logo.png';

// --- Icon components for cards ---
const GenerateIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>);
const VideoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const SketchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
const CodeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>);

interface LoginProps {
  onGoBack: () => void;
}

const ASSETS_URL = '/image-assets';

const Login: React.FC<LoginProps> = ({ onGoBack }) => {
  const [activeIconIndex, setActiveIconIndex] = useState(0);
  const [viewingLegalPage, setViewingLegalPage] = useState<'terms' | 'privacy' | null>(null);

  const toolData = [
    { 
      icon: <GenerateIcon />, 
      color: 'text-blue-400', 
      name: 'Image Studio',
      background: { type: 'image', src: `${ASSETS_URL}/dashboard/banners/image-studio.jpeg` }
    },
    { 
      icon: <VideoIcon />, 
      color: 'text-red-400', 
      name: 'Video Studio',
      background: { type: 'video', src: `${ASSETS_URL}/dashboard/banners/video-studio-1.mp4` }
    },
    { 
      icon: <SketchIcon />, 
      color: 'text-yellow-400', 
      name: 'Sketch Studio',
      background: { type: 'image', src: `${ASSETS_URL}/dashboard/banners/sketch-studio.jpeg` }
    },
    { 
      icon: <CodeIcon />, 
      color: 'text-green-400', 
      name: 'Developer Studio',
      background: { type: 'image', src: `${ASSETS_URL}/dashboard/banners/dev-studio.jpeg` }
    }
  ];

  useEffect(() => {
      const interval = setInterval(() => {
          setActiveIconIndex(prevIndex => (prevIndex + 1) % toolData.length);
      }, 3000); // Cycle every 3 seconds

      return () => clearInterval(interval);
  }, []);

  if (viewingLegalPage === 'terms') {
    return <TermsOfService onGoBack={() => setViewingLegalPage(null)} />;
  }
  if (viewingLegalPage === 'privacy') {
    return <PrivacyPolicy onGoBack={() => setViewingLegalPage(null)} />;
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-zinc-900 lg:bg-zinc-800">
      {/* Left Column - Branding & Showcase */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-black text-white relative overflow-hidden m-2.5 rounded-2xl">
        {/* Dynamic Backgrounds */}
        {toolData.map((tool, index) => (
          tool.background.type === 'video' ? (
            <video 
              key={index}
              src={tool.background.src}
              autoPlay loop muted playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${activeIconIndex === index ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : (
            <img 
              key={index}
              src={tool.background.src}
              alt={`${tool.name} background`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${activeIconIndex === index ? 'opacity-100' : 'opacity-0'}`}
            />
          )
        ))}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 h-full w-full">
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <img src={logoUrl} alt="MANIBAU Studios Logo" className="h-10 w-10 filter drop-shadow-lg" />
                <div className="text-xl font-bold tracking-wider font-poppins">
                    <span className="text-white">MANIBAU</span>
                    <span className="text-gray-400"> STUDIOS</span>
                </div>
            </div>

            <div className="absolute bottom-8 right-8 flex flex-col items-end">
                <div className="relative h-8 w-full overflow-hidden text-right mb-4">
                    {toolData.map((tool, index) => (
                        <p
                            key={index}
                            className={`absolute w-full text-2xl font-semibold text-gray-200 transition-all duration-700 ease-in-out ${activeIconIndex === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
                        >
                            {tool.name}
                        </p>
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {toolData.map((tool, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIconIndex(index)}
                            className={`relative w-16 h-16 p-4 rounded-xl border transition-all duration-300 ease-in-out ${tool.color} ${activeIconIndex === index ? 'bg-white/20 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/15'}`}
                        >
                            {tool.icon}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Right Column - Auth Form */}
      <div className="bg-zinc-900 lg:bg-zinc-800 flex flex-col items-center justify-center p-4 relative">
        <button 
          onClick={onGoBack} 
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Go Back</span>
        </button>
        <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center gap-4 mb-8">
                <img src={logoUrl} alt="MANIBAU Studios Logo" className="h-10 w-10 filter drop-shadow-lg animate-rotate-once" />
                <div className="text-2xl font-bold tracking-wider font-poppins animate-logo-shine">
                    <span className="text-white">MANIBAU</span>
                    <span className="text-gray-400"> STUDIOS</span>
                </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-zinc-800">
                <AuthForm 
                  onViewTerms={() => setViewingLegalPage('terms')}
                  onViewPrivacy={() => setViewingLegalPage('privacy')}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;