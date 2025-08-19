import { User } from '../types';
import { apiConfig } from '../config/apiConfig';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';

// Storage key for user data
const STORAGE_KEY = 'dev_assist_user';

// Default avatar URL using Gravatar
const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

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
    try {
      // Check if there's a Firebase user
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        // If no Firebase user, check local storage as fallback
        const userJson = localStorage.getItem(STORAGE_KEY);
        if (!userJson) return null;
        return JSON.parse(userJson) as User;
      }
      
      // Convert Firebase user to app User type
      return {
        id: currentUser.uid,
        name: currentUser.displayName || 'User',
        email: currentUser.email || '',
        avatar: currentUser.photoURL || getGravatarUrl(currentUser.email || '')
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Convert Firebase user to app User type
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || getGravatarUrl(firebaseUser.email || '')
      };
      
      // Store user in local storage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide more user-friendly error messages
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else {
        throw new Error(error.message || 'Failed to login');
      }
    }
  },
  
  signup: async (email: string, password: string, name: string): Promise<User> => {
    try {
      // Validate inputs
      if (!email || !password || !name) {
        throw new Error('Name, email, and password are required');
      }
      
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile with display name
      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: getGravatarUrl(email)
      });
      
      // Convert Firebase user to app User type
      const user: User = {
        id: firebaseUser.uid,
        name: name,
        email: email,
        avatar: getGravatarUrl(email)
      };
      
      // Store user in local storage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Provide more user-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already in use');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Email address is invalid');
      } else {
        throw new Error(error.message || 'Failed to sign up');
      }
    }
  },
  
  loginWithGoogle: async (): Promise<User> => {
    try {
      // Sign in with Google using Firebase
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;
      
      // Convert Firebase user to app User type
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || DEFAULT_AVATAR
      };
      
      // Store user in local storage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('Google login error:', error);
      
      // Provide more user-friendly error messages
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login canceled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Login popup was blocked. Please allow popups for this website.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('An account already exists with the same email address but different sign-in credentials.');
      } else {
        throw new Error(error.message || 'Failed to login with Google');
      }
    }
  },
  
  loginWithGithub: async (): Promise<User> => {
    try {
      // Sign in with GitHub using Firebase
      const userCredential = await signInWithPopup(auth, githubProvider);
      const firebaseUser = userCredential.user;
      
      // Convert Firebase user to app User type
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'GitHub User',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || DEFAULT_AVATAR
      };
      
      // Store user in local storage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error('GitHub login error:', error);
      
      // Provide more user-friendly error messages
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login canceled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Login popup was blocked. Please allow popups for this website.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error('An account already exists with the same email address but different sign-in credentials.');
      } else {
        throw new Error(error.message || 'Failed to login with GitHub');
      }
    }
  },
  
  logout: async (): Promise<void> => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Also remove user from local storage
      localStorage.removeItem(STORAGE_KEY);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  }
};