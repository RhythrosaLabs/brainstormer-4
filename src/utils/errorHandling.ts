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

export async function handleApiResponse<T>(
  response: Response,
  errorPrefix: string
): Promise<T> {
  const requestId = response.headers.get('x-request-id');
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMessage = `${errorPrefix}: Request failed with status ${response.status}`;
    let errorDetails: unknown;

    try {
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        const validatedError = apiErrorSchema.safeParse(errorData);

        if (validatedError.success) {
          errorMessage = `${errorPrefix}: ${validatedError.data.message}`;
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
      response.status.toString(),
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

// Global error handler setup
export function setupGlobalErrorHandling() {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', {
      error: event.reason,
      timestamp: new Date().toISOString()
    });
  });

  window.addEventListener('error', (event) => {
    console.error('Uncaught Error:', {
      error: event.error,
      timestamp: new Date().toISOString()
    });
  });
}