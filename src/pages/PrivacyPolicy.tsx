import React from 'react';

interface PrivacyPolicyProps {
  onGoBack: () => void;
}

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
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;