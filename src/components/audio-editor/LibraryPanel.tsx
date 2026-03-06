import React from 'react';
import { Plus, Music, Mic, Volume2, Package, Search } from 'lucide-react';

interface LibraryPanelProps {
  onAddTrack: (type: 'audio' | 'midi' | 'instrument') => void;
}

export function LibraryPanel({ onAddTrack }: LibraryPanelProps) {
  return (
    <div className="h-full bg-[#242424] border-r border-[#333] flex flex-col">
      <div className="p-4 border-b border-[#333]">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-gray-400" />
          <h3 className="text-sm font-medium">Library</h3>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#333] text-sm rounded-lg pl-8 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
          />
          <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
        </div>

        {/* Track Type Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onAddTrack('audio')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-[#333] hover:bg-[#404040] rounded-lg"
          >
            <Music size={16} />
            <span>Audio Track</span>
          </button>
          <button
            onClick={() => onAddTrack('midi')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-[#333] hover:bg-[#404040] rounded-lg"
          >
            <Volume2 size={16} />
            <span>MIDI Track</span>
          </button>
          <button
            onClick={() => onAddTrack('instrument')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-[#333] hover:bg-[#404040] rounded-lg"
          >
            <Mic size={16} />
            <span>Instrument Track</span>
          </button>
        </div>
      </div>
    </div>
  );
}