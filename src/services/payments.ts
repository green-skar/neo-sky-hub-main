import { apiClient } from './api';
import { Transaction, PayoutStats, PayoutChartData, MpesaRequest, MpesaResponse, ApiResponse } from '@/types';

export const paymentsService = {
  async getPayoutStats(): Promise<ApiResponse<PayoutStats>> {
    return apiClient.get<PayoutStats>('/payments/stats');
  },

  async getPayoutHistory(): Promise<ApiResponse<Transaction[]>> {
    return apiClient.get<Transaction[]>('/payments/history');
  },

  async getEarningsChart(): Promise<ApiResponse<PayoutChartData[]>> {
    return apiClient.get<PayoutChartData[]>('/payments/earnings-chart');
  },

  async initiateMpesaPayout(request: MpesaRequest): Promise<ApiResponse<MpesaResponse>> {
    return apiClient.post<MpesaResponse>('/payments/mpesa/initiate', request);
  },

  async checkMpesaStatus(checkoutRequestId: string): Promise<ApiResponse<{
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
  }>> {
    return apiClient.get<{
      status: 'pending' | 'completed' | 'failed';
      transactionId?: string;
    }>(`/payments/mpesa/status/${checkoutRequestId}`);
  },

  async getMpesaCallback(callbackData: any): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/payments/mpesa/callback', callbackData);
  },

  async requestPayout(amount: number, method: 'mpesa' | 'sepa'): Promise<ApiResponse<{
    success: boolean;
    requestId: string;
    message: string;
  }>> {
    return apiClient.post<{
      success: boolean;
      requestId: string;
      message: string;
    }>('/payments/request', { amount, method });
  },

  async getPaymentMethods(): Promise<ApiResponse<{
    mpesa: { enabled: boolean; phoneNumber?: string };
    sepa: { enabled: boolean; accountNumber?: string };
  }>> {
    return apiClient.get<{
      mpesa: { enabled: boolean; phoneNumber?: string };
      sepa: { enabled: boolean; accountNumber?: string };
    }>('/payments/methods');
  },

  async configureMpesa(phoneNumber: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/payments/mpesa/configure', { phoneNumber });
  },

  async configureSepa(accountData: {
    accountNumber: string;
    bankCode: string;
    accountHolder: string;
  }): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post<{ success: boolean }>('/payments/sepa/configure', accountData);
  },

  async exportPayoutReport(format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await fetch(`/api/payments/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${apiClient.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },
};
