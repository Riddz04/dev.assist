import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">Page not found</p>
      <p className="text-gray-400 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
      >
        <HomeIcon className="h-5 w-5" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;