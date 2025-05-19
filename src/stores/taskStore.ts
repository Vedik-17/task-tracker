import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { generateId } from '../lib/utils';
import { 
  Task, 
  Priority, 
  TaskStatus,
  Project,
  Tag,
  TaskFilters,
  TaskSortOption
} from '../types/task';

interface TaskState {
  tasks: Task[];
  projects: Project[];
  tags: Tag[];
  filters: TaskFilters;
  sortOption: TaskSortOption;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => string;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  
  // Project Actions
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => string;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Tag Actions
  addTag: (tag: Omit<Tag, 'id'>) => string;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  // Filter Actions
  setFilters: (filters: TaskFilters) => void;
  resetFilters: () => void;
  
  // Sort Actions
  setSortOption: (option: TaskSortOption) => void;
  
  // Filtered & Sorted Tasks
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: [],
        projects: [],
        tags: [],
        filters: {
          status: 'all',
          priority: 'all',
          projectId: 'all',
          tags: [],
          search: '',
          dateRange: {},
        },
        sortOption: {
          field: 'dueDate',
          direction: 'asc',
        },
        
        // Task Actions
        addTask: (taskData) => {
          const id = generateId();
          const newTask: Task = {
            id,
            ...taskData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            tags: taskData.tags || [],
          };
          
          set((state) => ({
            tasks: [...state.tasks, newTask],
          }));
          
          return id;
        },
        
        updateTask: (id, taskData) => {
          set((state) => ({
            tasks: state.tasks.map((task) => 
              task.id === id ? { ...task, ...taskData } : task
            ),
          }));
        },
        
        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }));
        },
        
        completeTask: (id) => {
          set((state) => ({
            tasks: state.tasks.map((task) => 
              task.id === id 
                ? { 
                    ...task, 
                    status: 'completed', 
                    completedAt: new Date().toISOString() 
                  } 
                : task
            ),
          }));
        },
        
        // Project Actions
        addProject: (projectData) => {
          const id = generateId();
          const newProject: Project = {
            id,
            ...projectData,
            createdAt: new Date().toISOString(),
          };
          
          set((state) => ({
            projects: [...state.projects, newProject],
          }));
          
          return id;
        },
        
        updateProject: (id, projectData) => {
          set((state) => ({
            projects: state.projects.map((project) => 
              project.id === id ? { ...project, ...projectData } : project
            ),
          }));
        },
        
        deleteProject: (id) => {
          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
            // Remove project from tasks or set to undefined
            tasks: state.tasks.map((task) => 
              task.projectId === id 
                ? { ...task, projectId: undefined } 
                : task
            ),
          }));
        },
        
        // Tag Actions
        addTag: (tagData) => {
          const id = generateId();
          const newTag: Tag = {
            id,
            ...tagData,
          };
          
          set((state) => ({
            tags: [...state.tags, newTag],
          }));
          
          return id;
        },
        
        updateTag: (id, tagData) => {
          set((state) => ({
            tags: state.tags.map((tag) => 
              tag.id === id ? { ...tag, ...tagData } : tag
            ),
          }));
        },
        
        deleteTag: (id) => {
          set((state) => ({
            tags: state.tags.filter((tag) => tag.id !== id),
            // Remove tag from all tasks
            tasks: state.tasks.map((task) => ({
              ...task,
              tags: task.tags.filter((tagId) => tagId !== id),
            })),
          }));
        },
        
        // Filter Actions
        setFilters: (filters) => {
          set((state) => ({
            filters: {
              ...state.filters,
              ...filters,
            },
          }));
        },
        
        resetFilters: () => {
          set({
            filters: {
              status: 'all',
              priority: 'all',
              projectId: 'all',
              tags: [],
              search: '',
              dateRange: {},
            },
          });
        },
        
        // Sort Actions
        setSortOption: (option) => {
          set({
            sortOption: option,
          });
        },
        
        // Get Filtered & Sorted Tasks
        getFilteredTasks: () => {
          const { tasks, filters, sortOption } = get();
          
          // Apply filters
          let filteredTasks = [...tasks];
          
          if (filters.status && filters.status !== 'all') {
            filteredTasks = filteredTasks.filter(
              (task) => task.status === filters.status
            );
          }
          
          if (filters.priority && filters.priority !== 'all') {
            filteredTasks = filteredTasks.filter(
              (task) => task.priority === filters.priority
            );
          }
          
          if (filters.projectId && filters.projectId !== 'all') {
            filteredTasks = filteredTasks.filter(
              (task) => task.projectId === filters.projectId
            );
          }
          
          if (filters.tags && filters.tags.length > 0) {
            filteredTasks = filteredTasks.filter((task) =>
              filters.tags!.some((tagId) => task.tags.includes(tagId))
            );
          }
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredTasks = filteredTasks.filter(
              (task) =>
                task.title.toLowerCase().includes(searchLower) ||
                (task.description &&
                  task.description.toLowerCase().includes(searchLower))
            );
          }
          
          if (filters.dateRange) {
            if (filters.dateRange.from) {
              const fromDate = new Date(filters.dateRange.from);
              filteredTasks = filteredTasks.filter(
                (task) => task.dueDate && new Date(task.dueDate) >= fromDate
              );
            }
            
            if (filters.dateRange.to) {
              const toDate = new Date(filters.dateRange.to);
              filteredTasks = filteredTasks.filter(
                (task) => task.dueDate && new Date(task.dueDate) <= toDate
              );
            }
          }
          
          // Apply sorting
          return filteredTasks.sort((a, b) => {
            const { field, direction } = sortOption;
            
            if (field === 'dueDate') {
              if (!a.dueDate) return direction === 'asc' ? 1 : -1;
              if (!b.dueDate) return direction === 'asc' ? -1 : 1;
              
              return direction === 'asc'
                ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
            }
            
            if (field === 'priority') {
              const priorityWeight = { high: 3, medium: 2, low: 1 };
              return direction === 'asc'
                ? priorityWeight[a.priority] - priorityWeight[b.priority]
                : priorityWeight[b.priority] - priorityWeight[a.priority];
            }
            
            if (field === 'createdAt') {
              return direction === 'asc'
                ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            
            if (field === 'title') {
              return direction === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
            }
            
            return 0;
          });
        },
      }),
      {
        name: 'task-tracker-storage',
      }
    )
  )
);