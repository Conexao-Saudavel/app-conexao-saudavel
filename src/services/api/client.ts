import { buildApiUrl, API_CONFIG } from '../../config/api';

// Cliente API centralizado usando a configuração
const apiClient = {
  get: async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    return response.json();
  },
  
  post: async (endpoint: string, data?: any, options?: RequestInit) => {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return response.json();
  },
  
  put: async (endpoint: string, data?: any, options?: RequestInit) => {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return response.json();
  },
  
  delete: async (endpoint: string, options?: RequestInit) => {
    const response = await fetch(buildApiUrl(endpoint), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    return response.json();
  },
};

export default apiClient;