import React, { useState, useRef, useEffect, useCallback } from 'react';
import { editImage } from '../services/geminiService';
import GeneratedImage from './GeneratedImage';
import ImagePlaceholder from './ImagePlaceholder';
import { Tool } from '../types';
import { Project } from './Dashboard';
import ImageEditorModal from './ImageEditorModal';
import { Theme } from '../App';
import ThemeToggleButton from './ThemeToggleButton';
import AspectRatioModal from './AspectRatioModal';
import { SettingsTab } from './SettingsModal';
import { KeyRound } from 'lucide-react';
import MenuButton from './MenuButton';

// --- Icon Components ---
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const SearchButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button onClick={onClick} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-black dark:hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </button>
);
const UndoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>);
const EraserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21H7Z"/>
        <path d="M22 21H7"/>
        <path d="m5 12 5 5"/>
    </svg>
);
const PencilIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);
const GenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);
const AiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);
const ChevronLeftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>);
const ChevronRightIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>);
const EditIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /> <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /> </svg> );
const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>);
const AspectRatioIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5" />
    </svg>
);

const ActionButton: React.FC<{ onClick?: () => void; children: React.ReactNode; href?: string; download?: string; disabled?: boolean; title?: string; }> = ({ children, ...props }) => {
  const commonClasses = "flex items-center justify-center w-8 h-8 bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:border-zinc-200 dark:disabled:border-zinc-800 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed text-zinc-700 dark:text-white rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black";
  if (props.href) {
    return <a {...props} className={commonClasses}>{children}</a>
  }
  return <button type="button" {...props} className={commonClasses}></button>
}

interface SketchGeneratorProps {
  setActiveTool: (tool: Tool) => void;
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

// Helper function to calculate canvas dimensions
const getCanvasDimensions = (aspect: string): { width: number; height: number } => {
    const baseSize = 440;
    const [w, h] = aspect.split(':').map(Number);
    if (w > h) {
        return { width: baseSize, height: Math.round((baseSize * h) / w) };
    } else {
        return { width: Math.round((baseSize * w) / h), height: baseSize };
    }
};

const aspectRatioClassMap: { [key: string]: string } = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-[16/9]',
  '3:4': 'aspect-[3/4]',
  '9:16': 'aspect-[9/16]',
};

