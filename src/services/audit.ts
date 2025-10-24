import { apiClient } from './api';
import { AuditRecord, AuditStats, BlockchainHash, ApiResponse } from '@/types';

export const auditService = {
  async getAuditStats(): Promise<ApiResponse<AuditStats>> {
    return apiClient.get<AuditStats>('/audit/stats');
  },

  async getAuditLogs(): Promise<ApiResponse<AuditRecord[]>> {
    return apiClient.get<AuditRecord[]>('/audit/logs');
  },

  async getCurrentHash(): Promise<ApiResponse<BlockchainHash>> {
    return apiClient.get<BlockchainHash>('/audit/current-hash');
  },

  async verifyHash(hash: string): Promise<ApiResponse<{
    verified: boolean;
    blockNumber?: number;
    timestamp?: string;
    transactionHash?: string;
  }>> {
    return apiClient.post<{
      verified: boolean;
      blockNumber?: number;
      timestamp?: string;
      transactionHash?: string;
    }>('/audit/verify-hash', { hash });
  },

  async generateProof(): Promise<ApiResponse<{
    hash: string;
    blockNumber: number;
    timestamp: string;
  }>> {
    return apiClient.post<{
      hash: string;
      blockNumber: number;
      timestamp: string;
    }>('/audit/generate-proof');
  },

  async getBlockchainStatus(): Promise<ApiResponse<{
    connected: boolean;
    lastBlock: number;
    latency: number;
    network: string;
  }>> {
    return apiClient.get<{
      connected: boolean;
      lastBlock: number;
      latency: number;
      network: string;
    }>('/audit/blockchain-status');
  },

  async exportAuditLog(format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await fetch(`/api/audit/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${apiClient.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  async getHashHistory(): Promise<ApiResponse<BlockchainHash[]>> {
    return apiClient.get<BlockchainHash[]>('/audit/hash-history');
  },
};
