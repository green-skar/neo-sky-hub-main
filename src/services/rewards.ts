import { apiClient } from './api';
import { Reward, Achievement, Level, ApiResponse } from '@/types';

export const rewardsService = {
  async getLevels(): Promise<ApiResponse<Level[]>> {
    return apiClient.get<Level[]>('/rewards/levels');
  },

  async getCurrentLevel(): Promise<ApiResponse<{ level: Level; progress: number; points: number }>> {
    return apiClient.get<{ level: Level; progress: number; points: number }>('/rewards/current-level');
  },

  async getAvailableRewards(): Promise<ApiResponse<Reward[]>> {
    return apiClient.get<Reward[]>('/rewards/available');
  },

  async getRewardHistory(): Promise<ApiResponse<Reward[]>> {
    return apiClient.get<Reward[]>('/rewards/history');
  },

  async redeemReward(rewardId: number): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return apiClient.post<{ success: boolean; message: string }>('/rewards/redeem', { rewardId });
  },

  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    return apiClient.get<Achievement[]>('/rewards/achievements');
  },

  async getPointsSummary(): Promise<ApiResponse<{
    totalPoints: number;
    availableRewards: number;
    redeemed: number;
  }>> {
    return apiClient.get<{
      totalPoints: number;
      availableRewards: number;
      redeemed: number;
    }>('/rewards/points-summary');
  },

  async getRewardCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/rewards/categories');
  },

  async searchRewards(query: string): Promise<ApiResponse<Reward[]>> {
    return apiClient.get<Reward[]>(`/rewards/search?q=${encodeURIComponent(query)}`);
  },
};
