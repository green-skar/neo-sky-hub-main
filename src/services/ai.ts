import { apiClient } from './api';
import { ChatMessage, ChatResponse, ApiResponse } from '@/types';

export const aiService = {
  async sendMessage(message: string, conversationId?: string): Promise<ApiResponse<ChatResponse>> {
    return apiClient.post<ChatResponse>('/ai/chat', {
      message,
      conversationId,
    });
  },

  async getSuggestions(context: string): Promise<ApiResponse<string[]>> {
    return apiClient.post<string[]>('/ai/suggestions', { context });
  },

  async getConversationHistory(conversationId: string): Promise<ApiResponse<ChatMessage[]>> {
    return apiClient.get<ChatMessage[]>(`/ai/conversation/${conversationId}`);
  },

  async createConversation(): Promise<ApiResponse<{ conversationId: string }>> {
    return apiClient.post<{ conversationId: string }>('/ai/conversation');
  },

  async deleteConversation(conversationId: string): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.delete<{ success: boolean }>(`/ai/conversation/${conversationId}`);
  },

  async getConversations(): Promise<ApiResponse<{
    id: string;
    title: string;
    lastMessage: string;
    updatedAt: string;
  }[]>> {
    return apiClient.get<{
      id: string;
      title: string;
      lastMessage: string;
      updatedAt: string;
    }[]>('/ai/conversations');
  },

  async getAiStatus(): Promise<ApiResponse<{
    available: boolean;
    model: string;
    responseTime: number;
  }>> {
    return apiClient.get<{
      available: boolean;
      model: string;
      responseTime: number;
    }>('/ai/status');
  },

  async getHelpTopics(): Promise<ApiResponse<{
    category: string;
    topics: string[];
  }[]>> {
    return apiClient.get<{
      category: string;
      topics: string[];
    }[]>('/ai/help-topics');
  },
};
