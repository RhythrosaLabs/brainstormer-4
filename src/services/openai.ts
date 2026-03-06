import { storage } from '../utils/storage';
import { handleApiResponse, ServiceError } from '../utils/errorHandling';

interface OpenAIImageOptions {
  model: 'dall-e-3';
  prompt: string;
  quality?: 'standard' | 'hd';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}

interface OpenAITextOptions {
  model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}

interface GenerationResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  url?: string;
}

export async function generateOpenAIText(options: OpenAITextOptions): Promise<GenerationResponse<string>> {
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
        model: options.model,
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
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 2000
      })
    });

    const data = await handleApiResponse<{
      choices: Array<{ message: { content: string } }>;
    }>(response, 'Text generation failed');

    if (!data.choices?.[0]?.message?.content) {
      throw new ServiceError('Invalid response format from OpenAI');
    }

    return {
      success: true,
      data: data.choices[0].message.content.trim()
    };
  } catch (error) {
    console.error('OpenAI text generation error:', {
      error,
      options
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate text'
    };
  }
}

export async function generateOpenAIImage(options: OpenAIImageOptions): Promise<GenerationResponse<Blob>> {
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
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model,
        prompt: options.prompt,
        n: 1,
        size: options.size ?? '1024x1024',
        quality: options.quality ?? 'standard',
        response_format: 'url'
      })
    });

    const data = await handleApiResponse<{
      data: Array<{ url: string }>;
    }>(response, 'Image generation failed');

    if (!data.data?.[0]?.url) {
      throw new ServiceError('No image URL in response');
    }

    // Download the image
    const imageResponse = await fetch(data.data[0].url);
    if (!imageResponse.ok) {
      throw new ServiceError('Failed to download generated image');
    }

    const imageBlob = await imageResponse.blob();
    if (!imageBlob.size) {
      throw new ServiceError('Downloaded image is empty');
    }

    return {
      success: true,
      data: imageBlob,
      url: data.data[0].url
    };
  } catch (error) {
    console.error('DALL-E image generation error:', {
      error,
      options,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image'
    };
  }
}