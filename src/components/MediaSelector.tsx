import React from 'react';
import { Image, Video, FileText, Code, Table, BarChart2, Box, Music, Upload } from 'lucide-react';

interface MediaSelectorProps {
  onSelect: (type: string) => void;
  onClose: () => void;
}

export function MediaSelector({ onSelect, onClose }: MediaSelectorProps) {
  const options = [
    { type: 'image', icon: Image, label: 'Image (DALL·E)' },
    { type: 'image-sd', icon: Image, label: 'Image (Stable Diffusion)' },
    { type: 'video', icon: Video, label: 'Video' },
    { type: 'music', icon: Music, label: 'Music' },
    { type: '3d', icon: Box, label: '3D Model' }
  ];

  return (
    <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#242424] rounded-lg shadow-lg border border-[#333] p-2">
      <div className="grid grid-cols-1 gap-2">
        {options.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-[#333] text-left"
          >
            <Icon size={16} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}