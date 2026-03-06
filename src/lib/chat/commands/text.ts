import { CommandHandler, CommandResult } from '../types';
import { OpenAIClient, APIError } from '@/lib/api';

export class TextCommand implements CommandHandler {
  async execute(prompt: string): Promise<CommandResult> {
    try {
      const client = new OpenAIClient();
      const result = await client.generateText(prompt);

      return {
        type: 'text',
        content: result
      };
    } catch (error) {
      console.error('Text generation error:', error);
      
      if (error instanceof APIError) {
        return {
          type: 'error',
          content: error.message
        };
      }

      return {
        type: 'error',
        content: 'Failed to generate text'
      };
    }
  }
}