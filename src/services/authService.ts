import { User } from '../types';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import type { User as FirebaseUser } from 'firebase/auth';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

// Storage key for user data
const STORAGE_KEY = 'dev_assist_user';

// Helper function to generate a Gravatar URL from email
const getGravatarUrl = (email: string): string => {
  const hash = email
    .trim()
    .toLowerCase()
    .split('')
    .map(char => char.charCodeAt(0).toString(16))
    .join('');
  
  return `https://www.gravatar.com/avatar/${hash}?d=mp&f=y`;
};

export const authService = {
  getCurrentUser: async (): Promise<User | null> => {
    return new Promise((resolve) => {
      // Listen for auth state changes - resolves when Firebase has restored the session
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        unsubscribe(); // Stop listening after first change
        
        if (!firebaseUser) {
          resolve(null);
          return;
        }
        
        // Convert Firebase user to app User type
        resolve({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || getGravatarUrl(firebaseUser.email || '')
        });
      });
    });
  },

  login: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Convert Firebase user to app User type
      const appUser: User = {
        id: user.uid,
        name: user.displayName || email.split('@')[0],
        email: user.email || '',
        avatar: user.photoURL || getGravatarUrl(user.email || '')
      };

      // Store user data in local storage for offline access
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appUser));

      return appUser;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  },

  signup: async (email: string, password: string, name: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, { displayName: name });

      // Convert Firebase user to app User type
      const appUser: User = {
        id: user.uid,
        name: name,
        email: user.email || '',
        avatar: user.photoURL || getGravatarUrl(user.email || '')
      };

      // Store user data in local storage for offline access
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appUser));

      return appUser;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  },

  loginWithGoogle: async (): Promise<User> => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Convert Firebase user to app User type
      const appUser: User = {
        id: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || '',
        avatar: user.photoURL || getGravatarUrl(user.email || '')
      };

      // Store user data in local storage for offline access
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appUser));

      return appUser;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Failed to login with Google');
    }
  },

  
  loginWithGithub: async (): Promise<User> => {
    try {
      const userCredential = await signInWithPopup(auth, githubProvider);
      const user = userCredential.user;

      // Convert Firebase user to app User type
      const appUser: User = {
        id: user.uid,
        name: user.displayName || 'GitHub User',
        email: user.email || '',
        avatar: user.photoURL || getGravatarUrl(user.email || '')
      };

      // Store user data in local storage for offline access
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appUser));

      return appUser;
    } catch (error: any) {
      console.error('GitHub login error:', error);
      throw new Error(error.message || 'Failed to login with GitHub');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
      
      // Remove user data from local storage
      localStorage.removeItem(STORAGE_KEY);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  }
};