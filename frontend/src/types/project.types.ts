export interface Project {
  id: number;
  title: string;
  description?: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail {
  id: number;
  title: string;
  description?: string;
  owner: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}