import React, { useState, useRef, useEffect, useCallback } from 'react';
import PromptInput from './PromptInput';
import { editImage } from '../services/geminiService';

// --- Icon Components ---
const BackgroundIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.586a2.25 2.25 0 01-2.095-2.023A2.25 2.25 0 0016.75 12c0-1.01.623-1.855 1.481-2.152A2.25 2.25 0 0121 8.414v7.172zM2.25 12a2.25 2.25 0 002.25-2.25 2.25 2.25 0 012.096-2.023A2.25 2.25 0 007.25 6c-1.01 0-1.855.623-2.152 1.481A2.25 2.25 0 003 9.75v4.5a2.25 2.25 0 002.25 2.25 2.25 2.25 0 012.023 2.096A2.25 2.25 0 009.75 21c1.01 0 1.855-.623 2.152-1.481A2.25 2.25 0 0014.25 18v-4.5a2.25 2.25 0 00-2.25-2.25 2.25 2.25 0 01-2.023-2.096A2.25 2.25 0 007.5 7c-1.01 0-1.855.623-2.152 1.481A2.25 2.25 0 003 10.75V12z" />
    <path strokeLinecap="round" d="M12 21v-2.25m0-11.5V3" />
  </svg>
);
const ExpandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
  </svg>
);
const CropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M9 12l-3.75 3.75M9 12l3.75 3.75M9 12l-3.75-3.75M9 12l3.75-3.75" />
  </svg>
);
const StyleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Helper Types & Functions ---
type ActiveTool = 'crop' | null;
type Filter = 'none' | 'sepia(100%)' | 'grayscale(100%)' | 'saturate(2) brightness(80%) contrast(120%)' | 'none'; // 'Mint' is custom

interface ImageEditorModalProps {
  imageUrl: string;
  originalPrompt: string;
  onClose: () => void;
  onSaveChanges: (newImageUrl: string, newPrompt: string) => void;
}

const dataUrlToParts = (dataUrl: string): { base64Data: string; mimeType: string } | null => {
  const parts = dataUrl.split(',');
  if (parts.length !== 2) return null;
  const header = parts[0];
  const base64Data = parts[1];
  const mimeTypeMatch = header.match(/:(.*?);/);
  if (!mimeTypeMatch || !mimeTypeMatch[1]) return null;
  return { base64Data, mimeType: mimeTypeMatch[1] };
}

