/**
 * Client-side rate limiter for better UX
 * Prevents unnecessary API calls before they hit the server
 */

const STORAGE_KEY = 'deepgrok_rate_limit';
const LIMIT = 20;
const WINDOW_MS = 60 * 1000; // 1 minute

interface ClientRateLimitData {
  count: number;
  resetTime: number;
}

export function checkClientRateLimit(): { allowed: boolean; remaining: number; resetIn: number } {
  try {
    const now = Date.now();
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      // First request
      const data: ClientRateLimitData = {
        count: 1,
        resetTime: now + WINDOW_MS,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return {
        allowed: true,
        remaining: LIMIT - 1,
        resetIn: WINDOW_MS,
      };
    }

    const data: ClientRateLimitData = JSON.parse(stored);

    if (now > data.resetTime) {
      // Window expired, reset
      const newData: ClientRateLimitData = {
        count: 1,
        resetTime: now + WINDOW_MS,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return {
        allowed: true,
        remaining: LIMIT - 1,
        resetIn: WINDOW_MS,
      };
    }

    if (data.count >= LIMIT) {
      // Limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetIn: data.resetTime - now,
      };
    }

    // Increment count
    data.count++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    return {
      allowed: true,
      remaining: LIMIT - data.count,
      resetIn: data.resetTime - now,
    };
  } catch (err) {
    // If localStorage fails, allow the request
    console.error('Client rate limit check failed:', err);
    return {
      allowed: true,
      remaining: LIMIT,
      resetIn: WINDOW_MS,
    };
  }
}


