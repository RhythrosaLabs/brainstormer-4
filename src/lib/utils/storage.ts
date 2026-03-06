// Type definitions for stored data
interface StorageData {
  apiKeys: Record<string, string>;
  settings: Record<string, unknown>;
}

class StorageManager {
  private prefix = 'brainstormer_';

  private getKey(key: string): string {
    return this.prefix + key;
  }

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  // API Key specific methods
  getApiKey(service: string): string | undefined {
    const apiKeys = this.getItem<Record<string, string>>('apiKeys', {});
    return apiKeys[service];
  }

  setApiKey(service: string, key: string): void {
    const apiKeys = this.getItem<Record<string, string>>('apiKeys', {});
    apiKeys[service] = key;
    this.setItem('apiKeys', apiKeys);
  }

  removeApiKey(service: string): void {
    const apiKeys = this.getItem<Record<string, string>>('apiKeys', {});
    delete apiKeys[service];
    this.setItem('apiKeys', apiKeys);
  }
}

export const storage = new StorageManager();