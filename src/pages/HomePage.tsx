import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code, Search, Lightbulb, Database, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
          Build your projects faster with curated resources
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8">
          Describe your project, and we'll find the best documentation, tutorials, 
          templates, and repositories to help you build it quickly and efficiently.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {user ? (
            <Link 
              to="/dashboard" 
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard <ChevronRight className="h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link 
                to="/signup" 
                className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Get Started <ChevronRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/login" 
                className="bg-black hover:bg-slate-900 text-white font-medium px-8 py-3 rounded-lg transition-colors border border-slate-800"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black rounded-xl border border-slate-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-6 rounded-lg transition-transform hover:scale-105 border border-slate-800">
              <div className="mb-4 text-slate-400">
                <Lightbulb className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Describe Your Project</h3>
              <p className="text-slate-300">
                Tell us what you want to build, whether it's a blog, e-commerce site, or mobile app.
              </p>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-lg transition-transform hover:scale-105 border border-slate-800">
              <div className="mb-4 text-slate-400">
                <Code className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI Feature Extraction</h3>
              <p className="text-slate-300">
                Our AI analyzes your project and breaks it down into core features and components.
              </p>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-lg transition-transform hover:scale-105 border border-slate-800">
              <div className="mb-4 text-slate-400">
                <Database className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Curated Resources</h3>
              <p className="text-slate-300">
                Get categorized resources from across the web for each feature of your project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Demo Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Try It Out</h2>
          <p className="text-center text-slate-300 mb-8">
            Enter a project description to see what resources we can find for you.
          </p>
          
          <div className="bg-black p-6 rounded-lg border border-slate-800">
            <div className="relative">
              <input 
                type="text" 
                placeholder="e.g., A blog platform with authentication and Markdown editor"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
              />
              <Search className="absolute right-3 top-3 h-6 w-6 text-slate-400" />
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                to="/signup" 
                className="inline-block bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Sign Up to Get Results
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;