import { replicateClient, APIError } from '../api-client';

interface ReplicateResponse {
  id: string;
  status: string;
  output?: string[];
  error?: string;
}

export async function generateMusic(prompt: string): Promise<string> {
  try {
    // Start generation
    const prediction = await replicateClient.post<ReplicateResponse>('/predictions', {
      version: "8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e7b",
      input: {
        prompt,
        duration: 30,
        model_version: "stereo-large",
        temperature: 1,
        classifier_free_guidance: 3,
        output_format: "mp3"
      }
    });

    if (!prediction.id) {
      throw new APIError('No prediction ID received');
    }

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000));

      const status = await replicateClient.get<ReplicateResponse>(
        `/predictions/${prediction.id}`
      );

      if (status.status === 'succeeded' && status.output?.[0]) {
        return status.output[0];
      }

      if (status.status === 'failed') {
        throw new APIError(status.error || 'Generation failed');
      }

      attempts++;
    }

    throw new APIError('Music generation timed out');
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to generate music', 500);
  }
}