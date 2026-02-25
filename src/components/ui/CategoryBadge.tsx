import React from 'react';
import { ResourceType } from '../../types';
import { categoryMapping, getCategoryConfig } from '../../utils/categoryMapping';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Github, 
  Video, 
  Layers,
  LucideIcon
} from 'lucide-react';

interface CategoryBadgeProps {
  type: ResourceType;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'filled';
}

const iconMap: Record<string, LucideIcon> = {
  FileText,
  Github,
  Video,
  Layers
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  type, 
  showLabel = true,
  size = 'md',
  variant = 'default'
}) => {
  const config = getCategoryConfig(type);
  const Icon = iconMap[config.icon] || FileText;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const baseClasses = `
    inline-flex items-center gap-1.5 font-medium border rounded-full
    ${config.bgColor} ${config.color} ${config.borderColor}
    ${sizeClasses[size]}
  `;
  
  if (variant === 'filled') {
    return (
      <span className={baseClasses}>
        <Icon className={iconSizes[size]} />
        {showLabel && <span>{config.label}</span>}
      </span>
    );
  }
  
  return (
    <Badge 
      variant="outline" 
      className={`${baseClasses} hover:bg-white/5 transition-colors`}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && config.label}
    </Badge>
  );
};

interface CategoryFilterProps {
  selected: ResourceType | 'all';
  onChange: (type: ResourceType | 'all') => void;
  counts?: Record<ResourceType, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selected, 
  onChange,
  counts
}) => {
  const categories = Object.values(categoryMapping);
  
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 border
          ${selected === 'all' 
            ? 'bg-primary text-primary-foreground border-primary' 
            : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-foreground'
          }
        `}
      >
        All Resources
        {counts && (
          <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
            {Object.values(counts).reduce((a, b) => a + b, 0)}
          </span>
        )}
      </button>
      
      {categories.map((category) => {
        const Icon = iconMap[category.icon] || FileText;
        const isSelected = selected === category.type;
        const count = counts?.[category.type];
        
        return (
          <button
            key={category.type}
            onClick={() => onChange(category.type)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200 border
              ${isSelected 
                ? `${category.bgColor} ${category.color} ${category.borderColor}` 
                : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-foreground'
              }
            `}
            title={category.description}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{category.label}</span>
            <span className="sm:hidden">{category.label.split(' ')[0]}</span>
            {count !== undefined && count > 0 && (
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full
                ${isSelected ? 'bg-black/20' : 'bg-white/20'}
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

interface CategoryGroupProps {
  type: ResourceType;
  resources: any[];
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({ 
  type, 
  resources,
  children,
  collapsible = false,
  defaultExpanded = true
}) => {
  const config = getCategoryConfig(type);
  const Icon = iconMap[config.icon] || FileText;
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  
  if (resources.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <button 
        onClick={() => collapsible && setExpanded(!expanded)}
        className={`
          w-full flex items-center gap-3 p-2 rounded-lg transition-colors
          ${collapsible ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'}
        `}
      >
        <div className={`p-2 rounded-lg ${config.bgColor}`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-foreground">{config.label}</h3>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
        <span className={`
          ml-auto text-sm font-medium px-3 py-1 rounded-full
          ${config.bgColor} ${config.color}
        `}>
          {resources.length}
        </span>
        {collapsible && (
          <span className="text-muted-foreground">
            {expanded ? '−' : '+'}
          </span>
        )}
      </button>
      
      {expanded && (
        <div className="space-y-3 pl-4 border-l-2 border-white/5">
          {children}
        </div>
      )}
    </div>
  );
};

export default CategoryBadge;
