export interface RecentActivity {
  id: number;
  type: 'PROJECT_CREATED' | 'TASK_CREATED' | 'TASK_COMPLETED' | 'PROJECT_UPDATED';
  title: string;
  description: string;
  timestamp: string;
  projectId: number;
  taskId?: number;
  projectTitle: string;
}

export interface StatsResponse {
  // Project Statistics
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  
  // Task Statistics
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  overdueTasks: number;
  
  // Progress Statistics
  averageProjectProgress: number;
  projectsWithDeadlines: number;
  tasksWithDeadlines: number;
  
  // Recent Activity
  recentActivities: RecentActivity[];
  
  // Distributions
  projectProgressDistribution: Record<string, number>;
  taskStatusDistribution: Record<string, number>;
  
  // Trends
  weeklyTaskCompletion: Record<string, number>;
  monthlyProjectCreation: Record<string, number>;
}

export interface DashboardResponse {
  stats: StatsResponse;
  recentProjects: any[]; // ProjectResponse[]
  upcomingTasks: any[]; // TaskResponse[]
  overdueTasks: any[]; // TaskResponse[]
}

// Chart Data Interfaces
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// Quick Stats for Cards
export interface QuickStat {
  title: string;
  value: number;
  icon: string;
  color: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
}