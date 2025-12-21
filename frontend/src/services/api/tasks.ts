import axiosInstance from './axiosInstance';
import type {
    Task,
    TaskDetail,
    CreateTaskRequest,
    UpdateTaskRequest,
    TaskFilterRequest,
    TaskStats
} from '../../types/task.types';
import type { ApiResponse, PaginatedResponse } from '../../types/common.types';

export const taskService = {
  // Create a new task in a project
  async createTask(projectId: number, data: CreateTaskRequest): Promise<Task> {
    const response = await axiosInstance.post<ApiResponse<Task>>(
      `/projects/${projectId}/tasks`,
      data
    );
    return response.data.data;
  },

  // Get tasks for a project
  async getProjectTasks(projectId: number, params?: TaskFilterRequest): Promise<PaginatedResponse<Task>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Task>>>(
      `/projects/${projectId}/tasks`,
      { params }
    );
    return response.data.data;
  },

  // Get all user tasks
  async getUserTasks(params?: TaskFilterRequest): Promise<PaginatedResponse<Task>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Task>>>(
      '/tasks',
      { params }
    );
    return response.data.data;
  },

  // Get task by ID
  async getTaskById(id: number): Promise<TaskDetail> {
    const response = await axiosInstance.get<ApiResponse<TaskDetail>>(
      `/tasks/${id}`
    );
    return response.data.data;
  },

  // Update task
  async updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    const response = await axiosInstance.put<ApiResponse<Task>>(
      `/tasks/${id}`,
      data
    );
    return response.data.data;
  },

  // Mark task as completed
  async markAsCompleted(id: number): Promise<Task> {
    const response = await axiosInstance.patch<ApiResponse<Task>>(
      `/tasks/${id}/complete`
    );
    return response.data.data;
  },

  // Delete task
  async deleteTask(id: number): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`/tasks/${id}`);
  },

  // Search tasks
  async searchTasks(query: string, params?: TaskFilterRequest): Promise<PaginatedResponse<Task>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Task>>>(
      '/tasks/search',
      { 
        params: { 
          query,
          ...params 
        } 
      }
    );
    return response.data.data;
  },

  // Get task statistics for dashboard
  async getTaskStats(): Promise<TaskStats> {
    // Note: You might need to implement this endpoint in backend
    const allTasks = await this.getUserTasks({ size: 1000 });
    
    const stats: TaskStats = {
      total: allTasks.totalElements,
      completed: allTasks.content.filter(t => t.status === 'DONE').length,
      inProgress: allTasks.content.filter(t => t.status === 'IN_PROGRESS').length,
      todo: allTasks.content.filter(t => t.status === 'TODO').length,
      overdue: allTasks.content.filter(t => t.overdue).length
    };
    
    return stats;
  }
};