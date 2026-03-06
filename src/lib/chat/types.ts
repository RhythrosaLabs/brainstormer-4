export interface Message {
  id: string;
  content: string;
  type: MediaType;
  isUser: boolean;
  timestamp: Date;
  mediaUrl?: string;
}

export type MediaType = 'text' | 'image' | 'video' | 'error';