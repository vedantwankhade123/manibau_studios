import React from 'react';

interface TermsOfServiceProps {
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

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onGoBack }) => {
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
          <h1>Terms of Service</h1>
          <p className="lead">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <p>Welcome to MANIBAU Studios! These Terms of Service ("Terms") govern your use of our AI-powered creative suite (the "Service"). By using our Service, you agree to these Terms.</p>

          <h2>1. The Service</h2>
          <p>MANIBAU Studios provides a suite of tools that leverage Google's Gemini API to generate and edit content ("Generated Content"). The Service is designed with a "local-first" architecture, meaning it runs entirely in your browser.</p>
          <ul>
            <li><strong>Local Storage:</strong> All projects, conversations, and Generated Content you create are stored directly in your web browser's local storage. We do not have access to, nor do we store, this data on our servers.</li>
            <li><strong>API Key Requirement:</strong> To use the generative features, you must provide your own Google Gemini API key. This key is also stored in your browser's local storage and is sent directly to Google's servers with each request.</li>
          </ul>

          <h2>2. User Responsibilities</h2>
          <ul>
            <li><strong>API Key Security and Usage:</strong> You are solely responsible for obtaining, managing, and securing your Google Gemini API key. You are also responsible for any and all costs associated with its use. We are not liable for any charges incurred from your API key usage, nor are we responsible for its unauthorized use.</li>
            <li><strong>Local Data Backup:</strong> Because all your project data is stored locally on your device, it is your sole responsibility to back it up. Clearing your browser's cache, cookies, or local storage **will permanently delete all your projects and settings.** We are not responsible for any data loss.</li>
            <li><strong>Acceptable Use:</strong> You agree not to use the Service to create any content that is illegal, harmful, abusive, or infringes on the rights of others. You must comply with the terms of service of any third-party APIs you use through our platform, including the Google Gemini API's <a href="https://ai.google.dev/terms" target="_blank" rel="noopener noreferrer">Prohibited Use Policy</a>.</li>
          </ul>

          <h2>3. Intellectual Property</h2>
          <p>You retain ownership of the prompts you provide and the Generated Content created by you through the Service, subject to the terms of the underlying AI models (e.g., Google's Gemini API terms). We claim no ownership rights over your creations.</p>

          <h2>4. Disclaimers and Limitation of Liability</h2>
          <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY GENERATED CONTENT.</p>
          <p>IN NO EVENT SHALL MANIBAU STUDIOS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, LOSS OF PROFITS, DATA, OR OTHER INTANGIBLES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, YOUR API KEY USAGE, OR THE LOSS OF YOUR LOCALLY STORED DATA.</p>

          <h2>5. Changes to Terms</h2>
          <p>We may modify these Terms from time to time. We will notify you of any changes by posting the new Terms within the application. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>

          <h2>6. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

          <h2>7. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at manibaustudios@gmail.com.</p>
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

export default TermsOfService;