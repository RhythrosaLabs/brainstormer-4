import React, { useState, useRef, useEffect } from 'react';
import { 
  Pen, 
  Square, 
  Circle, 
  Type, 
  Image as ImageIcon,
  Eraser,
  Hand,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  Save,
  Download,
  Wand2,
  Plus,
  Minus,
  Settings
} from 'lucide-react';
import { generateOpenAIImage } from '../services/openai';

type Tool = 'pen' | 'rectangle' | 'circle' | 'text' | 'image' | 'eraser' | 'hand' | 'select';
type Shape = 'rectangle' | 'circle';

interface WhiteboardObject {
  id: string;
  type: 'path' | 'shape' | 'text' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: { x: number; y: number }[];
  text?: string;
  imageUrl?: string;
  color: string;
  strokeWidth: number;
}

interface WhiteboardProps {
  apiKeys: Record<string, string>;
}

export function Whiteboard({ apiKeys }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#ffffff');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [objects, setObjects] = useState<WhiteboardObject[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setIsDrawing(true);

    if (tool === 'pen') {
      setCurrentPath([{ x, y }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    if (tool === 'pen') {
      setCurrentPath(prev => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    if (tool === 'pen' && currentPath.length > 0) {
      const newObject: WhiteboardObject = {
        id: `path-${Date.now()}`,
        type: 'path',
        points: currentPath,
        color,
        strokeWidth,
        x: 0,
        y: 0
      };
      setObjects(prev => [...prev, newObject]);
      setCurrentPath([]);
    }

    setIsDrawing(false);
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const result = await generateOpenAIImage({
        model: 'dall-e-3',
        prompt: prompt.trim(),
        size: '1024x1024'
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate image');
      }

      const imageUrl = URL.createObjectURL(result.data);
      const newObject: WhiteboardObject = {
        id: `image-${Date.now()}`,
        type: 'image',
        x: 100,
        y: 100,
        width: 300,
        height: 300,
        imageUrl,
        color: 'transparent',
        strokeWidth: 0
      };

      setObjects(prev => [...prev, newObject]);
      setPrompt('');
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom
    ctx.save();
    ctx.scale(zoom, zoom);

    // Draw all objects
    objects.forEach(obj => {
      ctx.strokeStyle = obj.color;
      ctx.lineWidth = obj.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (obj.type === 'path' && obj.points) {
        ctx.beginPath();
        obj.points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (obj.type === 'image' && obj.imageUrl) {
        const img = new Image();
        img.src = obj.imageUrl;
        img.onload = () => {
          ctx.drawImage(img, obj.x, obj.y, obj.width || 300, obj.height || 300);
        };
      }
    });

    // Draw current path
    if (currentPath.length > 0) {
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.beginPath();
      currentPath.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }

    ctx.restore();
  }, [objects, currentPath, zoom, color, strokeWidth]);

  return (
    <div className="flex-1 flex bg-[#1a1a1a]">
      {/* Tools Panel */}
      <div className="w-16 bg-[#2a2a2a] border-r border-[#333] flex flex-col items-center py-2">
        {[
          { id: 'pen' as Tool, icon: Pen, label: 'Pen' },
          { id: 'rectangle' as Tool, icon: Square, label: 'Rectangle' },
          { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
          { id: 'text' as Tool, icon: Type, label: 'Text' },
          { id: 'image' as Tool, icon: ImageIcon, label: 'Image' },
          { id: 'eraser' as Tool, icon: Eraser, label: 'Eraser' },
          { id: 'hand' as Tool, icon: Hand, label: 'Hand' },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            className={`w-10 h-10 mb-1 flex items-center justify-center rounded ${
              tool === id 
                ? 'bg-[#454545] text-white' 
                : 'text-gray-400 hover:bg-[#353535] hover:text-white'
            }`}
            title={label}
          >
            <Icon size={20} />
          </button>
        ))}

        <div className="w-px h-4 bg-[#333] my-2" />

        <button
          onClick={() => setShowAIPanel(!showAIPanel)}
          className={`w-10 h-10 mb-1 flex items-center justify-center rounded ${
            showAIPanel ? 'bg-[#454545] text-white' : 'text-gray-400 hover:bg-[#353535] hover:text-white'
          }`}
          title="AI Assistant"
        >
          <Wand2 size={20} />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className="w-full h-full bg-[#242424]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Toolbar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-[#2a2a2a] rounded-lg p-2">
          <button
            onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))}
            className="p-1.5 hover:bg-[#353535] rounded"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(prev => Math.min(5, prev + 0.1))}
            className="p-1.5 hover:bg-[#353535] rounded"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>

          <div className="w-px h-4 bg-[#333] mx-2" />

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-24"
          />

          <div className="w-px h-4 bg-[#333] mx-2" />

          <button className="p-1.5 hover:bg-[#353535] rounded" title="Undo">
            <Undo size={16} />
          </button>
          <button className="p-1.5 hover:bg-[#353535] rounded" title="Redo">
            <Redo size={16} />
          </button>

          <div className="w-px h-4 bg-[#333] mx-2" />

          <button className="p-1.5 hover:bg-[#353535] rounded" title="Save">
            <Save size={16} />
          </button>
          <button className="p-1.5 hover:bg-[#353535] rounded" title="Export">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* AI Panel */}
      {showAIPanel && (
        <div className="w-80 bg-[#2a2a2a] border-l border-[#333] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 size={16} className="text-gray-400" />
            <h3 className="text-sm font-medium">AI Assistant</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Generate Image</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to add..."
                className="w-full h-24 bg-[#333] rounded p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#45caff]"
              />
              <button
                onClick={handleGenerateImage}
                disabled={isGenerating || !prompt.trim()}
                className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] rounded disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>

            <div className="w-full h-px bg-[#333]" />

            <div>
              <label className="block text-xs text-gray-400 mb-2">Smart Tools</label>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-[#333] hover:bg-[#404040] rounded text-sm text-center">
                  Auto-Arrange
                </button>
                <button className="px-3 py-2 bg-[#333] hover:bg-[#404040] rounded text-sm text-center">
                  Smart Select
                </button>
                <button className="px-3 py-2 bg-[#333] hover:bg-[#404040] rounded text-sm text-center">
                  Extract Text
                </button>
                <button className="px-3 py-2 bg-[#333] hover:bg-[#404040] rounded text-sm text-center">
                  Enhance Image
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-[#333]" />

            <div>
              <label className="block text-xs text-gray-400 mb-2">Settings</label>
              <button className="w-full flex items-center justify-between px-3 py-2 bg-[#333] hover:bg-[#404040] rounded text-sm">
                <span>Advanced Options</span>
                <Settings size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}