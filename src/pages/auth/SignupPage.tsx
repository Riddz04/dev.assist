import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Github, Mail } from 'lucide-react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, loginWithGithub, error } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setFormError('');
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setFormError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      setFormError('');
      await loginWithGithub();
      navigate('/dashboard');
    } catch (err: any) {
      setFormError(err.message || 'Failed to sign up with GitHub');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-gray-800 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Create Your Account</h1>
      
      {(error || formError) && (
        <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-300 px-4 py-3 rounded mb-4">
          {error || formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>
        
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="terms" className="ml-2 block text-sm">
            I agree to the{' '}
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-400 hover:text-indigo-300">
              Privacy Policy
            </a>
          </label>
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
        
        <div className="my-4 flex items-center justify-center">
          <div className="border-t border-gray-600 flex-grow"></div>
          <div className="mx-4 text-gray-400 text-sm">or continue with</div>
          <div className="border-t border-gray-600 flex-grow"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGithubLogin}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            <Github className="mr-2 h-5 w-5" />
            GitHub
          </button>
          
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            <Mail className="mr-2 h-5 w-5" />
            Google
          </button>
        </div>
      </form>
      
      <p className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;