import { storage } from '../utils/storage';

interface GenerationOptions {
  model: 'stable-ultra' | 'sd3.5-large' | 'sd3.5-large-turbo' | 'sd3.5-medium';
  prompt: string;
  cfg_scale?: number;
  motion_bucket_id?: number;
  seed?: number;
}

interface GenerationResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function generateImage(options: GenerationOptions): Promise<GenerationResponse<Blob>> {
  const apiKey = storage.getApiKey('stability');
  if (!apiKey) {
    return {
      success: false,
      error: 'Stability API key not found. Please add it in Settings.'
    };
  }

  try {
    const formData = new FormData();
    formData.append('prompt', options.prompt);
    formData.append('mode', 'text-to-image');
    formData.append('model', options.model);
    
    if (options.seed) {
      formData.append('seed', String(options.seed));
    }

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
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    const imageBlob = await response.blob();
    if (!imageBlob.size) {
      throw new Error('Received empty image data');
    }

    return {
      success: true,
      data: imageBlob
    };
  } catch (error) {
    console.error('Stability image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image'
    };
  }
}

export async function generateVideo(options: GenerationOptions): Promise<GenerationResponse<Blob>> {
  const apiKey = storage.getApiKey('stability');
  if (!apiKey) {
    return {
      success: false,
      error: 'Stability API key not found. Please add it in Settings.'
    };
  }

  try {
    // First generate an image with specific dimensions for video
    const imageResult = await generateImage({
      ...options,
      model: 'stable-ultra'
    });

    if (!imageResult.success || !imageResult.data) {
      throw new Error('Failed to generate initial image');
    }

    // Convert Blob to File with proper dimensions
    const imageFile = new File([imageResult.data], 'source.png', { type: 'image/png' });
    
    // Create form data for video generation
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('cfg_scale', String(options.cfg_scale || 1.8));
    formData.append('motion_bucket_id', String(options.motion_bucket_id || 127));
    
    if (options.seed) {
      formData.append('seed', String(options.seed));
    }

    // Start video generation
    const startResponse = await fetch('https://api.stability.ai/v2beta/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!startResponse.ok) {
      const error = await startResponse.json();
      throw new Error(error.message || 'Failed to start video generation');
    }

    const { id: generationId } = await startResponse.json();
    if (!generationId) {
      throw new Error('No generation ID received');
    }

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000));

      const resultResponse = await fetch(
        `https://api.stability.ai/v2beta/image-to-video/result/${generationId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'video/*'
          }
        }
      );

      if (resultResponse.status === 202) {
        attempts++;
        continue;
      }

      if (!resultResponse.ok) {
        const error = await resultResponse.json();
        throw new Error(error.message || 'Failed to fetch generated video');
      }

      const videoBlob = await resultResponse.blob();
      if (!videoBlob.size) {
        throw new Error('Received empty video data');
      }

      return {
        success: true,
        data: videoBlob
      };
    }

    throw new Error('Video generation timed out');
  } catch (error) {
    console.error('Video generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate video'
    };
  }
}