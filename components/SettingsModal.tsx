import React, { useState, useEffect } from 'react';
import { Theme, FontSize } from '../App';
import UserProfileCard from './UserProfileCard';
import { useSession } from '../src/contexts/SessionContext';
import { supabase } from '../src/integrations/supabase/client';
import { Loader2, Check, ExternalLink } from 'lucide-react';
import RemoveApiKeyConfirmationModal from './RemoveApiKeyConfirmationModal';

// --- Icon Components ---
const GeneralIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AccountIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AccessibilityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const IntegrationsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const AboutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ToggleSwitch: React.FC<{ id: string; checked: boolean; onChange: () => void; label: string; disabled?: boolean; }> = ({ id, checked, onChange, label, disabled }) => (
  <div className="flex items-center justify-between">
    <label htmlFor={id} className={`transition-colors ${disabled ? 'text-gray-400 dark:text-gray-600' : 'text-zinc-700 dark:text-gray-300'}`}>{label}</label>
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors disabled:cursor-not-allowed ${checked ? 'bg-gray-600 dark:bg-gray-400' : 'bg-zinc-300 dark:bg-zinc-700'} ${disabled ? 'opacity-50' : ''}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div>
    <label className="text-lg font-semibold text-zinc-800 dark:text-gray-300">{title}</label>
    <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">{description}</p>
    {children}
  </div>
);


interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customApiKey: string | null;
  setCustomApiKey: (key: string | null) => void;
  initialTab?: SettingsTab;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  onViewTerms: () => void;
  onViewPrivacy: () => void;
}

export type SettingsTab = 'general' | 'account' | 'accessibility' | 'integrations' | 'about';

const GeneralSettingsContent: React.FC<{ theme: Theme; setTheme: (theme: Theme) => void; }> = ({ theme, setTheme }) => {
    return (
        <div>
            <h3 className="text-2xl font-bold mb-6">General Settings</h3>
            <div className="space-y-8">
                <SettingsSection title="Theme" description="Choose the appearance of the application.">
                <div className="grid grid-cols-2 gap-4">
                    {(['light', 'dark'] as Theme[]).map(t => (
                    <label key={t} className={`relative flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition-all ${theme === t ? 'border-zinc-500 dark:border-zinc-600 ring-2 ring-zinc-500/50 dark:ring-zinc-700' : 'border-zinc-200 dark:border-zinc-700'}`}>
                        <input type="radio" name="theme" value={t} checked={theme === t} onChange={() => setTheme(t)} className="absolute opacity-0" />
                        <div className={`w-12 h-8 rounded-lg ${t === 'light' ? 'bg-gray-200 border border-gray-300' : 'bg-zinc-800 border border-zinc-700'}`}></div>
                        <div>
                        <span className="font-semibold text-zinc-800 dark:text-white capitalize">{t}</span>
                        </div>
                    </label>
                    ))}
                </div>
                </SettingsSection>
            </div>
        </div>
    );
};

