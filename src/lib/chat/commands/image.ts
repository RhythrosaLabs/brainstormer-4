import { CommandHandler, CommandResult } from '../types';
import { OpenAIClient, APIError } from '@/lib/api';

export class DalleImageCommand implements CommandHandler {
  async execute(prompt: string): Promise<CommandResult> {
    if (!prompt) {
      return {
        type: 'error',
        content: 'Please provide a prompt for the image generation'
      };
    }

    try {
      const client = new OpenAIClient();
      const result = await client.generateImage(prompt);

      return {
        type: 'image',
        content: `Generated image using DALL·E 3 for prompt: "${prompt}"`,
        mediaUrl: result.url
      };
    } catch (error) {
      console.error('DALL-E image generation error:', error);
      
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