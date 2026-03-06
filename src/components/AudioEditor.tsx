import React, { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { TrackList } from './audio-editor/TrackList';
import { PianoRoll } from './audio-editor/PianoRoll';
import { TransportBar } from './audio-editor/TransportBar';
import { MixerPanel } from './audio-editor/MixerPanel';
import { LibraryPanel } from './audio-editor/LibraryPanel';
import { InspectorPanel } from './audio-editor/InspectorPanel';
import { Track } from '../types/audio-editor';
import { Wand2, Settings, AlertCircle } from 'lucide-react';
import { generateMusic } from '../services/replicate';

export function AudioEditor() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [showPianoRoll, setShowPianoRoll] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('meta-musicgen');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    duration: 30,
    style: 'electronic',
    tempo: 120,
    key: 'C',
    scale: 'major'
  });

  const models = [
    { id: 'meta-musicgen', name: 'Meta MusicGen' },
    { id: 'stable-audio', name: 'Stable Audio' }
  ];

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
    setSelectedTrack(newTrack.id);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const result = await generateMusic({
        prompt: prompt.trim(),
        duration: advancedOptions.duration,
        model_version: 'stereo-large',
        temperature: 1,
        classifier_free_guidance: 3,
        output_format: 'mp3'
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate audio');
      }

      // Create new audio track with generated content
      const newTrack: Track = {
        id: `track-${Date.now()}`,
        name: 'Generated Audio',
        type: 'audio',
        volume: 0,
        pan: 0,
        muted: false,
        soloed: false,
        armed: false,
        clips: [{
          id: `clip-${Date.now()}`,
          name: 'Generated Clip',
          startTime: 0,
          duration: advancedOptions.duration,
          url: URL.createObjectURL(result.data)
        }],
        effects: [],
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };

      setTracks([...tracks, newTrack]);
      setPrompt('');
    } catch (error) {
      console.error('Failed to generate audio:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate audio');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1a1a1a] text-gray-200">
      {/* AI Generation Bar */}
      <div className="bg-[#2a2a2a] border-b border-[#333]">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <Wand2 size={16} className="text-gray-400" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-1.5 hover:bg-[#333] rounded"
            >
              <Settings size={16} className="text-gray-400" />
            </button>
          </div>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the music you want to generate..."
            className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
          />

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-2 rounded">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {showAdvanced && (
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Duration (seconds)</label>
                <input
                  type="number"
                  value={advancedOptions.duration}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Style</label>
                <select
                  value={advancedOptions.style}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                >
                  <option value="electronic">Electronic</option>
                  <option value="rock">Rock</option>
                  <option value="jazz">Jazz</option>
                  <option value="classical">Classical</option>
                  <option value="ambient">Ambient</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Tempo (BPM)</label>
                <input
                  type="number"
                  value={advancedOptions.tempo}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, tempo: Number(e.target.value) }))}
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Key</label>
                <select
                  value={advancedOptions.key}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, key: e.target.value }))}
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                >
                  {['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db'].map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Scale</label>
                <select
                  value={advancedOptions.scale}
                  onChange={(e) => setAdvancedOptions(prev => ({ ...prev, scale: e.target.value }))}
                  className="w-full bg-[#333] text-sm rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
                >
                  <option value="major">Major</option>
                  <option value="minor">Minor</option>
                  <option value="dorian">Dorian</option>
                  <option value="phrygian">Phrygian</option>
                  <option value="lydian">Lydian</option>
                  <option value="mixolydian">Mixolydian</option>
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full px-4 py-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] text-white rounded disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Audio'}
          </button>
        </div>
      </div>

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

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
          <LibraryPanel onAddTrack={handleAddTrack} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={65}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
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
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={30}>
              <MixerPanel
                tracks={tracks}
                onTrackUpdate={(updatedTrack) => {
                  setTracks(tracks.map(track =>
                    track.id === updatedTrack.id ? updatedTrack : track
                  ));
                }}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
          <InspectorPanel
            track={tracks.find(track => track.id === selectedTrack)}
            onTrackUpdate={(updates) => {
              setTracks(tracks.map(track =>
                track.id === selectedTrack ? { ...track, ...updates } : track
              ));
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}