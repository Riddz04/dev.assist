import { apiConfig } from '../../config/apiConfig';
import { ResourceType, ResourceStatus } from '../../types';

interface GoogleSearchResult {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
}

export const googleSearchService = {
  /**
   * Search for web results based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  search: async (query: string, limit: number = 5): Promise<GoogleSearchResult[]> => {
    try {
      const response = await fetch(
        `${apiConfig.googleSearch.baseUrl}?key=${apiConfig.googleSearch.apiKey}&cx=${apiConfig.googleSearch.searchEngineId}&q=${encodeURIComponent(query)}&num=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items as GoogleSearchResult[];
    } catch (error) {
      console.error('Error performing Google search:', error);
      return [];
    }
  },

  /**
   * Search for documentation related to a specific technology
   * @param technology Technology name
   * @param limit Maximum number of results to return
   */
  searchDocumentation: async (technology: string, limit: number = 5): Promise<GoogleSearchResult[]> => {
    try {
      const query = `${technology} documentation for developers`;
      const response = await fetch(
        `${apiConfig.googleSearch.baseUrl}?key=${apiConfig.googleSearch.apiKey}&cx=${apiConfig.googleSearch.searchEngineId}&q=${encodeURIComponent(query)}&num=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items as GoogleSearchResult[];
    } catch (error) {
      console.error('Error searching for documentation:', error);
      return [];
    }
  },

  /**
   * Format a Google search result as a resource object
   * @param result Google search result object
   */
  formatSearchResultAsResource: (result: GoogleSearchResult) => {
    return {
      id: result.link,
      title: result.title,
      url: result.link,
      type: 'documentation' as ResourceType,
      status: 'unread' as ResourceStatus,
      description: result.snippet,
      source: result.displayLink
    };
  }
};