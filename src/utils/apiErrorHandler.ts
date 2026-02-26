// API Error Handling and Retry Logic

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  retryable: boolean;
}

export class ApiErrorHandler {
  private static readonly MAX_RETRIES = 3;
  private static readonly BASE_DELAY = 1000; // 1 second
  private static readonly MAX_DELAY = 10000; // 10 seconds

  static async withRetry<T>(
    apiCall: () => Promise<T>,
    apiName: string,
    maxRetries: number = this.MAX_RETRIES
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error as Error;
        const apiError = this.parseError(error, apiName);

        // Don't retry if it's not a retryable error
        if (!apiError.retryable || attempt === maxRetries) {
          console.error(`❌ ${apiName} API failed after ${attempt + 1} attempts:`, {
            message: apiError.message,
            status: apiError.status,
            code: apiError.code,
            originalError: lastError?.message || 'No details'
          });
          throw apiError;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.BASE_DELAY * Math.pow(2, attempt),
          this.MAX_DELAY
        );

        console.warn(`⚠️ ${apiName} API attempt ${attempt + 1} failed, retrying in ${delay}ms:`, apiError.message);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  static parseError(error: any, apiName: string): ApiError {
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        message: 'Network error. Please check your internet connection.',
        retryable: true
      };
    }

    // HTTP errors
    if (error.status) {
      switch (error.status) {
        case 401:
          return {
            message: `${apiName} API: Invalid credentials. Please check your API key.`,
            status: 401,
            code: 'UNAUTHORIZED',
            retryable: false
          };
        case 403:
          return {
            message: `${apiName} API: Access forbidden. Rate limit exceeded or insufficient permissions.`,
            status: 403,
            code: 'FORBIDDEN',
            retryable: true
          };
        case 404:
          return {
            message: `${apiName} API: Resource not found.`,
            status: 404,
            code: 'NOT_FOUND',
            retryable: false
          };
        case 429:
          return {
            message: `${apiName} API: Rate limit exceeded. Please try again later.`,
            status: 429,
            code: 'RATE_LIMIT',
            retryable: true
          };
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            message: `${apiName} API: Server error. Please try again later.`,
            status: error.status,
            code: 'SERVER_ERROR',
            retryable: true
          };
        default:
          return {
            message: `${apiName} API: HTTP error ${error.status}`,
            status: error.status,
            code: 'HTTP_ERROR',
            retryable: error.status >= 500
          };
      }
    }

    // API-specific errors
    if (error.message) {
      if (error.message.includes('API key')) {
        return {
          message: `${apiName} API: Invalid or missing API key.`,
          code: 'INVALID_API_KEY',
          retryable: false
        };
      }
      
      if (error.message.includes('quota')) {
        return {
          message: `${apiName} API: Quota exceeded.`,
          code: 'QUOTA_EXCEEDED',
          retryable: true
        };
      }
    }

    // Unknown errors
    return {
      message: `${apiName} API: ${error.message || 'Unknown error occurred'}`,
      retryable: false
    };
  }

  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static createSafeApiCall<T>(
    apiCall: () => Promise<T>,
    apiName: string,
    fallback?: T
  ): Promise<T> {
    return this.withRetry(apiCall, apiName)
      .catch(error => {
        console.error(`🚨 ${apiName} API call failed:`, error);
        if (fallback !== undefined) {
          console.warn(`📦 Using fallback value for ${apiName}`);
          return Promise.resolve(fallback);
        }
        throw error;
      });
  }
}

// Enhanced fetch with error handling
export async function safeFetch(
  url: string,
  options: RequestInit = {},
  apiName: string = 'API'
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      (error as any).status = response.status;
      throw error;
    }

    return response;
  } catch (error) {
    throw ApiErrorHandler.parseError(error, apiName);
  }
}
