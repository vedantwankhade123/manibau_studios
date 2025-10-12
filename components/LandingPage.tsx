import React, { useState, useRef, useEffect } from 'react';
const logoUrl = '/image-assets/MANIBAU Studios Logo.png';

// --- Icon Components ---

// Video Controls
const MuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9l4 4m0-4l-4 4" />
  </svg>
);
const UnmuteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);
const FullscreenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
  </svg>
);
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// Social Icons for Footer
const GithubIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>GitHub</title>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);
const InstagramIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>Instagram</title>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
const LinkedInIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>LinkedIn</title>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
const EmailIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <title>Email</title>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

declare const hljs: any;

interface LandingPageProps {
  onGetStarted: () => void;
}

const features = [
  {
    title: "Image Studio",
    description: "Generate breathtaking images and art with simple text prompts. Edit, refine, and iterate on your creations in a seamless, conversational interface.",
  },
  {
    title: "Sketch Studio",
    description: "Turn your doodles into masterpieces. Draw a sketch, provide a prompt, and let our AI bring your vision to life with stunning detail.",
  },
  {
    title: "Developer Studio",
    description: "Describe the website you envision, and watch it come to life. Our AI generates multi-file, production-ready code with Tailwind CSS.",
  },
];

const ASSETS_URL = '/image-assets';

const showcaseItemsRow1 = [
    { type: 'image', src: `${ASSETS_URL}/landing-page/showcase/row1-img1.jpeg`, prompt: 'A moody, atmospheric shot of a person walking through a neon-lit city street at night, cinematic lighting.', tool: 'Image Studio' },
    { type: 'video', src: `${ASSETS_URL}/landing-page/showcase/row1-vid1.mp4`, prompt: 'A cinematic drone shot flying over a dramatic, misty mountain range at sunrise.', tool: 'Video Studio' },
    { type: 'image', src: `${ASSETS_URL}/landing-page/showcase/row1-img2.jpeg`, prompt: 'An abstract, vibrant painting with swirling colors and textures, created from a simple sketch.', tool: 'Sketch Studio' },
    { type: 'video', src: `${ASSETS_URL}/landing-page/showcase/row1-vid2.mp4`, prompt: 'A photorealistic video of a majestic lion walking across a savanna.', tool: 'Video Studio' },
    { type: 'image', src: `${ASSETS_URL}/landing-page/showcase/row1-img3.jpeg`, prompt: 'A cinematic, photorealistic portrait of an astronaut on Mars, detailed visor reflection, dramatic lighting.', tool: 'Image Studio' },
    { type: 'video', src: `${ASSETS_URL}/landing-page/showcase/row1-vid3.mp4`, prompt: 'An animated scene of a colorful bird flying through a lush jungle.', tool: 'Video Studio' },
    { type: 'sketch', sketchSrc: `${ASSETS_URL}/landing-page/showcase/row1-sketch1.png`, src: `${ASSETS_URL}/landing-page/showcase/row1-sketch1-result.jpeg`, prompt: 'A photorealistic modern house in the woods, cinematic lighting, high detail.', tool: 'Sketch Studio' },
];

const showcaseItemsRow2 = [
    { type: 'image', src: `${ASSETS_URL}/landing-page/showcase/row2-img1.jpeg`, prompt: 'A sleek, futuristic sports car driving on a neon-lit street at night, cyberpunk aesthetic.', tool: 'Image Studio' },
    { type: 'video', src: `${ASSETS_URL}/landing-page/showcase/row2-vid1.mp4`, prompt: 'An aerial shot of a beautiful beach with turquoise water and white sand.', tool: 'Video Studio' },
    { type: 'sketch', sketchSrc: `${ASSETS_URL}/landing-page/showcase/row2-sketch1.png`, src: `${ASSETS_URL}/landing-page/showcase/row2-sketch1-result.jpeg`, prompt: 'A powerful, majestic dragon perched on a mountain peak, breathing fire, fantasy digital art.', tool: 'Sketch Studio' },
    { type: 'image', src: `${ASSETS_URL}/landing-page/showcase/row2-img2.jpeg`, prompt: 'A close-up, detailed portrait of a red panda in a bamboo forest, soft lighting.', tool: 'Image Studio' },
    { type: 'video', src: `${ASSETS_URL}/landing-page/showcase/row2-vid2.mp4`, prompt: 'A slow-motion video of honey being drizzled over a stack of pancakes.', tool: 'Video Studio' },
    { type: 'image', src: `${ASSETS_URL}/landing-page/showcase/row2-img3.jpeg`, prompt: 'A vast, alien desert landscape with two suns in the sky and strange rock formations.', tool: 'Image Studio' },
];

