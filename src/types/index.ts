// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// Resource types
export type ResourceType = 'documentation' | 'tutorial' | 'repository' | 'template';
export type ResourceStatus = 'unread' | 'read' | 'used' | 'broken';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  status: ResourceStatus;
  description?: string;
}

// Feature types
export interface Feature {
  id: string;
  name: string;
  resources: Resource[];
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  features: Feature[];
}