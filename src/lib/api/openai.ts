import { storage } from '../utils/storage';
import { ApiClient, APIError } from './client';

interface OpenAIResponse<T> {
  data: T;
  error?: {
    message: string;
    type: string;
    code: string;
  };
}

export class OpenAIClient extends ApiClient {
  constructor() {
    const apiKey = storage.getApiKey('openai');
    if (!apiKey) {
      throw new APIError('OpenAI API key not found. Please add it in Settings.');
    }
    super('https://api.openai.com/v1', apiKey);
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.request<OpenAIResponse<{
      choices: Array<{ message: { content: string } }>;
    }>>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.data.choices?.[0]?.message?.content) {
      throw new APIError('Invalid response format from OpenAI');
    }

    return response.data.choices[0].message.content;
  }
}