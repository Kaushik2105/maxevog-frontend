import apiClient from './client';

export const jobsApi = {
  getJobs: (params) => apiClient.get('/jobs', { params }),
  getJobById: (id) => apiClient.get(`/jobs/${id}`),
  checkEligibility: (id) => apiClient.get(`/jobs/${id}/eligibility`),
};
