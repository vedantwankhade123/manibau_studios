import React, { useState, useRef, useEffect } from 'react';
import { generateChatResponse, fileToBase64 } from '../services/geminiService';
import PromptInput from './PromptInput';
import { Tool } from '../types';
import { Project } from './Dashboard';
import { Theme } from '../App';
import ThemeToggleButton from './ThemeToggleButton';
import { SettingsTab } from './SettingsModal';
import { KeyRound, Sparkles, User, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, RefreshCw, Copy, Check, Link } from 'lucide-react';
import type { Content } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MenuButton from './MenuButton';

interface ChatWithAiProps {
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
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  onOpenSettings: (tab?: SettingsTab) => void;
}

interface Source {
  title: string;
  url: string;
}

interface ConversationTurn {
  role: 'user' | 'model';
  text: string;
  sentImages?: { url: string; name: string }[];
  sources?: Source[];
  isRedirect?: boolean;
  redirectTool?: Tool;
}

const AIMessage: React.FC<{ text: string; onStreamUpdate: () => void }> = ({ text, onStreamUpdate }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText('');
        let i = 0;
        const intervalId = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.substring(0, i + 1));
                i++;
                onStreamUpdate();
            } else {
                clearInterval(intervalId);
            }
        }, 10); // Typing speed

        return () => clearInterval(intervalId);
    }, [text, onStreamUpdate]);

    return (
        <div className="prose prose-zinc dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {displayedText}
            </ReactMarkdown>
        </div>
    );
};

const SourceList: React.FC<{ sources: Source[] }> = ({ sources }) => (
    <div className="mt-4">
        <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">Sources</h4>
        <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => (
                <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full px-3 py-1 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                    <Link size={14} />
                    <span>{source.title}</span>
                </a>
            ))}
        </div>
    </div>
);

const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    </button>
);

const NotificationBell: React.FC<{ onClick: () => void; notificationCount: number; }> = ({ onClick, notificationCount }) => (
    <button onClick={onClick} className="relative p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {notificationCount > 0 && (
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900"></span>
        )}
    </button>
);

const examplePrompts = [
  { title: 'Brainstorm ideas', prompt: 'Brainstorm three creative names for a new coffee shop that specializes in artisanal, single-origin beans.' },
  { title: 'Write a poem', prompt: 'Write a short, four-stanza poem about the feeling of the first sunny day after a long winter.' },
  { title: 'Explain a concept', prompt: 'Explain the concept of "quantum entanglement" in simple, easy-to-understand terms, as if you were talking to a high school student.' },
  { title: 'Draft an email', prompt: 'Draft a professional email to a potential client, introducing my web design services and asking for a brief meeting to discuss their needs.' },
];

