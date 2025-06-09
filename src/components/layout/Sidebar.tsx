import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  PlusCircle, 
  FolderOpen, 
  BookOpen, 
  ChevronRight, 
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  // Mock projects for the sidebar (would be fetched from API in a real app)
  const projects = [
    { id: '1', name: 'Blog Platform' },
    { id: '2', name: 'E-commerce App' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-800 transform -translate-x-full md:translate-x-0 transition-transform duration-200 ease-in-out z-10">
      <div className="flex flex-col h-full">
        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <Link 
            to="/dashboard" 
            className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
              isActive('/dashboard') 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/projects/create" 
            className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
              isActive('/projects/create') 
                ? 'bg-gray-700 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Project</span>
          </Link>

          {/* Projects Dropdown */}
          <div>
            <button 
              className="flex items-center justify-between w-full px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
            >
              <div className="flex items-center space-x-3">
                <FolderOpen className="h-5 w-5" />
                <span>My Projects</span>
              </div>
              {isProjectsOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {isProjectsOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {projects.map(project => (
                  <Link 
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                      isActive(`/projects/${project.id}`) 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="truncate">{project.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          <p>© 2025 Dev.Assist</p>
          <p>Building better developers</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;