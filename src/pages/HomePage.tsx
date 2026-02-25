import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  Search, 
  Lightbulb, 
  Database, 
  ChevronRight, 
  Zap, 
  Shield, 
  Rocket,
  ArrowRight,
  Sparkles,
  Github,
  Youtube,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Lightbulb,
      title: 'Describe Your Project',
      description: 'Tell us what you want to build, whether it\'s a blog, e-commerce site, or mobile app.',
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-400'
    },
    {
      icon: Code,
      title: 'AI Feature Extraction',
      description: 'Our AI analyzes your project and breaks it down into core features and components.',
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400'
    },
    {
      icon: Database,
      title: 'Curated Resources',
      description: 'Get categorized resources from across the web for each feature of your project.',
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400'
    }
  ];

  const resourceTypes = [
    { icon: Github, label: 'GitHub Repos', count: '10K+' },
    { icon: Youtube, label: 'Tutorials', count: '5K+' },
    { icon: BookOpen, label: 'Docs', count: '2K+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[100px] rounded-full" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Powered by AI
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="gradient-text">Build Faster</span>
              <br />
              <span className="text-foreground">With Smart Resources</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Describe your project, and we&apos;ll find the best documentation, tutorials, 
              templates, and repositories from across the web.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              {user ? (
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 glow text-lg px-8">
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 glow text-lg px-8">
                    <Link to="/signup">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Get Started Free
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-white/10 text-lg px-8">
                    <Link to="/search">
                      <Search className="mr-2 h-5 w-5" />
                      Try Search
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 pt-8">
              {resourceTypes.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-white/5" />

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to discover the best resources for your next project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="group bg-card/50 border-white/5 card-hover overflow-hidden">
                <CardContent className="p-8">
                  {/* Step Number */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="bg-white/5" />

      {/* Benefits Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Everything You Need to{' '}
                <span className="gradient-text">Ship Faster</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Stop searching through dozens of tabs. Get all the resources you need in one place, organized by feature and category.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Zap, title: 'Lightning Fast Search', desc: 'Find resources in seconds, not hours' },
                  { icon: Shield, title: 'Curated & Verified', desc: 'Only high-quality, up-to-date resources' },
                  { icon: Rocket, title: 'Project Management', desc: 'Track resources for each project feature' },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/[0.07] transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full" />
              <Card className="relative bg-card/80 backdrop-blur-xl border-white/10 overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-sm text-muted-foreground">Project: E-commerce App</span>
                  </div>
                  
                  {[
                    { name: 'Authentication', resources: 12, color: 'bg-blue-500/20 text-blue-400' },
                    { name: 'Payment Integration', resources: 8, color: 'bg-green-500/20 text-green-400' },
                    { name: 'Product Catalog', resources: 15, color: 'bg-purple-500/20 text-purple-400' },
                    { name: 'Shopping Cart', resources: 10, color: 'bg-orange-500/20 text-orange-400' },
                  ].map((feature) => (
                    <div key={feature.name} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="font-medium">{feature.name}</span>
                      <Badge className={feature.color}>
                        {feature.resources} resources
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Something{' '}
            <span className="gradient-text">Amazing?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are shipping faster with Dev.Assist
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 glow text-lg px-8">
              <Link to={user ? "/dashboard" : "/signup"}>
                {user ? 'Go to Dashboard' : 'Start Building Free'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;