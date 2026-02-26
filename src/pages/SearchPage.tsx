import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  Clock, 
  Star, 
  Code, 
  Sparkles,
  ArrowRight,
  Loader2,
  FileText,
  Video,
  Github,
  Layers
} from 'lucide-react';
import { resourceService } from '../services/api/resourceService';
import { Resource, ResourceType } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  sortResourcesByCategory 
} from '../utils/categoryMapping';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Generate resource types from category mapping
  const resourceTypes = [
    { type: 'all' as const, label: 'All', icon: Search, color: 'text-foreground', bg: 'bg-white/5', description: 'All resource types' },
    { type: 'documentation' as ResourceType, label: 'Documentation', icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', description: 'Official docs and references' },
    { type: 'repository' as ResourceType, label: 'Repositories', icon: Github, color: 'text-green-400', bg: 'bg-green-500/10', description: 'GitHub repos and packages' },
    { type: 'tutorial' as ResourceType, label: 'Tutorials', icon: Video, color: 'text-red-400', bg: 'bg-red-500/10', description: 'Video tutorials and guides' },
    { type: 'template' as ResourceType, label: 'Templates', icon: Layers, color: 'text-yellow-400', bg: 'bg-yellow-500/10', description: 'Starter templates and examples' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Auto-search when category changes (if already searched)
  useEffect(() => {
    if (hasSearched && query.trim()) {
      handleSearch(query);
    }
  }, [selectedType]);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      let searchResults: Resource[] = [];
      
      if (selectedType === 'all') {
        searchResults = await resourceService.searchResourcesForFeature(searchQuery, 12);
      } else {
        searchResults = await resourceService.getResourcesByType(searchQuery, selectedType, 12);
      }

      // Sort results by category using the mapping utility
      const sortedResults = sortResourcesByCategory(searchResults);

      setResults(sortedResults);

      // Update search history
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case 'documentation': return <FileText className="h-5 w-5 text-blue-400" />;
      case 'tutorial': return <Video className="h-5 w-5 text-red-400" />;
      case 'repository': return <Github className="h-5 w-5 text-green-400" />;
      case 'template': return <Layers className="h-5 w-5 text-yellow-400" />;
      default: return <Search className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getResourceTypeBadge = (type: ResourceType) => {
    const styles = {
      documentation: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      tutorial: 'bg-red-500/10 text-red-400 border-red-500/20',
      repository: 'bg-green-500/10 text-green-400 border-green-500/20',
      template: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    return styles[type] || 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="min-h-screen pt-8">
      {/* Hero Search Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Search
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Search <span className="gradient-text">Developer Resources</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find documentation, tutorials, repositories, and templates from across the web
            </p>
          </div>

          {/* Search Form */}
          <Card className="bg-card/50 border-white/5 backdrop-blur-xl">
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for any technology, framework, or concept..."
                    className="w-full pl-12 pr-4 py-6 bg-white/5 border-white/10 text-lg placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Type Filters */}
                <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as ResourceType | 'all')} className="w-full">
                  <TabsList className="w-full flex-wrap h-auto bg-white/5 p-1 gap-1">
                    {resourceTypes.map(({ type, label, icon: Icon }) => (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                <Button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="w-full bg-primary hover:bg-primary/90 glow text-lg py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Search Resources
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(term);
                      handleSearch(term);
                    }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Separator className="bg-white/5" />

      {/* Results Section */}
      {hasSearched && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {results.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    Found <span className="gradient-text">{results.length}</span> resources for "{query}"
                  </h2>
                </div>
                
                <div className="grid gap-4">
                  {results.map((resource) => (
                    <Card 
                      key={resource.id} 
                      className="group bg-card/50 border-white/5 hover:border-white/10 card-hover overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              {getResourceIcon(resource.type)}
                              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {resource.title}
                              </h3>
                              <Badge className={`${getResourceTypeBadge(resource.type)} border`}>
                                {resource.type}
                              </Badge>
                            </div>
                            
                            {resource.description && (
                              <p className="text-muted-foreground mb-3 line-clamp-2">{resource.description}</p>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1.5">
                                <ExternalLink className="h-3.5 w-3.5" />
                                {(() => {
                                  try {
                                    return new URL(resource.url).hostname.replace('www.', '');
                                  } catch {
                                    return resource.url.substring(0, 30) + '...';
                                  }
                                })()}
                              </span>
                              {(resource as any).stars && (
                                <span className="flex items-center gap-1.5">
                                  <Star className="h-3.5 w-3.5 text-yellow-400" />
                                  {(resource as any).stars.toLocaleString()}
                                </span>
                              )}
                              {(resource as any).language && (
                                <Badge variant="secondary" className="text-xs bg-white/5">
                                  <Code className="h-3 w-3 mr-1" />
                                  {(resource as any).language}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            asChild
                            variant="outline"
                            className="flex-shrink-0 border-white/10 hover:bg-white/5 hover:border-primary/50"
                          >
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : !loading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try searching with different keywords or check your spelling. We search across GitHub, YouTube, Stack Overflow, and more.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Empty State - Before Search */}
      {!hasSearched && !loading && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Github, label: 'GitHub Repos', color: 'text-green-400', bg: 'bg-green-500/10' },
                { icon: Video, label: 'Video Tutorials', color: 'text-red-400', bg: 'bg-red-500/10' },
                { icon: FileText, label: 'Documentation', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { icon: Layers, label: 'Templates', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-white/5 border border-white/5">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchPage;
