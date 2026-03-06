import { Message, MediaType } from '@/types';
import { generateOpenAIText } from '@/services/openai';
import { generateImage, generateVideo } from '@/services/stability';
import { generate3D } from '@/services/ai';
import { generateMusic } from '@/services/replicate';

export async function handleCommand(content: string): Promise<{
  success: boolean;
  data?: any;
  type?: MediaType;
  error?: string;
}> {
  if (!content.startsWith('/')) {
    const result = await generateOpenAIText({
      model: 'gpt-4',
      prompt: content
    });
    return { ...result, type: 'text' };
  }

  const [command, ...args] = content.split(' ');
  const prompt = args.join(' ');

  if (!prompt) {
    return {
      success: false,
      error: 'Please provide a prompt after the command'
    };
  }

  try {
    switch (command) {
      case '/video': {
        const result = await generateVideo({
          model: 'stable-ultra',
          prompt,
          cfg_scale: 1.8,
          motion_bucket_id: 127
        });

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to generate video');
        }

        return {
          success: true,
          data: result.data,
          type: 'video'
        };
      }

      case '/3d': {
        const result = await generate3D({
          prompt,
          texture_resolution: '1024',
          foreground_ratio: 0.85,
          remesh: 'none'
        });

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to generate 3D model');
        }

        return {
          success: true,
          data: result.data,
          type: '3d'
        };
      }

      case '/music': {
        const result = await generateMusic({
          prompt,
          duration: 30,
          model_version: 'stereo-large'
        });

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to generate music');
        }

        return {
          success: true,
          data: result.data,
          type: 'audio'
        };
      }

      default: {
        const textResult = await generateOpenAIText({
          model: 'gpt-4',
          prompt: content
        });
        return { ...textResult, type: 'text' };
      }
    }
  } catch (error) {
    console.error(`Error handling command ${command}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Command failed',
      type: 'error'
    };
  }
}