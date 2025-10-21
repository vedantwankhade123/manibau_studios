import React from 'react';

interface PrivacyPolicyProps {
  onGoBack: () => void;
}

const GithubIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor">
    <title>GitHub</title>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor">
    <title>Instagram</title>
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.784.305-1.455.717-2.126 1.387C1.337 2.701.926 3.372.62 4.14c-.3.765-.5 1.635-.558 2.913-.057 1.28-.072 1.687-.072 4.947s.015 3.667.072 4.947c.06 1.277.26 2.148.558 2.913.306.78.718 1.457 1.387 2.126.67.67 1.344 1.082 2.126 1.387.765.3 1.635.5 2.913.558 1.28.057 1.687.072 4.947.072s3.667-.015 4.947-.072c1.277-.06 2.148-.26 2.913-.558.78-.305 1.457-.718 2.126-1.387.67-.67 1.082-1.344 1.387-2.126.3-.765.5-1.635.558-2.913.057-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.26-2.148-.558-2.913-.306-.78-.718-1.457-1.387-2.126C21.299 1.337 20.628.926 19.86.62c-.765-.3-1.635-.5-2.913-.558C15.667.015 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.07 1.17.05 1.805.248 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.06 1.17-.248 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.015-4.85-.07c-1.17-.06-1.805-.248-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.585.07-4.85c.06-1.17.248-1.805.413-2.227.217-.562.477.96.896-1.382.42-.419.819.679 1.381-.896.422-.164 1.057.36 2.227-.413C8.415 2.18 8.797 2.16 12 2.16zm0 9.04c-2.12 0-3.84 1.72-3.84 3.84s1.72 3.84 3.84 3.84 3.84-1.72 3.84-3.84-1.72-3.84-3.84-3.84zM12 16.8c-1.01 0-1.84-.83-1.84-1.84s.83-1.84 1.84-1.84 1.84.83 1.84 1.84-.83 1.84-1.84 1.84zm6.406-11.845c-.796 0-1.44.645-1.44 1.44s.645 1.44 1.44 1.44 1.44-.645 1.44-1.44-.644-1.44-1.44-1.44z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor">
    <title>LinkedIn</title>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
  </svg>
);
const EmailIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor">
    <title>Email</title>
    <path d="M24 4.5v15c0 .825-.675 1.5-1.5 1.5H1.5C.675 21 0 20.325 0 19.5v-15C0 3.675.675 3 1.5 3h21c.825 0 1.5.675 1.5 1.5zM22.5 6l-10.5 7.5L1.5 6v-1.5h21V6z"/>
  </svg>
);

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onGoBack }) => {
  return (
    <div className="absolute inset-0 bg-zinc-900 text-gray-300 p-4 sm:p-8 overflow-y-auto custom-scrollbar z-50">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onGoBack} 
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Go Back</span>
        </button>

        <div className="prose prose-invert prose-lg max-w-none">
          <h1>Privacy Policy</h1>
          <p className="lead">Last Updated: {new Date().toLocaleDateString()}</p>

          <p>MANIBAU Studios ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our application (the "Service"). Our philosophy is "local-first," meaning your data stays with you.</p>

          <h2>1. Information We DO NOT Collect</h2>
          <p>Our Service is designed to run entirely within your web browser. We do not have a backend server that collects or stores your personal data. We DO NOT collect:</p>
          <ul>
            <li><strong>Personal Information:</strong> We do not require you to create an account, so we do not collect names, email addresses, or any other personal identifiers.</li>
            <li><strong>Project Data:</strong> All projects, prompts, conversations, and any content you generate (images, videos, code, etc.) are stored exclusively in your browser's local storage on your own device. We cannot see, access, or share this data.</li>
            <li><strong>API Keys:</strong> Your Google Gemini API key is stored in your browser's local storage. It is never sent to our servers.</li>
            <li><strong>Usage Analytics:</strong> We do not track how you use the application or what you create.</li>
          </ul>

          <h2>2. Information Stored on Your Device</h2>
          <p>To enable the functionality of the Service, some data is stored locally on your device using your web browser's `localStorage` feature:</p>
          <ul>
            <li><strong>Your Google Gemini API Key:</strong> This is required to power the AI features. It is stored on your device so you don't have to enter it every time.</li>
            <li><strong>Your Projects:</strong> All your creative work is saved in your browser so you can continue where you left off.</li>
            <li><strong>Settings:</strong> Your preferences, such as theme and accessibility settings, are also stored locally.</li>
          </ul>
          <p><strong>Important:</strong> Because this data is stored locally, it is your responsibility to manage it. If you clear your browser's cache or local storage, **all your projects and settings will be permanently deleted.**</p>

          <h2>3. Third-Party Services</h2>
          <p>The core functionality of our Service relies on the Google Gemini API. When you generate content, your prompts and API key are sent directly from your browser to Google's servers for processing. Your use of these features is subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a> and their API terms of service.</p>

          <h2>4. Security</h2>
          <p>While we do not store your data, you are responsible for the security of the data on your device. This includes protecting your Google Gemini API key. We are not responsible for any unauthorized use of your API key or any costs incurred from its usage.</p>

          <h2>5. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the policy within the application. Your continued use of the Service after such changes constitutes your acceptance of the new policy.</p>

          <h2>6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at manibaustudios@gmail.com.</p>
          <div className="not-prose flex gap-6 mt-6">
            <a href="https://github.com/vedantwankhade123" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><GithubIcon /></a>
            <a href="https://www.instagram.com/_vedantkwankhade_?igsh=MXY2YTQwNG80eHV6bQ==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><InstagramIcon /></a>
            <a href="https://www.linkedin.com/in/vedant-wankhade123?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><LinkedInIcon /></a>
            <a href="mailto:manibaustudios@gmail.com" className="text-gray-400 hover:text-white transition-colors"><EmailIcon /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;