import apiClient from './client';

export const assistanceApi = {
  bookSession: (data) => apiClient.post('/assistance/book', data),
  getMySessions: (params) => apiClient.get('/assistance', { params }),
  getSessionById: (id) => apiClient.get(`/assistance/${id}`),
  rescheduleSession: (id, data) => apiClient.put(`/assistance/${id}/reschedule`, data),
  cancelSession: (id, data) => apiClient.put(`/assistance/${id}/cancel`, data),
};
