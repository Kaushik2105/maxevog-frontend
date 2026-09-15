import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('maxevog_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract error messages & handle 401 / 403
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const msg = String(error.response?.data?.message || '').toLowerCase();
    const isSuspended = error.response?.data?.data?.isSuspended || msg.includes('suspended');

    if (isSuspended) {
      localStorage.removeItem('maxevog_token');
      localStorage.removeItem('maxevog_user');
      sessionStorage.setItem('maxevog_suspended_alert', 'Your account has been suspended by administration. Access has been revoked.');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?suspended=true';
      }
    } else if (status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('maxevog_token');
        localStorage.removeItem('maxevog_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
