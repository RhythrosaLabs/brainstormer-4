import { z } from 'zod';

const apiKeySchema = z.string().min(1);

const apiKeysSchema = z.object({
  openai: apiKeySchema.optional(),
  stability: apiKeySchema.optional(),
  anthropic: apiKeySchema.optional(),
  meta: apiKeySchema.optional(),
  luma: apiKeySchema.optional(),
  replicate: apiKeySchema.optional()
});

type ApiKeys = z.infer<typeof apiKeysSchema>;

const API_KEYS_KEY = 'brainstormer_api_keys';

export const storage = {
  getApiKeys(): ApiKeys {
    try {
      const keys = localStorage.getItem(API_KEYS_KEY);
      if (!keys) return {};
      
      const parsedKeys = JSON.parse(keys);
      return apiKeysSchema.parse(parsedKeys);
    } catch {
      return {};
    }
  },

  getApiKey(service: keyof ApiKeys): string | undefined {
    const keys = this.getApiKeys();
    return keys[service];
  },

  setApiKey(service: keyof ApiKeys, key: string): void {
    const keys = this.getApiKeys();
    const newKeys = { ...keys, [service]: key };
    
    try {
      apiKeysSchema.parse(newKeys);
      localStorage.setItem(API_KEYS_KEY, JSON.stringify(newKeys));
    } catch (error) {
      console.error('Invalid API key format:', error);
      throw new Error('Invalid API key format');
    }
  },

  removeApiKey(service: keyof ApiKeys): void {
    const keys = this.getApiKeys();
    delete keys[service];
    localStorage.setItem(API_KEYS_KEY, JSON.stringify(keys));
  },

  clearApiKeys(): void {
    localStorage.removeItem(API_KEYS_KEY);
  }
};