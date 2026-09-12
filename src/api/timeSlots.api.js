import apiClient from './client';

export const timeSlotsApi = {
  getAvailableSlots: (date) => apiClient.get('/time-slots/available', { params: { date } }),
};
