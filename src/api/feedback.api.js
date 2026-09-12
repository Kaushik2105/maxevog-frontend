import apiClient from './client';

export const feedbackApi = {
  submitFeedback: (data) => apiClient.post('/feedback', data),
  getMyFeedbacks: () => apiClient.get('/feedback/my'),
};
