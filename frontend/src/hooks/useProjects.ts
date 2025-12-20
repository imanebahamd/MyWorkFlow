import { useState, useCallback } from 'react';
import { projectService } from '../services/api/projects';
import type { Project, ProjectDetail, CreateProjectRequest, UpdateProjectRequest, PageRequest } from '../types/project.types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
    first: true,
  });

  // Fetch projects with pagination
  const fetchProjects = useCallback(async (params?: PageRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await projectService.getProjects(params);
      setProjects(response.content);
      setPagination({
        page: response.pageNumber,
        size: response.pageSize,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        last: response.last,
        first: response.first,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
      
      // Reset to empty if error
      setProjects([]);
      setPagination({
        page: 0,
        size: params?.size || 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        first: true,
      });
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies - stable function

  // Fetch single project
  const fetchProjectById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const project = await projectService.getProjectById(id);
      setProjectDetail(project);
      return project;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch project';
      setError(errorMessage);
      console.error('Error fetching project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create project
  const createProject = useCallback(async (data: CreateProjectRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const newProject = await projectService.createProject(data);
      setProjects(prev => [newProject, ...prev]);
      
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        totalElements: prev.totalElements + 1,
      }));
      
      return newProject;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create project';
      setError(errorMessage);
      console.error('Error creating project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update project
  const updateProject = useCallback(async (id: number, data: UpdateProjectRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProject = await projectService.updateProject(id, data);
      setProjects(prev => prev.map(project => 
        project.id === id ? updatedProject : project
      ));
      
      if (projectDetail?.id === id) {
        setProjectDetail(prev => prev ? { ...prev, ...updatedProject } : null);
      }
      
      return updatedProject;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update project';
      setError(errorMessage);
      console.error('Error updating project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectDetail]);

  // Delete project
  const deleteProject = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      
      if (projectDetail?.id === id) {
        setProjectDetail(null);
      }
      
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        totalElements: Math.max(0, prev.totalElements - 1),
      }));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete project';
      setError(errorMessage);
      console.error('Error deleting project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectDetail]);

  // Clear projects
  const clearProjects = useCallback(() => {
    setProjects([]);
    setProjectDetail(null);
    setError(null);
    setPagination({
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      first: true,
    });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    projects,
    projectDetail,
    loading,
    error,
    pagination,
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    clearProjects,
    clearError,
  };
};