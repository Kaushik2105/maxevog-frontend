import apiClient from './client';

export const resultsApi = {
  getResults: (params) => apiClient.get('/results', { params }),
  getResultById: (id) => apiClient.get(`/results/${id}`),
};
