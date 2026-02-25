import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;