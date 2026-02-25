import { Project, Feature, Resource } from '../types';
import { db, auth } from '../config/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';

// Firestore collection reference
const projectsCollection = collection(db, 'projects');

// Helper to get current user ID
const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};

// Convert Firestore doc to Project type
const docToProject = (doc: any): Project => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
    features: data.features || [],
    userId: data.userId
  };
};

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      // Query projects for current user (no orderBy to avoid index requirement)
      const q = query(
        projectsCollection,
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(q);
      const projects = snapshot.docs.map(docToProject);
      
      // Sort client-side by createdAt descending
      return projects.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to fetch projects');
    }
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const projectDoc = await getDoc(doc(projectsCollection, id));

      if (!projectDoc.exists()) return null;

      const data = projectDoc.data();
      // Verify project belongs to current user
      if (data.userId !== userId) return null;

      return docToProject(projectDoc);
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }
  },

  createProject: async (name: string, description: string): Promise<Project> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      // Extract features using NLP
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

      // Create project document
      const projectData = {
        name,
        description,
        createdAt: Timestamp.now(),
        features: featuresWithResources,
        userId
      };

      const docRef = await addDoc(projectsCollection, projectData);

      return {
        id: docRef.id,
        ...projectData,
        createdAt: new Date().toISOString()
      } as Project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  },

  // Feature extraction - extracts only technology keywords from description
  extractFeatures: async (description: string): Promise<Omit<Feature, 'resources'>[]> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const descLower = description.toLowerCase();

    // Comprehensive technology keywords database
    const techKeywords = [
      // Cloud & Infrastructure
      'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'firebase', 'supabase',
      'heroku', 'vercel', 'netlify', 'digitalocean', 'linode', 'cloudflare', 'cdn',
      'lambda', 'ec2', 's3', 'rds', 'dynamodb', 'mongodb atlas', 'cloudfront', 'route53',
      'sns', 'sqs', 'eventbridge', 'step functions', 'api gateway',

      // Databases
      'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'elasticsearch',
      'cassandra', 'dynamodb', 'firebase database', 'firestore', 'neo4j', 'couchdb',
      'prisma', 'sequelize', 'mongoose', 'typeorm', 'hasura', 'graphql',

      // Backend & APIs
      'node.js', 'nodejs', 'express', 'nestjs', 'fastify', 'koa', 'hapi',
      'python', 'django', 'flask', 'fastapi', 'tornado',
      'java', 'spring boot', 'springboot', 'kotlin',
      'go', 'golang', 'rust',
      'php', 'laravel', 'symfony', 'codeigniter',
      'ruby', 'rails', 'sinatra',
      'rest api', 'graphql', 'grpc', 'websocket', 'socket.io', 'webhook',
      'oauth', 'jwt', 'authentication', 'authorization', 'auth0', 'firebase auth',
      'microservices', 'serverless', 'docker', 'kubernetes', 'k8s', 'terraform',

      // Frontend
      'react', 'react.js', 'next.js', 'nextjs', 'vue', 'vue.js', 'nuxt', 'nuxt.js',
      'angular', 'svelte', 'solidjs', 'preact', 'alpine.js',
      'javascript', 'typescript', 'js', 'ts',
      'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less',
      'tailwind', 'tailwindcss', 'bootstrap', 'material-ui', 'mui', 'chakra-ui',
      'antd', 'semantic-ui', 'bulma', 'foundation',
      'webpack', 'vite', 'rollup', 'parcel', 'esbuild', 'babel',
      'redux', 'zustand', 'mobx', 'recoil', 'jotai',
      'react query', 'tanstack query', 'swr',
      'react router', 'next router', 'vue router',

      // Mobile
      'react native', 'flutter', 'dart', 'swift', 'ios', 'android',
      'kotlin mobile', 'jetpack compose', 'cordova', 'ionic', 'capacitor',

      // DevOps & Tools
      'git', 'github', 'gitlab', 'bitbucket', 'ci/cd', 'jenkins', 'github actions',
      'travis ci', 'circleci', 'docker compose', 'nginx', 'apache', 'caddy',
      'prometheus', 'grafana', 'datadog', 'new relic', 'sentry', 'logrocket',

      // AI/ML
      'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras',
      'scikit-learn', 'pandas', 'numpy', 'opencv', 'huggingface',
      'openai', 'chatgpt', 'gpt-4', 'claude', 'llm', 'langchain', 'vector database',

      // Security
      'ssl', 'tls', 'https', 'encryption', 'hashing', 'bcrypt', 'cors', 'csp',
      'penetration testing', 'oauth2', 'oidc', 'mfa', '2fa',

      // Testing
      'jest', 'mocha', 'chai', 'cypress', 'playwright', 'selenium', 'vitest',
      'react testing library', 'enzyme', 'karma', 'jasmine',

      // Messaging & Real-time
      'rabbitmq', 'kafka', 'redis pub/sub', 'socket.io', 'pusher', 'ably',
      'firebase messaging', 'onesignal', 'twilio', 'sendgrid', 'aws ses',
      'postmark', 'mailgun', 'mailchimp', 'amazon sns',

      // Google APIs & Services
      'google calendar api', 'google oauth', 'google maps api', 'google drive api',
      'google sheets api', 'gmail api', 'firebase', 'google cloud platform',

      // Storage & File Handling
      'aws s3', 'cloudinary', 'uploadcare', 'sharp', 'imagemagick', 'ffmpeg',

      // Payment & E-commerce
      'stripe', 'paypal', 'razorpay', 'shopify', 'woocommerce', 'medusa',

      // Analytics
      'google analytics', 'mixpanel', 'amplitude', 'segment', 'hotjar',

      // Search
      'elasticsearch', 'algolia', 'meilisearch', 'typesense',

      // CMS
      'contentful', 'sanity', 'strapi', 'wordpress', 'drupal', 'ghost',

      // Other
      'pwa', 'progressive web app', 'electron', 'tauri', 'webassembly', 'wasm',
      'webrtc', 'webgl', 'three.js', 'd3.js', 'chart.js', 'highcharts',
      'pdf generation', 'puppeteer', 'playwright', 'cheerio', 'web scraping'
    ];

    // Extract matching tech keywords
    const foundKeywords: string[] = [];

    // Check for multi-word terms first (longer matches take priority)
    const multiWordTerms = techKeywords.filter(kw => kw.includes(' '));
    multiWordTerms.sort((a, b) => b.length - a.length); // Longest first

    let remainingDesc = descLower;

    for (const term of multiWordTerms) {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      if (regex.test(remainingDesc)) {
        foundKeywords.push(term);
        remainingDesc = remainingDesc.replace(regex, ' '); // Remove matched term
      }
    }

    // Check for single-word terms
    const singleWordTerms = techKeywords.filter(kw => !kw.includes(' '));
    const wordPattern = /\b[a-z]+\b/g;
    const words = descLower.match(wordPattern) || [];

    for (const word of words) {
      if (singleWordTerms.includes(word) && !foundKeywords.includes(word)) {
        foundKeywords.push(word);
      }
    }

    // Remove duplicates and limit
    const uniqueKeywords = [...new Set(foundKeywords)].slice(0, 8);

    // FALLBACK: If we have fewer than 8 keywords, try to extract potential tech terms from remaining description
    if (uniqueKeywords.length < 8) {
      const remainingWords = remainingDesc.match(/\b[a-z]+\b/g) || [];
      
      // Common tech patterns that might not be in our database
      const techPatterns = [
        // Version numbers (e.g., "python3", "es6")
        /^[a-z]+\d+$/,
        // Acronyms (e.g., "api", "sdk", "sdk")
        /^[a-z]{2,4}$/,
        // Compound tech terms (e.g., "webpack", "babel")
        /([a-z]+)(js|ts|py|go|rb)$/,
        // Tech suffixes
        /[a-z]+(db|sql|api|sdk|ide|cli|gui|ui|ux|os|vm|ci|cd)$/,
        // Capitalized tech names in original description
      ];
      
      // Also check original description for capitalized words (often tech names)
      const originalWords = description.match(/\b[A-Z][a-zA-Z]+\b/g) || [];
      const lowercaseOriginals = originalWords.map(w => w.toLowerCase());
      
      for (const word of [...remainingWords, ...lowercaseOriginals]) {
        if (uniqueKeywords.includes(word)) continue;
        if (word.length < 3) continue; // Skip very short words
        
        // Check if it matches tech patterns
        const looksLikeTech = techPatterns.some(pattern => pattern.test(word));
        
        // Or if it's commonly a tech term (ends with common tech suffixes)
        const commonTechEndings = ['js', 'ts', 'py', 'rb', 'go', 'db', 'sql', 'api', 'sdk', 'cli', 'ui', 'os', 'vm'];
        const hasTechEnding = commonTechEndings.some(ending => word.endsWith(ending));
        
        if (looksLikeTech || hasTechEnding) {
          uniqueKeywords.push(word);
          if (uniqueKeywords.length >= 8) break;
        }
      }
    }

    // If no keywords found, add generic ones
    if (uniqueKeywords.length === 0) {
      // Try to infer from common patterns
      if (descLower.includes('database') || descLower.includes('data')) uniqueKeywords.push('database');
      if (descLower.includes('api') || descLower.includes('server')) uniqueKeywords.push('backend');
      if (descLower.includes('ui') || descLower.includes('interface')) uniqueKeywords.push('frontend');
      if (descLower.includes('auth') || descLower.includes('login')) uniqueKeywords.push('authentication');
      if (descLower.includes('email') || descLower.includes('notification')) uniqueKeywords.push('notifications');
      
      // Last resort defaults
      if (uniqueKeywords.length === 0) {
        uniqueKeywords.push('web development', 'backend');
      }
    }

    // Create features from keywords
    const features = uniqueKeywords.map((keyword, index) => ({
      id: (index + 1).toString(),
      name: keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }));

    console.log(`✅ Extracted ${features.length} tech features:`, features.map(f => f.name).join(', '));
    return features;
  },
  
  generateResourcesForFeature: async (featureName: string): Promise<Resource[]> => {
    try {
      // Import the resourceService here to avoid circular dependencies
      const { resourceService } = await import('./api/resourceService');
      
      // Get resources from various APIs
      const resources = await resourceService.searchResourcesForFeature(featureName);
      
      // If no resources found, return empty array - real APIs should provide results
      if (resources.length === 0) {
        console.warn(`No resources found for "${featureName}". All APIs may be rate limited or the technology is not recognized.`);
        return [];
      }
      
      return resources;
    } catch (error) {
      console.error('Error generating resources for feature:', error);
      
      // Return empty array on error - don't show fake placeholder resources
      return [];
    }
  },
  
  updateResourceStatus: async (
    projectId: string,
    featureId: string,
    resourceId: string,
    status: 'read' | 'used' | 'broken' | 'unread'
  ): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const projectRef = doc(projectsCollection, projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) throw new Error('Project not found');

      const data = projectDoc.data();
      if (data.userId !== userId) throw new Error('Unauthorized');

      // Update the resource status in the features array
      const updatedFeatures = data.features.map((feature: Feature) => {
        if (feature.id !== featureId) return feature;

        return {
          ...feature,
          resources: feature.resources.map((resource: Resource) =>
            resource.id === resourceId ? { ...resource, status } : resource
          )
        };
      });

      await updateDoc(projectRef, { features: updatedFeatures });
    } catch (error) {
      console.error('Error updating resource status:', error);
      throw new Error('Failed to update resource status');
    }
  },
  
  addFeature: async (projectId: string, name: string): Promise<Feature | null> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const projectRef = doc(projectsCollection, projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) return null;

      const data = projectDoc.data();
      if (data.userId !== userId) throw new Error('Unauthorized');

      // Generate resources for the feature
      const resources = await projectService.generateResourcesForFeature(name.toLowerCase());

      // Create new feature
      const newFeature: Feature = {
        id: (data.features.length + 1).toString(),
        name,
        resources
      };

      // Update project with new feature
      await updateDoc(projectRef, {
        features: [...data.features, newFeature]
      });

      return newFeature;
    } catch (error) {
      console.error('Error adding feature:', error);
      throw new Error('Failed to add feature');
    }
  },
  
  removeFeature: async (projectId: string, featureId: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const projectRef = doc(projectsCollection, projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) return;

      const data = projectDoc.data();
      if (data.userId !== userId) throw new Error('Unauthorized');

      // Remove the feature
      const updatedFeatures = data.features.filter((feature: Feature) => feature.id !== featureId);

      await updateDoc(projectRef, { features: updatedFeatures });
    } catch (error) {
      console.error('Error removing feature:', error);
      throw new Error('Failed to remove feature');
    }
  },

  removeProject: async (projectId: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');

    try {
      const projectRef = doc(projectsCollection, projectId);
      const projectDoc = await getDoc(projectRef);

      if (!projectDoc.exists()) return;

      const data = projectDoc.data();
      if (data.userId !== userId) throw new Error('Unauthorized');

      await deleteDoc(projectRef);
    } catch (error) {
      console.error('Error removing project:', error);
      throw new Error('Failed to remove project');
    }
  }
};