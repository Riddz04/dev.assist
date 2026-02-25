import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { CalendarDays, ArrowRight, List, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { projectService } from '../../services/projectService';

interface ProjectCardProps {
  project: Project;
  onDelete?: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await projectService.removeProject(project.id);
      onDelete?.(project.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="group bg-card/50 border-white/5 card-hover overflow-hidden relative">
        {/* Delete Button */}
        <div className="absolute top-4 right-4 z-10">
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Delete Project
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong className="text-foreground">{project.name}</strong>? 
                  This action cannot be undone. All resources and features associated with this project will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel 
                  className="border-white/10 hover:bg-white/5"
                  disabled={isDeleting}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90 text-white"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Project'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2 text-foreground pr-10">{project.name}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
          
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>Created on {formatDate(project.createdAt)}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground text-sm mb-6">
            <List className="h-4 w-4 mr-1" />
            <span>{project.features.length} Features</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.features.slice(0, 3).map((feature) => (
              <Badge 
                key={feature.id}
                variant="secondary"
                className="bg-white/5 text-muted-foreground hover:bg-white/10"
              >
                {feature.name}
              </Badge>
            ))}
            {project.features.length > 3 && (
              <Badge variant="secondary" className="bg-white/5 text-muted-foreground">
                +{project.features.length - 3} more
              </Badge>
            )}
          </div>
          
          <Button 
            asChild
            variant="outline"
            className="w-full border-white/10 hover:bg-white/5 hover:border-primary/50"
          >
            <Link to={`/projects/${project.id}`}>
              View Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default ProjectCard;