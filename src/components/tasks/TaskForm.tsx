import React, { useState, useEffect } from 'react';
import { Task, Priority } from '../../types/task';
import { useTaskStore } from '../../stores/taskStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface TaskFormProps {
  task?: Task;
  onSubmit: () => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
}) => {
  const { addTask, updateTask, projects, tags } = useTaskStore();
  const isEditing = !!task;
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.slice(0, 10) : '');
  const [projectId, setProjectId] = useState(task?.projectId || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(task?.tags || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      projectId: projectId || undefined,
      tags: selectedTags,
    };
    
    if (isEditing && task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData as any);
    }
    
    onSubmit();
  };
  
  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Task Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add task details"
          className="input min-h-[80px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <Select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={[
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' },
            ]}
          />
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="project" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project
        </label>
        <Select
          id="project"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          options={[
            { value: '', label: 'No Project' },
            ...projects.map((project) => ({
              value: project.id,
              label: project.name,
            })),
          ]}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-700 rounded-md">
          {tags.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No tags available. Create tags in the settings.
            </p>
          )}
          
          {tags.map((tag) => (
            <div
              key={tag.id}
              onClick={() => handleTagToggle(tag.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors
                ${selectedTags.includes(tag.id)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;