const AccountSettingsContent: React.FC<{
    customApiKey: string | null;
    setCustomApiKey: (key: string | null) => void;
}> = ({ customApiKey, setCustomApiKey }) => {
    const { profile, session, setProfile } = useSession();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState(customApiKey || '');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [apiKeySaveState, setApiKeySaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isRemoveApiKeyModalOpen, setIsRemoveApiKeyModalOpen] = useState(false);

    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name || '');
            setLastName(profile.last_name || '');
            setApiKeyInput(profile.gemini_api_key || '');
        }
    }, [profile]);


    const handleToggleEdit = () => {
        if (isEditingProfile) { // This is now the "Cancel" action
            if (profile) {
                setFirstName(profile.first_name || '');
                setLastName(profile.last_name || '');
            }
        }
        setIsEditingProfile(!isEditingProfile);
    };

    const handleProfileUpdate = async () => {
        if (!session?.user) return;
        setSaveState('saving');

        const updates = {
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString(),
        };

        const { data, error: updateError } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', session.user.id)
            .select()
            .single();

        if (updateError) {
            alert('Error updating profile: ' + updateError.message);
            setSaveState('idle');
        } else {
            setProfile(data);
            setSaveState('saved');
            setTimeout(() => {
                setSaveState('idle');
                setIsEditingProfile(false);
            }, 2000);
        }
    };

    const handleSaveApiKey = async (keyToSave: string | null) => {
        if (!session?.user) return;
        setApiKeySaveState('saving');

        const { data, error } = await supabase
            .from('profiles')
            .update({ gemini_api_key: keyToSave })
            .eq('id', session.user.id)
            .select()
            .single();

        if (error) {
            alert('Error saving API key: ' + error.message);
            setApiKeySaveState('idle');
        } else {
            setProfile(data);
            setCustomApiKey(keyToSave);
            setApiKeyInput(keyToSave || '');
            setApiKeySaveState('saved');
            setTimeout(() => setApiKeySaveState('idle'), 2000);
        }
    };

    const handleRemoveApiKey = () => {
        setIsRemoveApiKeyModalOpen(true);
    };

    const confirmAndRemoveApiKey = async () => {
        await handleSaveApiKey(null);
        setIsRemoveApiKeyModalOpen(false);
    };

    const user = {
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || session?.user?.email || 'User',
        email: session?.user?.email || '',
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-6">Account Information</h3>
            <div className="space-y-8">
                <SettingsSection title="User Profile" description="This is your profile information.">
                    <UserProfileCard
                        name={user.name}
                        email={user.email}
                        isEditing={isEditingProfile}
                        firstName={firstName}
                        lastName={lastName}
                        onFirstNameChange={setFirstName}
                        onLastNameChange={setLastName}
                        onToggleEdit={handleToggleEdit}
                    />
                    {isEditingProfile && (
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={handleToggleEdit} disabled={saveState === 'saving'} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg font-semibold text-sm disabled:opacity-50">Cancel</button>
                            <button
                                onClick={handleProfileUpdate}
                                disabled={saveState !== 'idle'}
                                className={`px-4 py-2 rounded-lg font-semibold text-sm w-32 flex items-center justify-center transition-all duration-300 ease-in-out ${
                                    saveState === 'saved'
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50'
                                }`}
                            >
                                {saveState === 'saving' && <Loader2 className="animate-spin h-5 w-5" />}
                                {saveState === 'saved' && (
                                    <div className="flex items-center gap-1.5">
                                        <Check className="h-5 w-5" />
                                        <span>Saved!</span>
                                    </div>
                                )}
                                {saveState === 'idle' && <span>Save Changes</span>}
                            </button>
                        </div>
                    )}
                </SettingsSection>
                <SettingsSection title="Your API Key" description="Your Google Gemini API key is required to use the generative features of this platform.">
                    <div className="p-4 border border-zinc-200 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl space-y-4">
                        <div>
                            <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Your Gemini API Key</label>
                            <div className="flex gap-2 mt-2">
                                <input
                                    id="api-key-input"
                                    type="password"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="Enter your API key"
                                    className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg p-2.5 focus:ring-gray-500 focus:border-gray-500 font-mono"
                                />
                                <button
                                    onClick={() => handleSaveApiKey(apiKeyInput.trim() || null)}
                                    disabled={apiKeySaveState !== 'idle'}
                                    className={`px-4 py-2 rounded-lg font-semibold text-sm w-24 flex items-center justify-center transition-colors ${
                                        apiKeySaveState === 'saved'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-black text-white dark:bg-white dark:text-black disabled:opacity-50'
                                    }`}
                                >
                                    {apiKeySaveState === 'saving' && <Loader2 className="animate-spin h-5 w-5" />}
                                    {apiKeySaveState === 'saved' && <Check className="h-5 w-5" />}
                                    {apiKeySaveState === 'idle' && <span>Save</span>}
                                </button>
                            </div>
                            {customApiKey && (
                                <div className="mt-2 text-right">
                                    <button onClick={handleRemoveApiKey} className="text-sm font-semibold text-red-600 dark:text-red-400 hover:underline">Remove Key</button>
                                </div>
                            )}
                        </div>
                    </div>
                </SettingsSection>
                <SettingsSection title="API Key Usage" description="Track your Gemini API usage and manage quotas in your Google AI Studio dashboard.">
                    <a 
                        href="https://aistudio.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-full font-semibold text-sm px-4 py-2 transition-colors"
                    >
                        <ExternalLink size={16} />
                        <span>View Usage in Google AI Studio</span>
                    </a>
                </SettingsSection>
            </div>
            <RemoveApiKeyConfirmationModal
                isOpen={isRemoveApiKeyModalOpen}
                onClose={() => setIsRemoveApiKeyModalOpen(false)}
                onConfirm={confirmAndRemoveApiKey}
                isLoading={apiKeySaveState === 'saving'}
            />
        </div>
    );
};

