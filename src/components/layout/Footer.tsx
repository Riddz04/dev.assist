import React from 'react';
import { Code, Github, Twitter, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-xl font-bold text-white mb-3">
              <Code className="h-6 w-6 text-indigo-400" />
              <span>Dev.Assist</span>
            </div>
            <p className="text-sm mb-4">
              Helping developers build faster by curating the best resources 
              from across the web, tailored to your specific project needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">Dashboard</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">Create Project</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">API Docs</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">Community</a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">Support</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2025 Dev.Assist. All rights reserved.</p>
          <p className="text-sm flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;