const ShowcaseCard: React.FC<{ item: typeof showcaseItemsRow1[0] }> = ({ item }) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (item.type === 'code' && codeRef.current && typeof hljs !== 'undefined') {
      hljs.highlightElement(codeRef.current);
    }
  }, [item.type, item.code]);

  const renderMedia = () => {
    switch (item.type) {
      case 'video':
        return <video src={item.src} autoPlay loop muted playsInline className="w-full h-full object-cover" />;
      case 'sketch':
        return (
          <>
            <img src={item.sketchSrc} alt="Sketch" className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
            <img src={item.src} alt="Generated from sketch" className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </>
        );
      case 'code':
        return (
          <div className="w-full h-full bg-zinc-800 p-4 overflow-hidden">
            <pre className="text-[10px] text-left"><code ref={codeRef} className="language-html">{item.code}</code></pre>
          </div>
        );
      case 'image':
      default:
        return <img src={item.src} alt={item.prompt} className="w-full h-full object-cover" />;
    }
  };

  return (
    <div className="relative group flex-shrink-0 w-96 h-64 rounded-xl overflow-hidden border border-zinc-800 mx-2">
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
        {renderMedia()}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-sm font-semibold text-white">{item.prompt}</p>
        <p className="text-xs text-purple-300 font-bold mt-1">{item.tool}</p>
      </div>
    </div>
  );
};