const PromptModal: React.FC<{ isOpen: boolean; onClose: () => void; onGenerate: (prompt: string) => void; isLoading: boolean; }> = ({ isOpen, onClose, onGenerate, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    if (!isOpen) return null;

    const handleGenerate = () => {
        onGenerate(prompt);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-900 dark:to-black rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg shadow-2xl">
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold">Add a Prompt (Optional)</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" aria-label="Close">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Describe what you want the AI to create from your sketch. If you leave this blank, the AI will interpret the sketch on its own.</p>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A photorealistic painting of a cat wearing a wizard hat..."
                        className="w-full h-24 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-white rounded-lg p-2.5 focus:ring-gray-500 focus:border-gray-500 custom-scrollbar"
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg font-semibold disabled:opacity-50">Cancel</button>
                        <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-semibold disabled:opacity-50">
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SketchGenerator: React.FC<SketchGeneratorProps> = (props) => {
  const { setActiveTool, onToggleCommandPalette, onAddProject, onUpdateProject, loadedProject, onProjectLoaded, customApiKey, theme, setTheme, isSidebarCollapsed, setIsSidebarCollapsed, setIsMobileMenuOpen, onOpenSettings } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const history = useRef<ImageData[]>([]);
  const historyIndex = useRef(-1);

  const [viewMode, setViewMode] = useState<'canvas' | 'split'>('canvas');
  const [mobileView, setMobileView] = useState<'canvas' | 'result'>('canvas');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const userBrushSettings = useRef({ color: '#000000' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [lastPrompt, setLastPrompt] = useState('');
  const [editingImage, setEditingImage] = useState<{ url: string; prompt: string; index: number } | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isAspectRatioModalOpen, setIsAspectRatioModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Carousel state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [animatingFromIndex, setAnimatingFromIndex] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const touchMoveX = useRef(0);
  const isSwiping = useRef(false);

  useEffect(() => {
    if (loadedProject && loadedProject.tool === Tool.SKETCH_STUDIO) {
      const images = loadedProject.files?.map((f: any) => f.url) || [];
      setGeneratedImages(images);
      setLastPrompt(loadedProject.name);
      setCurrentProjectId(loadedProject.id);
      if (images.length > 0) {
        setViewMode('split');
        if (window.innerWidth < 768) {
            setMobileView('result');
        }
      }
      onProjectLoaded();
    }
  }, [loadedProject, onProjectLoaded]);

  const getCanvasContext = () => canvasRef.current?.getContext('2d');
  
  const saveToHistory = () => {
    const ctx = getCanvasContext();
    if (!ctx || !canvasRef.current) return;
    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    history.current = history.current.slice(0, historyIndex.current + 1);
    history.current.push(imageData);
    historyIndex.current = history.current.length - 1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = getCanvasDimensions(aspectRatio);
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Reset drawing history
    history.current = [];
    historyIndex.current = -1;
    saveToHistory();
  }, [aspectRatio]);

  const getCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): { x: number, y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    const eventCoord = 'touches' in e ? e.touches[0] : e;
    if (!eventCoord) return null;

    return {
        x: eventCoord.clientX - rect.left,
        y: eventCoord.clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoords(e);
    if (!coords) return;

    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    isDrawing.current = true;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const coords = getCoords(e);
    if (!coords) return;

    const ctx = getCanvasContext();
    if (!ctx) return;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    saveToHistory();
  };

  const clearCanvas = () => {
    const ctx = getCanvasContext();
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveToHistory();
  };

  const undo = () => {
    if (historyIndex.current > 0) {
      historyIndex.current--;
      const ctx = getCanvasContext();
      if (!ctx || !history.current[historyIndex.current]) return;
      ctx.putImageData(history.current[historyIndex.current], 0, 0);
    }
  };

  const handleModeChange = (newMode: 'draw' | 'erase') => {
    if (newMode === mode) return;
    if (newMode === 'erase') {
        userBrushSettings.current.color = brushColor;
        setBrushColor('#FFFFFF');
    } else {
        setBrushColor(userBrushSettings.current.color);
    }
    setMode(newMode);
  };
  
  const handleGenerate = async (promptText: string) => {
    if (!canvasRef.current) return;

    if (!customApiKey) {
      onOpenSettings('account');
      return;
    }

    setViewMode('split');
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setActiveImageIndex(0);
    if (window.innerWidth < 768) {
        setMobileView('result');
    }

    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.split(',')[1];

      const finalPrompt = promptText && promptText.trim().length > 0 ? promptText : 'Enhance and render this sketch into a polished, high-quality image while preserving the composition and intent of the drawing.';
      const urls = await editImage([{ base64Data, mimeType: 'image/png' }], finalPrompt);

      if (urls.length > 0) {
        setGeneratedImages(urls);
        setLastPrompt(promptText);
        
        const projectFiles = urls.map(url => ({ url }));

        if (currentProjectId) {
          onUpdateProject(currentProjectId, {
            name: promptText || 'Sketch Generation',
            files: projectFiles,
          });
        } else {
          const newProjectId = onAddProject({
            name: promptText || 'Sketch Generation',
            tool: Tool.SKETCH_STUDIO,
            files: projectFiles,
          });
          if (newProjectId) {
            setCurrentProjectId(newProjectId);
          }
        }
      } else {
        throw new Error('AI failed to generate an image from the sketch.');
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = (newImageUrl: string, newPrompt: string) => {
    if (editingImage === null) return;
    setGeneratedImages(prev => {
        const newImages = [...prev];
        newImages[editingImage.index] = newImageUrl;
        return newImages;
    });
    setLastPrompt(newPrompt);
    setEditingImage(null);
  };
  
    useEffect(() => {
        if (animatingFromIndex !== null) {
            const timer = setTimeout(() => {
                setAnimatingFromIndex(null);
            }, 500); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [animatingFromIndex]);
  
  const goToPrevImage = () => {
    setActiveImageIndex(prev => (prev === 0 ? generatedImages.length - 1 : prev - 1));
  };
  const goToNextImage = () => {
    setActiveImageIndex(prev => (prev === generatedImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (!isSwiping.current) return;
      touchMoveX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
      if (!isSwiping.current) return;
      isSwiping.current = false;
      const diff = touchMoveX.current - touchStartX.current;
      
      if (Math.abs(diff) > 50) { // Swipe threshold
          if (diff < 0) {
              goToNextImage();
          } else {
              goToPrevImage();
          }
      }
  };

  const aspectRatioClass = aspectRatioClassMap[aspectRatio] || 'aspect-square';
  const canvasDimensions = getCanvasDimensions(aspectRatio);

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
              {isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
          <h1 className="text-lg font-bold">Sketch Studio</h1>
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
        </div>
      </header>
      <div className="flex-grow flex flex-col md:flex-row min-h-0 relative">
        {/* Canvas Panel */}
        <div className={`p-4 flex flex-col items-center justify-start h-full overflow-y-auto custom-scrollbar transition-all duration-500 ease-in-out ${viewMode === 'canvas' ? 'w-full' : 'md:w-1/2'} ${viewMode === 'split' && mobileView === 'result' ? 'hidden md:flex' : 'flex'}`}>
            <div className="w-full max-w-[440px] mb-4 flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-2 py-1 bg-gradient-to-br from-zinc-100 to-white dark:from-zinc-800 dark:to-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center gap-1">
                        <button onClick={() => handleModeChange('draw')} title="Brush" className={`p-1.5 rounded-full transition-colors ${mode === 'draw' ? 'bg-zinc-300 dark:bg-zinc-700' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}><PencilIcon/></button>
                        <button onClick={() => handleModeChange('erase')} title="Eraser" className={`p-1.5 rounded-full transition-colors ${mode === 'erase' ? 'bg-zinc-300 dark:bg-zinc-700' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}><EraserIcon/></button>
                    </div>
                    <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <input type="color" value={brushColor} onChange={e => setBrushColor(e.target.value)} disabled={mode === 'erase'} className="w-6 h-6 p-0 border-none rounded-full bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" title="Brush color"/>
                        <div className="relative flex items-center justify-center w-6 h-6">
                            <div className="bg-zinc-400 dark:bg-zinc-600 rounded-full transition-all" style={{ width: brushSize / 2, height: brushSize / 2 }}></div>
                        </div>
                        <input type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} className="w-16 sm:w-24" title="Brush size" />
                    </div>
                    <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 hidden sm:block"></div>
                    <div className="flex items-center gap-1">
                        <button onClick={undo} title="Undo" className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"><UndoIcon/></button>
                        <button onClick={clearCanvas} title="Clear Canvas" className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"><TrashIcon/></button>
                    </div>
                    <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 hidden sm:block"></div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setIsPromptModalOpen(true)} title="Add AI Prompt" className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"><AiIcon/></button>
                        <button onClick={() => setIsAspectRatioModalOpen(true)} title="Aspect Ratio" className="p-1.5 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"><AspectRatioIcon/></button>
                    </div>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                style={{ touchAction: 'none' }}
                className={`bg-white rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 cursor-crosshair w-full max-w-[440px] ${aspectRatioClass}`}
            />
            <div className="w-full max-w-[440px] mt-4 flex flex-col items-center">
                <button 
                    onClick={() => handleGenerate('')} 
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-zinc-800 to-black text-white rounded-full p-2.5 px-4 hover:from-zinc-700 hover:to-zinc-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-zinc-500 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <span className="generating-text-animation font-semibold">Generating...</span>
                    ) : (
                        <>
                            <GenerateIcon />
                            <span className="text-sm font-semibold whitespace-nowrap">
                                Generate from Sketch
                            </span>
                        </>
                    )}
                </button>
            </div>
        </div>
        
        {/* Output Panel */}
        {viewMode === 'split' && (
            <div className={`w-full md:w-1/2 h-full bg-zinc-100 dark:bg-zinc-900/50 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 rounded-lg md:rounded-l-lg md:rounded-r-none ${mobileView === 'canvas' ? 'hidden md:flex' : 'flex'}`}>
                <div className="flex-grow p-6 flex flex-col items-center justify-center h-full overflow-y-auto custom-scrollbar">
                    {isLoading && generatedImages.length === 0 && (
                        <div className={`relative w-full max-w-[440px] ${aspectRatioClass} bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden flex items-center justify-center`}>
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-300/50 dark:via-gray-700/50 to-transparent"></div>
                            <div className="relative text-2xl font-bold generating-text-animation">Generating...</div>
                        </div>
                    )}
                    {error && <p className="text-red-500 dark:text-red-400 text-center p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">{error}</p>}
                    
                    {generatedImages.length > 0 && (
                        <div className="w-full max-w-[440px] flex flex-col items-center">
                            <div 
                                className={`relative w-full ${aspectRatioClass} overflow-hidden rounded-xl`}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {generatedImages.map((url, index) => {
                                    const offset = index - activeImageIndex;
                                    const isAnimatingOut = animatingFromIndex === index;
                                    
                                    return (
                                        <div
                                            key={url.startsWith('loading-') ? url : `${url}-${index}`}
                                            className="absolute inset-0 w-full h-full"
                                            style={{
                                                transform: `translateX(${offset * 100}%)`,
                                                opacity: isAnimatingOut ? 0 : 1,
                                                transition: 'transform 500ms ease-in-out, opacity 300ms ease-in-out'
                                            }}
                                        >
                                            <div className="w-full h-full bg-black dark:bg-zinc-900 rounded-xl">
                                                {url.startsWith('loading-') ? (
                                                    <ImagePlaceholder aspectRatio={aspectRatio} />
                                                ) : (
                                                    <GeneratedImage
                                                        src={url}
                                                        alt={lastPrompt}
                                                        onEdit={() => {}}
                                                        onGenerateVariations={() => {}}
                                                        showActions={false}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="w-full mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ActionButton 
                                        onClick={() => setEditingImage({ url: generatedImages[activeImageIndex], prompt: lastPrompt, index: activeImageIndex })} 
                                        title="Edit Image"
                                    >
                                        <EditIcon />
                                    </ActionButton>
                                    <ActionButton 
                                        href={generatedImages[activeImageIndex]} 
                                        download={`${lastPrompt.substring(0, 20)}.png`}
                                        title="Download Image"
                                    >
                                        <DownloadIcon />
                                    </ActionButton>
                                </div>
                                
                                {generatedImages.length > 1 && (
                                    <div className="flex items-center gap-4">
                                        <button onClick={goToPrevImage} className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"><ChevronLeftIcon/></button>
                                        <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{activeImageIndex + 1} / {generatedImages.length}</span>
                                        <button onClick={goToNextImage} className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"><ChevronRightIcon/></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}
        {viewMode === 'split' && (
            <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20 bg-zinc-800/80 backdrop-blur-sm text-white p-1 rounded-full flex items-center gap-1 shadow-lg">
                <button onClick={() => setMobileView('canvas')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${mobileView === 'canvas' ? 'bg-zinc-700' : ''}`}>Canvas</button>
                <button onClick={() => setMobileView('result')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${mobileView === 'result' ? 'bg-zinc-700' : ''}`}>Result</button>
            </div>
        )}
      </div>
        {editingImage && (
            <ImageEditorModal
            imageUrl={editingImage.url}
            originalPrompt={editingImage.prompt}
            onClose={() => setEditingImage(null)}
            onSaveChanges={handleSaveChanges}
            />
        )}
        <AspectRatioModal
            isOpen={isAspectRatioModalOpen}
            onClose={() => setIsAspectRatioModalOpen(false)}
            currentAspectRatio={aspectRatio}
            onSelectAspectRatio={setAspectRatio}
        />
        <PromptModal
            isOpen={isPromptModalOpen}
            onClose={() => setIsPromptModalOpen(false)}
            onGenerate={(promptText) => handleGenerate(promptText)}
            isLoading={isLoading}
        />
    </div>
  );
};

export default SketchGenerator;