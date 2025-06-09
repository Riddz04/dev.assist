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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Build your projects faster with curated resources
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Describe your project, and we'll find the best documentation, tutorials, 
          templates, and repositories to help you build it quickly and efficiently.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {user ? (
            <Link 
              to="/dashboard" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Go to Dashboard <ChevronRight className="h-5 w-5" />
            </Link>
          ) : (
            <>
              <Link 
                to="/signup" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Get Started <ChevronRight className="h-5 w-5" />
              </Link>
              <Link 
                to="/login" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-800 rounded-xl">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg transition-transform hover:scale-105">
              <div className="mb-4 text-indigo-400">
                <Lightbulb className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Describe Your Project</h3>
              <p className="text-gray-300">
                Tell us what you want to build, whether it's a blog, e-commerce site, or mobile app.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg transition-transform hover:scale-105">
              <div className="mb-4 text-indigo-400">
                <Code className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Feature Extraction</h3>
              <p className="text-gray-300">
                Our AI analyzes your project and breaks it down into core features and components.
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg transition-transform hover:scale-105">
              <div className="mb-4 text-indigo-400">
                <Database className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Resources</h3>
              <p className="text-gray-300">
                Get categorized resources from across the web for each feature of your project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Demo Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Try It Out</h2>
          <p className="text-center text-gray-300 mb-8">
            Enter a project description to see what resources we can find for you.
          </p>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="relative">
              <input 
                type="text" 
                placeholder="e.g., A blog platform with authentication and Markdown editor"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute right-3 top-3 h-6 w-6 text-gray-400" />
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                to="/signup" 
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Sign Up to Get Results
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-800 rounded-xl">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Developers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://i.pravatar.cc/150?img=1" 
                  alt="Developer" 
                  className="w-12 h-12 rounded-full mr-4" 
                />
                <div>
                  <h4 className="font-semibold">Alex Johnson</h4>
                  <p className="text-sm text-gray-400">Frontend Developer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "Dev.Assist saved me hours of searching for the right libraries and documentation for my React project."
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://i.pravatar.cc/150?img=2" 
                  alt="Developer" 
                  className="w-12 h-12 rounded-full mr-4" 
                />
                <div>
                  <h4 className="font-semibold">Sarah Chen</h4>
                  <p className="text-sm text-gray-400">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "Finding the right resources for authentication was always a pain. Now I just describe my project and get everything I need."
              </p>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://i.pravatar.cc/150?img=3" 
                  alt="Developer" 
                  className="w-12 h-12 rounded-full mr-4" 
                />
                <div>
                  <h4 className="font-semibold">Marcus Williams</h4>
                  <p className="text-sm text-gray-400">Mobile Developer</p>
                </div>
              </div>
              <p className="text-gray-300">
                "As a hackathon regular, this tool is a game-changer. I can quickly get up to speed on new technologies."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Build Faster?</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Join thousands of developers who are using Dev.Assist to find the best resources for their projects.
        </p>
        <Link 
          to="/signup" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          Get Started Now <ChevronRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
};

export default HomePage;