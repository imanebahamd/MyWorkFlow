import { useState, useCallback } from 'react';
import { taskService } from '../services/api/tasks';
import { 
   type Task, 
   type TaskDetail, 
  type CreateTaskRequest, 
  type UpdateTaskRequest, 
  type TaskFilterRequest,
  TaskStatus
} from '../types/task.types';
import type { PaginatedResponse } from '../types/common.types';

export const useTasks = (projectId?: number) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
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

  // Fetch tasks
  const fetchTasks = useCallback(async (params?: TaskFilterRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      let response: PaginatedResponse<Task>;
      
      if (projectId) {
        response = await taskService.getProjectTasks(projectId, params);
      } else {
        response = await taskService.getUserTasks(params);
      }
      
      setTasks(response.content);
      setPagination({
        page: response.pageNumber,
        size: response.pageSize,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        last: response.last,
        first: response.first,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Fetch single task
  const fetchTaskById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const task = await taskService.getTaskById(id);
      setTaskDetail(task);
      return task;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create task
  const createTask = useCallback(async (data: CreateTaskRequest) => {
    if (!projectId) throw new Error('Project ID is required');
    
    setLoading(true);
    setError(null);
    
    try {
      const newTask = await taskService.createTask(projectId, data);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Update task
  const updateTask = useCallback(async (id: number, data: UpdateTaskRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedTask = await taskService.updateTask(id, data);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      if (taskDetail?.id === id) {
        setTaskDetail(prev => prev ? { ...prev, ...updatedTask } : null);
      }
      return updatedTask;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [taskDetail]);

  // Mark task as completed
  const markAsCompleted = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedTask = await taskService.markAsCompleted(id);
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));
      if (taskDetail?.id === id) {
        setTaskDetail(prev => prev ? { ...prev, ...updatedTask } : null);
      }
      return updatedTask;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [taskDetail]);

  // Delete task
  const deleteTask = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      if (taskDetail?.id === id) {
        setTaskDetail(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [taskDetail]);

  // Toggle task status
  const toggleTaskStatus = useCallback(async (task: Task) => {
    let newStatus: TaskStatus;
    
    switch (task.status) {
      case TaskStatus.TODO:
        newStatus = TaskStatus.IN_PROGRESS;
        break;
      case TaskStatus.IN_PROGRESS:
        newStatus = TaskStatus.DONE;
        break;
      case TaskStatus.DONE:
        newStatus = TaskStatus.TODO;
        break;
      default:
        newStatus = TaskStatus.TODO;
    }
    
    return updateTask(task.id, { status: newStatus });
  }, [updateTask]);

  // Search tasks
  const searchTasks = useCallback(async (query: string, params?: TaskFilterRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taskService.searchTasks(query, params);
      setTasks(response.content);
      setPagination({
        page: response.pageNumber,
        size: response.pageSize,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        last: response.last,
        first: response.first,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear tasks
  const clearTasks = useCallback(() => {
    setTasks([]);
    setTaskDetail(null);
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks,
    taskDetail,
    loading,
    error,
    pagination,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    markAsCompleted,
    deleteTask,
    toggleTaskStatus,
    searchTasks,
    clearTasks,
    clearError,
  };
};