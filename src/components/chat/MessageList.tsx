import React, { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { MessageDisplay } from './MessageDisplay';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-gray-400">
        <div className="max-w-md">
          <h2 className="text-xl font-semibold mb-2">Welcome to brAInstormer!</h2>
          <p className="mb-4">
            Chat naturally with AI or try special commands:
          </p>
          <div className="space-y-2 text-sm">
            <div className="bg-[#242424] p-2 rounded">
              <code className="text-[#45caff]">/image</code> Generate images with DALL-E 3
            </div>
            <div className="bg-[#242424] p-2 rounded">
              <code className="text-[#45caff]">/image-sd</code> Generate images with Stable Diffusion
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((message) => (
          <MessageDisplay key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}