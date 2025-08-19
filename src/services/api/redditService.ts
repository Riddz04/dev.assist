import { apiConfig } from '../../config/apiConfig';
import { ResourceType, ResourceStatus } from '../../types';

interface RedditPost {
  id: string;
  title: string;
  permalink: string;
  url: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
  selftext: string;
}

export const redditService = {
  // Token storage
  accessToken: null as string | null,
  tokenExpiry: 0,

  /**
   * Get access token for Reddit API
   */
  getAccessToken: async (): Promise<string> => {
    try {
      // Check if we already have a valid token
      if (redditService.accessToken && Date.now() < redditService.tokenExpiry) {
        return redditService.accessToken;
      }

      // Request new token
      const response = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${apiConfig.reddit.clientId}:${apiConfig.reddit.clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }

      const data = await response.json();
      redditService.accessToken = data.access_token;
      redditService.tokenExpiry = Date.now() + (data.expires_in * 1000);
      return data.access_token;
    } catch (error) {
      console.error('Error getting Reddit access token:', error);
      throw error;
    }
  },

  /**
   * Search for posts based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  searchPosts: async (query: string, limit: number = 5): Promise<RedditPost[]> => {
    try {
      const token = await redditService.getAccessToken();
      const response = await fetch(
        `${apiConfig.reddit.baseUrl}/search?q=${encodeURIComponent(query)}&limit=${limit}&sort=relevance`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'DevAssist/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.children.map((child: any) => child.data) as RedditPost[];
    } catch (error) {
      console.error('Error searching Reddit posts:', error);
      return [];
    }
  },

  /**
   * Get posts from a specific subreddit
   * @param subreddit Subreddit name
   * @param limit Maximum number of results to return
   */
  getSubredditPosts: async (subreddit: string, limit: number = 5): Promise<RedditPost[]> => {
    try {
      const token = await redditService.getAccessToken();
      const response = await fetch(
        `${apiConfig.reddit.baseUrl}/r/${subreddit}/hot?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'DevAssist/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Reddit API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.children.map((child: any) => child.data) as RedditPost[];
    } catch (error) {
      console.error(`Error fetching posts from r/${subreddit}:`, error);
      return [];
    }
  },

  /**
   * Format a Reddit post as a resource object
   * @param post Reddit post object
   */
  formatPostAsResource: (post: RedditPost) => {
    return {
      id: post.id,
      title: post.title,
      url: `https://www.reddit.com${post.permalink}`,
      type: 'documentation' as ResourceType,
      status: 'unread' as ResourceStatus,
      description: post.selftext.substring(0, 200) + (post.selftext.length > 200 ? '...' : ''),
      author: post.author,
      source: `r/${post.subreddit}`,
      score: post.score,
      comments: post.num_comments
    };
  }
};