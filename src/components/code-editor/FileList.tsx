import React from 'react';
import { Plus, Code } from 'lucide-react';
import { CodeFile } from '../../types/code-editor';

interface FileListProps {
  files: CodeFile[];
  selectedFile: string | null;
  onFileSelect: (id: string) => void;
  onNewFile: () => void;
}

export function FileList({
  files,
  selectedFile,
  onFileSelect,
  onNewFile
}: FileListProps) {
  return (
    <div className="w-full h-full bg-[#242424] border-r border-[#333]">
      <div className="p-4 border-b border-[#333]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Files</h3>
          <button
            onClick={onNewFile}
            className="p-1.5 hover:bg-[#333] rounded"
            title="New File"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => onFileSelect(file.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded ${
                selectedFile === file.id
                  ? 'bg-[#333] text-white'
                  : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              <Code size={16} />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}