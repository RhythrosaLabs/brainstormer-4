import React, { useState } from 'react';
import { Upload, Folder, Film, Search, Grid, List } from 'lucide-react';
import { Clip } from '../../types/video-editor';

interface MediaBrowserProps {
  onAddClip: (clip: Clip) => void;
}

export function MediaBrowser({ onAddClip }: MediaBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const clip: Clip = {
        id: `clip-${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        duration: 10, // This would normally come from the video metadata
        startTime: 0,
        color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };
      onAddClip(clip);
    }
  };

  return (
    <div className="w-72 flex flex-col h-full bg-[#242424] border-r border-[#333]">
      {/* Header */}
      <div className="p-4 border-b border-[#333]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Media Browser</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#333]' : 'hover:bg-[#333]'}`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#333]' : 'hover:bg-[#333]'}`}
            >
              <List size={14} />
            </button>
            <input
              type="file"
              id="video-upload"
              className="hidden"
              accept="video/*"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="video-upload"
              className="p-1.5 hover:bg-[#333] rounded cursor-pointer"
              title="Upload Video"
            >
              <Upload size={14} />
            </label>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search media..."
            className="w-full bg-[#333] text-sm rounded-lg pl-8 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
          />
          <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
        </div>
      </div>

      {/* Media Categories */}
      <div className="flex-1 overflow-y-auto p-2">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#333] rounded-lg mb-1">
          <Folder size={16} />
          <span>All Media</span>
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#333] rounded-lg">
          <Film size={16} />
          <span>Recent Imports</span>
        </button>
      </div>
    </div>
  );
}