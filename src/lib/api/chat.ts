import { storage } from '@/utils/storage';
import { ApiResponse } from './types';

export async function generateText(prompt: string): Promise<ApiResponse<string>> {
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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format');
    }

    return {
      success: true,
      data: data.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('Text generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate text'
    };
  }
}