import { apiClient } from './api';
import { MediaItem, UploadedFile, ApiResponse } from '@/types';

export const mediaService = {
  async getMediaGallery(): Promise<ApiResponse<MediaItem[]>> {
    return apiClient.get<MediaItem[]>('/media/gallery');
  },

  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<UploadedFile>> {
    return apiClient.uploadFile<UploadedFile>('/media/upload', file, onProgress);
  },

  async deleteMedia(mediaId: number): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/media/${mediaId}`);
  },

  async verifyMedia(mediaId: number): Promise<ApiResponse<{ verified: boolean }>> {
    return apiClient.post<{ verified: boolean }>(`/media/${mediaId}/verify`);
  },

  async getDroneShowVideos(): Promise<ApiResponse<MediaItem[]>> {
    return apiClient.get<MediaItem[]>('/media/drone-show');
  },

  async getVideoUrl(mediaId: number): Promise<ApiResponse<{ url: string }>> {
    return apiClient.get<{ url: string }>(`/media/${mediaId}/video-url`);
  },

  async downloadMedia(mediaId: number): Promise<Blob> {
    const response = await fetch(`/api/media/${mediaId}/download`, {
      headers: {
        'Authorization': `Bearer ${apiClient.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  },

  async shareMedia(mediaId: number, shareData: {
    platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp';
    message?: string;
  }): Promise<ApiResponse<{ shareUrl: string }>> {
    return apiClient.post<{ shareUrl: string }>(`/media/${mediaId}/share`, shareData);
  },

  async getMediaStats(): Promise<ApiResponse<{
    totalProofs: number;
    verified: number;
    pending: number;
    fraudAlerts: number;
  }>> {
    return apiClient.get<{
      totalProofs: number;
      verified: number;
      pending: number;
      fraudAlerts: number;
    }>('/media/stats');
  },

  async getVrArPreview(): Promise<ApiResponse<{ previewUrl: string }>> {
    return apiClient.get<{ previewUrl: string }>('/media/vr-ar-preview');
  },
};
