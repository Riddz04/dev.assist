import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../../services/projectService';
import { Project, Feature, Resource, ResourceStatus } from '../../types';
import { 
  Loader, 
  BookOpen, 
  Code, 
  FileText, 
  Package, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Plus,
  Trash2,
  Calendar
} from 'lucide-react';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [addingFeatureLoading, setAddingFeatureLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        const data = await projectService.getProjectById(projectId);
        
        if (!data) {
          setError('Project not found');
          return;
        }
        
        setProject(data);
        
        // Set the first feature as active by default
        if (data.features.length > 0 && !activeFeature) {
          setActiveFeature(data.features[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('Failed to load project. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, activeFeature]);

  const handleResourceStatusChange = async (
    featureId: string, 
    resourceId: string, 
    status: ResourceStatus
  ) => {
    if (!projectId) return;

    try {
      await projectService.updateResourceStatus(projectId, featureId, resourceId, status);
      
      // Update local state
      setProject(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          features: prev.features.map(feature => {
            if (feature.id !== featureId) return feature;
            
            return {
              ...feature,
              resources: feature.resources.map(resource => {
                if (resource.id !== resourceId) return resource;
                return { ...resource, status };
              })
            };
          })
        };
      });
    } catch (err) {
      console.error('Failed to update resource status:', err);
    }
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId || !newFeatureName.trim()) return;
    
    try {
      setAddingFeatureLoading(true);
      const newFeature = await projectService.addFeature(projectId, newFeatureName);
      
      if (newFeature) {
        setProject(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            features: [...prev.features, newFeature]
          };
        });
        
        setActiveFeature(newFeature.id);
        setNewFeatureName('');
        setIsAddingFeature(false);
      }
    } catch (err) {
      console.error('Failed to add feature:', err);
    } finally {
      setAddingFeatureLoading(false);
    }
  };

  const handleRemoveFeature = async (featureId: string) => {
    if (!projectId || !window.confirm('Are you sure you want to remove this feature?')) return;
    
    try {
      await projectService.removeFeature(projectId, featureId);
      
      setProject(prev => {
        if (!prev) return prev;
        
        const updatedFeatures = prev.features.filter(f => f.id !== featureId);
        
        // If we're removing the active feature, set another one as active
        if (activeFeature === featureId && updatedFeatures.length > 0) {
          setActiveFeature(updatedFeatures[0].id);
        } else if (updatedFeatures.length === 0) {
          setActiveFeature(null);
        }
        
        return {
          ...prev,
          features: updatedFeatures
        };
      });
    } catch (err) {
      console.error('Failed to remove feature:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'documentation':
        return <BookOpen className="h-5 w-5 text-blue-400" />;
      case 'tutorial':
        return <FileText className="h-5 w-5 text-green-400" />;
      case 'repository':
        return <Code className="h-5 w-5 text-purple-400" />;
      case 'template':
        return <Package className="h-5 w-5 text-orange-400" />;
      default:
        return <BookOpen className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStatusIcon = (status: ResourceStatus) => {
    switch (status) {
      case 'read':
        return <CheckCircle className="h-5 w-5 text-blue-400" />;
      case 'used':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'broken':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-300 px-4 py-3 rounded">
        {error || 'Project not found'}
      </div>
    );
  }

  const activeFeatureObj = project.features.find(f => f.id === activeFeature);

  return (
    <div>
      {/* Project Header */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center text-gray-400">
            <Calendar className="h-5 w-5 mr-2" />
            <span>Created on {formatDate(project.createdAt)}</span>
          </div>
        </div>
        <p className="text-gray-300 mb-4">{project.description}</p>
      </div>

      {/* Feature Navigation and Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Feature Navigation Sidebar */}
        <div className="col-span-1">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Features</h2>
              <button 
                onClick={() => setIsAddingFeature(!isAddingFeature)}
                className="p-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {/* Add Feature Form */}
            {isAddingFeature && (
              <form onSubmit={handleAddFeature} className="mb-4">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newFeatureName}
                    onChange={(e) => setNewFeatureName(e.target.value)}
                    placeholder="Feature name"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={addingFeatureLoading || !newFeatureName.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50"
                  >
                    {addingFeatureLoading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      'Add'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Feature List */}
            <ul className="space-y-2">
              {project.features.length === 0 ? (
                <li className="text-gray-400 text-sm italic">
                  No features yet. Add one to get started.
                </li>
              ) : (
                project.features.map((feature) => (
                  <li key={feature.id}>
                    <div 
                      className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                        activeFeature === feature.id 
                          ? 'bg-indigo-600 text-white' 
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <button
                        onClick={() => setActiveFeature(feature.id)}
                        className="flex-1 text-left"
                      >
                        {feature.name}
                      </button>
                      <button 
                        onClick={() => handleRemoveFeature(feature.id)}
                        className="p-1 rounded-full hover:bg-gray-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Resource Content */}
        <div className="col-span-1 md:col-span-3">
          {!activeFeatureObj ? (
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <p className="text-gray-300">
                {project.features.length === 0 
                  ? 'No features yet. Add a feature to see curated resources.' 
                  : 'Select a feature to view resources.'}
              </p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-6">{activeFeatureObj.name} Resources</h2>
              
              {activeFeatureObj.resources.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No resources found for this feature.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeFeatureObj.resources.map((resource) => (
                    <div 
                      key={resource.id} 
                      className="bg-gray-700 rounded-lg p-4 transition-transform hover:scale-[1.01]"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getResourceIcon(resource.type)}
                          <div>
                            <h3 className="font-semibold text-white">{resource.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">
                              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                            </p>
                            {resource.description && (
                              <p className="text-sm text-gray-300 mb-2">{resource.description}</p>
                            )}
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                              View Resource <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="relative group">
                            <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
                              {getStatusIcon(resource.status)}
                            </button>
                            
                            <div className="absolute right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 hidden group-hover:block">
                              <div className="p-2 space-y-1 min-w-40">
                                <button
                                  onClick={() => handleResourceStatusChange(
                                    activeFeatureObj.id, 
                                    resource.id, 
                                    'unread'
                                  )}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-gray-700 text-sm"
                                >
                                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                                  <span>Mark as Unread</span>
                                </button>
                                <button
                                  onClick={() => handleResourceStatusChange(
                                    activeFeatureObj.id, 
                                    resource.id, 
                                    'read'
                                  )}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-gray-700 text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 text-blue-400" />
                                  <span>Mark as Read</span>
                                </button>
                                <button
                                  onClick={() => handleResourceStatusChange(
                                    activeFeatureObj.id, 
                                    resource.id, 
                                    'used'
                                  )}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-gray-700 text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  <span>Mark as Used</span>
                                </button>
                                <button
                                  onClick={() => handleResourceStatusChange(
                                    activeFeatureObj.id, 
                                    resource.id, 
                                    'broken'
                                  )}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-gray-700 text-sm"
                                >
                                  <XCircle className="h-4 w-4 text-red-400" />
                                  <span>Mark as Broken</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;