import { apiClient } from './api';
import { UserPreferences, ApiResponse } from '@/types';

export const settingsService = {
  async getSettings(): Promise<ApiResponse<{
    profile: any;
    preferences: UserPreferences;
    security: any;
    privacy: any;
  }>> {
    return apiClient.get<{
      profile: any;
      preferences: UserPreferences;
      security: any;
      privacy: any;
    }>('/settings');
  },

  async updateProfile(profileData: any): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.put<{ success: boolean }>('/settings/profile', profileData);
  },

  async updatePreferences(preferences: UserPreferences): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.put<{ success: boolean }>('/settings/preferences', preferences);
  },

  async updateSecurity(securityData: {
    twoFactor: boolean;
    biometric: boolean;
    sessionTimeout: number;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.put<{ success: boolean }>('/settings/security', securityData);
  },

  async updatePrivacy(privacyData: {
    profileVisible: boolean;
    locationSharing: boolean;
    dataSharing: boolean;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.put<{ success: boolean }>('/settings/privacy', privacyData);
  },

  async exportData(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const response = await fetch(`/api/settings/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${apiClient.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  async deleteAccount(): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/settings/delete-account');
  },

  async getDataUsage(): Promise<ApiResponse<{
    storageUsed: number;
    storageLimit: number;
    apiCalls: number;
    lastBackup: string;
  }>> {
    return apiClient.get<{
      storageUsed: number;
      storageLimit: number;
      apiCalls: number;
      lastBackup: string;
    }>('/settings/data-usage');
  },

  async createBackup(): Promise<ApiResponse<{ backupId: string; downloadUrl: string }>> {
    return apiClient.post<{ backupId: string; downloadUrl: string }>('/settings/backup');
  },
};
