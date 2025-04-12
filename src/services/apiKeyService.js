const API_KEY_STORAGE_KEY = 'gemini_api_key';

/**
 * Saves the API key to localStorage
 * @param {string} apiKey - The API key to save
 */
export function saveApiKey(apiKey) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  }
}

/**
 * Retrieves the API key from localStorage
 * @returns {string|null} The stored API key or null if not found
 */
export function getApiKey() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }
  return null;
}

/**
 * Removes the API key from localStorage
 */
export function removeApiKey() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
} 