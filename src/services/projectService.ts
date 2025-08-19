import { Project, Feature, Resource } from '../types';

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Blog Platform',
    description: 'A blog platform with authentication, Markdown editor, and comment system.',
    createdAt: new Date().toISOString(),
    features: [
      {
        id: '1',
        name: 'Authentication',
        resources: [
          {
            id: '1',
            title: 'Auth0 Documentation',
            url: 'https://auth0.com/docs',
            type: 'documentation',
            status: 'unread'
          },
          {
            id: '2',
            title: 'JWT Authentication in React',
            url: 'https://blog.logrocket.com/jwt-authentication-in-react-applications/',
            type: 'tutorial',
            status: 'unread'
          }
        ]
      },
      {
        id: '2',
        name: 'Markdown Editor',
        resources: [
          {
            id: '3',
            title: 'React Markdown',
            url: 'https://github.com/remarkjs/react-markdown',
            type: 'repository',
            status: 'unread'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'E-commerce App',
    description: 'An e-commerce platform with product catalog, cart, and checkout functionality.',
    createdAt: new Date().toISOString(),
    features: [
      {
        id: '3',
        name: 'Product Catalog',
        resources: [
          {
            id: '4',
            title: 'Building a Product Catalog with React',
            url: 'https://example.com/product-catalog',
            type: 'tutorial',
            status: 'unread'
          }
        ]
      }
    ]
  }
];

// Note: Feature extraction can be enhanced with AI services like OpenAI
// This would require adding an API key to the apiConfig

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockProjects;
  },
  
  getProjectById: async (id: string): Promise<Project | null> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProjects.find(project => project.id === id) || null;
  },
  
  createProject: async (name: string, description: string): Promise<Project> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Extract features using mock NLP
    const featureDefinitions = await projectService.extractFeatures(description);
    
    // Generate resources for each feature (in parallel)
    const featuresWithResources = await Promise.all(
      featureDefinitions.map(async (feature) => {
        const resources = await projectService.generateResourcesForFeature(feature.name.toLowerCase());
        return {
          ...feature,
          resources
        };
      })
    );
    
    const newProject: Project = {
      id: (mockProjects.length + 1).toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      features: featuresWithResources
    };
    
    // In a real implementation, we would save this to a database
    mockProjects.push(newProject);
    
    return newProject;
  },
  
  // Feature extraction (simulating OpenAI API call)
  extractFeatures: async (description: string): Promise<Omit<Feature, 'resources'>[]> => {
    // In a real implementation, this would call OpenAI API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract keywords from description
    const keywords = description.toLowerCase().match(/\b(\w+)\b/g) || [];
    
    // Predefined features to match against
    const featureMap: Record<string, string[]> = {
      'authentication': ['auth', 'login', 'signup', 'register'],
      'database': ['database', 'storage', 'data', 'sql', 'nosql'],
      'ui': ['ui', 'interface', 'design', 'layout'],
      'api': ['api', 'endpoint', 'rest', 'graphql'],
      'hosting': ['hosting', 'deploy', 'server'],
      'testing': ['test', 'testing', 'unit test', 'integration test'],
      'frontend': ['frontend', 'react', 'vue', 'angular', 'ui'],
      'backend': ['backend', 'server', 'api', 'database'],
      'mobile': ['mobile', 'ios', 'android', 'react native', 'flutter'],
    };
    
    // Match keywords to features
    // Define the type for feature names to match the keys in featureMap
    type FeatureName = 'authentication' | 'database' | 'ui' | 'api' | 'hosting' | 'testing' | 'frontend' | 'backend' | 'mobile';
    const matchedFeatures = new Set<FeatureName>();
    
    for (const [feature, terms] of Object.entries(featureMap)) {
      if (terms.some(term => keywords.includes(term)) || 
          description.toLowerCase().includes(feature)) {
        matchedFeatures.add(feature as FeatureName);
      }
    }
    
    // If no features matched, add some default ones
    if (matchedFeatures.size === 0) {
      matchedFeatures.add('frontend' as FeatureName);
      matchedFeatures.add('backend' as FeatureName);
    }
    
    // Create feature definitions (without resources)
    const features = Array.from(matchedFeatures).map((name, index) => {
      return {
        id: (index + 1).toString(),
        name: name.charAt(0).toUpperCase() + name.slice(1)
      };
    });
    
    return features;
  },
  
  generateResourcesForFeature: async (featureName: string): Promise<Resource[]> => {
    try {
      // Import the resourceService here to avoid circular dependencies
      const { resourceService } = await import('./api/resourceService');
      
      // Get resources from various APIs
      const resources = await resourceService.searchResourcesForFeature(featureName);
      
      // If no resources found, return some fallback resources
      if (resources.length === 0) {
        const resourceTypes = ['documentation', 'tutorial', 'repository', 'template'];
        const fallbackResources: Resource[] = [];
        
        for (let i = 0; i < 3; i++) {
          const type = resourceTypes[i % resourceTypes.length];
          
          fallbackResources.push({
            id: `${featureName}-${i}`,
            title: `${featureName.charAt(0).toUpperCase() + featureName.slice(1)} ${type}`,
            url: `https://example.com/${featureName}/${type}`,
            type: type as 'documentation' | 'tutorial' | 'repository' | 'template',
            status: 'unread',
            description: `This is a placeholder for ${featureName} ${type}. API keys need to be configured.`
          });
        }
        
        return fallbackResources;
      }
      
      return resources;
    } catch (error) {
      console.error('Error generating resources for feature:', error);
      
      // Return fallback resources in case of error
      return [
        {
          id: `${featureName}-fallback`,
          title: `${featureName} Documentation`,
          url: `https://example.com/${featureName}`,
          type: 'documentation',
          status: 'unread',
          description: 'API error occurred. Please check your API configuration.'
        }
      ];
    }
  },
  
  updateResourceStatus: async (
    projectId: string, 
    featureId: string, 
    resourceId: string, 
    status: 'read' | 'used' | 'broken' | 'unread'
  ): Promise<void> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the project
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return;
    
    // Find the feature
    const feature = project.features.find(f => f.id === featureId);
    if (!feature) return;
    
    // Find and update the resource
    const resource = feature.resources.find(r => r.id === resourceId);
    if (resource) {
      resource.status = status;
    }
  },
  
  addFeature: async (projectId: string, name: string): Promise<Feature | null> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find the project
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return null;
    
    // Generate resources for the feature
    const resources = await projectService.generateResourcesForFeature(name.toLowerCase());
    
    // Create new feature
    const newFeature: Feature = {
      id: (project.features.length + 1).toString(),
      name,
      resources
    };
    
    // Add to project
    project.features.push(newFeature);
    
    return newFeature;
  },
  
  removeFeature: async (projectId: string, featureId: string): Promise<void> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Find the project
    const project = mockProjects.find(p => p.id === projectId);
    if (!project) return;
    
    // Remove the feature
    project.features = project.features.filter(f => f.id !== featureId);
  }
};