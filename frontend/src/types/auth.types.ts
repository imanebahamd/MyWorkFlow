export interface User {
  role: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  password?: string;
  currentPassword?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}