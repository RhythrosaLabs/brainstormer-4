import { generateText, generateDalleImage, generateStableImage } from '@/lib/api';
import { MediaType } from '@/types';

interface CommandResult {
  success: boolean;
  content: string;
  type: MediaType;
  mediaUrl?: string;
}

export async function executeCommand(input: string): Promise<CommandResult> {
  // Handle commands
  if (input.startsWith('/')) {
    const [command, ...args] = input.split(' ');
    const prompt = args.join(' ');

    if (!prompt) {
      return {
        success: false,
        content: 'Please provide a prompt after the command',
        type: 'error'
      };
    }

    try {
      switch (command) {
        case '/image': {
          const result = await generateDalleImage(prompt);
          if (!result.success) {
            throw new Error(result.error);
          }
          return {
            success: true,
            content: `Generated image for prompt: "${prompt}"`,
            type: 'image',
            mediaUrl: URL.createObjectURL(result.data)
          };
        }

        case '/image-sd': {
          const result = await generateStableImage(prompt);
          if (!result.success) {
            throw new Error(result.error);
          }
          return {
            success: true,
            content: `Generated image for prompt: "${prompt}"`,
            type: 'image',
            mediaUrl: URL.createObjectURL(result.data)
          };
        }

        default:
          return {
            success: false,
            content: `Unknown command: ${command}. Available commands: /image, /image-sd`,
            type: 'error'
          };
      }
    } catch (error) {
      return {
        success: false,
        content: error instanceof Error ? error.message : 'Command failed',
        type: 'error'
      };
    }
  }

  // Handle regular chat
  try {
    const result = await generateText(input);
    if (!result.success) {
      throw new Error(result.error);
    }
    return {
      success: true,
      content: result.data,
      type: 'text'
    };
  } catch (error) {
    return {
      success: false,
      content: error instanceof Error ? error.message : 'Failed to generate response',
      type: 'error'
    };
  }
}