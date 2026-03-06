import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Message } from '@/types';

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  gradient: string;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSession: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export function ChatHistory({
  sessions,
  currentSession,
  onSelectSession,
  onNewSession,
  onDeleteSession
}: ChatHistoryProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const gradients = [
    'from-violet-500/10 via-fuchsia-500/10 to-pink-500/10',
    'from-pink-500/10 via-rose-500/10 to-red-500/10',
    'from-red-500/10 via-orange-500/10 to-amber-500/10',
    'from-amber-500/10 via-yellow-500/10 to-lime-500/10',
    'from-lime-500/10 via-green-500/10 to-emerald-500/10',
    'from-emerald-500/10 via-teal-500/10 to-cyan-500/10',
    'from-cyan-500/10 via-sky-500/10 to-blue-500/10',
    'from-blue-500/10 via-indigo-500/10 to-violet-500/10'
  ];

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
      <div className="p-4 border-b border-[#333] flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare size={20} className="min-w-[20px] text-gray-400" />
          {isExpanded && <span className="ml-3">Chat History</span>}
        </div>
        {isExpanded && (
          <button
            onClick={onNewSession}
            className="p-1.5 hover:bg-[#333] rounded"
            title="New Chat"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group relative ${
              currentSession === session.id ? 'bg-[#333]' : ''
            }`}
          >
            <button
              onClick={() => onSelectSession(session.id)}
              className={`w-full flex items-center px-4 py-3 hover:bg-gradient-to-r ${session.gradient} transition-all duration-300 group`}
            >
              <MessageSquare 
                size={16} 
                className="min-w-[16px] text-gray-400 group-hover:text-black transition-colors" 
              />
              {isExpanded && (
                <div className="ml-3 text-left overflow-hidden">
                  <div className="text-sm truncate text-gray-300 group-hover:text-black transition-colors">
                    {session.title || 'New Chat'}
                  </div>
                  <div className="text-xs text-gray-400 group-hover:text-black/70 transition-colors">
                    {session.messages.length} messages · {new Date(session.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </button>
            {isExpanded && (
              <button
                onClick={() => onDeleteSession(session.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-[#333] transition-opacity"
              >
                <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* New Chat Button (when collapsed) */}
      {!isExpanded && (
        <button
          onClick={onNewSession}
          className="p-4 border-t border-[#333] hover:bg-[#333]"
          title="New Chat"
        >
          <Plus size={20} />
        </button>
      )}
    </div>
  );
}