// API Configuration for external services

// Helper function to get environment variables
const getEnvVar = (key: string): string => {
  const viteKey = `VITE_${key}`;
  const value = import.meta.env[viteKey];
  if (!value || value.includes('your_') || value.includes('here') || value.includes('placeholder')) {
    console.warn(`⚠️ ${key} not configured. Please set up your environment variables.`);
    return '';
  }
  return value;
};

export const apiConfig = {
  // GitHub API
  github: {
    apiKey: getEnvVar('GITHUB_API_KEY'),
    baseUrl: 'https://api.github.com'
  },
  
  // YouTube Data API
  youtube: {
    apiKey: getEnvVar('YOUTUBE_API_KEY'),
    baseUrl: 'https://www.googleapis.com/youtube/v3'
  },
  
  // Stack Overflow API
  stackoverflow: {
    apiKey: getEnvVar('STACKOVERFLOW_API_KEY'),
    baseUrl: 'https://api.stackexchange.com/2.3'
  },
  
  // Google Custom Search API
  googleSearch: {
    apiKey: getEnvVar('GOOGLE_SEARCH_API_KEY'),
    searchEngineId: getEnvVar('GOOGLE_SEARCH_ENGINE_ID'),
    baseUrl: 'https://www.googleapis.com/customsearch/v1'
  },
  
  // Reddit API
  reddit: {
    clientId: getEnvVar('REDDIT_CLIENT_ID'),
    clientSecret: getEnvVar('REDDIT_CLIENT_SECRET'),
    baseUrl: 'https://oauth.reddit.com'
  },
  
  // Dev.to API
  devto: {
    apiKey: getEnvVar('DEVTO_API_KEY'),
    baseUrl: 'https://dev.to/api'
  },
  
  // Medium API
  medium: {
    apiKey: getEnvVar('MEDIUM_API_KEY'),
    baseUrl: 'https://api.medium.com/v1'
  }
};