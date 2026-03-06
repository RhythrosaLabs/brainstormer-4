import React, { useState } from 'react';
import { Track } from '../../types/audio-editor';
import { Piano as PianoIcon, Sliders, Waveform } from 'lucide-react';

interface ControlsProps {
  selectedTrack: Track | undefined;
  onTrackUpdate: (track: Track) => void;
}

export function Controls({ selectedTrack, onTrackUpdate }: ControlsProps) {
  const [activeTab, setActiveTab] = useState<'effects' | 'piano'>('effects');

  if (!selectedTrack) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a track to view controls
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#333]">
        <button
          onClick={() => setActiveTab('effects')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'effects'
              ? 'border-b-2 border-[#45caff] text-[#45caff]'
              : 'text-gray-400'
          }`}
        >
          <Sliders size={16} />
          <span>Effects</span>
        </button>
        <button
          onClick={() => setActiveTab('piano')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'piano'
              ? 'border-b-2 border-[#45caff] text-[#45caff]'
              : 'text-gray-400'
          }`}
        >
          <PianoIcon size={16} />
          <span>Piano Roll</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4">
        {activeTab === 'effects' && (
          <div className="space-y-6">
            {/* Effect Slots */}
            {selectedTrack.effects.map((effect, index) => (
              <div key={effect.id} className="bg-[#242424] rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Waveform size={16} className="text-gray-400" />
                    <select
                      value={effect.type}
                      onChange={() => {}}
                      className="bg-[#333] text-sm rounded px-2 py-1"
                    >
                      <option value="reverb">Reverb</option>
                      <option value="delay">Delay</option>
                      <option value="eq">EQ</option>
                      <option value="compressor">Compressor</option>
                    </select>
                  </div>
                  <button
                    className={`px-2 py-1 rounded text-sm ${
                      effect.enabled ? 'bg-[#45caff]' : 'bg-[#333]'
                    }`}
                  >
                    {effect.enabled ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Effect Parameters */}
                <div className="space-y-4">
                  {Object.entries(effect.parameters).map(([param, value]) => (
                    <div key={param}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">
                          {param.charAt(0).toUpperCase() + param.slice(1)}
                        </span>
                        <span>{value}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={() => {}}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add Effect Button */}
            <button
              className="w-full py-2 border border-dashed border-[#333] rounded-lg text-gray-400 hover:border-[#45caff] hover:text-white"
            >
              Add Effect
            </button>
          </div>
        )}

        {activeTab === 'piano' && (
          <div className="h-full bg-[#242424] rounded-lg p-4">
            {/* Piano Roll implementation would go here */}
            <div className="text-gray-500 text-center">
              Piano Roll View
            </div>
          </div>
        )}
      </div>
    </div>
  );
}