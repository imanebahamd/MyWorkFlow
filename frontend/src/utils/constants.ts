export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'MyWorkFlow';

export const TOKEN_KEY = 'myworkflow_token';
export const USER_KEY = 'myworkflow_user';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;