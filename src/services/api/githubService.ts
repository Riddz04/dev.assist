import { apiConfig } from '../../config/apiConfig';
import { rateLimiter } from '../../utils/rateLimiter';
import { ApiErrorHandler, safeFetch } from '../../utils/apiErrorHandler';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
  topics: string[];
  updated_at: string;
}

export const githubService = {
  /**
   * Search for repositories based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  searchRepositories: async (query: string, limit: number = 5): Promise<GitHubRepository[]> => {
    return ApiErrorHandler.withRetry(async () => {
      // Check rate limit
      if (!rateLimiter.canMakeRequest('github')) {
        const resetTime = rateLimiter.getResetTime('github');
        const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000 / 60) : 60;
        throw new Error(`GitHub rate limit exceeded. Please wait ${waitTime} minutes.`);
      }

      if (!apiConfig.github.apiKey) {
        console.warn('⚠️ GitHub API key not configured, using unauthenticated requests (lower rate limit)');
      }

      const url = `${apiConfig.github.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`;
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
      };

      // Add authorization if API key is available
      if (apiConfig.github.apiKey) {
        headers['Authorization'] = `token ${apiConfig.github.apiKey}`;
      }

      const response = await safeFetch(url, { headers }, 'GitHub');
      const data = await response.json();
      
      // Record the request
      rateLimiter.recordRequest('github');
      
      console.log(`✅ GitHub API: Found ${data.items?.length || 0} repositories for "${query}"`);
      console.log(`📊 GitHub API remaining requests: ${rateLimiter.getRemainingRequests('github')}`);
      
      return data.items as GitHubRepository[];
    }, 'GitHub');
  },

  /**
   * Get repository details by owner and repo name
   * @param owner Repository owner
   * @param repo Repository name
   */
  getRepository: async (owner: string, repo: string): Promise<GitHubRepository | null> => {
    return ApiErrorHandler.withRetry(async () => {
      if (!rateLimiter.canMakeRequest('github')) {
        throw new Error('GitHub rate limit exceeded. Please try again later.');
      }

      const url = `${apiConfig.github.baseUrl}/repos/${owner}/${repo}`;
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
      };

      if (apiConfig.github.apiKey) {
        headers['Authorization'] = `token ${apiConfig.github.apiKey}`;
      }

      const response = await safeFetch(url, { headers }, 'GitHub');
      const data = await response.json();
      
      rateLimiter.recordRequest('github');
      
      return data as GitHubRepository;
    }, 'GitHub');
  },

  /**
   * Get trending repositories for a specific language
   * @param language Programming language
   * @param limit Maximum number of results
   */
  getTrendingRepositories: async (language: string, limit: number = 5): Promise<GitHubRepository[]> => {
    const query = `language:${language} created:>${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`;
    return githubService.searchRepositories(query, limit);
  }
};