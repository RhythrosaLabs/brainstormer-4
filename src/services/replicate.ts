import { storage } from '../utils/storage';

interface MusicGenerationOptions {
  prompt: string;
  duration?: number;
  model_version?: string;
  temperature?: number;
  classifier_free_guidance?: number;
  output_format?: string;
}

interface GenerationResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ReplicateError {
  detail?: string;
  error?: string;
}

async function handleReplicateError(response: Response): Promise<string> {
  try {
    const errorData: ReplicateError = await response.json();
    return errorData.detail || errorData.error || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

export async function generateMusic(options: MusicGenerationOptions): Promise<GenerationResponse<Blob>> {
  const apiKey = storage.getApiKey('replicate');
  if (!apiKey) {
    return {
      success: false,
      error: 'Replicate API key not found. Please add it in Settings.'
    };
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
        input: {
          prompt: options.prompt,
          duration: options.duration || 30,
          model_version: options.model_version || 'stereo-large',
          temperature: options.temperature || 1,
          classifier_free_guidance: options.classifier_free_guidance || 3,
          output_format: options.output_format || 'mp3'
        }
      })
    });

    if (!response.ok) {
      const errorMessage = await handleReplicateError(response);
      throw new Error(errorMessage);
    }

    const prediction = await response.json();
    if (!prediction.id) {
      throw new Error('No prediction ID received');
    }

    // Poll for results
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000));

      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${apiKey}`
          }
        }
      );

      if (!pollResponse.ok) {
        const errorMessage = await handleReplicateError(pollResponse);
        throw new Error(errorMessage);
      }

      const status = await pollResponse.json();
      
      if (status.status === 'succeeded' && status.output) {
        const audioUrl = status.output;
        const audioResponse = await fetch(audioUrl);
        
        if (!audioResponse.ok) {
          throw new Error('Failed to download generated audio');
        }

        const audioBlob = await audioResponse.blob();
        if (!audioBlob.size) {
          throw new Error('Generated audio is empty');
        }

        return {
          success: true,
          data: audioBlob
        };
      } else if (status.status === 'failed') {
        throw new Error(status.error || 'Generation failed');
      }

      attempts++;
    }

    throw new Error('Music generation timed out');
  } catch (error) {
    console.error('Music generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate music'
    };
  }
}