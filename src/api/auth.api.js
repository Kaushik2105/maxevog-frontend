import apiClient from './client';

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  sendOtp: (data) => apiClient.post('/auth/send-otp', data),
  verifyOtpRegister: (data) => apiClient.post('/auth/verify-otp-register', data),
  googleAuth: (data) => apiClient.post('/auth/google', data),
  login: (data) => apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/me', data),
  changePassword: (data) => apiClient.put('/auth/change-password', data),
  uploadAvatar: (formData) => apiClient.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadDocument: (formData) => apiClient.post('/auth/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
