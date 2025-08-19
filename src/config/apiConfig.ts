// API Configuration for external services

export const apiConfig = {
  // GitHub API
  // Create a personal access token at GitHub Settings > Developer settings
  // Rate limit: 5,000 requests/hour (authenticated)
  github: {
    apiKey: process.env.GITHUB_API_KEY || 'GITHUB_PERSONAL_ACCESS_TOKEN',
    baseUrl: 'https://api.github.com'
  },
  
  // YouTube Data API
  // Enable in Google Cloud Console and get API key
  // Rate limit: 10,000 units/day
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY || 'YOUTUBE_API_KEY',
    baseUrl: 'https://www.googleapis.com/youtube/v3'
  },
  
  // Stack Overflow API
  // Register app at stackapps.com
  // Rate limit: 300 requests/day
  stackoverflow: {
    apiKey: process.env.STACKOVERFLOW_API_KEY || 'STACKOVERFLOW_API_KEY',
    baseUrl: 'https://api.stackexchange.com/2.3'
  },
  
  // Google Custom Search API
  // Set up custom search engine and get API key
  // Rate limit: 100 queries/day
  googleSearch: {
    apiKey: process.env.GOOGLE_SEARCH_API_KEY || 'GOOGLE_SEARCH_API_KEY',
    searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || 'GOOGLE_SEARCH_ENGINE_ID',
    baseUrl: 'https://www.googleapis.com/customsearch/v1'
  },
  
  // Reddit API
  // Create app at reddit.com/prefs/apps
  // Rate limit: 60 requests/minute
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID || 'REDDIT_CLIENT_ID',
    clientSecret: process.env.REDDIT_CLIENT_SECRET || 'REDDIT_CLIENT_SECRET',
    baseUrl: 'https://oauth.reddit.com'
  },
  
  // Dev.to API
  // Get API key from Dev.to settings
  devto: {
    apiKey: process.env.DEVTO_API_KEY || 'DEVTO_API_KEY',
    baseUrl: 'https://dev.to/api'
  },
  
  // Medium API
  // Apply for API access (limited availability)
  medium: {
    apiKey: process.env.MEDIUM_API_KEY || 'MEDIUM_API_KEY',
    baseUrl: 'https://api.medium.com/v1'
  }
};