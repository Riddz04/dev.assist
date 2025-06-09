import { User } from '../types';

// This is a mock implementation - would be replaced with actual API calls
const STORAGE_KEY = 'dev_assist_user';

// Example user for demonstration
const exampleUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
};

export const authService = {
  getCurrentUser: async (): Promise<User | null> => {
    const userJson = localStorage.getItem(STORAGE_KEY);
    if (!userJson) return null;
    
    return JSON.parse(userJson) as User;
  },
  
  login: async (email: string, password: string): Promise<User> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email !== 'demo@example.com' || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    
    const user = {...exampleUser, email};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },
  
  signup: async (email: string, password: string, name: string): Promise<User> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = {...exampleUser, name, email};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },
  
  loginWithGoogle: async (): Promise<User> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = exampleUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },
  
  loginWithGithub: async (): Promise<User> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = exampleUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },
  
  logout: async (): Promise<void> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    localStorage.removeItem(STORAGE_KEY);
  }
};