import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isAuthenticated = !!user;

  return (
    <div className="flex flex-col min-h-screen bg-black text-slate-200">
      <Header />
      
      <div className="flex flex-1">
        {isAuthenticated && (
          <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        )}
        
        <main className={`flex-1 p-4 transition-all duration-300 ${isAuthenticated ? (isSidebarOpen ? 'md:ml-64' : 'md:ml-20') : ''}`}>
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