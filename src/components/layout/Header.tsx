import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Code, Menu, X, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-gray-800 text-white sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Code className="h-6 w-6 text-indigo-400" />
            <span>Dev.Assist</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-indigo-400 transition-colors">
              Home
            </Link>
            {user ? (
              <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* User Menu (Desktop) */}
          {user && (
            <div className="hidden md:block relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 hover:text-indigo-400"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </button>
              
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-20">
                  <Link 
                    to="/dashboard" 
                    className="block px-4 py-2 hover:bg-gray-600 flex items-center gap-2"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setProfileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-600 flex items-center gap-2 text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-700 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link 
              to="/" 
              className="py-2 hover:text-indigo-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="py-2 hover:text-indigo-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-left text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="py-2 hover:text-indigo-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-indigo-600 py-2 px-4 rounded text-center hover:bg-indigo-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;