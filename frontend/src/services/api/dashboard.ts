import axiosInstance from './axiosInstance';
import type { DashboardResponse, StatsResponse } from '../../types/dashboard.types';
import type { ApiResponse } from '../../types/common.types';

export const dashboardService = {
  // Get complete dashboard data
  async getDashboard(): Promise<DashboardResponse> {
    const response = await axiosInstance.get<ApiResponse<DashboardResponse>>(
      '/dashboard'
    );
    return response.data.data;
  },

  // Get statistics only
  async getStats(): Promise<StatsResponse> {
    const response = await axiosInstance.get<ApiResponse<StatsResponse>>(
      '/dashboard/stats'
    );
    return response.data.data;
  },

  // Get quick stats for cards (derived from stats)
  async getQuickStats(): Promise<any> {
    const stats = await this.getStats();
    
    return {
      totalProjects: stats.totalProjects,
      activeProjects: stats.activeProjects,
      completedProjects: stats.completedProjects,
      totalTasks: stats.totalTasks,
      completedTasks: stats.completedTasks,
      inProgressTasks: stats.inProgressTasks,
      todoTasks: stats.todoTasks,
      overdueTasks: stats.overdueTasks,
      averageProgress: stats.averageProjectProgress,
    };
  }
};