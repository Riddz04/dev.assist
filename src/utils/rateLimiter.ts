// Rate limiting utility for API calls

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitConfig> = new Map();
  private requests: Map<string, RateLimitEntry> = new Map();

  constructor() {
    // Set default rate limits for different APIs
    this.limits.set('github', { maxRequests: 5000, windowMs: 60 * 60 * 1000 }); // 5000/hour
    this.limits.set('gitlab', { maxRequests: 2000, windowMs: 60 * 60 * 1000 }); // 2000/hour
    this.limits.set('youtube', { maxRequests: 10000, windowMs: 24 * 60 * 60 * 1000 }); // 10000/day
    this.limits.set('stackoverflow', { maxRequests: 300, windowMs: 24 * 60 * 60 * 1000 }); // 300/day
    this.limits.set('googleSearch', { maxRequests: 100, windowMs: 24 * 60 * 60 * 1000 }); // 100/day
    this.limits.set('reddit', { maxRequests: 60, windowMs: 60 * 1000 }); // 60/minute
    this.limits.set('devto', { maxRequests: 1000, windowMs: 60 * 60 * 1000 }); // 1000/hour
    this.limits.set('medium', { maxRequests: 100, windowMs: 60 * 60 * 1000 }); // 100/hour
    this.limits.set('mdn', { maxRequests: 1000, windowMs: 60 * 60 * 1000 }); // 1000/hour (public API)
    this.limits.set('codepen', { maxRequests: 60, windowMs: 60 * 1000 }); // 60/minute
    this.limits.set('codesandbox', { maxRequests: 100, windowMs: 60 * 60 * 1000 }); // 100/hour
    this.limits.set('npm', { maxRequests: 1000, windowMs: 60 * 60 * 1000 }); // 1000/hour
  }

  canMakeRequest(apiName: string): boolean {
    const limit = this.limits.get(apiName);
    if (!limit) return true; // No limit set

    const now = Date.now();
    const key = apiName;
    const entry = this.requests.get(key);

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
      this.requests.delete(key);
      return true;
    }

    // Check if under limit
    if (!entry || entry.count < limit.maxRequests) {
      return true;
    }

    return false;
  }

  recordRequest(apiName: string): void {
    const limit = this.limits.get(apiName);
    if (!limit) return;

    const now = Date.now();
    const key = apiName;
    const entry = this.requests.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      this.requests.set(key, {
        count: 1,
        resetTime: now + limit.windowMs
      });
    } else {
      // Increment existing entry
      entry.count++;
    }
  }

  getRemainingRequests(apiName: string): number {
    const limit = this.limits.get(apiName);
    if (!limit) return Infinity;

    const now = Date.now();
    const key = apiName;
    const entry = this.requests.get(key);

    if (!entry || now > entry.resetTime) {
      return limit.maxRequests;
    }

    return Math.max(0, limit.maxRequests - entry.count);
  }

  getResetTime(apiName: string): number | null {
    const entry = this.requests.get(apiName);
    return entry ? entry.resetTime : null;
  }
}

export const rateLimiter = new RateLimiter();
