import { storage } from '../utils/storage';

interface ImageOptions {
  prompt: string;
  size?: '1024x1024' | '1024x1792' | '1792x1024';
  quality?: 'standard' | 'hd';
  model?: string;
}

interface ImageResponse {
  success: boolean;
  imageUrl?: string;
  imageData?: Blob;
  error?: string;
}

export async function generateImage(options: ImageOptions): Promise<ImageResponse> {
  const apiKey = storage.getApiKey('openai');
  if (!apiKey) {
    return {
      success: false,
      error: 'OpenAI API key not found. Please add it in Settings.'
    };
  }

  try {
    // Generate image URL
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'dall-e-3',
        prompt: options.prompt,
        n: 1,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        response_format: 'url'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.data?.[0]?.url) {
      throw new Error('No image URL in API response');
    }

    const imageUrl = data.data[0].url;

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download generated image: ${imageResponse.statusText}`);
    }

    const imageBlob = await imageResponse.blob();
    if (!imageBlob.size) {
      throw new Error('Downloaded image is empty');
    }

    return {
      success: true,
      imageUrl,
      imageData: imageBlob
    };
  } catch (error) {
    console.error('Image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image'
    };
  }
}