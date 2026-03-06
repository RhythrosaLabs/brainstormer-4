import React from 'react';
import { Track } from '../../types/audio-editor';
import { Settings, Sliders } from 'lucide-react';

interface InspectorPanelProps {
  track?: Track;
  onTrackUpdate: (updates: Partial<Track>) => void;
}

export function InspectorPanel({ track, onTrackUpdate }: InspectorPanelProps) {
  if (!track) {
    return (
      <div className="h-full bg-[#242424] p-4 flex items-center justify-center text-gray-400">
        Select a track to view properties
      </div>
    );
  }

  return (
    <div className="h-full bg-[#242424] flex flex-col">
      <div className="p-4 border-b border-[#333] flex items-center gap-2">
        <Settings size={16} className="text-gray-400" />
        <h3 className="text-sm font-medium">Inspector</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Track Properties */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={track.name}
              onChange={(e) => onTrackUpdate({ name: e.target.value })}
              className="w-full bg-[#333] rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#45caff]"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Color</label>
            <input
              type="color"
              value={track.color}
              onChange={(e) => onTrackUpdate({ color: e.target.value })}
              className="w-full h-8 bg-[#333] rounded cursor-pointer"
            />
          </div>

          {/* Effects */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sliders size={14} className="text-gray-400" />
              <label className="text-xs text-gray-400">Effects</label>
            </div>
            <button
              className="w-full py-2 border border-dashed border-[#333] rounded text-sm text-gray-400 hover:border-[#45caff] hover:text-white"
            >
              Add Effect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}