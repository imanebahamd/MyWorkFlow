import { toast, type ToastOptions } from 'react-hot-toast';
import type { Task } from '../types/task.types';
import { isDateToday, isDateTomorrow, isDatePast } from '../utils/dateUtils';

class NotificationService {
  private notifiedTasks = new Set<number>();
  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private isInitialized = false;

  // Initialize notification service
  initialize() {
    if (this.isInitialized) return;
    
    // Check for due tasks every minute
    this.checkInterval = setInterval(() => {
      this.checkDueTasks();
    }, 60000); // 1 minute
    
    this.isInitialized = true;
    console.log('Notification service initialized');
  }

  // Cleanup
  cleanup() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.notifiedTasks.clear();
    this.isInitialized = false;
  }

  // Check for due tasks
  async checkDueTasks() {
    try {
      // In a real app, you would fetch tasks from API
      // For now, we'll use localStorage or context
      const storedTasks = localStorage.getItem('myworkflow_tasks');
      if (!storedTasks) return;

      const tasks: Task[] = JSON.parse(storedTasks);
      
      tasks.forEach(task => {
        if (task.dueDate && !this.notifiedTasks.has(task.id)) {
          if (isDatePast(task.dueDate) && task.status !== 'DONE') {
            this.showOverdueNotification(task);
            this.notifiedTasks.add(task.id);
          } else if (isDateToday(task.dueDate) && task.status !== 'DONE') {
            this.showDueTodayNotification(task);
            this.notifiedTasks.add(task.id);
          } else if (isDateTomorrow(task.dueDate) && task.status !== 'DONE') {
            this.showDueTomorrowNotification(task);
            this.notifiedTasks.add(task.id);
          }
        }
      });
    } catch (error) {
      console.error('Error checking due tasks:', error);
    }
  }

  // Show overdue notification
  private showOverdueNotification(task: Task) {
    toast.error(
      `Task Overdue: ${task.title}`,
      {
        duration: 10000,
        icon: '⚠️',
        position: 'top-right'
      }
    );
  }

  // Show due today notification
  private showDueTodayNotification(task: Task) {
    toast(
      `Task Due Today: ${task.title}`,
      {
        duration: 8000,
        icon: '📅',
        position: 'top-right'
      }
    );
  }

  // Show due tomorrow notification
  private showDueTomorrowNotification(task: Task) {
    toast(
      `Task Due Tomorrow: ${task.title}`,
      {
        duration: 6000,
        icon: '⏰',
        position: 'top-right'
      }
    );
  }

  // Success notification
  showSuccess(message: string, options?: ToastOptions) {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      ...options
    });
  }

  // Error notification
  showError(message: string, options?: ToastOptions) {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      ...options
    });
  }

  // Info notification
  showInfo(message: string, options?: ToastOptions) {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      ...options
    });
  }

  // Clear all notifications
  clearAll() {
    toast.dismiss();
  }

  // Mark task as notified (when user views it)
  markTaskAsNotified(taskId: number) {
    this.notifiedTasks.add(taskId);
  }

  // Clear task notification
  clearTaskNotification(taskId: number) {
    this.notifiedTasks.delete(taskId);
  }
}

export const notificationService = new NotificationService();
