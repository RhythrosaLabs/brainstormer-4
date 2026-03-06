import React from 'react';
import { Save, Trash2 } from 'lucide-react';

interface EditorToolbarProps {
  selectedFile: string | null;
  onSave: () => void;
  onDelete: () => void;
}

export function EditorToolbar({
  selectedFile,
  onSave,
  onDelete
}: EditorToolbarProps) {
  return (
    <div className="h-12 border-b border-[#333] flex items-center px-4 gap-2">
      <button
        onClick={onSave}
        disabled={!selectedFile}
        className="p-1.5 hover:bg-[#333] rounded disabled:opacity-50"
        title="Save (Ctrl+S)"
      >
        <Save size={16} />
      </button>

      <button
        onClick={onDelete}
        disabled={!selectedFile}
        className="p-1.5 hover:bg-[#333] rounded text-red-500 disabled:opacity-50"
        title="Delete File"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}