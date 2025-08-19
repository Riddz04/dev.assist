import { apiConfig } from '../../config/apiConfig';

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
    try {
      const response = await fetch(
        `${apiConfig.github.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${apiConfig.github.apiKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items as GitHubRepository[];
    } catch (error) {
      console.error('Error searching GitHub repositories:', error);
      return [];
    }
  },

  /**
   * Get repository details by owner and repo name
   * @param owner Repository owner
   * @param repo Repository name
   */
  getRepository: async (owner: string, repo: string): Promise<GitHubRepository | null> => {
    try {
      const response = await fetch(
        `${apiConfig.github.baseUrl}/repos/${owner}/${repo}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${apiConfig.github.apiKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json() as GitHubRepository;
    } catch (error) {
      console.error('Error fetching GitHub repository:', error);
      return null;
    }
  },

  /**
   * Get trending repositories
   * @param language Programming language filter (optional)
   * @param limit Maximum number of results to return
   */
  getTrendingRepositories: async (language?: string, limit: number = 5): Promise<GitHubRepository[]> => {
    try {
      // GitHub doesn't have a direct trending API, so we search for recently updated popular repos
      const query = language ? `language:${language} sort:stars` : 'sort:stars';
      const response = await fetch(
        `${apiConfig.github.baseUrl}/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=${limit}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${apiConfig.github.apiKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items as GitHubRepository[];
    } catch (error) {
      console.error('Error fetching trending GitHub repositories:', error);
      return [];
    }
  }
};