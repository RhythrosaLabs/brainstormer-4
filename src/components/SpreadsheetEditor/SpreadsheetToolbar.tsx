import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Clipboard,
  Scissors,
  Undo2,
  Redo2,
  Table,
  Type,
  PaintBucket
} from 'lucide-react';

interface SpreadsheetToolbarProps {
  onFormatClick: (format: string) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  activeFormats: Set<string>;
}

export function SpreadsheetToolbar({
  onFormatClick,
  onCopy,
  onCut,
  onPaste,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  activeFormats
}: SpreadsheetToolbarProps) {
  const tools = [
    { id: 'copy', icon: Copy, label: 'Copy (Ctrl+C)', action: onCopy },
    { id: 'cut', icon: Scissors, label: 'Cut (Ctrl+X)', action: onCut },
    { id: 'paste', icon: Clipboard, label: 'Paste (Ctrl+V)', action: onPaste },
    { type: 'separator' },
    { id: 'undo', icon: Undo2, label: 'Undo (Ctrl+Z)', action: onUndo, disabled: !canUndo },
    { id: 'redo', icon: Redo2, label: 'Redo (Ctrl+Y)', action: onRedo, disabled: !canRedo },
    { type: 'separator' },
    { id: 'bold', icon: Bold, label: 'Bold (Ctrl+B)', format: true },
    { id: 'italic', icon: Italic, label: 'Italic (Ctrl+I)', format: true },
    { id: 'underline', icon: Underline, label: 'Underline (Ctrl+U)', format: true },
    { type: 'separator' },
    { id: 'align-left', icon: AlignLeft, label: 'Align Left', format: true },
    { id: 'align-center', icon: AlignCenter, label: 'Align Center', format: true },
    { id: 'align-right', icon: AlignRight, label: 'Align Right', format: true },
    { type: 'separator' },
    { id: 'merge', icon: Table, label: 'Merge Cells', format: true },
    { id: 'font', icon: Type, label: 'Font', format: true },
    { id: 'fill', icon: PaintBucket, label: 'Fill Color', format: true }
  ];

  return (
    <div className="h-10 border-b border-[#333] flex items-center px-2 gap-1 bg-[#242424]">
      {tools.map((tool, index) => {
        if (tool.type === 'separator') {
          return <div key={index} className="w-px h-6 bg-[#333] mx-1" />;
        }

        const Icon = tool.icon;
        const isActive = tool.format && activeFormats.has(tool.id);

        return (
          <button
            key={tool.id}
            onClick={() => tool.format ? onFormatClick(tool.id) : tool.action?.()}
            disabled={tool.disabled}
            className={`p-1.5 rounded ${
              isActive
                ? 'bg-[#333] text-[#45caff]'
                : 'hover:bg-[#333] text-gray-400 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={tool.label}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}