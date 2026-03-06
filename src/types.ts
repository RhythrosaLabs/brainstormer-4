export type MediaType = 'text' | 'image' | 'video' | 'audio' | 'code' | '3d' | 'document' | 'spreadsheet' | 'graph' | 'file';

export interface Message {
  id: string;
  content: string;
  isBot: boolean;
  type: MediaType;
  timestamp: Date;
  mediaUrl?: string;
  mediaMetadata?: Record<string, unknown>;
  fileInfo?: {
    name: string;
    size: number;
    type: string;
  };
}