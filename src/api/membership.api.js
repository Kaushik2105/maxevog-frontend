import apiClient from './client';

export const membershipApi = {
  getCurrentMembership: () => apiClient.get('/membership/current'),
  subscribe: (data) => apiClient.post('/membership/subscribe', data),
  verifyPayment: (data) => apiClient.post('/membership/verify-payment', data),
};
