import React from 'react';
import { Save, Play, Trash2, Split, Terminal as TerminalIcon } from 'lucide-react';

interface CodeEditorToolbarProps {
  selectedFile: string | null;
  onSave: () => void;
  onDelete: () => void;
  onRun: () => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  showTerminal: boolean;
  onToggleTerminal: () => void;
}

export function CodeEditorToolbar({
  selectedFile,
  onSave,
  onDelete,
  onRun,
  showPreview,
  onTogglePreview,
  showTerminal,
  onToggleTerminal
}: CodeEditorToolbarProps) {
  return (
    <div className="h-12 border-b border-[#333] flex items-center px-4 gap-2">
      <button
        onClick={onSave}
        disabled={!selectedFile}
        className="p-1.5 hover:bg-[#333] rounded disabled:opacity-50"
        title="Save"
      >
        <Save size={16} />
      </button>

      <button
        onClick={onRun}
        disabled={!selectedFile}
        className="p-1.5 hover:bg-[#333] rounded disabled:opacity-50"
        title="Run"
      >
        <Play size={16} />
      </button>

      <button
        onClick={onDelete}
        disabled={!selectedFile}
        className="p-1.5 hover:bg-[#333] rounded text-red-500 disabled:opacity-50"
        title="Delete File"
      >
        <Trash2 size={16} />
      </button>

      <div className="flex-1" />

      <button
        onClick={onTogglePreview}
        className={`p-1.5 hover:bg-[#333] rounded ${showPreview ? 'text-[#45caff]' : ''}`}
        title="Toggle Preview"
      >
        <Split size={16} />
      </button>

      <button
        onClick={onToggleTerminal}
        className={`p-1.5 hover:bg-[#333] rounded ${showTerminal ? 'text-[#45caff]' : ''}`}
        title="Toggle Terminal"
      >
        <TerminalIcon size={16} />
      </button>
    </div>
  );
}