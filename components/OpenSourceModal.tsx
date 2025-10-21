import React from 'react';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GithubIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor">
      <title>GitHub</title>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);

interface OpenSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OpenSourceModal: React.FC<OpenSourceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-zinc-900 text-gray-300 rounded-2xl border border-zinc-800 w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 flex-shrink-0">
          <h2 className="text-lg font-bold">MANIBAU Studios is Open Source</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-zinc-700"><CloseIcon /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar prose prose-invert prose-sm sm:prose-base max-w-none">
          <p>We believe in the power of community and transparency. That's why MANIBAU Studios is a fully open-source project, built for developers, creators, and AI enthusiasts.</p>
          
          <h4>Our Philosophy</h4>
          <p>Our goal is to provide a powerful, local-first creative suite that respects your privacy and gives you full control over your data. By making our code public, we invite you to:</p>
          <ul>
            <li><strong>Learn:</strong> See how a modern AI application is built with React, Vite, Tailwind CSS, and the Google Gemini API.</li>
            <li><strong>Customize:</strong> Fork the repository and adapt the studio to your specific needs. Add new tools, change the UI, or integrate different AI models.</li>
            <li><strong>Contribute:</strong> Help us improve! You can report bugs, suggest new features, or submit pull requests to make MANIBAU Studios even better.</li>
          </ul>

          <h4>How to Use the Code</h4>
          <p>The entire application runs in your browser. There is no complex backend to set up. Here’s how you can run it locally:</p>
          <ol>
            <li>Clone the repository from GitHub.</li>
            <li>Install the dependencies using `npm install`.</li>
            <li>Get a Google Gemini API key and add it to a `.env.local` file.</li>
            <li>Run the development server with `npm run dev`.</li>
          </ol>
          <p>It's that simple! You'll have your own instance of MANIBAU Studios running on your machine.</p>

          <div className="not-prose flex justify-center mt-8">
            <a 
              href="https://github.com/vedantwankhade123/Manibau-studios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              <GithubIcon />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenSourceModal;