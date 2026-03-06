import React from 'react';
import { Search } from 'lucide-react';

interface CommandPaletteProps {
  onCommand: (command: string) => void;
}

export function CommandPalette({ onCommand }: CommandPaletteProps) {
  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Type a command or search... (⌘K)"
          className="w-full bg-[#242424] text-white pl-10 pr-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#45caff] rounded-lg"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onCommand(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
    </div>
  );
}