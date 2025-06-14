import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, FolderOpen, BookOpen, ChevronRight, ChevronDown, ChevronLeft, ChevronLeft as ChevronDoubleLeft, ChevronRight as ChevronDoubleRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
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
    <>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-black border-r border-slate-800 transition-all duration-300 z-20
          ${isOpen ? 'w-64' : 'w-20'} transform md:translate-x-0 -translate-x-full md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="absolute -right-3 top-4 bg-slate-800 rounded-full p-1 border border-slate-700"
          >
            {isOpen ? (
              <ChevronDoubleLeft className="h-4 w-4 text-slate-300" />
            ) : (
              <ChevronDoubleRight className="h-4 w-4 text-slate-300" />
            )}
          </button>

          {/* User Info */}
          {user && isOpen && (
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
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
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Home className="h-5 w-5" />
              {isOpen && <span>Dashboard</span>}
            </Link>

            <Link 
              to="/projects/create" 
              className={`flex items-center space-x-3 px-3 py-2 rounded-md ${
                isActive('/projects/create') 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PlusCircle className="h-5 w-5" />
              {isOpen && <span>New Project</span>}
            </Link>

            {/* Projects Dropdown */}
            {isOpen ? (
              <div>
                <button 
                  className="flex items-center justify-between w-full px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md"
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
                            ? 'bg-slate-800 text-white' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <BookOpen className="h-4 w-4" />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button 
                className={`flex items-center justify-center w-full p-3 rounded-md ${
                  location.pathname.includes('/projects/') 
                    ? 'bg-slate-800 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FolderOpen className="h-5 w-5" />
              </button>
            )}
          </nav>

          {/* Footer */}
          {isOpen && (
            <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
              <p>© 2025 Dev.Assist</p>
              <p>Building better developers</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;