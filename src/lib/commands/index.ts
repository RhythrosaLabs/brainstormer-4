import { APIError, generateDalleImage, generateStabilityImage } from '../api';

export type CommandResult = {
  type: 'text' | 'image' | 'error';
  content: string;
  metadata?: {
    url?: string;
    revisedPrompt?: string;
  };
};

export async function executeCommand(input: string): Promise<CommandResult> {
  const [command, ...args] = input.trim().split(' ');
  const prompt = args.join(' ');

  if (!prompt) {
    return {
      type: 'error',
      content: 'Please provide a prompt after the command'
    };
  }

  try {
    switch (command) {
      case '/image': {
        const result = await generateDalleImage(prompt);
        return {
          type: 'image',
          content: `Generated image using DALL·E 3 for prompt: "${prompt}"`,
          metadata: {
            url: result.url,
            revisedPrompt: result.revisedPrompt
          }
        };
      }

      case '/image-sd': {
        const result = await generateStabilityImage(prompt);
        return {
          type: 'image',
          content: `Generated image using Stable Diffusion Ultra for prompt: "${prompt}"`,
          metadata: {
            url: result.url
          }
        };
      }

      default:
        return {
          type: 'error',
          content: `Unknown command: ${command}. Available commands: /image, /image-sd`
        };
    }
  } catch (error) {
    console.error('Command execution error:', {
      command,
      error
    });
    
    if (error instanceof APIError) {
      return {
        type: 'error',
        content: error.message
      };
    }

    return {
      type: 'error',
      content: error instanceof Error 
        ? `Error: ${error.message}`
        : 'An unexpected error occurred while processing your command'
    };
  }
}