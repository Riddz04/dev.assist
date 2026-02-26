import { apiConfig } from '../../config/apiConfig';
import { rateLimiter } from '../../utils/rateLimiter';
import { ApiErrorHandler, safeFetch } from '../../utils/apiErrorHandler';

interface GitLabProject {
  id: number;
  name: string;
  path_with_namespace: string;
  web_url: string;
  description: string | null;
  star_count: number;
  forks_count: number;
  last_activity_at: string;
  namespace: {
    name: string;
  };
  readme_url: string | null;
}

export const gitlabService = {
  /**
   * Search for projects based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  searchProjects: async (query: string, limit: number = 5): Promise<GitLabProject[]> => {
    return ApiErrorHandler.withRetry(async () => {
      // Check rate limit
      if (!rateLimiter.canMakeRequest('gitlab')) {
        const resetTime = rateLimiter.getResetTime('gitlab');
        const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000 / 60) : 60;
        throw new Error(`GitLab rate limit exceeded. Please wait ${waitTime} minutes.`);
      }

      if (!apiConfig.gitlab.apiKey) {
        console.warn('⚠️ GitLab API key not configured, using unauthenticated requests (lower rate limit)');
      }

      // GitLab search API endpoint
      const url = `${apiConfig.gitlab.baseUrl}/projects?search=${encodeURIComponent(query)}&per_page=${limit}&order_by=stars&sort=desc`;
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };

      // Add authorization if API key is available
      if (apiConfig.gitlab.apiKey) {
        headers['PRIVATE-TOKEN'] = apiConfig.gitlab.apiKey;
      }

      const response = await safeFetch(url, { headers }, 'GitLab');
      const data = await response.json();
      
      // Record the request
      rateLimiter.recordRequest('gitlab');
      
      console.log(`✅ GitLab API: Found ${data.length || 0} projects for "${query}"`);
      console.log(`📊 GitLab API remaining requests: ${rateLimiter.getRemainingRequests('gitlab')}`);
      
      return data as GitLabProject[];
    }, 'GitLab');
  },

  /**
   * Get project details by ID
   * @param projectId GitLab project ID
   */
  getProject: async (projectId: number): Promise<GitLabProject | null> => {
    return ApiErrorHandler.withRetry(async () => {
      if (!rateLimiter.canMakeRequest('gitlab')) {
        throw new Error('GitLab rate limit exceeded. Please try again later.');
      }

      const url = `${apiConfig.gitlab.baseUrl}/projects/${projectId}`;
      const headers: HeadersInit = {
        'Accept': 'application/json',
      };

      if (apiConfig.gitlab.apiKey) {
        headers['PRIVATE-TOKEN'] = apiConfig.gitlab.apiKey;
      }

      const response = await safeFetch(url, { headers }, 'GitLab');
      const data = await response.json();
      
      rateLimiter.recordRequest('gitlab');
      
      return data as GitLabProject;
    }, 'GitLab');
  },

  /**
   * Format a GitLab project as a Resource object
   * @param project GitLab project
   */
  formatProjectAsResource: (project: GitLabProject) => {
    return {
      id: `gitlab-${project.id}`,
      title: project.name,
      url: project.web_url,
      type: 'repository' as const,
      status: 'unread' as const,
      description: project.description || `GitLab project by ${project.namespace.name}`,
      stars: project.star_count,
      forks: project.forks_count,
      source: 'GitLab'
    };
  }
};
