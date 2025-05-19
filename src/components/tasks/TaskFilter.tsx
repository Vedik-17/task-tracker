import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const TaskFilter: React.FC = () => {
  const { filters, setFilters, resetFilters, projects, tags } = useTaskStore();
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ status: e.target.value as any });
  };
  
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ priority: e.target.value as any });
  };
  
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ projectId: e.target.value });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };
  
  const handleTagToggle = (tagId: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    setFilters({ tags: newTags });
  };
  
  const isFiltered = filters.status !== 'all' || 
                    filters.priority !== 'all' || 
                    filters.projectId !== 'all' || 
                    (filters.tags && filters.tags.length > 0) ||
                    filters.search;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="flex-1">
          <Input
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
            leftIcon={<Search size={18} />}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Filter size={16} />}
            className="md:hidden"
            onClick={() => document.getElementById('filter-collapse')?.classList.toggle('hidden')}
          >
            Filters
          </Button>
          
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<X size={16} />}
              onClick={resetFilters}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      
      <div id="filter-collapse" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:flex md:flex-wrap">
        <div className="w-full md:w-auto md:flex-1">
          <Select
            value={filters.status || 'all'}
            onChange={handleStatusChange}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
        </div>
        
        <div className="w-full md:w-auto md:flex-1">
          <Select
            value={filters.priority || 'all'}
            onChange={handlePriorityChange}
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
          />
        </div>
        
        <div className="w-full md:w-auto md:flex-1">
          <Select
            value={filters.projectId || 'all'}
            onChange={handleProjectChange}
            options={[
              { value: 'all', label: 'All Projects' },
              ...projects.map(project => ({
                value: project.id,
                label: project.name,
              })),
            ]}
          />
        </div>
      </div>
      
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map(tag => (
            <div
              key={tag.id}
              onClick={() => handleTagToggle(tag.id)}
              className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors
                ${(filters.tags || []).includes(tag.id)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskFilter;