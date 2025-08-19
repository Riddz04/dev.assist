import { apiConfig } from '../../config/apiConfig';
import { ResourceType, ResourceStatus } from '../../types';

interface StackOverflowQuestion {
  question_id: number;
  title: string;
  link: string;
  score: number;
  answer_count: number;
  is_answered: boolean;
  creation_date: number;
  tags: string[];
  owner: {
    display_name: string;
    profile_image?: string;
  };
}

export const stackoverflowService = {
  /**
   * Search for questions based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   */
  searchQuestions: async (query: string, limit: number = 5): Promise<StackOverflowQuestion[]> => {
    try {
      const response = await fetch(
        `${apiConfig.stackoverflow.baseUrl}/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(query)}&site=stackoverflow&pagesize=${limit}&key=${apiConfig.stackoverflow.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Stack Overflow API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items as StackOverflowQuestion[];
    } catch (error) {
      console.error('Error searching Stack Overflow questions:', error);
      return [];
    }
  },

  /**
   * Get questions by tag
   * @param tag Tag to search for
   * @param limit Maximum number of results to return
   */
  getQuestionsByTag: async (tag: string, limit: number = 5): Promise<StackOverflowQuestion[]> => {
    try {
      const response = await fetch(
        `${apiConfig.stackoverflow.baseUrl}/questions?order=desc&sort=votes&tagged=${encodeURIComponent(tag)}&site=stackoverflow&pagesize=${limit}&key=${apiConfig.stackoverflow.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Stack Overflow API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items as StackOverflowQuestion[];
    } catch (error) {
      console.error('Error fetching Stack Overflow questions by tag:', error);
      return [];
    }
  },

  /**
   * Format a Stack Overflow question as a resource object
   * @param question Stack Overflow question object
   */
  formatQuestionAsResource: (question: StackOverflowQuestion) => {
    return {
      id: question.question_id.toString(),
      title: question.title,
      url: question.link,
      type: 'documentation' as ResourceType,
      status: 'unread' as ResourceStatus,
      description: `Score: ${question.score} | Answers: ${question.answer_count} | Tags: ${question.tags.join(', ')}`,
      author: question.owner.display_name
    };
  }
};