// utils/api.ts
import axios from 'axios';

const ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
});

// Add token to requests automatically
ApiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) {
        // Remove "Bearer " prefix if it exists (some implementations add it)
        const cleanToken = token.replace('Bearer ', '');
        config.headers.Authorization = `Bearer ${cleanToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration and unauthorized responses
ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid, logout user
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default ApiClient;