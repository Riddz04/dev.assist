import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { Project } from '../../types';
import ProjectCard from '../../components/projects/ProjectCard';
import { Plus, Loader2, Sparkles, FolderOpen, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Calculate stats
  const totalResources = projects.reduce((acc, project) => 
    acc + project.features.reduce((fAcc, feature) => fAcc + feature.resources.length, 0), 0
  );

  return (
    <div className="min-h-screen pt-8 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Profile Section */}
        {user && (
          <>
            <Card className="bg-card/50 border-white/5 mb-8 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-primary/20 ring-4 ring-primary/10">
                      <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
                  </div>
                  
                  {/* User Info */}
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">
                      Welcome back, <span className="gradient-text">{user.name}</span>
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  {/* Quick Action */}
                  <Button asChild className="bg-primary hover:bg-primary/90 glow-sm">
                    <Link to="/projects/create">
                      <Plus className="h-5 w-5 mr-2" />
                      New Project
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Separator className="bg-white/5 mb-8" />
          </>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card/50 border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{totalResources}</p>
                  <p className="text-sm text-muted-foreground">Resources</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/5 hidden md:block">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-muted-foreground">Quick Tip</p>
                  <p className="text-sm text-muted-foreground">Create a project to get started</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-white/5 mb-8" />

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          </div>
        ) : error ? (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card className="bg-card/50 border-white/5">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">No projects yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first project to get curated resources for your development needs. Our AI will analyze your project and find the best resources.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90 glow-sm">
                <Link to="/projects/create">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Your Projects <Badge variant="secondary" className="ml-2">{projects.length}</Badge>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onDelete={(deletedId) => {
                    setProjects(projects.filter(p => p.id !== deletedId));
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;