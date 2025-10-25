import { ApiResponse } from '@/types';

const IS_DEMO = import.meta.env.VITE_DEMO === '1' || import.meta.env.VITE_DEMO === undefined || true; // Default to demo mode
const API_BASE_URL = IS_DEMO ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:3001/api');

console.log('API Client initialization:', {
  VITE_DEMO: import.meta.env.VITE_DEMO,
  IS_DEMO,
  API_BASE_URL
});

class ApiClient {
  private baseURL: string;
  private isDemo: boolean;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.isDemo = IS_DEMO;
    
    console.log('ApiClient constructor:', {
      baseURL: this.baseURL,
      isDemo: this.isDemo,
      IS_DEMO,
      API_BASE_URL
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = this.isDemo ? `/api${endpoint}` : `${this.baseURL}${endpoint}`;
    
    console.log('API Request:', {
      url,
      isDemo: this.isDemo,
      endpoint,
      method: options.method || 'GET',
      baseURL: this.baseURL
    });
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request details:', { url, config });
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadFile<T>(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const url = this.isDemo ? `/api${endpoint}` : `${this.baseURL}${endpoint}`;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', url);
      
      const token = this.getToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  }

  private getToken(): string | null {
    return localStorage.getItem('demo_token') || localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('demo_token', token);
    localStorage.setItem('auth_token', token); // Keep both for compatibility
  }

  removeToken(): void {
    localStorage.removeItem('demo_token');
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const apiClient = new ApiClient();
