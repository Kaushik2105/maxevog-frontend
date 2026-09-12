import apiClient from './client';

export const applicationsApi = {
  createApplication: (data) => apiClient.post('/applications', data),
  getMyApplications: (params) => apiClient.get('/applications', { params }),
  getApplicationById: (id) => apiClient.get(`/applications/${id}`),
  updateStatus: (id, data) => apiClient.patch(`/applications/${id}/status`, data),
  authorizeSubmission: (id, data) => apiClient.patch(`/applications/${id}/authorize-submission`, data),
  uploadDocument: (id, formData) => apiClient.post(`/applications/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
