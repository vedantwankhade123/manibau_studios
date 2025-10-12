import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface PromptInputRef {
  setPromptText: (text: string) => void;
}

interface PromptInputProps {
  onGenerate: (prompt: string, files: File[], numberOfImages?: number) => void;
  isLoading?: boolean;
  disableAttachments?: boolean;
  placeholder?: string;
  singleLine?: boolean;
}

const MicIcon: React.FC<{ isListening: boolean }> = ({ isListening }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-6 w-6 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

const PaperclipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

// Add types for Web Speech API to fix TypeScript errors.
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface CustomSpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => CustomSpeechRecognition;
    webkitSpeechRecognition: new () => CustomSpeechRecognition;
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
}


const PromptInput = forwardRef<PromptInputRef, PromptInputProps>(
  ({ onGenerate, isLoading = false, disableAttachments = false, placeholder = "Describe an image...", singleLine = false }, ref) => {

    const [prompt, setPrompt] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isListening, setIsListening] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      setPromptText: (text: string) => {
        setPrompt(text);
      }
    }));

    useEffect(() => {
      const element = inputRef.current;
      // Guard against single line mode and ensure it's a textarea before adjusting height
      if (singleLine || !element || !(element instanceof HTMLTextAreaElement)) {
        return;
      }
      
      element.style.height = 'auto';
      const scrollHeight = element.scrollHeight;
      element.style.height = `${scrollHeight}px`;
    }, [prompt, singleLine]);

    const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isLoading) return;
      if (prompt.trim() || selectedFiles.length > 0) {
        onGenerate(prompt, selectedFiles, 1);
        setPrompt('');
        setSelectedFiles([]);
      }
    };

    const toggleListen = () => {
      if (!recognition) return;

      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
    };

    useEffect(() => {
      if (!recognition) return;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
        recognition.stop();
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...newFiles]);
      }
      if (e.target) e.target.value = '';
    };

    const handleRemoveFile = (indexToRemove: number) => {
      setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
    };

    return (
      <div className="flex flex-col items-center w-full">
        {selectedFiles.length > 0 && (
          <div className="w-full bg-zinc-100 dark:bg-zinc-900/50 p-2 mb-2 rounded-xl flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="relative group bg-zinc-200 dark:bg-zinc-800 p-1.5 rounded-lg flex items-center gap-2 text-sm">
                <img src={URL.createObjectURL(file)} alt={file.name} className="h-8 w-8 rounded object-cover" />
                <div className="flex flex-col text-xs max-w-[120px] truncate">
                  <span className="text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                  <span className="text-gray-500 dark:text-gray-500">{`${(file.size / 1024).toFixed(1)} KB`}</span>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="absolute -top-1 -right-1 text-gray-400 dark:text-gray-500 bg-zinc-100 dark:bg-zinc-900 rounded-full hover:text-black dark:hover:text-white transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <XCircleIcon />
                </button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full flex items-end gap-2 bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-2 shadow-lg dark:shadow-black/20">
          {!disableAttachments && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 group text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white flex-shrink-0 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:hover:text-gray-400 dark:disabled:hover:text-gray-600 disabled:cursor-not-allowed"
                aria-label="Attach files"
              >
                <PaperclipIcon />
              </button>
          )}
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {singleLine ? (
             <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow bg-transparent text-zinc-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none px-2 py-2"
                placeholder={placeholder}
             />
          ) : (
            <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                rows={1}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow bg-transparent text-zinc-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none px-2 py-2 max-h-56 custom-scrollbar"
                placeholder={placeholder}
            />
          )}
          <div className="flex-shrink-0 flex items-center gap-2">
            {recognition && (
              <button type="button" onClick={toggleListen} className="p-2 group" aria-label="Use microphone">
                <MicIcon isListening={isListening} />
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !(prompt.trim() || selectedFiles.length > 0)}
              className="bg-zinc-700 text-white rounded-full p-2.5 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed hover:bg-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 flex items-center justify-center min-w-[36px] h-[36px] gap-2 px-3"
              aria-label="Generate"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <SendIcon />
              )}
            </button>
          </div>
        </form>
      </div>
    );
  });

export default PromptInput;