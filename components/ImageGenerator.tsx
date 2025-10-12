import React, { useState, useRef, useEffect } from 'react';
import { generateImage, editImage, fileToBase64 } from '../services/geminiService';
import GeneratedImage from './GeneratedImage';
import PromptInput from './PromptInput';
import ImagePlaceholder from './ImagePlaceholder';
import ImageEditorModal from './ImageEditorModal';
import VariationsModal from './VariationsModal';
import { Tool } from '../types';
import { Project } from './Dashboard';
import { Theme } from '../App';
import ThemeToggleButton from './ThemeToggleButton';
import UserProfilePopover from './UserProfilePopover';
import { SettingsTab } from './SettingsModal';
import { KeyRound } from 'lucide-react';

interface ConversationTurn {
  id: number;
  prompt: string;
  sentImages?: { url: string; name: string }[];
  imageUrls: string[] | null;
  isLoading: boolean;
  error: string | null;
  numberOfImagesToGenerate?: number;
  aspectRatio?: string;
  showWatermark?: boolean;
}

interface ImageGeneratorProps {
  setActiveTool: (tool: Tool) => void;
  onToggleNotifications: () => void;
  unreadCount: number;
  onToggleCommandPalette: () => void;
  onAddProject: (project: Omit<Project, 'id' | 'timestamp'>) => string;
  onUpdateProject: (projectId: string, updatedData: Partial<Omit<Project, 'id'>>) => void;
  loadedProject: Project | null;
  onProjectLoaded: () => void;
  customApiKey: string | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
  onOpenSettings: (tab?: SettingsTab) => void;
  onSaveApiKey: (apiKey: string) => Promise<void>;
  onLogout: () => void;
}

const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </button>
);

const NotificationBell: React.FC<{ onClick: () => void; notificationCount: number; }> = ({ onClick, notificationCount }) => (
    <button onClick={onClick} className="relative p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notificationCount > 0 && (
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
        )}
    </button>
);

const GenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const ChevronLeftIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /> </svg> );
const ChevronRightIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /> </svg> );

const examplePrompts = [
  {
    title: 'Photorealistic Astronaut',
    prompt: 'A cinematic, photorealistic portrait of an astronaut on Mars, detailed visor reflection, dramatic lighting.'
  },
  {
    title: 'Enchanted Forest',
    prompt: 'An enchanted forest at twilight, glowing mushrooms, a mystical deer with glowing antlers, fantasy digital art.'
  },
  {
    title: 'Minimalist Coffee Logo',
    prompt: 'A minimalist logo for a coffee shop named "The Daily Grind", featuring a stylized coffee bean and a mountain.'
  },
  {
    title: 'Abstract Stormy Sea',
    prompt: 'An abstract oil painting of a storm at sea, with thick, textured brushstrokes and a moody color palette of deep blues and grays.'
  }
];

