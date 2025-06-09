import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { Project } from '../../types';
import ProjectCard from '../../components/projects/ProjectCard';
import { Plus, Loader } from 'lucide-react';

const DashboardPage: React.FC = () => {
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          to="/projects/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No projects yet</h2>
          <p className="text-gray-300 mb-6">
            Create your first project to get curated resources for your development needs.
          </p>
          <Link
            to="/projects/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;