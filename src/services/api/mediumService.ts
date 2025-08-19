import { apiConfig } from '../../config/apiConfig';
import { ResourceType, ResourceStatus } from '../../types';

interface MediumPost {
  id: string;
  title: string;
  author: string;
  url: string;
  publishedAt: string;
  content: string;
  tags: string[];
  claps: number;
  readingTime: number;
}

export const mediumService = {
  /**
   * Search for posts based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  searchPosts: async (query: string, limit: number = 5): Promise<MediumPost[]> => {
    try {
      // Note: Medium API has limited availability and requires approval
      // This implementation will need to be updated once API access is granted
      
      // For now, we'll throw an error to indicate this needs implementation
      throw new Error('Medium API not implemented - API key required');
      
      // When implemented, it would look something like this:
      // const response = await fetch(
      //   `${apiConfig.medium.baseUrl}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${apiConfig.medium.apiKey}`
      //     }
      //   }
      // );
      // 
      // if (!response.ok) {
      //   throw new Error(`Medium API error: ${response.status}`);
      // }
      // 
      // const data = await response.json();
      // return data.items as MediumPost[];
    } catch (error) {
      console.error('Error searching Medium posts:', error);
      return [];
    }
  },

  /**
   * Get posts by tag
   * @param tag Tag to search for
   * @param limit Maximum number of results to return
   */
  getPostsByTag: async (tag: string, limit: number = 5): Promise<MediumPost[]> => {
    try {
      // Note: Medium API has limited availability and requires approval
      // This implementation will need to be updated once API access is granted
      
      // For now, we'll throw an error to indicate this needs implementation
      throw new Error('Medium API not implemented - API key required');
      
      // When implemented, it would look something like this:
      // const response = await fetch(
      //   `${apiConfig.medium.baseUrl}/tags/${encodeURIComponent(tag)}/posts?limit=${limit}`,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${apiConfig.medium.apiKey}`
      //     }
      //   }
      // );
      // 
      // if (!response.ok) {
      //   throw new Error(`Medium API error: ${response.status}`);
      // }
      // 
      // const data = await response.json();
      // return data.items as MediumPost[];
    } catch (error) {
      console.error('Error fetching Medium posts by tag:', error);
      return [];
    }
  },

  /**
   * Format a Medium post as a resource object
   * @param post Medium post object
   */
  formatPostAsResource: (post: MediumPost) => {
    return {
      id: post.id,
      title: post.title,
      url: post.url,
      type: 'tutorial' as ResourceType,
      status: 'unread' as ResourceStatus,
      description: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
      author: post.author,
      tags: post.tags,
      readingTime: post.readingTime,
      claps: post.claps
    };
  }
};