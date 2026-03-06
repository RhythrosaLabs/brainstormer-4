import React from 'react';
import { ZoomIn, ZoomOut, Grid } from 'lucide-react';

interface SpreadsheetStatusBarProps {
  selectedCell: string | null;
  zoom: number;
  showGridlines: boolean;
  onZoomChange: (zoom: number) => void;
  onShowGridlinesChange: (show: boolean) => void;
}

export function SpreadsheetStatusBar({
  selectedCell,
  zoom,
  showGridlines,
  onZoomChange,
  onShowGridlinesChange
}: SpreadsheetStatusBarProps) {
  return (
    <div className="h-6 border-t border-[#333] flex items-center justify-between px-2 bg-[#242424] text-sm">
      <div className="flex items-center gap-4">
        <span className="text-gray-400">
          {selectedCell ? `Selected: ${selectedCell}` : 'No selection'}
        </span>
        <button
          onClick={() => onShowGridlinesChange(!showGridlines)}
          className={`flex items-center gap-1 ${
            showGridlines ? 'text-[#45caff]' : 'text-gray-400'
          }`}
        >
          <Grid size={14} />
          <span>Gridlines</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoomChange(Math.max(25, zoom - 25))}
          className="p-1 hover:bg-[#333] rounded"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <span className="w-12 text-center">{zoom}%</span>
        <button
          onClick={() => onZoomChange(Math.min(400, zoom + 25))}
          className="p-1 hover:bg-[#333] rounded"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
      </div>
    </div>
  );
}