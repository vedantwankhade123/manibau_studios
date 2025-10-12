import React from 'react';

interface TermsOfServiceProps {
  onGoBack: () => void;
}

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
          
          <p>Welcome to MANIBAU Studios! These Terms of Service ("Terms") govern your use of our AI-powered creative suite (the "Service"). By creating an account and using our Service, you agree to these Terms.</p>

          <h2>1. The Service</h2>
          <p>MANIBAU Studios provides a suite of tools that leverage Google's Gemini API to generate and edit content, including images, videos, and code ("Generated Content"). The Service is designed with a "local-first" architecture.</p>
          <ul>
            <li><strong>Local Storage:</strong> All projects, conversations, and Generated Content you create are stored directly in your web browser's local storage. We do not have access to, nor do we store, this project data on our servers.</li>
            <li><strong>API Key:</strong> To use the generative features, you must provide your own Google Gemini API key. This key is stored securely in our database and is used solely to process your requests to the Gemini API on your behalf.</li>
          </ul>

          <h2>2. User Accounts</h2>
          <p>You must create an account to access the Service. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>

          <h2>3. Your Responsibilities</h2>
          <ul>
            <li><strong>API Key:</strong> You are solely responsible for obtaining and managing your Google Gemini API key. You are also responsible for any costs associated with its use. We are not liable for any charges incurred from your API key usage.</li>
            <li><strong>Local Data Backup:</strong> Because your project data is stored locally, it is your responsibility to back it up. Clearing your browser's cache or data may permanently delete your projects.</li>
            <li><strong>Acceptable Use:</strong> You agree not to use the Service to create any content that is illegal, harmful, abusive, or infringes on the rights of others. You will comply with the terms of service of any third-party APIs you use through our platform, including the Google Gemini API.</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>You retain ownership of the prompts you provide and the Generated Content created by you through the Service, subject to the terms of the underlying AI models (e.g., Google's Gemini API terms). We do not claim any ownership rights over your creations.</p>

          <h2>5. Disclaimers and Limitation of Liability</h2>
          <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY GENERATED CONTENT.</p>
          <p>IN NO EVENT SHALL MANIBAU STUDIOS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, LOSS OF PROFITS, DATA, OR OTHER INTANGIBLES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, YOUR API KEY USAGE, OR THE LOSS OF YOUR LOCALLY STORED DATA.</p>

          <h2>6. Termination</h2>
          <p>We reserve the right to suspend or terminate your account at any time, without notice, for any reason, including for a breach of these Terms.</p>

          <h2>7. Changes to Terms</h2>
          <p>We may modify these Terms from time to time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>

          <h2>8. Governing Law</h2>
          <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at manibaustudios@gmail.com.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;