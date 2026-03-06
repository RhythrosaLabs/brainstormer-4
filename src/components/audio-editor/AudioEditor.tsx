import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { TrackList } from './TrackList';
import { PianoRoll } from './PianoRoll';
import { TransportBar } from './TransportBar';
import { MixerPanel } from './MixerPanel';
import { LibraryPanel } from './LibraryPanel';
import { InspectorPanel } from './InspectorPanel';
import { Track } from '../types/audio-editor';
import { Wand2, Settings } from 'lucide-react';

export function AudioEditor() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [showPianoRoll, setShowPianoRoll] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);

  const handleAddTrack = (type: 'audio' | 'midi' | 'instrument') => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name: `Track ${tracks.length + 1}`,
      type,
      volume: 0,
      pan: 0,
      muted: false,
      soloed: false,
      armed: false,
      clips: [],
      effects: [],
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    setTracks([...tracks, newTrack]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1a1a1a] text-gray-200">
      {/* Transport Bar */}
      <TransportBar
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        tempo={tempo}
        onTempoChange={setTempo}
        currentTime={0}
        volume={100}
        onStop={() => {}}
        onVolumeChange={() => {}}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Library Panel */}
          <LibraryPanel onAddTrack={handleAddTrack} />

          {/* Track List and Timeline */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <TrackList
              tracks={tracks}
              selectedTrack={selectedTrack}
              onTrackSelect={setSelectedTrack}
              onTrackUpdate={(updatedTrack) => {
                setTracks(tracks.map(track =>
                  track.id === updatedTrack.id ? updatedTrack : track
                ));
              }}
              playheadPosition={playheadPosition}
            />
          </div>
        </div>

        {/* Mixer Panel */}
        <div className="h-64 border-t border-[#333]">
          <MixerPanel
            tracks={tracks}
            onTrackUpdate={(updatedTrack) => {
              setTracks(tracks.map(track =>
                track.id === updatedTrack.id ? updatedTrack : track
              ));
            }}
          />
        </div>
      </div>
    </div>
  );
}