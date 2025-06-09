import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { CalendarDays, ArrowRight, List } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white">{project.name}</h3>
        <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
        
        <div className="flex items-center text-gray-400 text-sm mb-4">
          <CalendarDays className="h-4 w-4 mr-1" />
          <span>Created on {formatDate(project.createdAt)}</span>
        </div>
        
        <div className="flex items-center text-gray-400 text-sm mb-6">
          <List className="h-4 w-4 mr-1" />
          <span>{project.features.length} Features</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.features.slice(0, 3).map((feature) => (
            <span 
              key={feature.id}
              className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
            >
              {feature.name}
            </span>
          ))}
          {project.features.length > 3 && (
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
              +{project.features.length - 3} more
            </span>
          )}
        </div>
        
        <Link 
          to={`/projects/${project.id}`}
          className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          View Project
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;