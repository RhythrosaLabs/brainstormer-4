import React from 'react';
import { 
  Box, 
  Circle, 
  Cylinder as CylinderIcon,
  Move, 
  RotateCw, 
  Maximize, 
  Grid as GridIcon,
  Undo as UndoIcon,
  Redo as RedoIcon
} from 'lucide-react';
import { TransformMode } from './types';

interface ToolbarProps {
  onAddObject: (type: "box" | "sphere" | "cylinder") => void;
  transformMode: TransformMode;
  onTransformModeChange: (mode: TransformMode) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function Toolbar({
  onAddObject,
  transformMode,
  onTransformModeChange,
  showGrid,
  onToggleGrid,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: ToolbarProps) {
  return (
    <div className="h-12 border-b border-[#333] flex items-center px-4 gap-2">
      <div className="flex items-center gap-2 border-r border-[#333] pr-4">
        <button
          onClick={() => onAddObject("box")}
          className="p-1.5 hover:bg-[#333] rounded"
          title="Add Box"
        >
          <Box size={16} />
        </button>
        <button
          onClick={() => onAddObject("sphere")}
          className="p-1.5 hover:bg-[#333] rounded"
          title="Add Sphere"
        >
          <Circle size={16} />
        </button>
        <button
          onClick={() => onAddObject("cylinder")}
          className="p-1.5 hover:bg-[#333] rounded"
          title="Add Cylinder"
        >
          <CylinderIcon size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 border-r border-[#333] pr-4">
        <button
          onClick={() => onTransformModeChange("translate")}
          className={`p-1.5 rounded ${
            transformMode === "translate" ? "bg-[#333]" : "hover:bg-[#333]"
          }`}
          title="Move"
        >
          <Move size={16} />
        </button>
        <button
          onClick={() => onTransformModeChange("rotate")}
          className={`p-1.5 rounded ${
            transformMode === "rotate" ? "bg-[#333]" : "hover:bg-[#333]"
          }`}
          title="Rotate"
        >
          <RotateCw size={16} />
        </button>
        <button
          onClick={() => onTransformModeChange("scale")}
          className={`p-1.5 rounded ${
            transformMode === "scale" ? "bg-[#333]" : "hover:bg-[#333]"
          }`}
          title="Scale"
        >
          <Maximize size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 border-r border-[#333] pr-4">
        <button
          onClick={onToggleGrid}
          className={`p-1.5 rounded ${
            showGrid ? "bg-[#333]" : "hover:bg-[#333]"
          }`}
          title="Toggle Grid"
        >
          <GridIcon size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          className="p-1.5 hover:bg-[#333] rounded"
          title="Undo"
          disabled={!canUndo}
        >
          <UndoIcon size={16} className={!canUndo ? "opacity-50" : ""} />
        </button>
        <button
          onClick={onRedo}
          className="p-1.5 hover:bg-[#333] rounded"
          title="Redo"
          disabled={!canRedo}
        >
          <RedoIcon size={16} className={!canRedo ? "opacity-50" : ""} />
        </button>
      </div>
    </div>
  );
}