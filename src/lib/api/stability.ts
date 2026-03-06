import { storage } from '@/utils/storage';
import { ApiResponse } from './types';

export async function generateStabilityImage(prompt: string): Promise<ApiResponse<Blob>> {
  const apiKey = storage.getApiKey('stability');
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Stability API key not found. Please add it in Settings.'
    };
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
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    const imageBlob = await response.blob();
    if (!imageBlob.size) {
      throw new Error('Generated image is empty');
    }

    return {
      success: true,
      data: imageBlob,
      url: URL.createObjectURL(imageBlob)
    };
  } catch (error) {
    console.error('Stability image generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image'
    };
  }
}

export async function generateVideo(prompt: string): Promise<ApiResponse<Blob>> {
  const apiKey = storage.getApiKey('stability');
  
  if (!apiKey) {
    return {
      success: false,
      error: 'Stability API key not found. Please add it in Settings.'
    };
  }

  try {
    // First generate an image with specific dimensions for video
    const imageResponse = await generateStabilityImage(prompt);
    if (!imageResponse.success || !imageResponse.data) {
      throw new Error('Failed to generate initial image for video');
    }

    // Start video generation
    const formData = new FormData();
    formData.append('image', new Blob([imageResponse.data], { type: 'image/png' }));
    formData.append('cfg_scale', '1.8');
    formData.append('motion_bucket_id', '127');

    const response = await fetch('https://api.stability.ai/v2beta/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    const { id: generationId } = await response.json();

    // Poll for results
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
        throw new Error(`Failed to fetch video result: ${resultResponse.status}`);
      }

      const videoBlob = await resultResponse.blob();
      if (!videoBlob.size) {
        throw new Error('Generated video is empty');
      }

      return {
        success: true,
        data: videoBlob,
        url: URL.createObjectURL(videoBlob)
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