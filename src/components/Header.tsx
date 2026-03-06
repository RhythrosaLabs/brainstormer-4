import React from 'react';
import { Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 border-b border-dark-800 flex items-center justify-between px-6 bg-dark-950">
      <div className="flex items-center gap-4">
        <span className="text-sm text-dark-300">AI Assistant</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-dark-300 hover:text-white hover:bg-dark-800 rounded-lg transition-colors">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}