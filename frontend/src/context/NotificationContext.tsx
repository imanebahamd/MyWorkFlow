import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { notificationService } from '../services/notificationService';
import { useTasks } from '../hooks/useTasks';

interface NotificationContextType {
  unreadCount: number;
  notifications: NotificationItem[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  showNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
}

interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { tasks } = useTasks();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize notification service
  useEffect(() => {
    notificationService.initialize();
    
    return () => {
      notificationService.cleanup();
    };
  }, []);

  // Check for due tasks
  useEffect(() => {
    const checkDueTasks = () => {
      tasks.forEach(task => {
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);
          const now = new Date();
          const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          if (hoursUntilDue > 0 && hoursUntilDue <= 24 && !task.overdue) {
            // Task due within 24 hours
            if (!notifications.some(n => n.id === `task-due-${task.id}`)) {
              showNotification({
                type: 'warning',
                title: 'Task Due Soon',
                message: `${task.title} is due ${hoursUntilDue <= 1 ? 'in less than an hour' : `in ${Math.ceil(hoursUntilDue)} hours`}`,
                action: {
                  label: 'View Task',
                  onClick: () => window.location.href = `/tasks/${task.id}`
                }
              });
            }
          }
        }
      });
    };

    checkDueTasks();
  }, [tasks]);

  const showNotification = (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationItem = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      markAsRead(newNotification.id);
    }, 8000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    clearAll,
    showNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};