import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Layer, Tool } from '../../types/image-editor';

interface CanvasProps {
  layers: Layer[];
  selectedLayer: string | null;
  selectedTool: Tool;
  zoom: number;
}

export interface CanvasRef {
  getContext: () => CanvasRenderingContext2D | null;
  getCanvas: () => HTMLCanvasElement | null;
}

export const Canvas = forwardRef<CanvasRef, CanvasProps>(function Canvas(
  { layers, selectedLayer, selectedTool, zoom },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getContext: () => canvasRef.current?.getContext('2d') ?? null,
    getCanvas: () => canvasRef.current
  }));

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial size
    canvas.width = 1920;
    canvas.height = 1080;

    // Initial clear with checkerboard pattern for transparency
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create checkerboard pattern
      const patternCanvas = document.createElement('canvas');
      const patternCtx = patternCanvas.getContext('2d');
      if (patternCtx) {
        patternCanvas.width = 16;
        patternCanvas.height = 16;
        patternCtx.fillStyle = '#fff';
        patternCtx.fillRect(0, 0, 8, 8);
        patternCtx.fillRect(8, 8, 8, 8);
        patternCtx.fillStyle = '#eee';
        patternCtx.fillRect(0, 8, 8, 8);
        patternCtx.fillRect(8, 0, 8, 8);
        
        const pattern = ctx.createPattern(patternCanvas, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }, []);

  // Render layers
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas with checkerboard pattern
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    if (patternCtx) {
      patternCanvas.width = 16;
      patternCanvas.height = 16;
      patternCtx.fillStyle = '#fff';
      patternCtx.fillRect(0, 0, 8, 8);
      patternCtx.fillRect(8, 8, 8, 8);
      patternCtx.fillStyle = '#eee';
      patternCtx.fillRect(0, 8, 8, 8);
      patternCtx.fillRect(8, 0, 8, 8);
      
      const pattern = ctx.createPattern(patternCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Apply zoom
    const scale = zoom / 100;
    ctx.save();
    ctx.scale(scale, scale);

    // Render visible layers from bottom to top
    layers
      .filter(layer => layer.visible)
      .forEach(layer => {
        ctx.save();
        
        // Apply layer opacity
        ctx.globalAlpha = layer.opacity / 100;
        
        // Apply blend mode
        ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;

        // Draw the layer
        if (layer.imageData) {
          try {
            // Calculate centered position
            const x = (canvas.width / scale - layer.imageData.width) / 2;
            const y = (canvas.height / scale - layer.imageData.height) / 2;
            ctx.drawImage(layer.imageData, x, y);
          } catch (error) {
            console.error('Error drawing layer:', error);
          }
        } else if (layer.isBackground) {
          // Fill background with white
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.restore();
      });

    ctx.restore();
  }, [layers, zoom]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center bg-[#242424] overflow-auto"
    >
      <div 
        className="relative shadow-lg"
        style={{ 
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center',
          width: '1920px',
          height: '1080px'
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            cursor: getCursorForTool(selectedTool)
          }}
        />
      </div>
    </div>
  );
});

function getCursorForTool(tool: Tool): string {
  switch (tool) {
    case 'move':
      return 'move';
    case 'marquee':
      return 'crosshair';
    case 'lasso':
      return 'crosshair';
    case 'magic-wand':
      return 'crosshair';
    case 'crop':
      return 'crosshair';
    case 'eyedropper':
      return 'crosshair';
    case 'brush':
      return 'crosshair';
    case 'eraser':
      return 'crosshair';
    case 'text':
      return 'text';
    case 'shape':
      return 'crosshair';
    case 'stamp':
      return 'copy';
    case 'hand':
      return 'grab';
    case 'zoom':
      return 'zoom-in';
    default:
      return 'default';
  }
}