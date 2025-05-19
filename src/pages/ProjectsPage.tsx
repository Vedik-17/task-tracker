import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, FolderKanban } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ProjectForm from '../components/projects/ProjectForm';

const ProjectsPage: React.FC = () => {
  const { projects, deleteProject, tasks } = useTaskStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  const getProjectTaskCount = (projectId: string) => {
    return tasks.filter((task) => task.projectId === projectId).length;
  };
  
  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsCreateModalOpen(true);
  };
  
  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };
  
  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Projects
        </h1>
        
        <Button
          variant="primary"
          leftIcon={<PlusCircle size={16} />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first project to organize your tasks.
            </p>
            <Button
              variant="primary"
              leftIcon={<PlusCircle size={16} />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Your First Project
            </Button>
          </div>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="transform transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </CardTitle>
                <FolderKanban size={20} className="text-gray-400" />
              </CardHeader>
              
              <CardContent>
                {project.description ? (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {project.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No description
                  </p>
                )}
                
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getProjectTaskCount(project.id)} task{getProjectTaskCount(project.id) !== 1 ? 's' : ''}
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-800">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Edit size={16} />}
                  onClick={() => handleEditProject(project)}
                >
                  Edit
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 size={16} className="text-error-500" />}
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <ProjectForm
          project={editingProject}
          onSubmit={closeModal}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;