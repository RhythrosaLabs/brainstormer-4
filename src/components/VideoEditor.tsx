import React, { useState } from 'react';
import { Timeline } from './video-editor/Timeline';
import { PreviewWindow } from './video-editor/PreviewWindow';
import { MediaBrowser } from './video-editor/MediaBrowser';
import { InspectorPanel } from './video-editor/InspectorPanel';
import { ToolBar } from './video-editor/ToolBar';
import { Clip } from '../types/video-editor';
import { generateVideo } from '../services/stability';
import { Wand2, Settings, AlertCircle } from 'lucide-react';

export function VideoEditor() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('stable-video');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedOptions, setAdvancedOptions] = useState({
    duration: 10,
    fps: 30,
    resolution: '768x768',
    style: 'cinematic',
    cfg_scale: 1.8,
    motion_bucket_id: 127,
    seed: Math.floor(Math.random() * 4294967294)
  });

  const models = [
    { id: 'stable-video', name: 'Stable Video' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const result = await generateVideo({
        model: 'stable-ultra',
        prompt: prompt.trim(),
        cfg_scale: advancedOptions.cfg_scale,
        motion_bucket_id: advancedOptions.motion_bucket_id,
        seed: advancedOptions.seed
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate video');
      }

      const newClip: Clip = {
        id: `clip-${Date.now()}`,
        name: 'Generated Video',
        url: URL.createObjectURL(result.data),
        duration: advancedOptions.duration,
        startTime: 0,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
      };

      setClips([...clips, newClip]);
      setSelectedClip(newClip.id);
      setPrompt('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate video');
      console.error('Failed to generate video:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a1a] text-gray-200">
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
            placeholder="Describe the video you want to generate..."
            className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
          />

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {showAdvanced && (
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">CFG Scale</label>
                <input
                  type="number"
                  value={advancedOptions.cfg_scale}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, cfg_scale: Number(e.target.value) }))}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Motion Amount</label>
                <input
                  type="number"
                  value={advancedOptions.motion_bucket_id}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, motion_bucket_id: Number(e.target.value) }))}
                  min={1}
                  max={255}
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Seed</label>
                <input
                  type="number"
                  value={advancedOptions.seed}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, seed: Number(e.target.value) }))}
                  min={0}
                  max={4294967294}
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Resolution</label>
                <input
                  type="text"
                  value={advancedOptions.resolution}
                  disabled
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] text-white rounded disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Video'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        <MediaBrowser onAddClip={(clip) => setClips([...clips, clip])} />
        
        <div className="flex-1 flex flex-col">
          <div className="h-1/2 border-b border-[#333]">
            <PreviewWindow
              selectedClip={clips.find(clip => clip.id === selectedClip)}
              playheadPosition={playheadPosition}
              isPlaying={isPlaying}
            />
          </div>

          <div className="flex-1">
            <Timeline
              clips={clips}
              selectedClip={selectedClip}
              playheadPosition={playheadPosition}
              zoom={zoom}
              onClipSelect={setSelectedClip}
              onClipMove={(clipId, newStart) => {
                setClips(clips.map(clip =>
                  clip.id === clipId
                    ? { ...clip, startTime: newStart }
                    : clip
                ));
              }}
              onPlayheadChange={setPlayheadPosition}
            />
          </div>
        </div>

        <div className="w-72 border-l border-[#333]">
          <InspectorPanel
            clip={clips.find(clip => clip.id === selectedClip)}
            onClipUpdate={(updatedClip) => {
              setClips(clips.map(clip =>
                clip.id === updatedClip.id ? updatedClip : clip
              ));
            }}
          />
        </div>
      </div>
    </div>
  );
}