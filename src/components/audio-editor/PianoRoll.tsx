import React from 'react';
import { Track } from '../../types/audio-editor';

interface PianoRollProps {
  track?: Track;
  onClose: () => void;
}

export function PianoRoll({ track, onClose }: PianoRollProps) {
  return (
    <div className="h-full bg-[#1a1a1a] p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Piano Roll</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ×
        </button>
      </div>
      <div className="flex-1 bg-[#242424] rounded">
        {/* Piano roll canvas will go here */}
        <div className="grid grid-rows-12 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-[#333] h-8" />
          ))}
        </div>
      </div>
    </div>
  );
}