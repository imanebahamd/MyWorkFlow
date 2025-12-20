import axiosInstance from './axiosInstance';
import type {
    Project,
    ProjectDetail,
    CreateProjectRequest,
    UpdateProjectRequest,
    PageRequest
} from '../../types/project.types';
import type { ApiResponse, PaginatedResponse } from '../../types/common.types';

export const projectService = {
  // Create a new project
  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await axiosInstance.post<ApiResponse<Project>>(
      '/projects',
      data
    );
    return response.data.data;
  },

  // Get user projects with pagination and search
  async getProjects(params?: PageRequest): Promise<PaginatedResponse<Project>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Project>>>(
      '/projects',
      { params }
    );
    return response.data.data;
  },

  // Get project by ID
  async getProjectById(id: number): Promise<ProjectDetail> {
    const response = await axiosInstance.get<ApiResponse<ProjectDetail>>(
      `/projects/${id}`
    );
    return response.data.data;
  },

  // Update project
  async updateProject(id: number, data: UpdateProjectRequest): Promise<Project> {
    const response = await axiosInstance.put<ApiResponse<Project>>(
      `/projects/${id}`,
      data
    );
    return response.data.data;
  },

  // Delete project
  async deleteProject(id: number): Promise<void> {
    await axiosInstance.delete<ApiResponse<void>>(`/projects/${id}`);
  },

  // Search projects
  async searchProjects(query: string, params?: PageRequest): Promise<PaginatedResponse<Project>> {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Project>>>(
      '/projects/search',
      { 
        params: { 
          query,
          ...params 
        } 
      }
    );
    return response.data.data;
  }
};