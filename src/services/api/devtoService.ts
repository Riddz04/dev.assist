import { apiConfig } from '../../config/apiConfig';
import { ResourceType, ResourceStatus } from '../../types';

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  tag_list: string[];
  user: {
    name: string;
    username: string;
    profile_image: string;
  };
  reading_time_minutes: number;
  positive_reactions_count: number;
  comments_count: number;
}

export const devtoService = {
  /**
   * Search for articles based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  searchArticles: async (query: string, limit: number = 5): Promise<DevToArticle[]> => {
    try {
      const response = await fetch(
        `${apiConfig.devto.baseUrl}/articles?per_page=${limit}&tag=${encodeURIComponent(query)}`,
        {
          headers: {
            'api-key': apiConfig.devto.apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Dev.to API error: ${response.status}`);
      }

      return await response.json() as DevToArticle[];
    } catch (error) {
      console.error('Error searching Dev.to articles:', error);
      return [];
    }
  },

  /**
   * Get articles by tag
   * @param tag Tag to search for
   * @param limit Maximum number of results to return
   */
  getArticlesByTag: async (tag: string, limit: number = 5): Promise<DevToArticle[]> => {
    try {
      const response = await fetch(
        `${apiConfig.devto.baseUrl}/articles?per_page=${limit}&tag=${encodeURIComponent(tag)}`,
        {
          headers: {
            'api-key': apiConfig.devto.apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Dev.to API error: ${response.status}`);
      }

      return await response.json() as DevToArticle[];
    } catch (error) {
      console.error('Error fetching Dev.to articles by tag:', error);
      return [];
    }
  },

  /**
   * Format a Dev.to article as a resource object
   * @param article Dev.to article object
   */
  formatArticleAsResource: (article: DevToArticle) => {
    return {
      id: article.id.toString(),
      title: article.title,
      url: article.url,
      type: 'tutorial' as ResourceType,
      status: 'unread' as ResourceStatus,
      description: article.description,
      author: article.user.name,
      tags: article.tag_list,
      readingTime: article.reading_time_minutes,
      reactions: article.positive_reactions_count
    };
  }
};