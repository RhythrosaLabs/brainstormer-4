import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SceneHierarchy } from "./three-editor/SceneHierarchy";
import { Toolbar } from "./three-editor/Toolbar";
import { Viewport } from "./three-editor/Viewport";
import { PropertiesPanel } from "./three-editor/PropertiesPanel";
import { Scene3D, Object3D, TransformMode } from "./three-editor/types";
import { Wand2, Settings, AlertCircle } from 'lucide-react';
import { generate3D } from '../services/ai';

export function ThreeDViewer() {
  const [scenes, setScenes] = useState<Scene3D[]>([]);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>("translate");
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [undoStack, setUndoStack] = useState<Scene3D[][]>([]);
  const [redoStack, setRedoStack] = useState<Scene3D[][]>([]);

  // AI Generation state
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('stable-fast-3d');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    quality: 'medium',
    format: 'glb',
    seed: Math.floor(Math.random() * 1000000)
  });

  const models = [
    { id: 'stable-fast-3d', name: 'Stable Fast 3D' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setError(null);
    setIsGenerating(true);

    try {
      const result = await generate3D({
        model: selectedModel,
        prompt: prompt.trim(),
        ...advancedOptions
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate 3D model');
      }

      // Handle the generated 3D model data
      // This would typically involve loading it into the scene
      setPrompt('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate 3D model');
      console.error('3D generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full bg-[#1a1a1a]">
      <SceneHierarchy
        scenes={scenes}
        selectedScene={selectedScene}
        selectedObject={selectedObject}
        onSceneSelect={setSelectedScene}
        onObjectSelect={setSelectedObject}
        onNewScene={() => {
          const newScene: Scene3D = {
            id: uuidv4(),
            name: 'New Scene',
            objects: [],
            lastModified: new Date()
          };
          setScenes([...scenes, newScene]);
          setSelectedScene(newScene.id);
        }}
      />

      <div className="flex-1 flex flex-col">
        {/* AI Generation Bar */}
        <div className="bg-[#2a2a2a] border-b border-[#333]">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <Wand2 size={16} className="text-gray-400" />
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
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
              placeholder="Describe the 3D model you want to generate..."
              className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
            />

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-2 rounded">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {showAdvanced && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Quality</label>
                  <select
                    value={advancedOptions.quality}
                    onChange={(e) => setAdvancedOptions(prev => ({ ...prev, quality: e.target.value }))}
                    className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                  >
                    <option value="draft">Draft</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Format</label>
                  <select
                    value={advancedOptions.format}
                    onChange={(e) => setAdvancedOptions(prev => ({ ...prev, format: e.target.value }))}
                    className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                  >
                    <option value="glb">GLB</option>
                    <option value="gltf">GLTF</option>
                    <option value="obj">OBJ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Seed</label>
                  <input
                    type="number"
                    value={advancedOptions.seed}
                    onChange={(e) => setAdvancedOptions(prev => ({ ...prev, seed: Number(e.target.value) }))}
                    className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] text-white rounded disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate 3D Model'}
            </button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1">
          <Toolbar
            onAddObject={(type) => {
              if (!selectedScene) return;

              const newObject: Object3D = {
                id: uuidv4(),
                type,
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
                material: {
                  color: '#ffffff',
                  metalness: 0.5,
                  roughness: 0.5
                },
                visible: true
              };

              setScenes(scenes.map(scene =>
                scene.id === selectedScene
                  ? { ...scene, objects: [...scene.objects, newObject] }
                  : scene
              ));
              setSelectedObject(newObject.id);
            }}
            transformMode={transformMode}
            onTransformModeChange={setTransformMode}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(!showGrid)}
            onUndo={() => {
              if (undoStack.length === 0) return;
              const previousState = undoStack[undoStack.length - 1];
              setRedoStack([...redoStack, scenes]);
              setScenes(previousState);
              setUndoStack(undoStack.slice(0, -1));
            }}
            onRedo={() => {
              if (redoStack.length === 0) return;
              const nextState = redoStack[redoStack.length - 1];
              setUndoStack([...undoStack, scenes]);
              setScenes(nextState);
              setRedoStack(redoStack.slice(0, -1));
            }}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
          />

          {selectedScene && (
            <Viewport
              objects={scenes.find(s => s.id === selectedScene)?.objects || []}
              selectedObject={selectedObject}
              transformMode={transformMode}
              showGrid={showGrid}
              snapToGrid={snapToGrid}
              onObjectSelect={setSelectedObject}
            />
          )}
        </div>
      </div>

      <div className="w-80 border-l border-[#333] bg-[#242424] overflow-y-auto">
        <PropertiesPanel
          object={scenes.find(s => s.id === selectedScene)?.objects.find(o => o.id === selectedObject)}
          onUpdate={(updates) => {
            if (!selectedScene || !selectedObject) return;
            setUndoStack([...undoStack, scenes]);
            setScenes(scenes.map(scene =>
              scene.id === selectedScene
                ? {
                    ...scene,
                    objects: scene.objects.map(obj =>
                      obj.id === selectedObject ? { ...obj, ...updates } : obj
                    )
                  }
                : scene
            ));
          }}
        />
      </div>
    </div>
  );
}