// --- Main Component ---
const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ imageUrl, originalPrompt, onClose, onSaveChanges }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null); // For crop overlay

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState(`Edited: ${originalPrompt}`);

  // Canvas state
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [filter, setFilter] = useState<Filter>('none');

  // Tool state
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);

  // Crop tool state
  const [cropRect, setCropRect] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const isDraggingCrop = useRef(false);
  const dragStartCoords = useRef<{ x: number, y: number } | null>(null);

  // Load initial image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => setImage(img);
  }, [imageUrl]);

  // --- Canvas Drawing ---
  const drawCropOverlay = useCallback(() => {
    if (!maskCanvasRef.current) return;
    const overlayCanvas = maskCanvasRef.current;
    const ctx = overlayCanvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (activeTool === 'crop' && cropRect) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      ctx.clearRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.strokeRect(cropRect.x, cropRect.y, cropRect.width, cropRect.height);
    }
  }, [activeTool, cropRect]);

  const redrawCanvas = useCallback(() => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const { naturalWidth: iw, naturalHeight: ih } = image;
    const angle = rotation * Math.PI / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const newWidth = Math.abs(iw * cos) + Math.abs(ih * sin);
    const newHeight = Math.abs(iw * sin) + Math.abs(ih * cos);

    canvas.width = newWidth;
    canvas.height = newHeight;

    if (maskCanvasRef.current) {
      maskCanvasRef.current.width = newWidth;
      maskCanvasRef.current.height = newHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.scale(scale.x, scale.y);
    ctx.filter = filter;

    ctx.drawImage(image, -iw / 2, -ih / 2);
    ctx.restore();

    // After drawing the main image, draw the crop overlay on top if needed
    drawCropOverlay();
  }, [image, rotation, scale, filter, drawCropOverlay]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // --- API & State Logic ---
  const handleAIPrompt = async (prompt: string, images: { base64Data: string; mimeType: string }[], isTool: boolean = false) => {
    setIsLoading(true);
    setError(null);
    setActiveTool(null);

    try {
      const resultDataUrls = await editImage(images, prompt);
      if (resultDataUrls.length === 0) {
        throw new Error("AI failed to generate an image.");
      }
      const newImg = new Image();
      newImg.crossOrigin = 'anonymous';
      newImg.src = resultDataUrls[0];
      newImg.onload = () => {
        setRotation(0);
        setScale({ x: 1, y: 1 });
        setFilter('none');
        setImage(newImg);
        setLastPrompt(isTool ? `Applied tool: ${prompt}` : prompt);
      };
    } catch (e: any) {
      setError(e.message || "Failed to edit image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToolClick = (toolName: string, toolPrompt: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageParts = dataUrlToParts(canvas.toDataURL('image/png'));
    if (!imageParts) {
      setError("Invalid image format.");
      return;
    }
    handleAIPrompt(toolPrompt, [imageParts], true);
  };

  const handlePromptSubmit = (prompt: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageParts = dataUrlToParts(canvas.toDataURL('image/png'));
    if (!imageParts) {
      setError("Invalid image format.");
      return;
    }
    handleAIPrompt(prompt, [imageParts]);
  };

  const handleSaveChanges = () => {
    if (!canvasRef.current) return;
    const finalImage = canvasRef.current.toDataURL('image/png');
    onSaveChanges(finalImage, lastPrompt);
  };

  // --- Mouse Handlers for Tools ---
  const getCoords = (e: React.MouseEvent): { x: number; y: number } | null => {
    if (!maskCanvasRef.current) return null;
    const canvas = maskCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCoords(e);
    if (!coords) return;

    if (activeTool === 'crop') {
      isDraggingCrop.current = true;
      dragStartCoords.current = coords;
      setCropRect({ ...coords, width: 0, height: 0 });
    }
  };

  const handleMouseUp = () => {
    isDraggingCrop.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCoords(e);
    if (!coords) return;

    if (activeTool === 'crop' && isDraggingCrop.current && dragStartCoords.current) {
      const startX = dragStartCoords.current.x;
      const startY = dragStartCoords.current.y;
      const width = coords.x - startX;
      const height = coords.y - startY;

      setCropRect({
        x: width > 0 ? startX : coords.x,
        y: height > 0 ? startY : coords.y,
        width: Math.abs(width),
        height: Math.abs(height)
      });
    }
  };

  // --- Tool-Specific Actions ---
  const handleApplyCrop = () => {
    if (!canvasRef.current || !cropRect || cropRect.width < 1 || cropRect.height < 1) return;

    const sourceCanvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropRect.width;
    tempCanvas.height = cropRect.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(sourceCanvas, cropRect.x, cropRect.y, cropRect.width, cropRect.height, 0, 0, cropRect.width, cropRect.height);

    const croppedDataUrl = tempCanvas.toDataURL('image/png');
    const newImg = new Image();
    newImg.crossOrigin = 'anonymous';
    newImg.src = croppedDataUrl;
    newImg.onload = () => {
      setImage(newImg); // This triggers redrawCanvas
      setLastPrompt(`Applied tool: Crop`);
      setActiveTool(null);
      setCropRect(null);
    };
  };

  // --- UI Definitions ---
  const adjustmentTools = [
    { name: 'Rotate Left', onClick: () => setRotation(r => (r - 90)) },
    { name: 'Rotate Right', onClick: () => setRotation(r => (r + 90)) },
    { name: 'Flip H', onClick: () => setScale(s => ({ ...s, x: s.x * -1 })) },
    { name: 'Flip V', onClick: () => setScale(s => ({ ...s, y: s.y * -1 })) },
  ];
  const filters = [
    { name: 'None', value: 'none' as Filter },
    { name: 'Mint', value: 'saturate(2) brightness(80%) contrast(120%)' as Filter },
    { name: 'Noir', value: 'grayscale(100%)' as Filter },
    { name: 'Sepia', value: 'sepia(100%)' as Filter },
  ];
  const aiTools = [
    { name: 'Remove BG', prompt: 'remove the background, make it a transparent png', icon: <BackgroundIcon /> },
    { name: 'Expand', prompt: 'expand the image canvas by 25% and fill in the new areas contextually (outpainting)', icon: <ExpandIcon /> },
    { name: 'Photorealistic', prompt: 'make this image highly photorealistic, like a high-resolution DSLR photograph', icon: <StyleIcon /> },
    { name: 'Crop', icon: <CropIcon />, onClick: () => setActiveTool(prev => prev === 'crop' ? null : 'crop') },
  ];
  const getCanvasCursor = () => {
    if (isLoading) return 'cursor-wait';
    switch (activeTool) {
      case 'crop':
        return 'cursor-crosshair';
      default:
        return 'cursor-default';
    }
  };

  // Reset tool states when active tool changes
  useEffect(() => {
    if (activeTool !== 'crop') setCropRect(null);
  }, [activeTool]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-4" aria-modal="true" role="dialog">
      <div className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-zinc-800 w-full h-full flex flex-col lg:flex-row overflow-hidden shadow-2xl">
        <div className="flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-8 relative overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 rounded-lg">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400"></div>
            </div>
          )}
          <canvas ref={canvasRef} className="absolute max-w-full max-h-full object-contain rounded-lg shadow-lg z-10" />
          <canvas
            ref={maskCanvasRef}
            className={`absolute max-w-full max-h-full object-contain rounded-lg z-20 ${getCanvasCursor()}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
          />
        </div>

        <div className="w-full lg:w-96 bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col">
          <div className="flex-shrink-0 p-2 sm:p-4 flex justify-between items-center border-b border-zinc-800">
            <h2 className="text-xl font-bold">Image Editor</h2>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-zinc-700 transition-colors" aria-label="Close editor">
              <CloseIcon />
            </button>
          </div>

          <div className="flex-grow p-2 sm:p-4 overflow-y-auto custom-scrollbar">
            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Adjustments</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
              {adjustmentTools.map(tool => (<button key={tool.name} onClick={tool.onClick} disabled={isLoading} className="flex flex-col items-center justify-center gap-1 bg-zinc-800/50 border border-zinc-700 py-1 rounded-lg text-xs font-medium text-gray-300 hover:border-zinc-600 hover:text-white transition-colors disabled:opacity-50"> {tool.name} </button>))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {filters.map(f => (<button key={f.name} onClick={() => setFilter(f.value)} disabled={isLoading} className={`flex items-center justify-center text-xs font-medium py-1 rounded-lg border transition-colors disabled:opacity-50 ${filter === f.value ? 'bg-zinc-700 border-zinc-600 text-white' : 'bg-zinc-800/50 border-zinc-700 text-gray-300 hover:border-zinc-600'}`}> {f.name} </button>))}
            </div>

            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">AI Magic Tools</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {aiTools.map(tool => (
                <button key={tool.name} onClick={() => tool.onClick ? tool.onClick() : tool.prompt && handleToolClick(tool.name, tool.prompt)} disabled={isLoading} className={`relative flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-zinc-800 to-zinc-900 border p-1.5 rounded-lg text-center text-xs font-medium text-gray-300 hover:border-zinc-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${(activeTool === 'crop' && tool.name === 'Crop') ? 'border-gray-500' : 'border-zinc-700'}`}>
                  {tool.icon}
                  <span>{tool.name}</span>
                  {tool.prompt && (
                    <span className="absolute top-1 right-1 text-[8px] bg-purple-500 text-white font-bold px-1 rounded-full">AI</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tool Actions */}
            {activeTool === 'crop' && (
              <div className="flex gap-2 mb-4">
                <button onClick={handleApplyCrop} disabled={isLoading || !cropRect || cropRect.width < 1} className="w-full bg-white text-black font-bold py-1.5 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:bg-zinc-600 disabled:text-gray-400">Apply Crop</button>
                <button onClick={() => setActiveTool(null)} disabled={isLoading} className="w-full bg-zinc-700 text-white font-bold py-1.5 px-4 rounded-lg hover:bg-zinc-600 disabled:opacity-50">Cancel</button>
              </div>
            )}


            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Custom Prompt</h3>
            <PromptInput onGenerate={handlePromptSubmit} isLoading={isLoading} disableAttachments={true} placeholder="e.g., Change shirt to blue..." singleLine={true} />

            {error && <p className="text-red-400 mt-4 bg-red-900/20 p-3 rounded-lg text-center">{error}</p>}
          </div>

          <div className="flex-shrink-0 p-2 sm:p-4 border-t border-zinc-800 flex gap-3">
            <button onClick={onClose} disabled={isLoading} className="w-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 text-white font-bold py-2 px-4 rounded-lg hover:border-zinc-600 disabled:opacity-50">
              Discard
            </button>
            <button onClick={handleSaveChanges} disabled={isLoading} className="w-full bg-white text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:bg-zinc-600 disabled:text-gray-400">
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;