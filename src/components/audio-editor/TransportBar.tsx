import React from 'react';
import { Play, Pause, SkipBack, Timer, Volume2, Music2, Circle, Repeat } from 'lucide-react';

interface TransportBarProps {
  isPlaying: boolean;
  currentTime: number;
  tempo: number;
  volume: number;
  onPlayPause: () => void;
  onStop: () => void;
  onTempoChange: (tempo: number) => void;
  onVolumeChange: (volume: number) => void;
}

export function TransportBar({
  isPlaying,
  currentTime,
  tempo,
  volume,
  onPlayPause,
  onStop,
  onTempoChange,
  onVolumeChange
}: TransportBarProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
  };

  return (
    <div className="h-16 bg-[#1a1a1a] border-b border-[#333] flex items-center px-4 gap-8">
      {/* Transport Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onStop}
          className="p-2 rounded hover:bg-[#333] text-gray-400 hover:text-white"
        >
          <SkipBack size={20} />
        </button>
        <button
          onClick={onPlayPause}
          className="p-2 rounded hover:bg-[#333] text-gray-400 hover:text-white"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          className="p-2 rounded hover:bg-[#333] text-red-500 hover:text-red-400"
        >
          <Circle size={20} fill="currentColor" />
        </button>
      </div>

      {/* Time Display */}
      <div className="flex items-center gap-4">
        <div className="bg-[#242424] rounded-lg px-4 py-2 font-mono text-lg tracking-wider">
          {formatTime(currentTime)}
        </div>
        <div className="flex items-center gap-2">
          <Timer size={16} className="text-gray-400" />
          <input
            type="number"
            value={tempo}
            onChange={(e) => onTempoChange(Number(e.target.value))}
            className="w-16 bg-[#242424] rounded-lg px-2 py-1 text-sm"
            min="20"
            max="300"
          />
          <span className="text-sm text-gray-400">BPM</span>
        </div>
      </div>

      {/* Additional Controls */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded hover:bg-[#333] text-gray-400 hover:text-white"
          title="Metronome"
        >
          <Music2 size={16} />
        </button>
        <button
          className="p-2 rounded hover:bg-[#333] text-gray-400 hover:text-white"
          title="Loop"
        >
          <Repeat size={16} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2 ml-auto">
        <Volume2 size={16} className="text-gray-400" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-24"
        />
        <span className="text-sm text-gray-400 w-8">{volume}%</span>
      </div>
    </div>
  );
}