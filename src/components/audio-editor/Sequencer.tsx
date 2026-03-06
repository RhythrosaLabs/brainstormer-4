import React from 'react';
import { Track } from '../../types/audio-editor';
import { Plus, Play, Pause, Music, Mic, Volume2, Lock, Eye, Mute } from 'lucide-react';

interface SequencerProps {
  tracks: Track[];
  selectedTrack: string | null;
  onTrackSelect: (id: string) => void;
  onAddTrack: (type: 'audio' | 'midi' | 'instrument') => void;
  isPlaying: boolean;
  tempo: number;
  playheadPosition: number;
}

export function Sequencer({
  tracks,
  selectedTrack,
  onTrackSelect,
  onAddTrack,
  isPlaying,
  tempo,
  playheadPosition
}: SequencerProps) {
  const PIXELS_PER_BEAT = 80;
  const BEATS_PER_BAR = 4;
  const TOTAL_BARS = 8;

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Track Headers */}
      <div className="flex border-b border-[#333]">
        {/* Track Controls */}
        <div className="w-64 p-2 border-r border-[#333] bg-[#242424] flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => onAddTrack('audio')}
              className="p-1.5 hover:bg-[#333] rounded"
              title="Add Audio Track"
            >
              <Music size={16} />
            </button>
            <button
              onClick={() => onAddTrack('midi')}
              className="p-1.5 hover:bg-[#333] rounded"
              title="Add MIDI Track"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => onAddTrack('instrument')}
              className="p-1.5 hover:bg-[#333] rounded"
              title="Add Instrument Track"
            >
              <Mic size={16} />
            </button>
          </div>
          <div className="text-sm text-gray-400">{tempo} BPM</div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-x-auto bg-[#242424] h-12">
          <div className="flex" style={{ width: PIXELS_PER_BEAT * BEATS_PER_BAR * TOTAL_BARS }}>
            {Array.from({ length: TOTAL_BARS }).map((_, barIndex) => (
              <div
                key={barIndex}
                className="flex border-r border-[#333]"
                style={{ width: PIXELS_PER_BEAT * BEATS_PER_BAR }}
              >
                {Array.from({ length: BEATS_PER_BAR }).map((_, beatIndex) => (
                  <div
                    key={beatIndex}
                    className="border-r border-[#333] flex items-center justify-center text-xs text-gray-500"
                    style={{ width: PIXELS_PER_BEAT }}
                  >
                    {beatIndex === 0 ? barIndex + 1 : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto">
        {tracks.map(track => (
          <div
            key={track.id}
            className={`flex border-b border-[#333] ${
              selectedTrack === track.id ? 'bg-[#2a2a2a]' : ''
            }`}
            onClick={() => onTrackSelect(track.id)}
          >
            {/* Track Info */}
            <div className="w-64 p-2 border-r border-[#333] bg-[#242424] flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2">
                {track.type === 'audio' && <Music size={16} className="text-gray-400" />}
                {track.type === 'midi' && <Plus size={16} className="text-gray-400" />}
                {track.type === 'instrument' && <Mic size={16} className="text-gray-400" />}
                <input
                  type="text"
                  value={track.name}
                  onChange={() => {}}
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
                  <Mute size={12} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Track Content */}
            <div
              className="flex-1 relative bg-[#1a1a1a]"
              style={{ width: PIXELS_PER_BEAT * BEATS_PER_BAR * TOTAL_BARS }}
            >
              {track.clips.map(clip => (
                <div
                  key={clip.id}
                  className="absolute top-0 bottom-0 bg-opacity-50 rounded"
                  style={{
                    left: clip.startTime * PIXELS_PER_BEAT,
                    width: clip.duration * PIXELS_PER_BEAT,
                    backgroundColor: track.color
                  }}
                >
                  <div className="p-2 text-xs truncate">{clip.name}</div>
                </div>
              ))}
              {/* Grid Lines */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: TOTAL_BARS * BEATS_PER_BAR }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute top-0 bottom-0 border-l ${
                      i % BEATS_PER_BAR === 0 ? 'border-[#333]' : 'border-[#333]/30'
                    }`}
                    style={{ left: i * PIXELS_PER_BEAT }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Playhead */}
      <div
        className="absolute top-12 bottom-0 w-px bg-[#45caff] z-10 pointer-events-none"
        style={{ left: playheadPosition * PIXELS_PER_BEAT + 256 }}
      >
        <div className="w-4 h-4 -ml-2 -mt-2 bg-[#45caff] rounded-full" />
      </div>
    </div>
  );
}