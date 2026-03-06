import { generateOpenAIText, generateOpenAIImage } from './openai';
import { generateVideo } from './stability';
import { generateMusic } from './replicate';
import { storage } from '../utils/storage';

interface CommandContext {
  selectedModel: string;
  currentTab: string;
  updateTab: (tab: string) => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export async function handleCommand(command: string, context: CommandContext) {
  const { selectedModel, currentTab, updateTab, showToast } = context;

  try {
    // Extract command and parameters
    const [cmd, ...params] = command.split(' ');
    const prompt = params.join(' ');

    if (!prompt) {
      throw new Error('Please provide a prompt');
    }

    switch (cmd) {
      case '/chat':
      case '/text': {
        const result = await generateOpenAIText({
          model: 'gpt-4',
          prompt
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        showToast?.('Text generated successfully', 'success');
        return result.data;
      }

      case '/image': {
        const result = await generateOpenAIImage({
          model: 'dall-e-3',
          prompt,
          quality: 'standard',
          size: '1024x1024'
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        showToast?.('Image generated successfully', 'success');
        return result.data;
      }

      case '/video': {
        const result = await generateVideo({
          model: 'stable-video',
          prompt,
          cfg_scale: 1.8,
          motion_bucket_id: 127
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        showToast?.('Video generated successfully', 'success');
        return result.data;
      }

      case '/music': {
        const result = await generateMusic({
          prompt,
          duration: 30,
          model_version: 'stereo-large',
          temperature: 1,
          classifier_free_guidance: 3,
          output_format: 'mp3'
        });

        if (!result.success) {
          throw new Error(result.error);
        }

        showToast?.('Music generated successfully', 'success');
        return result.data;
      }

      // Navigation Commands
      case '/images':
        updateTab('images');
        break;
      case '/videos':
        updateTab('videos');
        break;
      case '/audio':
        updateTab('audio');
        break;
      case '/3d':
        updateTab('3d');
        break;
      case '/code':
        updateTab('code');
        break;
      case '/board':
        updateTab('board');
        break;

      default:
        showToast?.('Unknown command', 'error');
        break;
    }
  } catch (error) {
    showToast?.(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    throw error;
  }
}

// Command completion suggestions
export function getCommandSuggestions(input: string): string[] {
  const commands = [
    '/chat', '/text', '/image', '/video', '/music',
    '/images', '/videos', '/audio', '/3d', '/code',
    '/board', '/save', '/settings'
  ];

  if (!input.startsWith('/')) {
    return [];
  }

  return commands.filter(cmd => cmd.startsWith(input.toLowerCase()));
}