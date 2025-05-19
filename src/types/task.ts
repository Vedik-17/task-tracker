export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  tags: string[];
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: Priority | 'all';
  projectId?: string | 'all';
  tags?: string[];
  search?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export interface TaskSortOption {
  field: 'dueDate' | 'priority' | 'createdAt' | 'title';
  direction: 'asc' | 'desc';
}