import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('📤 API Request:', config.method.toUpperCase(), config.url);
      // console.log('🔑 Token preview:', `${token.substring(0, 20)}...`);
    } else {
      console.warn('⚠️ No token found in localStorage for request:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Unauthorized - log warning but DON'T auto-redirect
        // Let the calling component handle it appropriately
        console.warn('401 Unauthorized - Authentication failed');
      }
      if (error.response.status === 403) {
        // Forbidden - log warning but DON'T auto-redirect
        console.warn('403 Forbidden - Permission denied');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
