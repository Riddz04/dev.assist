import { rateLimiter } from '../../utils/rateLimiter';
import { ApiErrorHandler, safeFetch } from '../../utils/apiErrorHandler';

interface NPMPackage {
  package: {
    name: string;
    scope: string;
    version: string;
    description: string;
    keywords: string[];
    date: string;
    links: {
      npm: string;
      homepage: string | null;
      repository: string | null;
      bugs: string | null;
    };
    author: {
      name: string;
      email?: string;
    } | null;
    publisher: {
      username: string;
      email: string;
    };
    maintainers: {
      username: string;
      email: string;
    }[];
  };
  score: {
    final: number;
    detail: {
      quality: number;
      popularity: number;
      maintenance: number;
    };
  };
  searchScore: number;
  flags?: {
    insecure?: number;
  };
}

interface NPMSearchResponse {
  objects: NPMPackage[];
  total: number;
  time: string;
}

export const npmService = {
  /**
   * Search for npm packages based on a query
   * @param query Search query (package name or keyword)
   * @param limit Maximum number of results to return
   */
  searchPackages: async (query: string, limit: number = 5): Promise<NPMPackage[]> => {
    return ApiErrorHandler.withRetry(async () => {
      if (!rateLimiter.canMakeRequest('npm')) {
        const resetTime = rateLimiter.getResetTime('npm');
        const waitTime = resetTime ? Math.ceil((resetTime - Date.now()) / 1000 / 60) : 60;
        throw new Error(`npm registry rate limit exceeded. Please wait ${waitTime} minutes.`);
      }

      // npm Registry Search API via proxy to avoid CORS
      const url = `/api/npm/-/v1/search?text=${encodeURIComponent(query)}&size=${limit}&popularity=1&quality=1&maintenance=1`;
      
      const response = await safeFetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      }, 'npm');
      
      const data = await response.json() as NPMSearchResponse;
      
      rateLimiter.recordRequest('npm');
      
      console.log(`✅ npm Registry: Found ${data.objects?.length || 0} packages for "${query}"`);
      
      return data.objects || [];
    }, 'npm');
  },

  /**
   * Get package details by name
   * @param packageName Package name (e.g., "react", "express")
   */
  getPackageDetails: async (packageName: string): Promise<NPMPackage | null> => {
    return ApiErrorHandler.withRetry(async () => {
      if (!rateLimiter.canMakeRequest('npm')) {
        throw new Error('npm registry rate limit exceeded. Please try again later.');
      }

      // npm Registry API for specific package via proxy
      const url = `/api/npm/-/v1/search?text=${encodeURIComponent(packageName)}&size=1`;
      
      const response = await safeFetch(url, {
        headers: {
          'Accept': 'application/json',
        }
      }, 'npm');
      
      const data = await response.json() as NPMSearchResponse;
      
      rateLimiter.recordRequest('npm');
      
      // Find exact match or first result
      const pkg = data.objects?.find(p => p.package.name.toLowerCase() === packageName.toLowerCase()) || 
                  data.objects?.[0] || null;
      
      return pkg;
    }, 'npm');
  },

  /**
   * Format an npm package as a Resource
   * @param pkg npm package result
   */
  formatPackageAsResource: (pkg: NPMPackage) => {
    const npmUrl = pkg.package.links.npm || `https://www.npmjs.com/package/${pkg.package.name}`;
    const repoUrl = pkg.package.links.repository;
    
    // Use repository URL if available, otherwise npm page
    const displayUrl = repoUrl || npmUrl;
    
    return {
      id: `npm-${pkg.package.name.replace(/[@/]/g, '-')}`,
      title: pkg.package.name,
      url: displayUrl,
      type: 'repository' as const,
      status: 'unread' as const,
      description: pkg.package.description || `npm package - v${pkg.package.version}`,
      version: pkg.package.version,
      score: pkg.score?.final,
      popularity: pkg.score?.detail?.popularity,
      keywords: pkg.package.keywords,
      npmUrl: npmUrl,
      repositoryUrl: repoUrl,
      source: 'npm Registry'
    };
  },

  /**
   * Get packages for a specific technology/framework
   * @param technology Technology name (e.g., "react", "vue", "angular")
   * @param limit Maximum number of results
   */
  getTechnologyPackages: async (technology: string, limit: number = 5): Promise<NPMPackage[]> => {
    return npmService.searchPackages(technology, limit);
  },

  /**
   * Get most popular packages (by keywords)
   * @param keywords Keywords to search
   * @param limit Maximum number of results
   */
  getPopularPackages: async (keywords: string[], limit: number = 5): Promise<NPMPackage[]> => {
    const query = keywords.join(' ');
    const results = await npmService.searchPackages(query, limit);
    
    // Sort by score/popularity
    return results.sort((a, b) => (b.score?.final || 0) - (a.score?.final || 0));
  }
};
