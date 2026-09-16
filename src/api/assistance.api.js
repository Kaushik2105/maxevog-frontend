import apiClient from './client';

export const assistanceApi = {
  getAvailability: (params) => apiClient.get('/assistance/availability', { params }),
  bookSession: (data) => apiClient.post('/assistance/book', data),
  submitUrgentRequest: (data) => apiClient.post('/assistance/urgent', data),
  getMySessions: (params) => apiClient.get('/assistance', { params }),
  getSessionById: (id) => apiClient.get(`/assistance/${id}`),
  rescheduleSession: (id, data) => apiClient.put(`/assistance/${id}/reschedule`, data),
  cancelSession: (id, data) => apiClient.put(`/assistance/${id}/cancel`, data),
};
