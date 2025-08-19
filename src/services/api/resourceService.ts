import { Resource, ResourceType, ResourceStatus } from '../../types';
import { githubService } from './githubService';
import { youtubeService } from './youtubeService';
import { stackoverflowService } from './stackoverflowService';
import { googleSearchService } from './googleSearchService';
import { redditService } from './redditService';
import { devtoService } from './devtoService';
import { mediumService } from './mediumService';

export const resourceService = {
  /**
   * Search for resources across multiple platforms based on a feature name
   * @param featureName Feature name to search for
   * @param limit Maximum number of results to return per platform
   */
  searchResourcesForFeature: async (featureName: string, limit: number = 3): Promise<Resource[]> => {
    try {
      // Run searches in parallel
      const [githubResults, youtubeResults, stackoverflowResults, googleResults, redditResults, devtoResults, mediumResults] = await Promise.all([
        githubService.searchRepositories(featureName, limit),
        youtubeService.searchVideos(`${featureName} tutorial`, limit),
        stackoverflowService.searchQuestions(featureName, limit),
        googleSearchService.searchDocumentation(featureName, limit),
        redditService.searchPosts(`${featureName} programming`, limit),
        devtoService.searchArticles(featureName, limit),
        mediumService.searchPosts(featureName, limit)
      ]);

      // Format and combine results
      const resources: Resource[] = [
        ...githubResults.map(repo => ({
          id: repo.id.toString(),
          title: repo.name,
          url: repo.html_url,
          type: 'repository' as ResourceType,
          status: 'unread' as ResourceStatus,
          description: repo.description || `A GitHub repository for ${featureName}`,
          stars: repo.stargazers_count,
          language: repo.language
        })),
        ...youtubeResults.map(video => youtubeService.formatVideoAsResource(video)),
        ...stackoverflowResults.map(question => stackoverflowService.formatQuestionAsResource(question)),
        ...googleResults.map(result => googleSearchService.formatSearchResultAsResource(result)),
        ...redditResults.map(post => redditService.formatPostAsResource(post)),
        ...devtoResults.map(article => devtoService.formatArticleAsResource(article)),
        ...mediumResults.map(post => mediumService.formatPostAsResource(post))
      ];

      // Deduplicate by URL
      const uniqueResources = resources.filter((resource, index, self) => 
        index === self.findIndex(r => r.url === resource.url)
      );

      return uniqueResources;
    } catch (error) {
      console.error('Error searching resources for feature:', error);
      return [];
    }
  },

  /**
   * Get resources by type for a specific feature
   * @param featureName Feature name to search for
   * @param type Resource type to filter by
   * @param limit Maximum number of results to return
   */
  getResourcesByType: async (featureName: string, type: ResourceType, limit: number = 5): Promise<Resource[]> => {
    try {
      let resources: Resource[] = [];

      switch (type) {
        case 'repository':
          const repos = await githubService.searchRepositories(featureName, limit);
          resources = repos.map(repo => ({
            id: repo.id.toString(),
            title: repo.name,
            url: repo.html_url,
            type: 'repository' as ResourceType,
            status: 'unread' as ResourceStatus,
            description: repo.description || `A GitHub repository for ${featureName}`,
            stars: repo.stargazers_count,
            language: repo.language
          }));
          break;

        case 'tutorial':
          const videos = await youtubeService.getTutorials(featureName, limit);
          resources = videos.map(video => youtubeService.formatVideoAsResource(video));
          break;

        case 'documentation':
          // Fetch documentation resources from Stack Overflow or other sources
          const documentationResults = await stackoverflowService.searchQuestions(featureName, limit);
          resources = documentationResults.map(doc => ({
            id: doc.question_id.toString(),
            title: doc.title,
            description: `Score: ${doc.score} | Answers: ${doc.answer_count} | Tags: ${doc.tags.join(', ')}`,
            url: doc.link,
            type: 'documentation' as ResourceType,
            status: 'unread' as ResourceStatus,
            votes: doc.score,
            source: 'Stack Overflow'
          }));
          break;

        case 'template':
          // For templates, we can use GitHub repositories that are specifically templates
          const templates = await githubService.searchRepositories(`${featureName} template`, limit);
          resources = templates.map(repo => ({
            id: repo.id.toString(),
            title: repo.name,
            url: repo.html_url,
            type: 'template' as ResourceType,
            status: 'unread' as ResourceStatus,
            description: repo.description || `A template for ${featureName}`,
            stars: repo.stargazers_count,
            language: repo.language
          }));
          break;
      }

      return resources;
    } catch (error) {
      console.error(`Error getting ${type} resources for ${featureName}:`, error);
      return [];
    }
  }
};