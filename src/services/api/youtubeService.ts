import { apiConfig } from '../../config/apiConfig';
import { ResourceType, ResourceStatus } from '../../types';

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelTitle: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
  };
}

export const youtubeService = {
  /**
   * Search for videos based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  searchVideos: async (query: string, limit: number = 5): Promise<YouTubeVideo[]> => {
    try {
      const response = await fetch(
        `${apiConfig.youtube.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${limit}&key=${apiConfig.youtube.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items as YouTubeVideo[];
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      return [];
    }
  },

  /**
   * Get tutorial videos for a specific technology or concept
   * @param technology Technology or concept name
   * @param limit Maximum number of results to return
   */
  getTutorials: async (technology: string, limit: number = 5): Promise<YouTubeVideo[]> => {
    try {
      const query = `${technology} tutorial for developers`;
      const response = await fetch(
        `${apiConfig.youtube.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${limit}&key=${apiConfig.youtube.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items as YouTubeVideo[];
    } catch (error) {
      console.error('Error fetching YouTube tutorials:', error);
      return [];
    }
  },

  /**
   * Format a YouTube video as a resource object
   * @param video YouTube video object
   */
  formatVideoAsResource: (video: YouTubeVideo) => {
    return {
      id: video.id.videoId,
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      type: 'tutorial' as ResourceType,
      status: 'unread' as ResourceStatus,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.medium.url,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt
    };
  }
};