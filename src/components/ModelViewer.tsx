import React from 'react';
import { Box, Boxes } from 'lucide-react';

interface ModelViewerProps {
  url?: string;
  data?: any;
}

export function ModelViewer({ url, data }: ModelViewerProps) {
  return (
    <div className="bg-[#242424] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <Box size={20} className="text-gray-400" />
        <span className="text-sm font-medium">3D Model Preview</span>
      </div>
      <div className="aspect-video bg-[#1a1a1a] rounded flex items-center justify-center">
        <div className="text-center">
          <Boxes size={48} className="mx-auto mb-2 text-gray-500" />
          <span className="text-gray-500">3D model will be displayed here</span>
        </div>
      </div>
    </div>
  );
}