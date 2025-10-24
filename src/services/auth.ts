import { apiClient } from './api';
import { User, ApiResponse } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });

    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
    }

    return response;
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/register', userData);

    if (response.success && response.data.token) {
      apiClient.setToken(response.data.token);
    }

    return response;
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/auth/me');
  },

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/auth/profile', userData);
  },

  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    return apiClient.uploadFile<{ avatarUrl: string }>('/auth/avatar', file);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.removeToken();
    }
  },

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  },

  getToken(): string | null {
    return apiClient.getToken();
  },

  setToken(token: string): void {
    apiClient.setToken(token);
  },

  removeToken(): void {
    apiClient.removeToken();
  },
};
