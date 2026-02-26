import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import CreateProjectPage from './pages/projects/CreateProjectPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route 
              path="dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="projects/create" 
              element={
                <ProtectedRoute>
                  <CreateProjectPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="projects/:projectId" 
              element={
                <ProtectedRoute>
                  <ProjectDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;