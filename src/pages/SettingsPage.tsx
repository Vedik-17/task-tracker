import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, Tag, Download, Upload } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TagForm from '../components/tags/TagForm';
import { useThemeStore } from '../stores/themeStore';

const SettingsPage: React.FC = () => {
  const { tags, deleteTag, tasks, projects } = useTaskStore();
  const { theme, toggleTheme } = useThemeStore();
  
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  
  // Export data
  const handleExportData = () => {
    const data = {
      tasks,
      projects,
      tags,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task-tracker-backup.json';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  // Import data
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      
      if (file) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            
            if (confirm('This will replace all your current data. Continue?')) {
              localStorage.setItem('task-tracker-storage', JSON.stringify({
                state: data,
                version: 0,
              }));
              
              window.location.reload();
            }
          } catch (error) {
            alert('Invalid backup file');
          }
        };
        
        reader.readAsText(file);
      }
    };
    
    input.click();
  };
  
  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setIsTagModalOpen(true);
  };
  
  const handleDeleteTag = (id: string) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      deleteTag(id);
    }
  };
  
  const closeTagModal = () => {
    setIsTagModalOpen(false);
    setEditingTag(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Theme Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Switch between light and dark mode
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tags</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<PlusCircle size={16} />}
              onClick={() => setIsTagModalOpen(true)}
            >
              New Tag
            </Button>
          </CardHeader>
          <CardContent>
            {tags.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  No tags created yet
                </p>
                <Button
                  variant="primary"
                  leftIcon={<PlusCircle size={16} />}
                  onClick={() => setIsTagModalOpen(true)}
                >
                  Create Your First Tag
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                    <div className="flex items-center">
                      <Tag size={16} className="text-gray-400 mr-2" />
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                        }}
                      >
                        {tag.name}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTag(tag)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Export Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download all your tasks, projects, and tags
                  </p>
                </div>
                <Button
                  variant="secondary"
                  leftIcon={<Download size={16} />}
                  onClick={handleExportData}
                >
                  Export
                </Button>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium">Import Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Restore from a previous backup
                  </p>
                </div>
                <Button
                  variant="secondary"
                  leftIcon={<Upload size={16} />}
                  onClick={handleImportClick}
                >
                  Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Modal
        isOpen={isTagModalOpen}
        onClose={closeTagModal}
        title={editingTag ? 'Edit Tag' : 'Create New Tag'}
      >
        <TagForm
          tag={editingTag}
          onSubmit={closeTagModal}
          onCancel={closeTagModal}
        />
      </Modal>
    </div>
  );
};

export default SettingsPage;