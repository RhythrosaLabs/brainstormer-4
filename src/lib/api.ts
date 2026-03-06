import { storage } from '@/utils/storage';

export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function generateText(prompt: string): Promise<APIResponse<string>> {
  const apiKey = storage.getApiKey('openai');
  if (!apiKey) {
    throw new APIError('OpenAI API key not found');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
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
      throw new APIError(error.error?.message || 'Failed to generate text');
    }

    const data = await response.json();
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

export async function generateDalleImage(prompt: string): Promise<APIResponse<Blob>> {
  const apiKey = storage.getApiKey('openai');
  if (!apiKey) {
    throw new APIError('OpenAI API key not found');
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
      const error = await response.json();
      throw new APIError(error.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new APIError('Failed to download generated image');
    }

    const imageBlob = await imageResponse.blob();
    return { success: true, data: imageBlob };
  } catch (error) {
    console.error('DALL-E image generation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate image'
    };
  }
}

export async function generateStableImage(prompt: string): Promise<APIResponse<Blob>> {
  const apiKey = storage.getApiKey('stability');
  if (!apiKey) {
    throw new APIError('Stability API key not found');
  }

  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'png');

    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/ultra', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'image/*'
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error.message || 'Failed to generate image');
    }

    const imageBlob = await response.blob();
    return { success: true, data: imageBlob };
  } catch (error) {
    console.error('Stable Diffusion image generation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate image'
    };
  }
}