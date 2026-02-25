import { Resource, ResourceType } from '../types';

/**
 * Category mapping configuration
 * Maps resource types to their display properties and source APIs
 */
export interface CategoryConfig {
  type: ResourceType;
  label: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  sources: string[];
  priority: number; // For sorting (lower = higher priority)
}

/**
 * Category mapping for all resource types
 */
export const categoryMapping: Record<ResourceType, CategoryConfig> = {
  documentation: {
    type: 'documentation',
    label: 'Documentation',
    description: 'Official docs, references, and guides',
    icon: 'FileText',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    sources: ['MDN Web Docs', 'Stack Overflow', 'Google Search'],
    priority: 0
  },
  repository: {
    type: 'repository',
    label: 'Repositories',
    description: 'GitHub repos and npm packages',
    icon: 'Github',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    sources: ['GitHub', 'npm Registry'],
    priority: 1
  },
  tutorial: {
    type: 'tutorial',
    label: 'Tutorials',
    description: 'Video tutorials and learning content',
    icon: 'Video',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    sources: ['YouTube'],
    priority: 2
  },
  template: {
    type: 'template',
    label: 'Templates',
    description: 'Starter templates and live examples',
    icon: 'Layers',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    sources: ['GitHub', 'CodeSandbox', 'CodePen'],
    priority: 3
  }
};

/**
 * Get category config for a resource type
 * @param type Resource type
 */
export const getCategoryConfig = (type: ResourceType): CategoryConfig => {
  return categoryMapping[type];
};

/**
 * Get all category configs sorted by priority
 */
export const getAllCategories = (): CategoryConfig[] => {
  return Object.values(categoryMapping).sort((a, b) => a.priority - b.priority);
};

/**
 * Group resources by their category/type
 * @param resources Array of resources
 */
export const groupResourcesByCategory = (resources: Resource[]): Record<ResourceType, Resource[]> => {
  return resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<ResourceType, Resource[]>);
};

/**
 * Sort resources by category priority
 * @param resources Array of resources
 */
export const sortResourcesByCategory = (resources: Resource[]): Resource[] => {
  return [...resources].sort((a, b) => {
    const priorityA = categoryMapping[a.type].priority;
    const priorityB = categoryMapping[b.type].priority;
    return priorityA - priorityB;
  });
};

/**
 * Get category badge styles for a resource type
 * @param type Resource type
 */
export const getCategoryBadgeStyles = (type: ResourceType): string => {
  const config = categoryMapping[type];
  return `${config.bgColor} ${config.color} ${config.borderColor}`;
};

/**
 * Get source icon based on resource source
 * @param source Source name (e.g., 'GitHub', 'MDN Web Docs')
 */
export const getSourceIcon = (source: string): string => {
  const sourceIcons: Record<string, string> = {
    'GitHub': 'Github',
    'npm Registry': 'Package',
    'MDN Web Docs': 'FileText',
    'Stack Overflow': 'HelpCircle',
    'YouTube': 'Video',
    'CodeSandbox': 'Code',
    'CodePen': 'PenTool',
    'Reddit': 'MessageCircle',
    'Dev.to': 'BookOpen',
    'Medium': 'BookOpen',
    'Google Search': 'Search'
  };
  
  return sourceIcons[source] || 'Link';
};

/**
 * Filter resources by category
 * @param resources Array of resources
 * @param type Resource type to filter by
 */
export const filterResourcesByCategory = (
  resources: Resource[], 
  type: ResourceType | 'all'
): Resource[] => {
  if (type === 'all') return resources;
  return resources.filter(r => r.type === type);
};

/**
 * Get category stats (count per category)
 * @param resources Array of resources
 */
export const getCategoryStats = (resources: Resource[]): Record<ResourceType, number> => {
  const stats = {
    documentation: 0,
    repository: 0,
    tutorial: 0,
    template: 0
  };
  
  resources.forEach(resource => {
    if (stats[resource.type] !== undefined) {
      stats[resource.type]++;
    }
  });
  
  return stats;
};
