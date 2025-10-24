import { apiClient } from './api';
import { Notification, UserPreferences, ApiResponse } from '@/types';

export const notificationsService = {
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return apiClient.get<Notification[]>('/notifications');
  },

  async markAsRead(notificationId: number): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/notifications/mark-all-read');
  },

  async deleteNotification(notificationId: number): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/notifications/${notificationId}`);
  },

  async getNotificationStats(): Promise<ApiResponse<{
    unread: number;
    today: number;
    rewards: number;
    security: number;
  }>> {
    return apiClient.get<{
      unread: number;
      today: number;
      rewards: number;
      security: number;
    }>('/notifications/stats');
  },

  async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    return apiClient.get<UserPreferences>('/notifications/preferences');
  },

  async updatePreferences(preferences: UserPreferences): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.put<{ success: boolean }>('/notifications/preferences', preferences);
  },

  async getNotificationCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/notifications/categories');
  },

  async getCooldownStatus(): Promise<ApiResponse<{
    active: boolean;
    remainingTime: number;
    nextNotification: string;
  }>> {
    return apiClient.get<{
      active: boolean;
      remainingTime: number;
      nextNotification: string;
    }>('/notifications/cooldown');
  },
};
