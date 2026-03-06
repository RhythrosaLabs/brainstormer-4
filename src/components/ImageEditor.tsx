import React, { useState, useRef } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { generateDalleImage } from '../lib/api';
import { storage } from '../utils/storage';
import { generateId } from '../utils/helpers';
import { Layers } from './image-editor/Layers';
import { ToolsPanel } from './image-editor/ToolsPanel';
import { AdjustmentsPanel } from './image-editor/AdjustmentsPanel';
import { Canvas } from './image-editor/Canvas';
import { PropertiesPanel } from './image-editor/PropertiesPanel';
import { Layer, Tool } from '../types/image-editor';
import { Wand2, Settings, AlertCircle } from 'lucide-react';

export function ImageEditor() {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'background',
      name: 'Background',
      visible: true,
      opacity: 100,
      blendMode: 'normal',
      locked: true,
      type: 'image',
      isBackground: true
    }
  ]);
  const [selectedLayer, setSelectedLayer] = useState<string>('background');
  const [selectedTool, setSelectedTool] = useState<Tool>('move');
  const [zoom, setZoom] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<'dall-e-3' | 'stable-ultra'>('dall-e-3');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const result = await generateDalleImage(prompt.trim());

      // Create new image layer
      const img = new Image();
      img.onload = () => {
        const newLayer: Layer = {
          id: generateId(),
          name: 'Generated Layer',
          visible: true,
          opacity: 100,
          blendMode: 'normal',
          locked: false,
          type: 'image',
          imageData: img
        };

        setLayers(prev => [...prev, newLayer]);
        setSelectedLayer(newLayer.id);
        setPrompt('');
      };
      img.src = result.url;

    } catch (error) {
      console.error('Failed to generate image:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full bg-[#1a1a1a]">
      <ToolsPanel 
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
      />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <div className="h-full flex flex-col">
            <Layers
              layers={layers}
              selectedLayer={selectedLayer}
              onLayerSelect={setSelectedLayer}
              onAddLayer={() => {
                const newLayer: Layer = {
                  id: generateId(),
                  name: `Layer ${layers.length}`,
                  visible: true,
                  opacity: 100,
                  blendMode: 'normal',
                  locked: false,
                  type: 'image'
                };
                setLayers([...layers, newLayer]);
                setSelectedLayer(newLayer.id);
              }}
              onDeleteLayer={(id) => {
                if (id === 'background') return;
                setLayers(layers.filter(layer => layer.id !== id));
                if (selectedLayer === id) {
                  setSelectedLayer('background');
                }
              }}
              onLayerUpdate={(updatedLayer) => {
                setLayers(layers.map(layer => 
                  layer.id === updatedLayer.id ? updatedLayer : layer
                ));
              }}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60}>
          <div className="flex flex-col h-full">
            <div className="bg-[#2a2a2a] border-b border-[#333]">
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Wand2 size={16} className="text-gray-400" />
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as typeof selectedModel)}
                    className="bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                  >
                    <option value="dall-e-3">DALL·E 3 (OpenAI)</option>
                    <option value="stable-ultra">Stable Ultra (Stability AI)</option>
                  </select>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="p-1.5 hover:bg-[#333] rounded"
                  >
                    <Settings size={16} className="text-gray-400" />
                  </button>
                </div>

                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                />

                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-2 rounded">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] text-white rounded disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </div>

            <div className="flex-1 relative overflow-auto bg-[#242424]">
              <Canvas
                ref={canvasRef}
                layers={layers}
                selectedLayer={selectedLayer}
                selectedTool={selectedTool}
                zoom={zoom}
              />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <div className="h-full flex flex-col">
            <PropertiesPanel
              layer={layers.find(layer => layer.id === selectedLayer)}
              onUpdate={(updates) => {
                setLayers(layers.map(layer =>
                  layer.id === selectedLayer ? { ...layer, ...updates } : layer
                ));
              }}
            />
            <AdjustmentsPanel
              layer={layers.find(layer => layer.id === selectedLayer)}
              onAdjustmentChange={(adjustment) => {
                setLayers(layers.map(layer =>
                  layer.id === selectedLayer
                    ? { 
                        ...layer, 
                        adjustments: { 
                          ...(layer.adjustments || {}), 
                          ...adjustment 
                        } 
                      }
                    : layer
                ));
              }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}