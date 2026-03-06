import { z } from 'zod';

// Error type validation schema
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.unknown().optional(),
  requestId: z.string().optional(),
  timestamp: z.string().optional()
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export class ServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown,
    public requestId?: string
  ) {
    super(message);
    this.name = 'ServiceError';

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      requestId: this.requestId,
      stack: this.stack
    };
  }
}

export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError;
}

export async function handleApiResponse<T>(
  response: Response,
  errorPrefix: string
): Promise<T> {
  const requestId = response.headers.get('x-request-id');
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMessage = `${errorPrefix}: Request failed with status ${response.status}`;
    let errorDetails: unknown;
    let errorCode = response.status.toString();

    try {
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        const validatedError = apiErrorSchema.safeParse(errorData);

        if (validatedError.success) {
          errorMessage = `${errorPrefix}: ${validatedError.data.message}`;
          errorCode = validatedError.data.code || errorCode;
          errorDetails = validatedError.data.details;
        } else {
          errorDetails = errorData;
        }
      } else {
        errorMessage = `${errorPrefix}: ${await response.text()}`;
      }
    } catch (parseError) {
      console.error('Error parsing API error response:', parseError);
    }

    throw new ServiceError(
      errorMessage,
      errorCode,
      errorDetails,
      requestId
    );
  }

  if (contentType?.includes('application/json')) {
    const data = await response.json();
    return data as T;
  }

  return response as unknown as T;
}

// Global error handler
export function setupGlobalErrorHandling() {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    // Log to error monitoring service if available
    if (event.reason instanceof Error) {
      logError(event.reason);
    }
  });

  window.addEventListener('error', (event) => {
    console.error('Uncaught Error:', event.error);
    
    // Log to error monitoring service if available
    logError(event.error);
  });
}

// Error logging function (can be connected to external monitoring service)
export function logError(
  error: Error | ServiceError | unknown,
  context?: Record<string, unknown>
) {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context
  };

  if (error instanceof ServiceError) {
    Object.assign(errorDetails, {
      code: error.code,
      details: error.details,
      requestId: error.requestId
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorDetails);
  }

  // TODO: Send to error monitoring service
  // Example: sendToErrorMonitoring(errorDetails);
}

// Rate limiting and retry utilities
export class RateLimiter {
  private queue: Array<() => Promise<void>> = [];
  private processing = false;
  private lastRequestTime = 0;

  constructor(private minRequestInterval: number = 1000) {}

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeToWait = this.lastRequestTime + this.minRequestInterval - now;
      
      if (timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }

      const fn = this.queue.shift();
      if (fn) {
        this.lastRequestTime = Date.now();
        await fn();
      }
    }
    this.processing = false;
  }
}

// Retry utility with exponential backoff
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true
  } = options;

  let attempt = 0;
  let lastError: unknown;

  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (!shouldRetry(error) || attempt + 1 >= maxAttempts) {
        throw error;
      }

      const delay = Math.min(
        initialDelay * Math.pow(2, attempt),
        maxDelay
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }

  throw lastError;
}