const ChatWithAi: React.FC<ChatWithAiProps> = ({ setActiveTool, onToggleNotifications, unreadCount, onToggleCommandPalette, onAddProject, onUpdateProject, loadedProject, onProjectLoaded, customApiKey, theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, setIsMobileMenuOpen, onOpenSettings }) => {
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadedProject && loadedProject.tool === Tool.CHAT_WITH_AI) {
      setConversation(loadedProject.conversation || []);
      setCurrentProjectId(loadedProject.id);
      onProjectLoaded();
    }
  }, [loadedProject, onProjectLoaded]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  const handleGenerate = async (prompt: string, files: File[]) => {
    if (!prompt.trim() && files.length === 0) return;
    if (!customApiKey) {
      onOpenSettings('account');
      return;
    }

    const lowerPrompt = prompt.toLowerCase();
    
    const imageGenerationPrefixes = [
        'generate an image', 'create an image', 'make an image', 'draw an image',
        'an image of', 'a picture of', 'a photo of', 'a logo for', 'a drawing of',
        'photorealistic', 'cinematic', 'a portrait of', 'a render of'
    ];

    const videoGenerationPrefixes = [
        'generate a video', 'create a video', 'make a video', 'animate a',
        'a video of', 'a clip of', 'an animation of', 'a drone shot of', 'slow-motion video of'
    ];

    const isImageRequest = imageGenerationPrefixes.some(kw => lowerPrompt.startsWith(kw));
    const isVideoRequest = videoGenerationPrefixes.some(kw => lowerPrompt.startsWith(kw));

    const sentImagesForState = await Promise.all(
        files.map(file =>
            new Promise<{ url: string, name: string }>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ url: reader.result as string, name: file.name });
                reader.readAsDataURL(file);
            })
        )
    );
    const newUserTurn: ConversationTurn = { role: 'user', text: prompt, sentImages: sentImagesForState.length > 0 ? sentImagesForState : undefined };

    if (files.length === 0 && (isImageRequest || isVideoRequest)) {
        const tool = isImageRequest ? Tool.GENERATE : Tool.VIDEO_STUDIO;
        const toolName = isImageRequest ? 'Image Studio' : 'Video Studio';
        const redirectText = `It looks like you want to generate a ${isImageRequest ? 'image' : 'video'}. You can do that in our dedicated ${toolName}!`;
        
        const redirectTurn: ConversationTurn = { role: 'model', text: redirectText, isRedirect: true, redirectTool: tool };
        
        setConversation(prev => [...prev, newUserTurn, redirectTurn]);
        return;
    }

    const currentConversation = [...conversation, newUserTurn];
    setConversation(currentConversation);
    setIsLoading(true);

    const historyForAI: Content[] = currentConversation.map(turn => ({
      role: turn.role,
      parts: [{ text: turn.text }]
    }));

    try {
      const imagePayload = await Promise.all(
        files.map(async (file) => {
            const base64Data = await fileToBase64(file);
            return { base64Data, mimeType: file.type };
        })
      );

      const responseText = await generateChatResponse(historyForAI, imagePayload);
      
      const sourceDelimiter = '\n\n---\n**Sources**';
      let mainText = responseText;
      let sources: Source[] = [];

      if (responseText.includes(sourceDelimiter)) {
          const parts = responseText.split(sourceDelimiter);
          mainText = parts[0];
          const sourceText = parts[1];
          const sourceRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          let match;
          while ((match = sourceRegex.exec(sourceText)) !== null) {
              sources.push({ title: match[1], url: match[2] });
          }
      }

      const newModelTurn: ConversationTurn = { role: 'model', text: mainText, sources: sources.length > 0 ? sources : undefined };
      const finalConversation = [...currentConversation, newModelTurn];
      setConversation(finalConversation);

      if (currentProjectId) {
        onUpdateProject(currentProjectId, {
          conversation: finalConversation,
          name: prompt,
        });
      } else {
        const newProjectId = onAddProject({
          name: prompt.substring(0, 40) + (prompt.length > 40 ? '...' : ''),
          tool: Tool.CHAT_WITH_AI,
          conversation: finalConversation,
          files: [],
        });
        if (newProjectId) {
          setCurrentProjectId(newProjectId);
        }
      }
    } catch (e: any) {
      const errorTurn: ConversationTurn = { role: 'model', text: `Sorry, I encountered an error: ${e.message}` };
      setConversation(prev => [...prev, errorTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (promptIndex: number) => {
    const conversationForState = conversation.slice(0, promptIndex + 1);
    const historyForAI = conversationForState.map(turn => ({
        role: turn.role,
        parts: [{ text: turn.text }]
    }));

    setConversation(conversationForState);
    setIsLoading(true);

    try {
        const responseText = await generateChatResponse(historyForAI);
        const newModelTurn: ConversationTurn = { role: 'model', text: responseText };
        const finalConversation = [...conversationForState, newModelTurn];
        setConversation(finalConversation);

        if (currentProjectId) {
            onUpdateProject(currentProjectId, {
                conversation: finalConversation,
            });
        }
    } catch (e: any) {
        const errorTurn: ConversationTurn = { role: 'model', text: `Sorry, I encountered an error: ${e.message}` };
        setConversation(prev => [...prev, errorTurn]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
        setCopiedMessageIndex(index);
        setTimeout(() => setCopiedMessageIndex(null), 2000);
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <MenuButton onClick={() => setIsMobileMenuOpen(true)} />
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors hidden lg:block"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <h1 className="text-lg font-bold">AI Studio</h1>
        </div>
        <div className="flex items-center gap-2">
            {!customApiKey && (
              <button onClick={() => onOpenSettings('account')} className="flex items-center gap-2 text-sm font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/50 p-2 md:px-3 md:py-1.5">
                <KeyRound size={16} />
                <span className="hidden md:inline">Add API Key</span>
              </button>
            )}
            <ThemeToggleButton theme={theme} setTheme={setTheme} />
            <SearchButton onClick={onToggleCommandPalette} />
            <NotificationBell onClick={onToggleNotifications} notificationCount={unreadCount} />
        </div>
      </header>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400" style={{ minHeight: 'calc(100vh - 14rem)' }}>
              <div className="w-16 h-16 p-2 text-purple-500 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                <Sparkles size={48} />
              </div>
              <h2 className="text-2xl font-semibold text-zinc-800 dark:text-gray-300 mb-2">How can I help you today?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl mt-8">
                {examplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerate(p.prompt, [])}
                    className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 p-2 sm:p-3 rounded-lg text-left hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
                  >
                    <p className="font-semibold text-sm sm:text-base text-zinc-800 dark:text-gray-200">{p.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 hidden sm:line-clamp-2">{p.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 py-6">
              {conversation.map((turn, index) => (
                <div key={index}>
                    <div className={`flex gap-4 items-start ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {turn.role === 'model' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                        <Sparkles size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                    )}
                    <div className={`max-w-xl ${turn.role === 'user' ? 'order-first' : ''}`}>
                        <div className={`p-4 rounded-2xl ${
                            turn.role === 'user' 
                            ? 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm' 
                            : ''
                        }`}>
                            {turn.sentImages && turn.sentImages.length > 0 && (
                                <div className={`grid gap-2 grid-cols-2 mb-2`}>
                                    {turn.sentImages.map((image, idx) => (
                                        <img key={idx} src={image.url} alt={image.name} className="rounded-lg object-cover max-h-48" />
                                    ))}
                                </div>
                            )}
                            {turn.role === 'model' && index === conversation.length - 1 && isLoading ? (
                                <AIMessage text={turn.text} onStreamUpdate={() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })} />
                            ) : (
                                <div className="prose prose-zinc dark:prose-invert max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {turn.text}
                                    </ReactMarkdown>
                                </div>
                            )}
                             {turn.isRedirect && turn.redirectTool && (
                                <div className="mt-4">
                                    <button
                                        onClick={() => setActiveTool(turn.redirectTool!)}
                                        className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Go to {turn.redirectTool === Tool.GENERATE ? 'Image Studio' : 'Video Studio'}
                                    </button>
                                </div>
                            )}
                        </div>
                        {turn.sources && <SourceList sources={turn.sources} />}
                    </div>
                    {turn.role === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-700">
                        <User size={20} className="text-zinc-600 dark:text-gray-300" />
                        </div>
                    )}
                    </div>
                    {turn.role === 'model' && !isLoading && (
                        <div className="ml-12 mt-2 flex items-center gap-1">
                            <button onClick={() => handleCopy(turn.text, index)} title={copiedMessageIndex === index ? 'Copied!' : 'Copy response'} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                {copiedMessageIndex === index ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                            <button title="Good response" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                <ThumbsUp size={16} />
                            </button>
                            <button title="Bad response" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                <ThumbsDown size={16} />
                            </button>
                        </div>
                    )}
                    {turn.role === 'user' && index < conversation.length - 1 && conversation[index + 1].role === 'model' && !isLoading && (
                        <div className="mt-2 flex justify-end mr-12">
                            <button onClick={() => handleRegenerate(index)} title="Regenerate response" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                        <Sparkles size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="p-4 rounded-2xl">
                        <div className="generating-text-animation font-semibold">
                            Thinking...
                        </div>
                    </div>
                </div>
              )}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <PromptInput
            onGenerate={handleGenerate}
            isLoading={isLoading}
            placeholder="Ask me anything, or attach an image..."
            disableAttachments={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWithAi;