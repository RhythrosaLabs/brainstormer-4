import { CommandHandler, CommandResult } from '../types';
import { StabilityClient, APIError } from '@/lib/api';

export class StabilityImageCommand implements CommandHandler {
  async execute(prompt: string): Promise<CommandResult> {
    if (!prompt) {
      return {
        type: 'error',
        content: 'Please provide a prompt for the image generation'
      };
    }

    try {
      const client = new StabilityClient();
      const result = await client.generateImage(prompt);

      return {
        type: 'image',
        content: `Generated image using Stable Diffusion Ultra for prompt: "${prompt}"`,
        mediaUrl: result.url
      };
    } catch (error) {
      console.error('Stability image generation error:', error);
      
      if (error instanceof APIError) {
        return {
          type: 'error',
          content: error.message
        };
      }

      return {
        type: 'error',
        content: 'Failed to generate image'
      };
    }
  }
}