import { storage } from '../utils/storage';
import { handleApiResponse, ServiceError } from '../utils/errorHandling';

export type ModelType = 'text' | 'image' | 'video' | '3d' | 'audio';

export type ImageModel = 'dalle-3' | 'stable-ultra' | 'stable-diffusion-3' | 'flux-1.1';
export type VideoModel = 'luma' | 'kling' | 'stable-video';
export type TextModel = 'gpt-4o' | 'gpt-4o-mini' | 'claude-sonnet' | 'claude-haiku' | 'llama';
export type ThreeDModel = 'stable-fast-3d';
export type AudioModel = 'meta-musicgen' | 'stable-audio';

export const AI_MODELS = {
  text: [
    { id: 'gpt-4o', name: 'GPT-4 Omega', provider: 'OpenAI', description: 'High-intelligence flagship model' },
    { id: 'gpt-4o-mini', name: 'GPT-4 Omega Mini', provider: 'OpenAI', description: 'Fast, affordable model' },
    { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', description: 'High-performance model' },
    { id: 'claude-haiku', name: 'Claude Haiku', provider: 'Anthropic', description: 'Fast, efficient model' },
    { id: 'llama', name: 'Llama', provider: 'Meta', description: 'Open source model' }
  ],
  image: [
    { id: 'dalle-3', name: 'DALL·E 3', provider: 'OpenAI', description: 'Latest image generation' },
    { id: 'stable-ultra', name: 'Stable Image Ultra', provider: 'Stability AI', description: 'Ultra-high quality' },
    { id: 'stable-diffusion-3', name: 'Stable Diffusion 3', provider: 'Stability AI', description: 'High-quality generation' },
    { id: 'flux-1.1', name: 'Flux Pro 1.1', provider: 'Flux', description: 'Professional quality' }
  ],
  video: [
    { id: 'stable-video', name: 'Stable Video', provider: 'Stability AI', description: 'High-quality video generation' },
    { id: 'luma', name: 'Luma', provider: 'Luma AI', description: 'High-quality video generation' },
    { id: 'kling', name: 'Kling', provider: 'Kling AI', description: 'Fast video synthesis' }
  ],
  threeD: [
    { id: 'stable-fast-3d', name: 'Stable Fast 3D', provider: 'Stability AI', description: '3D model generation' }
  ],
  audio: [
    { id: 'meta-musicgen', name: 'Meta MusicGen', provider: 'Meta', description: 'Music generation' },
    { id: 'stable-audio', name: 'Stable Audio', provider: 'Stability AI', description: 'Audio synthesis' }
  ]
};

interface GenerationOptions {
  prompt: string;
  texture_resolution?: '512' | '1024' | '2048';
  foreground_ratio?: number;
  remesh?: 'none' | 'quad' | 'triangle';
  vertex_count?: number;
}

interface GenerationResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function generate3D(options: GenerationOptions): Promise<GenerationResponse<ArrayBuffer>> {
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
    formData.append('texture_resolution', options.texture_resolution || '1024');
    formData.append('foreground_ratio', String(options.foreground_ratio || 0.85));
    formData.append('remesh', options.remesh || 'none');
    
    if (options.vertex_count !== undefined) {
      formData.append('vertex_count', String(options.vertex_count));
    }

    const response = await fetch('https://api.stability.ai/v2beta/3d/stable-fast-3d', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'model/*'
      },
      body: formData
    });

    if (!response.ok) {
      throw new ServiceError(
        'Failed to generate 3D model',
        response.status.toString(),
        await response.text()
      );
    }

    const modelData = await response.arrayBuffer();
    return {
      success: true,
      data: modelData
    };
  } catch (error) {
    console.error('3D generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate 3D model'
    };
  }
}