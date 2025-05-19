import React, { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CheckCircle, Clock, AlertTriangle, PlusCircle } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { formatDateFriendly } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatCard from '../components/dashboard/StatCard';
import TaskCard from '../components/tasks/TaskCard';
import Modal from '../components/ui/Modal';
import TaskForm from '../components/tasks/TaskForm';

const Dashboard: React.FC = () => {
  const { tasks, projects, tags, getFilteredTasks } = useTaskStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState(null);
  
  const allTasks = getFilteredTasks();
  
  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && task.status !== 'completed').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Get tasks due today or overdue
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingTasks = tasks
    .filter(task => 
      task.status !== 'completed' && 
      task.dueDate && 
      new Date(task.dueDate) >= today
    )
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);
  
  // Charts data
  const statusData = useMemo(() => {
    const statuses = { 'pending': 0, 'in-progress': 0, 'completed': 0 };
    
    tasks.forEach(task => {
      if (statuses[task.status] !== undefined) {
        statuses[task.status]++;
      }
    });
    
    return Object.entries(statuses).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
      value,
    }));
  }, [tasks]);
  
  const priorityData = useMemo(() => {
    const priorities = { 'high': 0, 'medium': 0, 'low': 0 };
    
    tasks.forEach(task => {
      priorities[task.priority]++;
    });
    
    return Object.entries(priorities).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [tasks]);
  
  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];
  
  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };
  
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        
        <Button
          variant="primary"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setIsTaskModalOpen(true)}
        >
          New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={<CheckCircle size={24} />}
        />
        
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          trend={
            totalTasks > 0
              ? {
                  direction: 'up',
                  value: `${completionRate}% completion rate`,
                }
              : undefined
          }
          icon={<CheckCircle size={24} />}
        />
        
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={<Clock size={24} />}
        />
        
        <StatCard
          title="High Priority"
          value={highPriorityTasks}
          description="Tasks requiring attention"
          icon={<AlertTriangle size={24} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <p className="text-center py-4 text-gray-500 dark:text-gray-400">
              No upcoming tasks. Create a new task to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingTasks.map(task => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <TaskForm
          task={editingTask}
          onSubmit={closeTaskModal}
          onCancel={closeTaskModal}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;