import { CommandHandler, CommandResult } from '../types';
import { StabilityClient, APIError } from '@/lib/api';

export class VideoCommand implements CommandHandler {
  async execute(prompt: string): Promise<CommandResult> {
    if (!prompt) {
      return {
        type: 'error',
        content: 'Please provide a prompt for the video generation'
      };
    }

    try {
      const client = new StabilityClient();
      
      // First generate an image
      const imageResult = await client.generateImage(prompt);
      
      // Then convert it to video
      const videoResult = await client.generateVideo(imageResult.blob);

      return {
        type: 'video',
        content: `Generated video for prompt: "${prompt}"`,
        mediaUrl: videoResult.url
      };
    } catch (error) {
      console.error('Video generation error:', error);
      
      if (error instanceof APIError) {
        return {
          type: 'error',
          content: error.message
        };
      }

      return {
        type: 'error',
        content: 'Failed to generate video'
      };
    }
  }
}