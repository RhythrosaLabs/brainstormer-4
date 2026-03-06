import React, { useState, KeyboardEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload
      console.log('File selected:', file);
    }
  };

  return (
    <div className="border-t border-[#2a2a2a] p-4">
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-[#2a2a2a] text-white rounded-lg p-3 min-h-[50px] max-h-[200px] resize-y focus:outline-none focus:ring-1 focus:ring-[#45caff]"
          rows={1}
        />
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg px-4 py-2 cursor-pointer transition-all flex items-center justify-center"
          >
            <Paperclip size={20} />
          </label>
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-[#ff1b6b] to-[#45caff] hover:opacity-90 disabled:opacity-50 text-white rounded-lg px-4 py-2 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}