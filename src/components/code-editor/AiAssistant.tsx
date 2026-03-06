import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { generateOpenAIText } from '../../services/openai';
import { useToast } from '../../hooks/useToast';

interface AiAssistantProps {
  content: string;
  onContentChange: (content: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function AiAssistant({
  content,
  onContentChange,
  isProcessing,
  setIsProcessing
}: AiAssistantProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { showToast } = useToast();

  const handleAiAction = async (type: string) => {
    setIsProcessing(true);
    setShowDropdown(false);

    try {
      let prompt = '';
      switch (type) {
        case 'fix':
          prompt = `Fix the following code and explain the issues:\n\n${content}`;
          break;
        case 'improve':
          prompt = `Improve the following code for better performance and readability:\n\n${content}`;
          break;
        case 'explain':
          prompt = `Explain how the following code works:\n\n${content}`;
          break;
        case 'document':
          prompt = `Add comprehensive documentation to the following code:\n\n${content}`;
          break;
        case 'test':
          prompt = `Generate unit tests for the following code:\n\n${content}`;
          break;
      }

      const result = await generateOpenAIText({
        model: 'gpt-4',
        prompt
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to get AI assistance');
      }

      onContentChange(result.data);
      showToast('AI assistance applied!', 'success');
    } catch (error) {
      console.error('AI assistance error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to get AI assistance', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isProcessing}
        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#ff1b6b] to-[#45caff] rounded text-white hover:opacity-90 disabled:opacity-50"
      >
        <RefreshCw size={16} className={isProcessing ? 'animate-spin' : ''} />
        AI Assist
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-[#242424] rounded-lg shadow-lg border border-[#333] overflow-hidden z-50">
          <button
            onClick={() => handleAiAction('fix')}
            className="w-full px-4 py-2 text-left hover:bg-[#333] text-sm"
          >
            Fix Issues
          </button>
          <button
            onClick={() => handleAiAction('improve')}
            className="w-full px-4 py-2 text-left hover:bg-[#333] text-sm"
          >
            Improve Code
          </button>
          <button
            onClick={() => handleAiAction('explain')}
            className="w-full px-4 py-2 text-left hover:bg-[#333] text-sm"
          >
            Explain Code
          </button>
          <button
            onClick={() => handleAiAction('document')}
            className="w-full px-4 py-2 text-left hover:bg-[#333] text-sm"
          >
            Add Documentation
          </button>
          <button
            onClick={() => handleAiAction('test')}
            className="w-full px-4 py-2 text-left hover:bg-[#333] text-sm"
          >
            Generate Tests
          </button>
        </div>
      )}
    </div>
  );
}