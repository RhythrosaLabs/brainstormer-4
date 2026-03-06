import { storage } from '@/utils/storage';
import { ApiResponse } from './types';

export async function generateDalleImage(prompt: string): Promise<ApiResponse<Blob>> {
  const apiKey = storage.getApiKey('openai');
  
  if (!apiKey) {
    return {
      success: false,
      error: 'OpenAI API key not found. Please add it in Settings.'
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
      throw new Error(error.error?.message || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.data?.[0]?.url) {
      throw new Error('No image URL in response');
    }

    const imageUrl = data.data[0].url;
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image');
    }

    const imageBlob = await imageResponse.blob();
    if (!imageBlob.size) {
      throw new Error('Downloaded image is empty');
    }

    return {
      success: true,
      data: imageBlob,
      imageUrl
    };
  } catch (error) {
    console.error('DALL-E image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image'
    };
  }
}