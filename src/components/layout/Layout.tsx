import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      <Header />
      
      <div className="flex flex-1">
        {isAuthenticated && (
          <Sidebar />
        )}
        
        <main className={`flex-1 p-4 ${isAuthenticated ? 'md:ml-64' : ''}`}>
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;