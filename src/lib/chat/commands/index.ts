import { CommandResult } from '../types';
import { DalleImageCommand } from './image';
import { StabilityImageCommand } from './image-sd';
import { TextCommand } from './text';
import { APIError } from '../../api';

const commands = {
  '/image': new DalleImageCommand(),
  '/image-sd': new StabilityImageCommand(),
  'default': new TextCommand()
};

export async function executeCommand(input: string): Promise<CommandResult> {
  try {
    // Handle commands that start with /
    if (input.startsWith('/')) {
      const [command, ...args] = input.trim().split(' ');
      const prompt = args.join(' ').trim();

      const handler = commands[command as keyof typeof commands];
      if (!handler) {
        return {
          type: 'text',
          content: `Unknown command: ${command}. Available commands: /image, /image-sd`
        };
      }

      if (!prompt) {
        return {
          type: 'text',
          content: `Please add a description of what you'd like to generate after the ${command} command. For example:
${command} a beautiful sunset over mountains`
        };
      }

      return await handler.execute(prompt);
    }

    // Handle regular text input
    return await commands.default.execute(input);
  } catch (error) {
    console.error('Command execution error:', error);
    
    if (error instanceof APIError) {
      return {
        type: 'error',
        content: error.message
      };
    }

    return {
      type: 'error',
      content: error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred'
    };
  }
}