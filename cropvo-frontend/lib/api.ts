// ============================================
// API Utility
// ============================================
// Centralized API calls with caching, error handling, and security

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const REQUEST_TIMEOUT = 30000; // 30 seconds

// In-memory cache for requests
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Cleanup cache entry after duration
 */
const setCacheExpiry = (key: string) => {
  setTimeout(() => {
    requestCache.delete(key);
  }, CACHE_DURATION);
};

/**
 * Get cached request if valid and not expired
 */
const getCachedRequest = (key: string): any | null => {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  requestCache.delete(key);
  return null;
};

/**
 * Main API call function with security and error handling
 * @param endpoint API endpoint
 * @param options Request options
 * @returns Parsed response data
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${BACKEND_URL}${endpoint}`;
  const cacheKey = `${options.method || 'GET'}-${url}`;

  try {
    // Check cache for GET requests only
    if (!options.method || options.method === 'GET') {
      const cached = getCachedRequest(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    // Parse response
    const data = await response.json();

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    // Cache successful GET requests
    if (!options.method || options.method === 'GET') {
      requestCache.set(cacheKey, { data, timestamp: Date.now() });
      setCacheExpiry(cacheKey);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
}

/**
 * User signup
 * POST /auth/signup
 */
export async function signup(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) {
  return apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
}

/**
 * User login
 * POST /auth/login
 */
export async function login(email: string, password: string) {
  return apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Get all users
 * GET /users
 */
export async function getUsers() {
  return apiCall('/users', {
    method: 'GET',
  });
}

/**
 * Get current user profile (requires token)
 * GET /user/profile
 */
export async function getUserProfile(token: string) {
  return apiCall('/user/profile', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Clear all cached requests
 * Use after logout
 */
export function clearCache() {
  requestCache.clear();
}

