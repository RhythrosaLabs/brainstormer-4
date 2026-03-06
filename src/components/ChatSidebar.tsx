import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, MessageSquare } from 'lucide-react';

interface ChatHistoryEntry {
  id: string;
  title: string;
  date: Date;
}

export function ChatSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [chatHistory] = useState<ChatHistoryEntry[]>([
    // Example history entries
    { id: '1', title: 'Project Discussion', date: new Date() },
    { id: '2', title: 'Image Generation', date: new Date() },
    { id: '3', title: 'Code Review', date: new Date() }
  ]);

  return (
    <div 
      className={`${
        isExpanded ? 'w-64' : 'w-16'
      } bg-[#242424] border-r border-[#333] flex flex-col relative transition-all duration-200`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-[#242424] border border-[#333] rounded-full p-1 hover:bg-[#333] z-10"
      >
        {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Header */}
      <div className="p-4 border-b border-[#333] flex items-center">
        <MessageSquare size={20} className="min-w-[20px]" />
        {isExpanded && <span className="ml-3">Chat History</span>}
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto">
        {chatHistory.map((chat) => (
          <button
            key={chat.id}
            className="w-full flex items-center px-4 py-3 hover:bg-[#333] text-left"
          >
            <MessageSquare size={16} className="min-w-[16px] text-gray-400" />
            {isExpanded && (
              <div className="ml-3 truncate">
                <div className="text-sm truncate">{chat.title}</div>
                <div className="text-xs text-gray-400">
                  {chat.date.toLocaleDateString()}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}