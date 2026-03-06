import React from 'react';
import { Volume2, VolumeX, Mic, Music, Lock, Eye } from 'lucide-react';
import { Track } from '../../types/audio-editor';

interface TrackListProps {
  tracks: Track[];
  selectedTrack: string | null;
  onTrackSelect: (id: string) => void;
  onTrackUpdate: (track: Track) => void;
  playheadPosition: number;
}

export function TrackList({
  tracks,
  selectedTrack,
  onTrackSelect,
  onTrackUpdate,
  playheadPosition
}: TrackListProps) {
  const PIXELS_PER_BEAT = 80;
  const BEATS_PER_BAR = 4;
  const TOTAL_BARS = 8;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Timeline Ruler */}
      <div className="h-8 border-b border-[#333] bg-[#242424] flex items-center">
        <div className="w-64 border-r border-[#333] bg-[#1a1a1a] h-full" />
        <div className="flex-1 relative">
          {Array.from({ length: TOTAL_BARS * BEATS_PER_BAR }).map((_, i) => (
            <div
              key={i}
              className={`absolute top-0 bottom-0 border-l ${
                i % BEATS_PER_BAR === 0 ? 'border-[#333]' : 'border-[#333]/30'
              } flex items-center`}
              style={{ left: `${i * PIXELS_PER_BEAT}px` }}
            >
              {i % BEATS_PER_BAR === 0 && (
                <span className="text-xs text-gray-400 ml-1">{i / BEATS_PER_BAR + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {tracks.map(track => (
          <div
            key={track.id}
            onClick={() => onTrackSelect(track.id)}
            className={`flex h-32 border-b border-[#333] ${
              selectedTrack === track.id ? 'bg-[#2a2a2a]' : ''
            }`}
          >
            {/* Track Header */}
            <div className="w-64 p-2 border-r border-[#333] bg-[#242424] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {track.type === 'audio' && <Music size={16} className="text-gray-400" />}
                  {track.type === 'midi' && <Volume2 size={16} className="text-gray-400" />}
                  {track.type === 'instrument' && <Mic size={16} className="text-gray-400" />}
                  <input
                    type="text"
                    value={track.name}
                    onChange={(e) => onTrackUpdate({ ...track, name: e.target.value })}
                    className="bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[#45caff] rounded px-1"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-[#333] rounded">
                    <Eye size={12} className="text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-[#333] rounded">
                    <Lock size={12} className="text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-[#333] rounded">
                    <VolumeX size={12} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Track Controls */}
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrackUpdate({ ...track, muted: !track.muted });
                  }}
                  className={`px-2 py-1 text-xs rounded ${
                    track.muted ? 'bg-yellow-600' : 'bg-[#333] hover:bg-[#404040]'
                  }`}
                >
                  M
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrackUpdate({ ...track, soloed: !track.soloed });
                  }}
                  className={`px-2 py-1 text-xs rounded ${
                    track.soloed ? 'bg-green-600' : 'bg-[#333] hover:bg-[#404040]'
                  }`}
                >
                  S
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTrackUpdate({ ...track, armed: !track.armed });
                  }}
                  className={`px-2 py-1 text-xs rounded ${
                    track.armed ? 'bg-red-600' : 'bg-[#333] hover:bg-[#404040]'
                  }`}
                >
                  R
                </button>
              </div>
            </div>

            {/* Track Content */}
            <div className="flex-1 relative bg-[#1a1a1a] overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{ width: `${TOTAL_BARS * BEATS_PER_BAR * PIXELS_PER_BEAT}px` }}
              >
                {track.clips.map(clip => (
                  <div
                    key={clip.id}
                    className="absolute top-2 bottom-2 bg-opacity-50 rounded"
                    style={{
                      left: `${clip.startTime * PIXELS_PER_BEAT}px`,
                      width: `${clip.duration * PIXELS_PER_BEAT}px`,
                      backgroundColor: track.color
                    }}
                  >
                    <div className="p-2 text-xs truncate">{clip.name}</div>
                  </div>
                ))}

                {/* Grid Lines */}
                {Array.from({ length: TOTAL_BARS * BEATS_PER_BAR }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute top-0 bottom-0 border-l ${
                      i % BEATS_PER_BAR === 0 ? 'border-[#333]' : 'border-[#333]/30'
                    }`}
                    style={{ left: `${i * PIXELS_PER_BEAT}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Playhead */}
      {typeof playheadPosition === 'number' && (
        <div
          className="absolute top-8 bottom-0 w-px bg-[#45caff] z-10 pointer-events-none"
          style={{ left: `${(playheadPosition * PIXELS_PER_BEAT) + 256}px` }}
        >
          <div className="w-4 h-4 -ml-2 -mt-2 bg-[#45caff] rounded-full" />
        </div>
      )}
    </div>
  );
}