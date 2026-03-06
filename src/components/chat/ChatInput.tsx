import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { MediaSelector } from './MediaSelector';

interface ChatInputProps {
  onSend: (message: string) => void;
  isProcessing: boolean;
}

export function ChatInput({ onSend, isProcessing }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showMediaSelector, setShowMediaSelector] = useState(false);

  const handleSubmit = () => {
    if (input.trim() && !isProcessing) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="border-t border-[#333] p-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowMediaSelector(!showMediaSelector)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Add media"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message or type '/' for commands..."
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#45caff]"
            disabled={isProcessing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {showMediaSelector && (
            <MediaSelector
              onSelect={(type) => {
                setShowMediaSelector(false);
                setInput(`/${type} `);
              }}
              onClose={() => setShowMediaSelector(false)}
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isProcessing || !input.trim()}
          className="p-2 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}