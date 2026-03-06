import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  ZoomIn,
  ZoomOut,
  Scissors,
  Plus,
  Minus
} from 'lucide-react';

interface ToolBarProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function ToolBar({
  isPlaying,
  onPlayPause,
  onZoomIn,
  onZoomOut
}: ToolBarProps) {
  return (
    <div className="h-12 border-b border-[#333] flex items-center px-4 gap-2 bg-[#242424]">
      {/* Transport Controls */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-[#333] rounded">
          <SkipBack size={16} />
        </button>
        <button 
          onClick={onPlayPause}
          className="p-1.5 hover:bg-[#333] rounded"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button className="p-1.5 hover:bg-[#333] rounded">
          <SkipForward size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-[#333] mx-2" />

      {/* Edit Tools */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-[#333] rounded" title="Split Clip">
          <Scissors size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-[#333] mx-2" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <button 
          onClick={onZoomOut}
          className="p-1.5 hover:bg-[#333] rounded"
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
        <button 
          onClick={onZoomIn}
          className="p-1.5 hover:bg-[#333] rounded"
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}