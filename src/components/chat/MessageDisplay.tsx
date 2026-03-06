import React from 'react';
import { Message } from '@/types';
import { Bot, User, AlertCircle } from 'lucide-react';

interface MessageDisplayProps {
  message: Message;
}

export function MessageDisplay({ message }: MessageDisplayProps) {
  const isError = message.type === 'error';
  const isUser = message.isUser;

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
        isUser ? 'bg-[#45caff]' : isError ? 'bg-red-500' : 'bg-[#ff1b6b]'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block rounded-lg p-4 ${
          isUser
            ? 'bg-gradient-to-r from-[#45caff]/10 via-[#45caff]/5 to-transparent border border-[#45caff]/20'
            : isError
              ? 'bg-red-500/10 border border-red-500/20'
              : 'bg-[#242424] border border-[#333]'
        }`}>
          <div className="prose prose-invert max-w-none text-left">
            {message.content}
          </div>

          {message.mediaUrl && (
            <div className="mt-3">
              {message.type === 'image' && (
                <img
                  src={message.mediaUrl}
                  alt="Generated content"
                  className="max-w-full rounded-lg shadow-lg"
                  loading="lazy"
                />
              )}
              {message.type === 'video' && (
                <video
                  src={message.mediaUrl}
                  controls
                  className="max-w-full rounded-lg shadow-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
              {message.type === 'audio' && (
                <audio
                  src={message.mediaUrl}
                  controls
                  className="w-full"
                />
              )}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}