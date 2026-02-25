import { rateLimiter } from '../../utils/rateLimiter';
import { ApiErrorHandler, safeFetch } from '../../utils/apiErrorHandler';

interface CodePenProject {
  title: string;
  details: string;
  link: string;
  views: string;
  likes: string;
  user: {
    username: string;
  };
}

interface CodeSandboxProject {
  title: string;
  description: string | null;
  alias: string;
  id: string;
  screenshot_url: string | null;
  view_count: number;
  like_count: number;
  author: {
    username: string;
  } | null;
}

export const codeExampleService = {
  /**
   * Search for CodePen examples based on a query
   * @param query Search query (technology/framework name)
   * @param limit Maximum number of results to return
   */
  searchCodePen: async (query: string, limit: number = 3): Promise<CodePenProject[]> => {
    return ApiErrorHandler.withRetry(async () => {
      if (!rateLimiter.canMakeRequest('codepen')) {
        const resetTime = rateLimiter.getResetTime('codepen');
        const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000 / 60) : 60;
        throw new Error(`CodePen rate limit exceeded. Please wait ${waitTime} minutes.`);
      }

      // CodePen search via their unofficial search endpoint
      // Note: CodePen's API is unofficial and may change
      const url = `https://codepen.io/search/pens?q=${encodeURIComponent(query)}`;
      
      try {
        const response = await safeFetch(url, {}, 'CodePen');
        const html = await response.text();
        
        // Parse the HTML to extract pen data (CodePen returns HTML, not JSON)
        const projects: CodePenProject[] = [];
        
        // Look for pen data in the HTML (simplified parsing)
        const penMatches = html.match(/data-item-id="([^"]+)"/g) || [];
        const titleMatches = html.match(/<h3[^>]*>([^<]+)<\/h3>/g) || [];
        
        for (let i = 0; i < Math.min(penMatches.length, limit); i++) {
          const penId = penMatches[i]?.replace('data-item-id="', '').replace('"', '') || '';
          const titleMatch = titleMatches[i];
          const title = titleMatch ? titleMatch.replace(/<[^>]*>/g, '').trim() : `${query} example ${i + 1}`;
          
          projects.push({
            title,
            details: `Live code example on CodePen`,
            link: `https://codepen.io/pen/${penId}`,
            views: '0',
            likes: '0',
            user: { username: 'codepen-user' }
          });
        }
        
        rateLimiter.recordRequest('codepen');
        console.log(`✅ CodePen: Found ${projects.length} examples for "${query}"`);
        
        return projects;
      } catch (error) {
        console.warn('CodePen scraping failed, returning fallback results');
        return codeExampleService.getFallbackCodePenResults(query, limit);
      }
    }, 'CodePen');
  },

  /**
   * Search for CodeSandbox projects based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  searchCodeSandbox: async (query: string, limit: number = 3): Promise<CodeSandboxProject[]> => {
    return ApiErrorHandler.withRetry(async () => {
      if (!rateLimiter.canMakeRequest('codesandbox')) {
        const resetTime = rateLimiter.getResetTime('codesandbox');
        const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000 / 60) : 60;
        throw new Error(`CodeSandbox rate limit exceeded. Please wait ${waitTime} minutes.`);
      }

      // CodeSandbox GraphQL API
      const url = 'https://codesandbox.io/api/graphql';
      const graphqlQuery = {
        query: `
          query SearchSandboxes($query: String!, $limit: Int!) {
            sandboxes(limit: $limit, orderBy: { field: "view_count", direction: DESC }, filters: { title: $query }) {
              id
              title
              description
              alias
              screenshot_url
              view_count
              like_count
              author {
                username
              }
            }
          }
        `,
        variables: {
          query: query,
          limit: limit
        }
      };

      try {
        const response = await safeFetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphqlQuery)
        }, 'CodeSandbox');

        const data = await response.json();
        
        rateLimiter.recordRequest('codesandbox');
        
        const projects = data.data?.sandboxes || [];
        console.log(`✅ CodeSandbox: Found ${projects.length} projects for "${query}"`);
        
        return projects;
      } catch (error) {
        console.warn('CodeSandbox API failed, returning fallback results');
        return codeExampleService.getFallbackCodeSandboxResults(query, limit);
      }
    }, 'CodeSandbox');
  },

  /**
   * Get fallback CodePen results when API fails
   */
  getFallbackCodePenResults: (query: string, limit: number): CodePenProject[] => {
    return Array.from({ length: limit }, (_, i) => ({
      title: `${query} Example ${i + 1}`,
      details: `Search for "${query}" on CodePen for live examples`,
      link: `https://codepen.io/search/pens?q=${encodeURIComponent(query)}`,
      views: '0',
      likes: '0',
      user: { username: 'search' }
    }));
  },

  /**
   * Get fallback CodeSandbox results when API fails
   */
  getFallbackCodeSandboxResults: (query: string, limit: number): CodeSandboxProject[] => {
    return Array.from({ length: limit }, (_, i) => ({
      title: `${query} Sandbox ${i + 1}`,
      description: `Search for "${query}" on CodeSandbox`,
      alias: '',
      id: `fallback-${i}`,
      screenshot_url: null,
      view_count: 0,
      like_count: 0,
      author: null
    }));
  },

  /**
   * Format a CodePen project as a Resource
   * @param project CodePen project
   */
  formatCodePenAsResource: (project: CodePenProject) => {
    return {
      id: `codepen-${project.link.split('/').pop() || Math.random().toString(36).substr(2, 9)}`,
      title: project.title,
      url: project.link,
      type: 'template' as const,
      status: 'unread' as const,
      description: project.details || `Live code example by ${project.user?.username || 'CodePen user'}`,
      views: parseInt(project.views?.replace(/,/g, '') || '0', 10),
      likes: parseInt(project.likes?.replace(/,/g, '') || '0', 10),
      source: 'CodePen'
    };
  },

  /**
   * Format a CodeSandbox project as a Resource
   * @param project CodeSandbox project
   */
  formatCodeSandboxAsResource: (project: CodeSandboxProject) => {
    const sandboxUrl = project.alias 
      ? `https://codesandbox.io/s/${project.alias}`
      : `https://codesandbox.io/s/${project.id}`;
    
    return {
      id: `codesandbox-${project.id}`,
      title: project.title,
      url: sandboxUrl,
      type: 'template' as const,
      status: 'unread' as const,
      description: project.description || `Interactive sandbox by ${project.author?.username || 'CodeSandbox user'}`,
      views: project.view_count,
      likes: project.like_count,
      screenshot: project.screenshot_url,
      source: 'CodeSandbox'
    };
  }
};
