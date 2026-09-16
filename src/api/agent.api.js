import apiClient from './client';

export const agentApi = {
  getDashboard: () => apiClient.get('/agent/dashboard'),
  getSessions: (params) => apiClient.get('/agent/sessions', { params }),
  updateSession: (id, data) => apiClient.patch(`/agent/sessions/${id}`, data),
  getApplications: (params) => apiClient.get('/agent/applications', { params }),
  updateApplicationStage: (id, data) => apiClient.patch(`/agent/applications/${id}/status`, data),
  completeSubmission: (id, formData) => apiClient.post(`/applications/${id}/complete-submission`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateAvailability: (data) => apiClient.patch('/agent/availability', data),
  getDirectory: () => apiClient.get('/agent/directory'),
};
