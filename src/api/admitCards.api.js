import apiClient from './client';

export const admitCardsApi = {
  getAdmitCards: (params) => apiClient.get('/admit-cards', { params }),
  getAdmitCardById: (id) => apiClient.get(`/admit-cards/${id}`),
};
