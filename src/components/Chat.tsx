import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatProps {
  apiKeys: Record<string, string>;
  showHistory: boolean;
}

export function Chat({ apiKeys, showHistory }: ChatProps) {
  return (
    <div className="flex h-full bg-[#1a1a1a]">
      {showHistory && (
        <div className="w-64 border-r border-[#333] bg-[#242424] p-4">
          <h2 className="flex items-center gap-2 text-sm font-medium mb-4">
            <MessageSquare size={16} className="text-gray-400" />
            Chat History
          </h2>
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <div className="text-gray-400 text-center">
            Start a conversation...
          </div>
        </div>
        <div className="border-t border-[#333] p-4">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full bg-[#242424] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#45caff]"
          />
        </div>
      </div>
    </div>
  );
}