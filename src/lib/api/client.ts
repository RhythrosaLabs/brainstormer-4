import { storage } from '../utils/storage';
import { z } from 'zod';

// API Response validation schemas
const errorSchema = z.object({
  message: z.string(),
  type: z.string().optional(),
  code: z.string().optional(),
  param: z.string().optional(),
});

const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: errorSchema.optional(),
});

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown,
    public requestId?: string
  ) {
    super(message);
    this.name = 'APIError';
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      requestId: this.requestId,
      stack: this.stack
    };
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  const requestId = response.headers.get('x-request-id');
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorDetails: unknown;

    try {
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        const validatedError = errorSchema.safeParse(error);
        
        if (validatedError.success) {
          errorMessage = validatedError.data.message;
          errorDetails = validatedError.data;
        } else {
          errorDetails = error;
        }
      } else {
        errorMessage = await response.text();
      }
    } catch (parseError) {
      console.error('Error parsing API error response:', parseError);
    }

    throw new APIError(
      errorMessage,
      response.status,
      errorDetails,
      requestId
    );
  }

  if (contentType?.includes('application/json')) {
    const data = await response.json();
    const validatedResponse = apiResponseSchema.safeParse(data);

    if (validatedResponse.success) {
      return validatedResponse.data as T;
    }

    throw new APIError(
      'Invalid API response format',
      response.status,
      validatedResponse.error,
      requestId
    );
  }

  // Handle non-JSON responses (like blobs)
  return response as unknown as T;
}

export class ApiClient {
  private baseUrl: string;
  private apiKey: string;
  private defaultHeaders: Record<string, string>;
  private requestTimeout: number;

  constructor(
    baseUrl: string,
    apiKey: string,
    options: {
      defaultHeaders?: Record<string, string>;
      timeout?: number;
    } = {}
  ) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.apiKey = apiKey;
    this.defaultHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.defaultHeaders
    };
    this.requestTimeout = options.timeout || 30000; // Default 30s timeout
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<T> {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers
        },
        signal: controller.signal
      });

      return await handleApiResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        // Retry on 429 (Rate Limit) or 5xx errors
        if (
          retries > 0 && 
          (error.statusCode === 429 || (error.statusCode && error.statusCode >= 500))
        ) {
          const delay = error.statusCode === 429 
            ? this.getRetryDelay(response.headers)
            : this.getExponentialBackoff(3 - retries);

          await new Promise(resolve => setTimeout(resolve, delay));
          return this.request<T>(endpoint, options, retries - 1);
        }
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }

      throw new APIError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private getRetryDelay(headers: Headers): number {
    const retryAfter = headers.get('Retry-After');
    if (retryAfter) {
      // If Retry-After is a timestamp
      if (isNaN(Number(retryAfter))) {
        return Math.max(0, new Date(retryAfter).getTime() - Date.now());
      }
      // If Retry-After is seconds
      return Number(retryAfter) * 1000;
    }
    return 1000; // Default to 1 second
  }

  private getExponentialBackoff(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}