import { storage } from '@/utils/storage';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface OpenAIImageResponse {
  data: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

export async function generateImage(prompt: string): Promise<{ url: string; revisedPrompt?: string }> {
  const apiKey = storage.getApiKey('openai');
  if (!apiKey) {
    throw new APIError('OpenAI API key not found. Please add it in Settings.');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || `Request failed with status ${response.status}`;
      console.error('OpenAI API error:', {
        status: response.status,
        message: errorMessage,
        details: errorData
      });
      throw new APIError(errorMessage, response.status, errorData);
    }

    const data: OpenAIImageResponse = await response.json();
    
    if (!data.data?.[0]?.url) {
      throw new APIError('No image URL in response. The API response was invalid.');
    }

    return {
      url: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while generating the image';
    console.error('Image generation error:', {
      error,
      message: errorMessage
    });
    throw new APIError(errorMessage);
  }
}