import React from 'react';
import { Settings, Sliders, Clock, Video, Volume2 } from 'lucide-react';
import { Clip } from '../../types/video-editor';

interface InspectorPanelProps {
  clip: Clip | undefined;
  onClipUpdate: (clip: Clip) => void;
}

export function InspectorPanel({ clip, onClipUpdate }: InspectorPanelProps) {
  if (!clip) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No clip selected
      </div>
    );
  }

  return (
    <div className="w-72 h-full bg-[#242424] border-l border-[#333] overflow-y-auto">
      {/* Clip Info */}
      <div className="p-4 border-b border-[#333]">
        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
          <Video size={14} className="text-gray-400" />
          <span>Clip Info</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={clip.name}
              onChange={(e) => onClipUpdate({ ...clip, name: e.target.value })}
              className="w-full bg-[#333] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Duration</label>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <input 
                type="number"
                value={clip.duration}
                onChange={(e) => onClipUpdate({ ...clip, duration: Number(e.target.value) })}
                min={0}
                step={0.1}
                className="w-24 bg-[#333] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
              />
              <span className="text-sm text-gray-400">seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Effects */}
      <div className="p-4 border-b border-[#333]">
        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
          <Sliders size={14} className="text-gray-400" />
          <span>Video Effects</span>
        </h3>
        <div className="space-y-4">
          {/* Opacity */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Opacity</span>
              <span>{clip.opacity ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={clip.opacity ?? 100}
              onChange={(e) => onClipUpdate({ ...clip, opacity: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Scale */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Scale</span>
              <span>{clip.scale ?? 100}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={clip.scale ?? 100}
              onChange={(e) => onClipUpdate({ ...clip, scale: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Rotation */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Rotation</span>
              <span>{clip.rotation ?? 0}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={clip.rotation ?? 0}
              onChange={(e) => onClipUpdate({ ...clip, rotation: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="p-4">
        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
          <Volume2 size={14} className="text-gray-400" />
          <span>Audio</span>
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Volume</span>
              <span>{clip.volume ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={clip.volume ?? 100}
              onChange={(e) => onClipUpdate({ ...clip, volume: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}