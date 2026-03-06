import { storage } from '../utils/storage';

interface ChatOptions {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface ChatResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export async function generateChatResponse(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = storage.getApiKey('openai');
  if (!apiKey) {
    return {
      success: false,
      error: 'OpenAI API key not found. Please add it in Settings.'
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: options.prompt
          }
        ],
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return {
      success: true,
      content: data.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('Chat error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate response'
    };
  }
}