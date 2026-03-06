import React from 'react';
import { Clip } from '../../types/video-editor';
import { Play, Pause, SkipBack, SkipForward, Volume2, Settings } from 'lucide-react';

interface PreviewWindowProps {
  selectedClip: Clip | undefined;
  playheadPosition: number;
  isPlaying: boolean;
  onPlayPause?: () => void;
  onSeek?: (time: number) => void;
}

export function PreviewWindow({ 
  selectedClip, 
  playheadPosition, 
  isPlaying,
  onPlayPause,
  onSeek 
}: PreviewWindowProps) {
  return (
    <div className="flex flex-col bg-[#1a1a1a] border-b border-[#333]">
      {/* Video Preview */}
      <div className="relative aspect-video bg-black flex items-center justify-center">
        {selectedClip ? (
          <video
            src={selectedClip.url}
            className="max-h-full max-w-full"
            controls={false}
            autoPlay={isPlaying}
            loop
          />
        ) : (
          <div className="text-gray-500">No clip selected</div>
        )}
      </div>

      {/* Preview Controls */}
      <div className="h-16 bg-[#242424] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#333] rounded">
            <SkipBack size={16} />
          </button>
          <button 
            className="p-2 hover:bg-[#333] rounded"
            onClick={onPlayPause}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="p-2 hover:bg-[#333] rounded">
            <SkipForward size={16} />
          </button>
        </div>

        <div className="flex-1 mx-8">
          <div className="relative w-full h-1 bg-[#333] rounded">
            <div 
              className="absolute h-full bg-[#45caff] rounded"
              style={{ width: `${(playheadPosition / (selectedClip?.duration || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-gray-400" />
            <div className="w-24 h-1 bg-[#333] rounded">
              <div className="h-full w-3/4 bg-[#45caff] rounded" />
            </div>
          </div>
          <button className="p-2 hover:bg-[#333] rounded">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}