import { TOKEN_KEY, USER_KEY } from '../../utils/constants';
import type { User } from '../../types/auth.types';

export const tokenService = {
  // Save token
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if token exists
  hasToken(): boolean {
    return !!this.getToken();
  },

  // Save user data
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user data
  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Remove user data
  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  // Clear all auth data
  clearAll(): void {
    this.removeToken();
    this.removeUser();
  }
};