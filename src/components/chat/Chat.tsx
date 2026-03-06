import React, { useState, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { executeCommand } from '@/lib/chat/commands';
import { MessageStore } from '@/lib/chat/messageStore';
import { useToast } from '@/hooks/useToast';
import { Message } from '@/lib/chat/types';

const messageStore = new MessageStore();

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = messageStore.subscribe(setMessages);
    return unsubscribe;
  }, []);

  const handleSend = async (input: string) => {
    if (!input.trim() || isProcessing) return;

    messageStore.addMessage({
      content: input,
      type: 'text',
      isUser: true
    });

    setIsProcessing(true);

    try {
      const result = await executeCommand(input);
      
      messageStore.addMessage({
        content: result.content,
        type: result.type,
        isUser: false,
        metadata: result.metadata
      });

      if (result.type === 'error') {
        showToast(result.content, 'error');
      } else if (result.type === 'image') {
        showToast('Image generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      messageStore.addMessage({
        content: errorMessage,
        type: 'error',
        isUser: false
      });
      
      showToast(errorMessage, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} isProcessing={isProcessing} />
    </div>
  );
}