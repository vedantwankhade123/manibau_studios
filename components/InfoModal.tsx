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

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-zinc-900 text-gray-300 rounded-2xl border border-zinc-800 w-full max-w-2xl shadow-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 flex-shrink-0">
          <h2 className="text-lg font-bold">Free, Private, and Powerful</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-zinc-700"><CloseIcon /></button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar prose prose-invert prose-sm sm:prose-base max-w-none">
          <p>We believe powerful creative tools should be accessible to everyone. That's why MANIBAU Studios is completely free to use.</p>
          
          <h4>Your Data Stays With You</h4>
          <p>Our platform is built on a "local-first" philosophy. This means:</p>
          <ul>
            <li><strong>Complete Privacy:</strong> All your projects, conversations, and generated content are stored exclusively in your browser's local storage on your own device. We never see or store your data.</li>
            <li><strong>You're in Control:</strong> Your Google Gemini API key is also saved locally. It's sent directly from your browser to Google, never passing through our servers.</li>
          </ul>

          <h4>How is it Free?</h4>
          <p>The application itself is free. To power the AI features, you need to provide your own Google Gemini API key. While the Gemini API has a generous free tier, be aware that extensive use may incur costs from Google.</p>
          <p><strong>Important:</strong> Because everything is stored locally, remember to back up important projects. Clearing your browser's data will permanently delete your work.</p>

          <h4>License & Usage</h4>
          <p>The source code for MANIBAU Studios is available for viewing on GitHub for educational and inspirational purposes. However, please note the following restrictions:</p>
          <ul>
              <li>The code is provided for learning and reference only.</li>
              <li>You are <strong>not permitted</strong> to host, redistribute, or use this application or its code in a commercial or production environment.</li>
              <li>You may not use the code to create a derivative service or product without explicit permission.</li>
          </ul>
          <p>If you are interested in using MANIBAU Studios for commercial purposes, or would like to purchase a license to host your own version, please contact us to discuss options.</p>

          <div className="not-prose flex justify-center mt-8">
            <a 
              href="https://github.com/vedantwankhade123/Manibau-studios" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              <GithubIcon />
              <span>View Source on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;