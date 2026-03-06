import { APIError, generateImage } from '../api-client';

export interface ImageCommandOptions {
  prompt: string;
}

export async function handleImageCommand({ prompt }: ImageCommandOptions) {
  if (!prompt.trim()) {
    throw new APIError('Please provide a prompt for image generation');
  }

  return await generateImage(prompt);
}