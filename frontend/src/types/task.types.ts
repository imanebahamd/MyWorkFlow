export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  overdue: boolean;
  projectId: number;
  projectTitle: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDetail {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  overdue: boolean;
  project: {
    id: number;
    title: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
}

export interface TaskFilterRequest {
  page?: number;
  size?: number;
  sortBy?: 'title' | 'dueDate' | 'status' | 'createdAt' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
  search?: string;
  status?: TaskStatus;
  dueDate?: string;
  overdue?: boolean;
}

// For TaskStats on dashboard
export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
}