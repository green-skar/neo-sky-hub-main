import { apiClient } from './api';
import { ScanEvent, ScanStats, ScanChartData, MapMarker, ApiResponse, PaginatedResponse } from '@/types';

export const scanService = {
  async getChartData(): Promise<ApiResponse<ScanChartData[]>> {
    return apiClient.get<ScanChartData[]>('/scans/chart');
  },

  async getRecentScans(): Promise<ApiResponse<ScanEvent[]>> {
    return apiClient.get<ScanEvent[]>('/scans/recent');
  },

  async getScanHistory(params?: {
    page?: number;
    limit?: number;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    sponsor?: string;
    type?: string;
  }): Promise<ApiResponse<PaginatedResponse<ScanEvent>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.sponsor) queryParams.append('sponsor', params.sponsor);
    if (params?.type) queryParams.append('type', params.type);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/scans/history?${queryString}` : '/scans/history';
    
    return apiClient.get<PaginatedResponse<ScanEvent>>(endpoint);
  },

  async getStatistics(): Promise<ApiResponse<ScanStats>> {
    return apiClient.get<ScanStats>('/scans/stats');
  },

  async getMapMarkers(): Promise<ApiResponse<MapMarker[]>> {
    return apiClient.get<MapMarker[]>('/scans/map-markers');
  },

  async recordScan(scanData: {
    location: string;
    sponsor: string;
    type: 'QR Scan' | 'NFC Tap';
    latitude?: number;
    longitude?: number;
  }): Promise<ApiResponse<ScanEvent>> {
    return apiClient.post<ScanEvent>('/scans/record', scanData);
  },

  async exportScanData(format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await fetch(`/api/scans/export?format=${format}`, {
      headers: {
        'Authorization': `Bearer ${apiClient.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return response.blob();
  },

  async getSponsors(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/scans/sponsors');
  },

  async getLocations(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/scans/locations');
  },
};