const MarqueeRow: React.FC<{ items: typeof showcaseItemsRow1; direction?: 'left' | 'right' }> = ({ items, direction = 'left' }) => {
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';
  return (
    <div className="flex overflow-hidden">
      <div className={`flex flex-shrink-0 items-center ${animationClass} hover:[animation-play-state:paused]`}>
        {[...items, ...items].map((item, index) => (
          <ShowcaseCard key={`${item.prompt}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const headlines = [
    "Create at the Speed of Thought",
    "From Vision to Reality, Instantly",
    "Your All-in-One Creative Suite",
    "AI-Powered Creation, Simplified"
  ];
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const inActionRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const sections = [
        { ref: inActionRef, id: 'in-action' },
        { ref: showcaseRef, id: 'showcase' },
        { ref: featuresRef, id: 'features' },
        { ref: pricingRef, id: 'pricing' },
        { ref: footerRef, id: 'footer' },
    ];

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
                }
            });
        },
        { rootMargin: '0px', threshold: 0.2 }
    );

    sections.forEach((section) => {
        if (section.ref.current) {
            observer.observe(section.ref.current);
        }
    });

    return () => {
        sections.forEach((section) => {
            if (section.ref.current) {
                observer.unobserve(section.ref.current);
            }
        });
    };
  }, []);

  useEffect(() => {
    const headlineInterval = setInterval(() => {
      setHeadlineIndex(prevIndex => (prevIndex + 1) % headlines.length);
    }, 4000);

    return () => clearInterval(headlineInterval);
  }, []);

  return (
    <div className="bg-black text-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 p-4 opacity-0" style={{ animation: 'fade-in-down 0.8s ease-out 0.2s forwards' }}>
        <div className="container mx-auto relative flex items-center justify-between backdrop-blur-lg rounded-full p-4 px-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="MANIBAU Studios Logo" className="h-8 w-8 filter drop-shadow-lg animate-rotate-once" />
            <div className="text-xl font-bold tracking-wider font-poppins">
                <span>MANIBAU</span>
                <span className="text-gray-400"> STUDIOS</span>
            </div>
          </div>
          <nav className="hidden md:absolute md:left-1/2 md:-translate-x-1/2 md:flex items-center gap-1 bg-white/10 border border-white/20 backdrop-blur-lg rounded-full p-2 shadow-lg shadow-black/20">
            <a href="#home" className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-full transition-colors">Home</a>
            <a href="#in-action" className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-full transition-colors">In Action</a>
            <a href="#showcase" className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-full transition-colors">Showcase</a>
            <a href="#features" className="px-4 py-2 text-sm text-gray-200 hover:bg-white/10 rounded-full transition-colors">Features</a>
          </nav>
          <button onClick={onGetStarted} className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors">
            Get Started
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="h-screen flex items-center justify-center text-center bg-gradient-to-br from-zinc-900 to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] opacity-40"></div>
          <div className="z-10 px-4">
            <h1 key={headlineIndex} className="text-5xl md:text-7xl font-bold mb-4 animated-headline">
              {headlines[headlineIndex]}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 opacity-0" style={{ animation: 'fade-in-up 0.8s ease-out 0.4s forwards' }}>
              Harness the power of generative AI to bring your ideas to life. From stunning visuals to fully functional websites, MANIBAU Studios is your all-in-one creative suite.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-black font-semibold px-8 py-3 rounded-full text-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 opacity-0"
              style={{ animation: 'fade-in-up 0.8s ease-out 0.6s forwards' }}
            >
              Start Creating Now
            </button>
            <div className="flex gap-6 justify-center mt-12 opacity-0" style={{ animation: 'fade-in-up 0.8s ease-out 0.8s forwards' }}>
                <a href="https://github.com/vedantwankhade123" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                    <GithubIcon />
                </a>
                <a href="https://www.instagram.com/_vedantkwankhade_?igsh=MXY2YTQwNG80eHV6bQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                    <InstagramIcon />
                </a>
                <a href="https://www.linkedin.com/in/vedant-wankhade123?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                    <LinkedInIcon />
                </a>
                <a href="mailto:manibaustudios@gmail.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Email">
                    <EmailIcon />
                </a>
            </div>
          </div>
        </section>

        <section id="in-action" ref={inActionRef} className={`py-24 bg-black transition-all duration-1000 ease-out ${visibleSections['in-action'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">See it in Action</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Watch a quick overview of how MANIBAU Studios transforms your ideas into reality.
            </p>
            <div className="relative group max-w-4xl mx-auto">
              <div className="absolute -inset-4 bg-white rounded-full blur-3xl opacity-10 animate-pulse-slow"></div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-purple-500/10 group">
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ&controls=0&showinfo=0&rel=0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <section id="showcase" ref={showcaseRef} className={`py-24 bg-zinc-900/50 overflow-hidden transition-all duration-1000 ease-out ${visibleSections['showcase'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">From Prompt to Product</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">See what's possible with MANIBAU Studios. Our tools transform simple prompts into stunning images, videos, websites, and more.</p>
          </div>
          <div className="relative space-y-4" style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}>
            <MarqueeRow items={showcaseItemsRow1} />
            <MarqueeRow items={showcaseItemsRow2} direction="right" />
          </div>
        </section>

        <section id="features" ref={featuresRef} className={`py-32 bg-black transition-all duration-1000 ease-out ${visibleSections['features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-12">One Platform, Infinite Possibilities</h2>
          </div>
          <div
            className="relative w-full overflow-hidden"
            style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}
          >
            <div className="flex animate-infinite-scroll hover:[animation-play-state:paused]">
              {[...features, ...features].map((feature, index) => (
                <div key={index} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4" style={{ minWidth: '33.333%' }}>
                  <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-2xl border border-zinc-800 h-full">
                    <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" ref={footerRef} className={`m-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 transition-all duration-1000 ease-out ${visibleSections['footer'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-4 justify-center">
                        <img src={logoUrl} alt="MANIBAU Studios Logo" className="h-8 w-8 filter drop-shadow-lg animate-rotate-once" />
                        <h3 className="text-lg font-bold tracking-wider font-poppins">
                            <span>MANIBAU</span>
                            <span className="text-gray-400"> STUDIOS</span>
                        </h3>
                    </div>
                    <p className="text-gray-400 text-sm">Your all-in-one creative suite, powered by generative AI.</p>
                    <div className="flex gap-4 mt-6 justify-center">
                        <a href="https://github.com/vedantwankhade123" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><GithubIcon /></a>
                        <a href="https://www.instagram.com/_vedantkwankhade_?igsh=MXY2YTQwNG80eHV6bQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon /></a>
                        <a href="https://www.linkedin.com/in/vedant-wankhade123?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><LinkedInIcon /></a>
                        <a href="mailto:manibaustudios@gmail.com" className="text-gray-400 hover:text-white transition-colors"><EmailIcon /></a>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-200 mb-4">Tools</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Image Studio</a></li>
                        <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Video Studio</a></li>
                        <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Sketch Studio</a></li>
                        <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Developer Studio</a></li>
                        <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Library</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-200 mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-200 mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} MANIBAU Studios. All Rights Reserved. Made in India.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;