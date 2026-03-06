import React from 'react';
import { Track } from '../../types/audio-editor';
import { Volume2, Music, Mic, Sliders } from 'lucide-react';

interface MixerProps {
  tracks: Track[];
  onTrackUpdate: (track: Track) => void;
}

export function MixerPanel({ tracks, onTrackUpdate }: MixerProps) {
  return (
    <div className="h-full bg-[#242424] flex flex-col">
      <div className="p-4 border-b border-[#333] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-gray-400" />
          <h3 className="text-sm font-medium">Mixer</h3>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex h-full min-w-max">
          {tracks.map(track => (
            <div
              key={track.id}
              className="flex flex-col items-center w-32 border-r border-[#333] p-4"
              style={{ backgroundColor: track.color + '10' }}
            >
              {/* Track Icon & Name */}
              <div className="flex flex-col items-center gap-1 mb-4">
                {track.type === 'audio' && <Music size={16} className="text-gray-400" />}
                {track.type === 'midi' && <Volume2 size={16} className="text-gray-400" />}
                {track.type === 'instrument' && <Mic size={16} className="text-gray-400" />}
                <div className="text-xs font-medium text-center truncate w-full">
                  {track.name}
                </div>
              </div>

              {/* Volume Meter */}
              <div className="h-32 w-2 bg-[#333] rounded-full relative mb-2">
                <div 
                  className="absolute bottom-0 w-full rounded-full transition-all duration-100"
                  style={{ 
                    height: `${((track.volume + 60) / 72) * 100}%`,
                    backgroundColor: track.color 
                  }}
                />
              </div>

              {/* Volume Fader */}
              <div className="h-32 w-4 bg-[#333] rounded-full relative mb-4">
                <input
                  type="range"
                  min="-60"
                  max="12"
                  value={track.volume}
                  onChange={(e) => onTrackUpdate({ ...track, volume: Number(e.target.value) })}
                  className="absolute w-32 -rotate-90 origin-left top-16 left-2"
                />
              </div>

              {/* Volume Display */}
              <div className="text-xs mb-4 font-mono">
                {track.volume > 0 ? '+' : ''}{track.volume}dB
              </div>

              {/* Pan Knob */}
              <div className="mb-1 text-xs text-gray-400">Pan</div>
              <input
                type="range"
                min="-100"
                max="100"
                value={track.pan}
                onChange={(e) => onTrackUpdate({ ...track, pan: Number(e.target.value) })}
                className="w-24 mb-4"
              />
              <div className="text-xs mb-4 font-mono">
                {track.pan === 0 ? 'C' : track.pan < 0 ? `L${Math.abs(track.pan)}` : `R${track.pan}`}
              </div>

              {/* Track Controls */}
              <div className="flex gap-1">
                <button
                  onClick={() => onTrackUpdate({ ...track, muted: !track.muted })}
                  className={`w-8 h-8 rounded flex items-center justify-center ${
                    track.muted ? 'bg-yellow-600' : 'bg-[#333] hover:bg-[#404040]'
                  }`}
                >
                  M
                </button>
                <button
                  onClick={() => onTrackUpdate({ ...track, soloed: !track.soloed })}
                  className={`w-8 h-8 rounded flex items-center justify-center ${
                    track.soloed ? 'bg-green-600' : 'bg-[#333] hover:bg-[#404040]'
                  }`}
                >
                  S
                </button>
                <button
                  onClick={() => onTrackUpdate({ ...track, armed: !track.armed })}
                  className={`w-8 h-8 rounded flex items-center justify-center ${
                    track.armed ? 'bg-red-600' : 'bg-[#333] hover:bg-[#404040]'
                  }`}
                >
                  R
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}