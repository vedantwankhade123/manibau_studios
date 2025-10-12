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

          <p>MANIBAU Studios ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our Service.</p>

          <h2>1. Information We Collect</h2>
          <p>We collect a limited amount of information necessary to provide and improve our Service:</p>
          <ul>
            <li><strong>Account Information:</strong> When you sign up, we collect your email address and any other information you provide (such as your name) through our authentication provider, Supabase.</li>
            <li><strong>Google Gemini API Key:</strong> To enable generative features, we require you to provide your own API key. This key is stored securely in our encrypted database.</li>
          </ul>

          <h2>2. Information We DO NOT Collect</h2>
          <p>Our platform is designed with a "local-first" approach to maximize your privacy and control:</p>
          <ul>
            <li><strong>Project Data:</strong> We DO NOT collect or store your projects, prompts, conversations, or any content you generate (images, videos, code). All of this data is stored exclusively in your browser's local storage on your own device.</li>
            <li><strong>Usage Analytics (for your content):</strong> We do not track how you interact with your locally stored projects or what you create.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li><strong>To Provide the Service:</strong> We use your account information to authenticate you and give you access to the platform.</li>
            <li><strong>To Process AI Requests:</strong> Your securely stored API key is used to make requests to the Google Gemini API on your behalf. We do not log the content of these requests.</li>
            <li><strong>To Communicate With You:</strong> We may use your email address to send you important updates about the Service or your account.</li>
          </ul>

          <h2>4. Data Storage and Security</h2>
          <ul>
            <li><strong>Account Data & API Key:</strong> Your account information and encrypted API key are stored securely in our Supabase database. We implement industry-standard security measures to protect this data from unauthorized access.</li>
            <li><strong>Project Data:</strong> As stated above, all your project data resides on your local device. This means you have full control, but also full responsibility. If you clear your browser data, your projects will be permanently lost.</li>
          </ul>

          <h2>5. Third-Party Services</h2>
          <ul>
            <li><strong>Supabase:</strong> We use Supabase for user authentication and secure database storage. Supabase has its own privacy policy which you can review.</li>
            <li><strong>Google Gemini:</strong> Your prompts and requests are sent to the Google Gemini API for processing. Your use of these features is subject to Google's Privacy Policy and Terms of Service.</li>
          </ul>

          <h2>6. Your Rights and Choices</h2>
          <p>You have the right to access, update, or delete your account information at any time through the settings panel. You can also remove your API key at any time. Deleting your account will permanently remove your account information and API key from our database.</p>

          <h2>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes. Your continued use of the Service after such changes constitutes your acceptance of the new policy.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at manibaustudios@gmail.com.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;