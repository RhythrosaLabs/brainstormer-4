import React from 'react';
import { FileText, Table, File } from 'lucide-react';

interface FileViewerProps {
  url?: string;
  type: string;
  metadata?: {
    name: string;
    size?: number;
    format?: string;
  };
}

export function FileViewer({ url, type, metadata }: FileViewerProps) {
  return (
    <div className="bg-[#242424] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        {type === 'document' && <FileText size={20} className="text-gray-400" />}
        {type === 'spreadsheet' && <Table size={20} className="text-gray-400" />}
        {!['document', 'spreadsheet'].includes(type) && <File size={20} className="text-gray-400" />}
        <span className="text-sm font-medium">{metadata?.name || 'File Preview'}</span>
      </div>
      <div className="aspect-video bg-[#1a1a1a] rounded flex items-center justify-center">
        <span className="text-gray-500">File preview will be displayed here</span>
      </div>
      {metadata && (
        <div className="mt-2 text-sm text-gray-400">
          {metadata.format && <div>Format: {metadata.format}</div>}
          {metadata.size && <div>Size: {(metadata.size / 1024).toFixed(2)} KB</div>}
        </div>
      )}
    </div>
  );
}