const AccessibilitySettingsContent: React.FC<{
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
    highContrast: boolean;
    setHighContrast: (value: boolean) => void;
    reduceMotion: boolean;
    setReduceMotion: (value: boolean) => void;
}> = ({ fontSize, setFontSize, highContrast, setHighContrast, reduceMotion, setReduceMotion }) => {
    return (
        <div>
            <h3 className="text-2xl font-bold mb-6">Accessibility</h3>
            <div className="space-y-8">
              <SettingsSection title="Font Size" description="Adjust the text size across the application.">
                <div className="flex gap-2 p-2 bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl">
                  {(['Small', 'Medium', 'Large'] as const).map(size => (
                    <button key={size} onClick={() => setFontSize(size.toLowerCase() as FontSize)} className={`w-full text-center py-2 rounded-xl text-sm font-semibold transition-colors ${fontSize === size.toLowerCase() ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-white' : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}>{size}</button>
                  ))}
                </div>
              </SettingsSection>
              <SettingsSection title="Display" description="Improve visibility with display adjustments.">
                <div className="p-4 border border-zinc-200 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl space-y-4 divide-y divide-zinc-200 dark:divide-zinc-700">
                  <ToggleSwitch id="high-contrast" checked={highContrast} onChange={() => setHighContrast(!highContrast)} label="High Contrast Mode" />
                  <div className="pt-4">
                    <ToggleSwitch id="reduce-motion" checked={reduceMotion} onChange={() => setReduceMotion(!reduceMotion)} label="Reduce Motion" />
                  </div>
                </div>
              </SettingsSection>
            </div>
        </div>
    );
};

const IntegrationsSettingsContent: React.FC = () => (
    <div>
        <h3 className="text-2xl font-bold mb-6">Integrations</h3>
        <div className="space-y-8">
            <SettingsSection title="Connected Apps" description="Connect your favorite tools to streamline your workflow.">
            <div className="p-4 border border-zinc-200 dark:border-zinc-700 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-2xl space-y-4 divide-y divide-zinc-200 dark:divide-zinc-700">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <GithubIcon />
                    <span className="font-semibold">GitHub</span>
                </div>
                <ToggleSwitch id="github-toggle" checked={true} onChange={() => {}} label="" />
                </div>
            </div>
            </SettingsSection>
        </div>
    </div>
);

const AboutSettingsContent: React.FC<{ onViewTerms: () => void; onViewPrivacy: () => void; }> = ({ onViewTerms, onViewPrivacy }) => (
    <div>
        <h3 className="text-2xl font-bold mb-6">About MANIBAU Studios</h3>
        <div className="space-y-4 text-gray-500 dark:text-gray-400 prose prose-zinc dark:prose-invert max-w-none">
            <p>Version: <span className="font-mono text-zinc-800 dark:text-white bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded-md not-prose">1.0.0</span></p>
            <h4>How It Works</h4>
            <p>MANIBAU Studios is an all-in-one creative suite powered by Google's Gemini API. Our platform operates on a "local-first" principle to ensure your privacy and data ownership:</p>
            <ul>
                <li><strong>Your Data, Your Device:</strong> All projects, conversations, and generated content are stored directly in your browser's local storage. We do not have access to your creative work.</li>
                <li><strong>Your API Key:</strong> To generate content, you provide your own Google Gemini API key. We store this key securely in our database and use it only to process your requests.</li>
            </ul>
            <p>This approach gives you full control over your data while leveraging powerful AI capabilities.</p>
            <div className="flex gap-4 pt-4">
                <button onClick={onViewTerms} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white underline">Terms of Service</button>
                <button onClick={onViewPrivacy} className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white underline">Privacy Policy</button>
            </div>
        </div>
    </div>
);


export const SETTINGS_CONFIG: {
    id: SettingsTab;
    label: string;
    description: string;
    icon: React.ReactNode;
    content: React.FC<any>;
}[] = [
    { id: 'general', label: 'General', description: 'Appearance and language', icon: <GeneralIcon />, content: GeneralSettingsContent },
    { id: 'account', label: 'Account', description: 'API key and subscription', icon: <AccountIcon />, content: AccountSettingsContent },
    { id: 'accessibility', label: 'Accessibility', description: 'Font size and contrast', icon: <AccessibilityIcon />, content: AccessibilitySettingsContent },
    { id: 'integrations', label: 'Integrations', description: 'Connect to other apps', icon: <IntegrationsIcon />, content: IntegrationsSettingsContent },
    { id: 'about', label: 'About', description: 'App information and policies', icon: <AboutIcon />, content: AboutSettingsContent },
];


const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  const { isOpen, onClose, initialTab = 'general' } = props;
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  
  if (!isOpen) return null;

  const ActiveContent = SETTINGS_CONFIG.find(c => c.id === activeTab)?.content;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-black rounded-3xl border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl h-[80vh] shadow-2xl flex" onClick={(e) => e.stopPropagation()}>
        <div className="w-1/4 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-8">Settings</h2>
          <nav className="flex flex-col gap-2">
            {SETTINGS_CONFIG.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-2xl text-lg transition-colors ${activeTab === item.id ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="w-3/4 p-8 overflow-y-auto custom-scrollbar relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Close">
            <CloseIcon />
          </button>
          {ActiveContent && <ActiveContent {...props} />}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;