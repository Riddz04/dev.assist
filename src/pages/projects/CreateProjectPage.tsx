import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { Lightbulb, AlertCircle, Loader } from 'lucide-react';

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const newProject = await projectService.createProject(name, description);
      navigate(`/projects/${newProject.id}`);
    } catch (err: any) {
      console.error('Failed to create project:', err);
      setError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Example projects to help users get started
  const exampleProjects = [
    {
      name: 'Blog Platform',
      description: 'A blog platform with authentication, Markdown editor, and comment system'
    },
    {
      name: 'E-commerce Store',
      description: 'An online store with product catalog, shopping cart, and Stripe payment integration'
    },
    {
      name: 'Task Management App',
      description: 'A Trello-like application with drag-and-drop functionality, user assignments, and due dates'
    }
  ];

  const handleExampleClick = (example: { name: string; description: string }) => {
    setName(example.name);
    setDescription(example.description);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-300 px-4 py-3 rounded mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="My Awesome Project"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Project Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe your project in detail, including features you want to build..."
            />
            <p className="text-sm text-gray-400 mt-1">
              The more details you provide, the better resources we can find for you.
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Creating Project...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </form>
      </div>
      
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-start mb-4">
          <Lightbulb className="h-6 w-6 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-lg">Need inspiration?</h3>
            <p className="text-gray-300">
              Click on an example below to use it as a starting point.
            </p>
          </div>
        </div>
        
        <div className="grid gap-4">
          {exampleProjects.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-left bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors"
            >
              <h4 className="font-medium mb-1">{example.name}</h4>
              <p className="text-sm text-gray-300">{example.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;