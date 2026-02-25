import { Resource, ResourceType, ResourceStatus } from '../../types';
import { githubService } from './githubService';
import { youtubeService } from './youtubeService';
import { stackoverflowService } from './stackoverflowService';
import { googleSearchService } from './googleSearchService';
import { redditService } from './redditService';
import { devtoService } from './devtoService';
import { mediumService } from './mediumService';
import { mdnService } from './mdnService';
import { codeExampleService } from './codeExampleService';
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
        githubResult, youtubeResult, stackoverflowResult, googleResult,
        redditResult, devtoResult, mediumResult, mdnResult,
        codeSandboxResult, npmResult
      ] = await Promise.allSettled([
        githubService.searchRepositories(featureName, limit),
        youtubeService.searchVideos(`${featureName} tutorial`, limit),
        stackoverflowService.searchQuestions(featureName, limit),
        googleSearchService.searchDocumentation(featureName, limit),
        redditService.searchPosts(`${featureName} programming`, limit),
        devtoService.searchArticles(featureName, limit),
        mediumService.searchPosts(featureName, limit),
        mdnService.searchDocumentation(featureName, limit),
        codeExampleService.searchCodeSandbox(`${featureName} example`, limit),
        npmService.searchPackages(featureName, limit)
      ]);

      // Extract successful results with proper typing
      const githubResults = githubResult.status === 'fulfilled' ? githubResult.value : [];
      const youtubeResults = youtubeResult.status === 'fulfilled' ? youtubeResult.value : [];
      const stackoverflowResults = stackoverflowResult.status === 'fulfilled' ? stackoverflowResult.value : [];
      const googleResults = googleResult.status === 'fulfilled' ? googleResult.value : [];
      const redditResults = redditResult.status === 'fulfilled' ? redditResult.value : [];
      const devtoResults = devtoResult.status === 'fulfilled' ? devtoResult.value : [];
      const mediumResults = mediumResult.status === 'fulfilled' ? mediumResult.value : [];
      const mdnResults = mdnResult.status === 'fulfilled' ? mdnResult.value : [];
      const codeSandboxResults = codeSandboxResult.status === 'fulfilled' ? codeSandboxResult.value : [];
      const npmResults = npmResult.status === 'fulfilled' ? npmResult.value : [];

      // Log any failures
      const results = [githubResult, youtubeResult, stackoverflowResult, googleResult, redditResult, devtoResult, mediumResult, mdnResult, codeSandboxResult, npmResult];
      const serviceNames = ['GitHub', 'YouTube', 'Stack Overflow', 'Google', 'Reddit', 'Dev.to', 'Medium', 'MDN', 'CodeSandbox', 'npm'];
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
        ...npmResults.map(pkg => npmService.formatPackageAsResource(pkg)),
        ...youtubeResults.map(video => youtubeService.formatVideoAsResource(video)),
        ...stackoverflowResults.map(question => stackoverflowService.formatQuestionAsResource(question)),
        ...mdnResults.map(doc => mdnService.formatDocumentAsResource(doc)),
        ...googleResults.map(result => googleSearchService.formatSearchResultAsResource(result)),
        ...redditResults.map(post => redditService.formatPostAsResource(post)),
        ...devtoResults.map(article => devtoService.formatArticleAsResource(article)),
        ...mediumResults.map(post => mediumService.formatPostAsResource(post)),
        ...codeSandboxResults.map(project => codeExampleService.formatCodeSandboxAsResource(project))
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
          // Search both GitHub and npm for packages/repos independently
          const [repoResult, npmResult] = await Promise.allSettled([
            githubService.searchRepositories(featureName, Math.ceil(limit / 2)),
            npmService.searchPackages(featureName, Math.ceil(limit / 2))
          ]);
          
          const repos = repoResult.status === 'fulfilled' ? repoResult.value : [];
          const npmPackages = npmResult.status === 'fulfilled' ? npmResult.value : [];
          
          if (repoResult.status === 'rejected') console.warn('GitHub API failed:', repoResult.reason);
          if (npmResult.status === 'rejected') console.warn('npm API failed:', npmResult.reason);
          
          const githubResources = repos.map(repo => ({
            id: repo.id.toString(),
            title: repo.name,
            url: repo.html_url,
            type: 'repository' as ResourceType,
            status: 'unread' as ResourceStatus,
            description: repo.description || `A GitHub repository for ${featureName}`,
            stars: repo.stargazers_count,
            language: repo.language
          }));
          
          const npmResources = npmPackages.map(pkg => npmService.formatPackageAsResource(pkg));
          
          resources = [...githubResources, ...npmResources];
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
          // Search GitHub templates and CodeSandbox projects independently
          const [templateResult, sandboxResult] = await Promise.allSettled([
            githubService.searchRepositories(`${featureName} template`, Math.ceil(limit / 2)),
            codeExampleService.searchCodeSandbox(`${featureName} starter`, Math.ceil(limit / 2))
          ]);
          
          const templates = templateResult.status === 'fulfilled' ? templateResult.value : [];
          const sandboxes = sandboxResult.status === 'fulfilled' ? sandboxResult.value : [];
          
          if (templateResult.status === 'rejected') console.warn('GitHub template search failed:', templateResult.reason);
          if (sandboxResult.status === 'rejected') console.warn('CodeSandbox API failed:', sandboxResult.reason);
          
          const templateResources = templates.map(repo => ({
            id: repo.id.toString(),
            title: repo.name,
            url: repo.html_url,
            type: 'template' as ResourceType,
            status: 'unread' as ResourceStatus,
            description: repo.description || `A template for ${featureName}`,
            stars: repo.stargazers_count,
            language: repo.language
          }));
          
          const sandboxResources = sandboxes.map(project => codeExampleService.formatCodeSandboxAsResource(project));
          
          resources = [...templateResources, ...sandboxResources];
          break;
      }

      return resources;
    } catch (error) {
      console.error(`Error getting ${type} resources for ${featureName}:`, error);
      return [];
    }
  }
};