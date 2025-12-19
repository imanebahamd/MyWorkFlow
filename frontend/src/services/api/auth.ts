import axiosInstance from './axiosInstance';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ApiResponse,
    User,
    UpdateProfileRequest
} from '../../types/auth.types';

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/login', 
      credentials
    );
    return response.data.data;
  },

  // Register
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/auth/register', 
      userData
    );
    return response.data.data;
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  },

  // Update profile
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      '/users/me',
      data
    );
    return response.data.data;
  },

  // Upload profile image
  async uploadProfileImage(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.patch<ApiResponse<User>>(
      '/users/me/profile-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  // Logout
  logout(): void {
    localStorage.removeItem('myworkflow_token');
    localStorage.removeItem('myworkflow_user');
  }
};