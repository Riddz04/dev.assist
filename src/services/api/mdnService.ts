import { apiConfig } from '../../config/apiConfig';
import { rateLimiter } from '../../utils/rateLimiter';
import { ApiErrorHandler, safeFetch } from '../../utils/apiErrorHandler';

interface MDNDocument {
  mdn_url: string;
  title: string;
  summary: string;
  tags: string[];
  locale: string;
}

interface MDNSearchResponse {
  documents: MDNDocument[];
}

export const mdnService = {
  /**
   * Search for MDN documentation based on a query
   * @param query Search query (technology/framework name)
   * @param limit Maximum number of results to return
   */
  searchDocumentation: async (query: string, limit: number = 5): Promise<MDNDocument[]> => {
    return ApiErrorHandler.withRetry(async () => {
      if (!rateLimiter.canMakeRequest('mdn')) {
        const resetTime = rateLimiter.getResetTime('mdn');
        const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000 / 60) : 60;
        throw new Error(`MDN API rate limit exceeded. Please wait ${waitTime} minutes.`);
      }

      // MDN uses a public API endpoint
      const url = `https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(query)}&locale=en-US`;
      
      const response = await safeFetch(url, {}, 'MDN');
      const data = await response.json() as MDNSearchResponse;
      
      rateLimiter.recordRequest('mdn');
      
      // Limit results
      const limitedResults = data.documents?.slice(0, limit) || [];
      
      console.log(`✅ MDN API: Found ${limitedResults.length} documents for "${query}"`);
      
      return limitedResults;
    }, 'MDN');
  },

  /**
   * Format an MDN document as a Resource
   * @param doc MDN document
   */
  formatDocumentAsResource: (doc: MDNDocument) => {
    return {
      id: `mdn-${doc.mdn_url.split('/').pop() || Math.random().toString(36).substr(2, 9)}`,
      title: doc.title,
      url: `https://developer.mozilla.org${doc.mdn_url}`,
      type: 'documentation' as const,
      status: 'unread' as const,
      description: doc.summary || `Official MDN documentation for ${doc.title}`,
      source: 'MDN Web Docs'
    };
  },

  /**
   * Get documentation for a specific web technology
   * @param technology Technology name (e.g., "React", "JavaScript", "CSS")
   */
  getTechnologyDocs: async (technology: string): Promise<MDNDocument[]> => {
    return mdnService.searchDocumentation(technology, 3);
  }
};
