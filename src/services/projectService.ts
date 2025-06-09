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

// API Key for OpenAI (this is a placeholder - user will replace)
const OPENAI_API_KEY = 'EXAMPLE_OPENAI_API_KEY';

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
    const features = await projectService.extractFeatures(description);
    
    const newProject: Project = {
      id: (mockProjects.length + 1).toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      features
    };
    
    // In a real implementation, we would save this to a database
    mockProjects.push(newProject);
    
    return newProject;
  },
  
  // Mock feature extraction (simulating OpenAI API call)
  extractFeatures: async (description: string): Promise<Feature[]> => {
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
    };
    
    // Match keywords to features
    const matchedFeatures = new Set<string>();
    
    for (const [feature, terms] of Object.entries(featureMap)) {
      if (terms.some(term => keywords.includes(term)) || 
          description.toLowerCase().includes(feature)) {
        matchedFeatures.add(feature);
      }
    }
    
    // Generate resources for each feature
    const features: Feature[] = Array.from(matchedFeatures).map((name, index) => {
      return {
        id: (index + 1).toString(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        resources: projectService.generateResourcesForFeature(name)
      };
    });
    
    return features;
  },
  
  generateResourcesForFeature: (featureName: string): Resource[] => {
    // This would be replaced with actual API calls to various sources
    const resourceTypes = ['documentation', 'tutorial', 'repository', 'template'];
    
    // Generate 2-4 resources per feature
    const count = 2 + Math.floor(Math.random() * 3);
    const resources: Resource[] = [];
    
    for (let i = 0; i < count; i++) {
      const type = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      
      resources.push({
        id: `${featureName}-${i}`,
        title: `${featureName.charAt(0).toUpperCase() + featureName.slice(1)} ${type}`,
        url: `https://example.com/${featureName}/${type}`,
        type: type as 'documentation' | 'tutorial' | 'repository' | 'template',
        status: 'unread'
      });
    }
    
    return resources;
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
    
    // Create new feature
    const newFeature: Feature = {
      id: (project.features.length + 1).toString(),
      name,
      resources: projectService.generateResourcesForFeature(name.toLowerCase())
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