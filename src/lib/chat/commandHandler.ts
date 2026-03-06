import { Message } from '@/types';
import { generateDalleImage, generateStabilityImage, generateText, generateVideo } from '@/lib/api';

export interface Command {
  name: string;
  description: string;
  handler: (prompt: string) => Promise<CommandResult>;
}

export interface CommandResult {
  success: boolean;
  data?: any;
  type?: 'text' | 'image' | 'video' | 'error';
  error?: string;
  url?: string;
}

export class CommandRegistry {
  private commands: Map<string, Command>;

  constructor() {
    this.commands = new Map();
    this.registerDefaultCommands();
  }

  private registerDefaultCommands() {
    this.register({
      name: 'image',
      description: 'Generate an image using DALL-E 3',
      handler: async (prompt) => {
        const result = await generateDalleImage(prompt);
        return { ...result, type: 'image' };
      }
    });

    this.register({
      name: 'image-sd',
      description: 'Generate an image using Stable Diffusion',
      handler: async (prompt) => {
        const result = await generateStabilityImage(prompt);
        return { ...result, type: 'image' };
      }
    });

    this.register({
      name: 'video',
      description: 'Generate a video from text',
      handler: async (prompt) => {
        const result = await generateVideo(prompt);
        if (!result.success) {
          return {
            success: false,
            type: 'error',
            error: result.error || 'Failed to generate video'
          };
        }
        return {
          success: true,
          type: 'video',
          data: result.data,
          url: result.url
        };
      }
    });
  }

  register(command: Command) {
    this.commands.set(command.name, command);
  }

  async handleCommand(content: string): Promise<CommandResult> {
    if (!content.startsWith('/')) {
      const result = await generateText(content);
      return { ...result, type: 'text' };
    }

    const [commandName, ...args] = content.slice(1).split(' ');
    const prompt = args.join(' ');

    if (!prompt) {
      return {
        success: false,
        error: 'Please provide a prompt after the command',
        type: 'error'
      };
    }

    const command = this.commands.get(commandName);
    if (!command) {
      return {
        success: false,
        error: `Unknown command: /${commandName}. Available commands: ${Array.from(this.commands.keys()).map(k => '/' + k).join(', ')}`,
        type: 'error'
      };
    }

    try {
      return await command.handler(prompt);
    } catch (error) {
      console.error(`Error executing command /${commandName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Command failed',
        type: 'error'
      };
    }
  }

  getCommands(): Command[] {
    return Array.from(this.commands.values());
  }
}

export const commandRegistry = new CommandRegistry();