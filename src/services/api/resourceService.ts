import { Resource, ResourceType, ResourceStatus } from '../../types';
import { githubService } from './githubService';
import { gitlabService } from './gitlabService';
import { youtubeService } from './youtubeService';
import { stackoverflowService } from './stackoverflowService';
import { googleSearchService } from './googleSearchService';
import { redditService } from './redditService';
import { devtoService } from './devtoService';
import { mediumService } from './mediumService';
import { mdnService } from './mdnService';
import { npmService } from './npmService';

export const resourceService = {
  /**
   * Search for resources across multiple platforms based on a feature name
   * @param featureName Feature name to search for
   * @param limit Maximum number of results to return per platform
   */
  searchResourcesForFeature: async (featureName: string, limit: number = 3): Promise<Resource[]> => {
    try {
      // Run searches independently so one failure doesn't block others
      const [
        githubResult, gitlabResult, youtubeResult, stackoverflowResult, googleResult,
        redditResult, devtoResult, mediumResult, mdnResult, npmResult
      ] = await Promise.allSettled([
        githubService.searchRepositories(featureName, limit),
        gitlabService.searchProjects(featureName, limit),
        youtubeService.searchVideos(`${featureName} tutorial`, limit),
        stackoverflowService.searchQuestions(featureName, limit),
        googleSearchService.searchDocumentation(featureName, limit),
        redditService.searchPosts(`${featureName} programming`, limit),
        devtoService.searchArticles(featureName, limit),
        mediumService.searchPosts(featureName, limit),
        mdnService.searchDocumentation(featureName, limit),
        npmService.searchPackages(featureName, limit)
      ]);

      // Extract successful results with proper typing
      const githubResults = githubResult.status === 'fulfilled' ? githubResult.value : [];
      const gitlabResults = gitlabResult.status === 'fulfilled' ? gitlabResult.value : [];
      const youtubeResults = youtubeResult.status === 'fulfilled' ? youtubeResult.value : [];
      const stackoverflowResults = stackoverflowResult.status === 'fulfilled' ? stackoverflowResult.value : [];
      const googleResults = googleResult.status === 'fulfilled' ? googleResult.value : [];
      const redditResults = redditResult.status === 'fulfilled' ? redditResult.value : [];
      const devtoResults = devtoResult.status === 'fulfilled' ? devtoResult.value : [];
      const mediumResults = mediumResult.status === 'fulfilled' ? mediumResult.value : [];
      const mdnResults = mdnResult.status === 'fulfilled' ? mdnResult.value : [];
      const npmResults = npmResult.status === 'fulfilled' ? npmResult.value : [];

      // Log any failures
      const results = [githubResult, gitlabResult, youtubeResult, stackoverflowResult, googleResult, redditResult, devtoResult, mediumResult, mdnResult, npmResult];
      const serviceNames = ['GitHub', 'GitLab', 'YouTube', 'Stack Overflow', 'Google', 'Reddit', 'Dev.to', 'Medium', 'MDN', 'npm'];
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.warn(`${serviceNames[i]} API failed:`, r.reason?.message || r.reason);
        }
      });

      // Format and combine results (including new sources)
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
        ...gitlabResults.map(project => gitlabService.formatProjectAsResource(project)),
        ...npmResults.map(pkg => npmService.formatPackageAsResource(pkg)),
        ...youtubeResults.map(video => youtubeService.formatVideoAsResource(video)),
        ...stackoverflowResults.map(question => stackoverflowService.formatQuestionAsResource(question)),
        ...mdnResults.map(doc => mdnService.formatDocumentAsResource(doc)),
        ...googleResults.map(result => googleSearchService.formatSearchResultAsResource(result)),
        ...redditResults.map(post => redditService.formatPostAsResource(post)),
        ...devtoResults.map(article => devtoService.formatArticleAsResource(article)),
        ...mediumResults.map(post => mediumService.formatPostAsResource(post))
      ];

      // Deduplicate by URL
      const uniqueResources = resources.filter((resource, index, self) => 
        index === self.findIndex(r => r.url === resource.url)
      );

      console.log(`✅ Total unique resources found: ${uniqueResources.length}`);
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
          // Search both GitHub and GitLab for repositories independently
          const [githubRepoResult, gitlabRepoResult, npmRepoResult] = await Promise.allSettled([
            githubService.searchRepositories(featureName, Math.ceil(limit / 3)),
            gitlabService.searchProjects(featureName, Math.ceil(limit / 3)),
            npmService.searchPackages(featureName, Math.ceil(limit / 3))
          ]);
          
          const githubRepos = githubRepoResult.status === 'fulfilled' ? githubRepoResult.value : [];
          const gitlabProjects = gitlabRepoResult.status === 'fulfilled' ? gitlabRepoResult.value : [];
          const npmPackages = npmRepoResult.status === 'fulfilled' ? npmRepoResult.value : [];
          
          if (githubRepoResult.status === 'rejected') console.warn('GitHub API failed:', githubRepoResult.reason);
          if (gitlabRepoResult.status === 'rejected') console.warn('GitLab API failed:', gitlabRepoResult.reason);
          if (npmRepoResult.status === 'rejected') console.warn('npm API failed:', npmRepoResult.reason);
          
          const githubResources = githubRepos.map(repo => ({
            id: repo.id.toString(),
            title: repo.name,
            url: repo.html_url,
            type: 'repository' as ResourceType,
            status: 'unread' as ResourceStatus,
            description: repo.description || `A GitHub repository for ${featureName}`,
            stars: repo.stargazers_count,
            language: repo.language
          }));
          
          const gitlabResources = gitlabProjects.map(project => gitlabService.formatProjectAsResource(project));
          
          const npmResources = npmPackages.map(pkg => npmService.formatPackageAsResource(pkg));
          
          resources = [...githubResources, ...gitlabResources, ...npmResources];
          break;

        case 'tutorial':
          const videos = await youtubeService.getTutorials(featureName, limit);
          resources = videos.map(video => youtubeService.formatVideoAsResource(video));
          break;

        case 'documentation':
          // Fetch documentation from MDN and Stack Overflow independently
          const [mdnResult, soResult] = await Promise.allSettled([
            mdnService.searchDocumentation(featureName, limit),
            stackoverflowService.searchQuestions(featureName, limit)
          ]);
          
          const mdnDocs = mdnResult.status === 'fulfilled' ? mdnResult.value : [];
          const soDocs = soResult.status === 'fulfilled' ? soResult.value : [];
          
          if (mdnResult.status === 'rejected') console.warn('MDN API failed:', mdnResult.reason);
          if (soResult.status === 'rejected') console.warn('Stack Overflow API failed:', soResult.reason);
          
          const mdnResources = mdnDocs.map(doc => mdnService.formatDocumentAsResource(doc));
          const soResources = soDocs.map(doc => ({
            id: doc.question_id.toString(),
            title: doc.title,
            description: `Score: ${doc.score} | Answers: ${doc.answer_count} | Tags: ${doc.tags.join(', ')}`,
            url: doc.link,
            type: 'documentation' as ResourceType,
            status: 'unread' as ResourceStatus,
            votes: doc.score,
            source: 'Stack Overflow'
          }));
          
          resources = [...mdnResources, ...soResources];
          break;

        case 'template':
          // Search GitHub templates and GitLab projects independently
          const [githubTemplateResult, gitlabTemplateResult] = await Promise.allSettled([
            githubService.searchRepositories(`${featureName} template`, Math.ceil(limit / 2)),
            gitlabService.searchProjects(`${featureName} template`, Math.ceil(limit / 2))
          ]);
          
          const githubTemplates = githubTemplateResult.status === 'fulfilled' ? githubTemplateResult.value : [];
          const gitlabTemplates = gitlabTemplateResult.status === 'fulfilled' ? gitlabTemplateResult.value : [];
          
          if (githubTemplateResult.status === 'rejected') console.warn('GitHub template search failed:', githubTemplateResult.reason);
          if (gitlabTemplateResult.status === 'rejected') console.warn('GitLab template search failed:', gitlabTemplateResult.reason);
          
          const templateResources = githubTemplates.map(repo => ({
            id: repo.id.toString(),
            title: repo.name,
            url: repo.html_url,
            type: 'template' as ResourceType,
            status: 'unread' as ResourceStatus,
            description: repo.description || `A template for ${featureName}`,
            stars: repo.stargazers_count,
            language: repo.language
          }));
          
          const gitlabTemplateResources = gitlabTemplates.map(project => gitlabService.formatProjectAsResource(project));
          
          resources = [...templateResources, ...gitlabTemplateResources];
          break;
      }

      return resources;
    } catch (error) {
      console.error(`Error getting ${type} resources for ${featureName}:`, error);
      return [];
    }
  }
};