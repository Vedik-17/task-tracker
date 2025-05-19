import React from 'react';
import { formatDateFriendly, getPriorityColor } from '../../lib/utils';
import { CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { Task } from '../../types/task';
import { useTaskStore } from '../../stores/taskStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { updateTask, deleteTask, completeTask, projects, tags } = useTaskStore();
  
  const isCompleted = task.status === 'completed';
  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null;
  const taskTags = task.tags.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean);
  
  const handleComplete = () => {
    if (isCompleted) {
      updateTask(task.id, { status: 'pending', completedAt: undefined });
    } else {
      completeTask(task.id);
    }
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  return (
    <Card className={`${isCompleted ? 'opacity-75' : ''} transform transition-all duration-200 hover:-translate-y-1`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {task.description}
              </p>
            )}
            
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant={getPriorityColor(task.priority) as any}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              
              {project && (
                <Badge variant="secondary">
                  {project.name}
                </Badge>
              )}
              
              {taskTags.map(tag => (
                tag && (
                  <Badge key={tag.id} variant="primary" className="bg-opacity-70">
                    {tag.name}
                  </Badge>
                )
              ))}
            </div>
          </div>
          
          {task.dueDate && (
            <div className="ml-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock size={16} className="mr-1" />
              <span>{formatDateFriendly(task.dueDate)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-800">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<CheckCircle size={16} className={isCompleted ? 'text-success-500' : ''} />}
          onClick={handleComplete}
        >
          {isCompleted ? 'Completed' : 'Complete'}
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit size={16} />}
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={16} className="text-error-500" />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;