const aspectRatios: { value: string; label: string }[] = [
  { value: '1:1', label: 'Square' },
  { value: '4:3', label: 'Landscape' },
  { value: '3:4', label: 'Portrait' },
  { value: '16:9', label: 'Widescreen' },
  { value: '9:16', label: 'Story' },
];

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ setActiveTool, onToggleNotifications, unreadCount, onToggleCommandPalette, onAddProject, onUpdateProject, loadedProject, onProjectLoaded, customApiKey, theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, onOpenSettings, onSaveApiKey, onLogout }) => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [editingImage, setEditingImage] = useState<{ url: string; prompt: string } | null>(null);
  const [variationsModalState, setVariationsModalState] = useState<{ prompt: string; sourceImageUrl: string } | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isGenerating = conversation.length > 0 && conversation[conversation.length - 1].isLoading;

  useEffect(() => {
    if (loadedProject && loadedProject.tool === Tool.GENERATE) {
      setConversation(loadedProject.conversation || []);
      setCurrentProjectId(loadedProject.id);
      onProjectLoaded();
    }
  }, [loadedProject, onProjectLoaded]);

  useEffect(() => {
    if (conversation.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const handleGenerate = async (prompt: string, files: File[], numberOfImages: number = 1) => {
    if (!prompt.trim() && files.length === 0) return;
    
    if (!customApiKey) {
      onOpenSettings('account');
      return;
    }

    // Aspect Ratio Detection
    const supportedAspectRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    const aspectRatioRegex = /\b(\d{1,2}:\d{1,2})\b/;
    const match = prompt.match(aspectRatioRegex);
    let finalAspectRatio = aspectRatio; // Default to state
    if (match && supportedAspectRatios.includes(match[0])) {
      finalAspectRatio = match[0];
    }

    const sentImagesForState = await Promise.all(
      files.map(file =>
        new Promise<{ url: string, name: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ url: reader.result as string, name: file.name });
          reader.readAsDataURL(file);
        })
      )
    );

    const prevConversation = [...conversation];

    const newTurn: ConversationTurn = {
      id: Date.now(),
      prompt,
      sentImages: sentImagesForState.length > 0 ? sentImagesForState : undefined,
      imageUrls: null,
      isLoading: true,
      error: null,
      numberOfImagesToGenerate: numberOfImages,
      aspectRatio: files.length > 0 ? undefined : finalAspectRatio,
      showWatermark: false,
    };

    setConversation(prev => [...prev, newTurn]);

    try {
      let urls: string[];
      if (files.length > 0) {
        const imagePayload = await Promise.all(
          files.map(async (file) => {
            const base64Data = await fileToBase64(file);
            return { base64Data, mimeType: file.type };
          })
        );
        urls = await editImage(imagePayload, prompt);
      } else {
        // Generate a new image from text
        urls = await generateImage(prompt, numberOfImages, finalAspectRatio);
      }
      
      const finalTurn = { ...newTurn, imageUrls: urls, isLoading: false };
      const newConversation = [...prevConversation, finalTurn];
      setConversation(newConversation);

      if (currentProjectId) {
        onUpdateProject(currentProjectId, {
          conversation: newConversation,
          name: prompt,
        });
      } else {
        const newProjectId = onAddProject({
          name: prompt.substring(0, 40) + (prompt.length > 40 ? '...' : ''),
          tool: Tool.GENERATE,
          conversation: newConversation,
          files: [],
        });
        if (newProjectId) {
          setCurrentProjectId(newProjectId);
        }
      }
    } catch (e: any) {
      setConversation(prev => prev.map(turn => turn.id === newTurn.id ? { ...turn, error: e.message || 'An unexpected error occurred.', isLoading: false } : turn));
    }
  };

  const handleSaveChanges = (newImageUrl: string, newPrompt: string) => {
    if (!editingImage) return;

    const newTurn: ConversationTurn = {
      id: Date.now(),
      prompt: newPrompt,
      sentImages: [{ url: editingImage.url, name: 'source_image.png' }],
      imageUrls: [newImageUrl],
      isLoading: false,
      error: null,
    };

    setConversation(prev => [...prev, newTurn]);
    setEditingImage(null);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
          <h1 className="text-lg font-bold">Image Studio</h1>
        </div>
        <div className="flex items-center gap-2">
            {!customApiKey && (
              <button onClick={() => onOpenSettings('account')} className="flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50">
                <KeyRound size={16} />
                <span>Add API Key</span>
              </button>
            )}
            <ThemeToggleButton theme={theme} setTheme={setTheme} />
            <SearchButton onClick={onToggleCommandPalette} />
            <NotificationBell onClick={onToggleNotifications} notificationCount={unreadCount} />
            <UserProfilePopover onOpenSettings={onOpenSettings} onLogout={onLogout} />
        </div>
      </header>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400" style={{ minHeight: 'calc(100vh - 22rem)' }}>
              <div className="w-14 h-14 p-2 text-gray-400 dark:text-gray-600 mt-5 mb-1">
                <GenerateIcon />
              </div>
              <h2 className="text-2xl font-semibold text-zinc-800 dark:text-gray-300 mb-2">Imagination Awaits</h2>
              <p className="max-w-md mb-8">Describe the image you want to create, or try one of these examples to get started.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                {examplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerate(p.prompt, [])}
                    className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg text-left hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
                  >
                    <p className="font-semibold text-base text-zinc-800 dark:text-gray-200 leading-tight">{p.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-snug line-clamp-2">{p.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {conversation.map(turn => (
                <div key={turn.id} className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-gray-200 rounded-lg p-3 max-w-lg">
                      {turn.sentImages && turn.sentImages.length > 0 && (
                        <div className={`flex flex-wrap gap-2 ${turn.prompt ? 'mb-2' : ''}`}>
                          {turn.sentImages.map((image, index) => (
                            <img
                              key={index}
                              src={image.url}
                              alt={image.name}
                              className={`rounded-lg object-cover ${turn.sentImages.length === 1 ? 'max-h-48' : 'h-24 w-24'
                                }`}
                            />
                          ))}
                        </div>
                      )}
                      {turn.prompt && <p className="whitespace-pre-wrap">{turn.prompt}</p>}
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className={`w-full ${(turn.imageUrls && turn.imageUrls.length > 1) || (turn.isLoading && turn.numberOfImagesToGenerate && turn.numberOfImagesToGenerate > 1) ? 'max-w-xl' : 'max-w-sm'}`}>
                      {turn.isLoading && (
                        (turn.numberOfImagesToGenerate && turn.numberOfImagesToGenerate > 1) ? (
                          <div className="mt-6 grid grid-cols-2 gap-4">
                            {Array.from({ length: turn.numberOfImagesToGenerate }).map((_, index) => (
                              <ImagePlaceholder key={index} aspectRatio={turn.aspectRatio} />
                            ))}
                          </div>
                        ) : (
                           <ImagePlaceholder aspectRatio={turn.aspectRatio} />
                        )
                      )}
                      {turn.error && <p className="text-red-500 dark:text-red-400 text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">{turn.error}</p>}
                      {turn.imageUrls && (
                        <div className={`mt-6 ${turn.imageUrls.length > 1 ? "grid grid-cols-2 gap-4" : ""}`}>
                          {turn.imageUrls.map((url, index) => (
                            <GeneratedImage
                              key={index}
                              src={url}
                              alt={turn.prompt}
                              onEdit={() => setEditingImage({ url: url, prompt: turn.prompt })}
                              onGenerateVariations={(prompt, sourceImageUrl) => setVariationsModalState({ prompt, sourceImageUrl })}
                              layout={turn.imageUrls.length > 1 ? 'overlay' : 'default'}
                              showWatermark={turn.showWatermark}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex justify-center mb-3">
            <div className="bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 p-1 rounded-full flex items-center gap-1 flex-wrap justify-center">
              {aspectRatios.map(ar => (
                <button
                  key={ar.value}
                  onClick={() => setAspectRatio(ar.value)}
                  disabled={isGenerating}
                  className={`px-3 py-1 text-sm rounded-full transition-colors font-medium
                    ${aspectRatio === ar.value
                      ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 hover:text-zinc-800 dark:hover:text-white disabled:hover:bg-transparent disabled:text-gray-400 dark:disabled:text-gray-500'}`
                  }
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>
          <PromptInput
            onGenerate={handleGenerate}
            isLoading={isGenerating}
            placeholder="Describe an image, or attach one to edit..."
          />
        </div>
      </div>
      {editingImage && (
        <ImageEditorModal
          imageUrl={editingImage.url}
          originalPrompt={editingImage.prompt}
          onClose={() => setEditingImage(null)}
          onSaveChanges={handleSaveChanges}
        />
      )}
      {variationsModalState && (
        <VariationsModal
          isOpen={!!variationsModalState}
          onClose={() => setVariationsModalState(null)}
          prompt={variationsModalState.prompt}
          sourceImageUrl={variationsModalState.sourceImageUrl}
          onGenerate={(prompt, numVariations) => {
            setVariationsModalState(null);
            handleGenerate(prompt, [], numVariations);
          }}
        />
      )}
    </div>
  );
};

export default ImageGenerator;