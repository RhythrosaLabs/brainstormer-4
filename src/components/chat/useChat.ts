import { useState, useCallback } from 'react';
import { Message } from '@/types';
import { handleCommand } from './CommandHandler';
import { useToast } from '@/hooks/useToast';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      isBot: false,
      type: 'text',
      timestamp: new Date()
    };
    addMessage(userMessage);

    setIsProcessing(true);
    try {
      const result = await handleCommand(content);

      if (!result.success) {
        throw new Error(result.error || 'Generation failed');
      }

      const responseMessage: Message = {
        id: crypto.randomUUID(),
        content: typeof result.data === 'string' ? result.data : '',
        isBot: true,
        type: result.type || 'text',
        timestamp: new Date(),
        mediaUrl: result.data instanceof Blob ? URL.createObjectURL(result.data) : undefined
      };
      addMessage(responseMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('Chat error:', error);

      const errorResponse: Message = {
        id: crypto.randomUUID(),
        isBot: true,
        type: 'error',
        timestamp: new Date(),
        content: errorMessage,
      };
      addMessage(errorResponse);
      showToast(errorMessage, 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, showToast]);

  return {
    messages,
    isProcessing,
    sendMessage
  };
}