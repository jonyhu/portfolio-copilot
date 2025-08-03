const API_KEY_STORAGE_KEY = 'openai_api_key';

export function saveApiKey(apiKey: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      console.log('API Key: Saved successfully');
    }
  } catch (error) {
    console.error('API Key: Failed to save API key to localStorage:', error);
  }
}

export function loadApiKey(): string | null {
  try {
    if (typeof window !== 'undefined') {
      const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      console.log('API Key: Loaded from storage:', apiKey ? 'Present' : 'Not found');
      return apiKey;
    }
  } catch (error) {
    console.error('API Key: Failed to load API key from localStorage:', error);
  }
  return null;
}

export function clearApiKey(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      console.log('API Key: Cleared successfully');
    }
  } catch (error) {
    console.error('API Key: Failed to clear API key from localStorage:', error);
  }
}

export function hasApiKey(): boolean {
  const apiKey = loadApiKey();
  const hasKey = apiKey !== null && apiKey.trim() !== '';
  console.log('API Key: Has API key:', hasKey);
  return hasKey;
}

export function validateApiKey(apiKey: string): boolean {
  // Basic validation - OpenAI API keys typically start with 'sk-' and are 51 characters long
  const isValid = apiKey.startsWith('sk-') && apiKey.length >= 20;
  console.log('API Key: Validation result:', isValid, 'Length:', apiKey.length);
  return isValid;
} 