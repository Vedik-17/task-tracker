import React, { useState } from 'react';
import { PlusCircle, ArrowDownAZ, ArrowUpAZ, Calendar, CalendarDays } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import TaskCard from '../components/tasks/TaskCard';
import TaskFilter from '../components/tasks/TaskFilter';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';

const TasksPage: React.FC = () => {
  const { getFilteredTasks, setSortOption, sortOption } = useTaskStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const tasks = getFilteredTasks();
  
  const handleSort = (field: 'dueDate' | 'priority' | 'createdAt' | 'title') => {
    if (sortOption.field === field) {
      setSortOption({
        field,
        direction: sortOption.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortOption({
        field,
        direction: 'asc',
      });
    }
  };
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsCreateModalOpen(true);
  };
  
  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tasks
        </h1>
        
        <Button
          variant="primary"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Task
        </Button>
      </div>
      
      <TaskFilter />
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={sortOption.field === 'title' && sortOption.direction === 'asc' ? <ArrowDownAZ size={16} /> : <ArrowUpAZ size={16} />}
          onClick={() => handleSort('title')}
          className={sortOption.field === 'title' ? 'bg-gray-100 dark:bg-gray-700' : ''}
        >
          Name
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Calendar size={16} />}
          onClick={() => handleSort('dueDate')}
          className={sortOption.field === 'dueDate' ? 'bg-gray-100 dark:bg-gray-700' : ''}
        >
          Due Date {sortOption.field === 'dueDate' && (sortOption.direction === 'asc' ? '↑' : '↓')}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<CalendarDays size={16} />}
          onClick={() => handleSort('createdAt')}
          className={sortOption.field === 'createdAt' ? 'bg-gray-100 dark:bg-gray-700' : ''}
        >
          Date Created {sortOption.field === 'createdAt' && (sortOption.direction === 'asc' ? '↑' : '↓')}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleSort('priority')}
          className={sortOption.field === 'priority' ? 'bg-gray-100 dark:bg-gray-700' : ''}
        >
          Priority {sortOption.field === 'priority' && (sortOption.direction === 'asc' ? '↑' : '↓')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {tasks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {getFilteredTasks().length === 0
                ? "You haven't created any tasks yet."
                : "No tasks match your current filters."}
            </p>
            <Button
              variant="primary"
              leftIcon={<PlusCircle size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Your First Task
            </Button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
            />
          ))
        )}
      </div>
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSubmit={closeModal}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default TasksPage;