import React, { useRef } from 'react';
import { 
  Image, 
  Video, 
  Music, 
  FileText, 
  Code, 
  Box, 
  FileSpreadsheet, 
  LineChart, 
  Upload 
} from 'lucide-react';
import { MediaType } from '../types';

interface MediaToolbarProps {
  onMediaSelect: (type: MediaType) => void;
  onFileUpload: (file: File) => void;
}

export function MediaToolbar({ onMediaSelect, onFileUpload }: MediaToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mediaButtons = [
    { type: 'image' as MediaType, icon: Image, label: 'Image' },
    { type: 'video' as MediaType, icon: Video, label: 'Video' },
    { type: 'audio' as MediaType, icon: Music, label: 'Audio' },
    { type: 'code' as MediaType, icon: Code, label: 'Code' },
    { type: '3d' as MediaType, icon: Box, label: '3D' },
    { type: 'document' as MediaType, icon: FileText, label: 'Document' },
    { type: 'spreadsheet' as MediaType, icon: FileSpreadsheet, label: 'Spreadsheet' },
    { type: 'graph' as MediaType, icon: LineChart, label: 'Graph' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t border-gray-700 p-2">
      <div className="flex flex-wrap gap-2">
        {mediaButtons.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onMediaSelect(type)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title={`Generate ${label}`}
          >
            <Icon size={16} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          title="Upload File"
        >
          <Upload size={16} />
          <span className="text-sm">Upload</span>
        </button>
      </div>
    </div>
  );
}