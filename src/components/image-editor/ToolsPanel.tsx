import React from 'react';
import { 
  MousePointer, 
  Move, 
  Crop, 
  Type, 
  Wand2,
  Pencil,
  Eraser,
  Droplet,
  Square,
  Circle,
  Scissors,
  Stamp,
  HandMetal,
  ZoomIn
} from 'lucide-react';
import { Tool } from '../../types/image-editor';

interface ToolsPanelProps {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
}

export function ToolsPanel({ selectedTool, onToolSelect }: ToolsPanelProps) {
  const tools = [
    { id: 'move' as Tool, icon: Move, tooltip: 'Move Tool (V)' },
    { id: 'marquee' as Tool, icon: MousePointer, tooltip: 'Marquee Tool (M)' },
    { id: 'lasso' as Tool, icon: Scissors, tooltip: 'Lasso Tool (L)' },
    { id: 'magic-wand' as Tool, icon: Wand2, tooltip: 'Magic Wand Tool (W)' },
    { id: 'crop' as Tool, icon: Crop, tooltip: 'Crop Tool (C)' },
    { id: 'eyedropper' as Tool, icon: Droplet, tooltip: 'Eyedropper Tool (I)' },
    { id: 'brush' as Tool, icon: Pencil, tooltip: 'Brush Tool (B)' },
    { id: 'eraser' as Tool, icon: Eraser, tooltip: 'Eraser Tool (E)' },
    { id: 'text' as Tool, icon: Type, tooltip: 'Text Tool (T)' },
    { id: 'shape' as Tool, icon: Square, tooltip: 'Shape Tool (U)' },
    { id: 'stamp' as Tool, icon: Stamp, tooltip: 'Clone Stamp Tool (S)' },
    { id: 'hand' as Tool, icon: HandMetal, tooltip: 'Hand Tool (H)' },
    { id: 'zoom' as Tool, icon: ZoomIn, tooltip: 'Zoom Tool (Z)' }
  ];

  return (
    <div className="w-16 bg-[#2a2a2a] border-r border-[#333] flex flex-col items-center py-2">
      {tools.map(({ id, icon: Icon, tooltip }) => (
        <button
          key={id}
          onClick={() => onToolSelect(id)}
          className={`w-10 h-10 mb-1 flex items-center justify-center rounded ${
            selectedTool === id 
              ? 'bg-[#454545] text-white' 
              : 'text-gray-400 hover:bg-[#353535] hover:text-white'
          }`}
          title={tooltip}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}