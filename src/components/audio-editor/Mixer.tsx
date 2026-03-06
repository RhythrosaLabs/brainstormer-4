import React from 'react';
import { Track } from '../../types/audio-editor';
import { Volume2, Music, Mic } from 'lucide-react';

interface MixerProps {
  tracks: Track[];
  onTrackUpdate: (track: Track) => void;
}

export function Mixer({ tracks, onTrackUpdate }: MixerProps) {
  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex gap-2 p-4">
        {tracks.map(track => (
          <div
            key={track.id}
            className="flex flex-col items-center w-32 bg-[#242424] rounded-lg p-4"
          >
            {/* Track Icon */}
            <div className="mb-2">
              {track.type === 'audio' && <Music size={20} />}
              {track.type === 'midi' && <Volume2 size={20} />}
              {track.type === 'instrument' && <Mic size={20} />}
            </div>

            {/* Track Name */}
            <div className="text-sm font-medium mb-4 text-center">{track.name}</div>

            {/* Volume Fader */}
            <div className="h-48 w-4 bg-[#333] rounded-full relative mb-4">
              <input
                type="range"
                min="-60"
                max="12"
                value={track.volume}
                onChange={(e) => onTrackUpdate({ ...track, volume: Number(e.target.value) })}
                className="absolute w-48 -rotate-90 origin-left top-24 left-2"
              />
            </div>

            {/* Volume Display */}
            <div className="text-sm mb-4">
              {track.volume > 0 ? '+' : ''}{track.volume}dB
            </div>

            {/* Pan Knob */}
            <div className="mb-2 text-xs text-gray-400">Pan</div>
            <input
              type="range"
              min="-100"
              max="100"
              value={track.pan}
              onChange={(e) => onTrackUpdate({ ...track, pan: Number(e.target.value) })}
              className="w-24 mb-4"
            />

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
  );
}