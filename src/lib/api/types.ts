export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  url?: string;
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}