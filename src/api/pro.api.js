import apiClient from './client';

export const proApi = {
  getStatus: () => apiClient.get('/pro/status'),
  activate: (data = {}) => apiClient.post('/pro/activate', data),
  getMatchedJobs: (params = {}) => apiClient.get('/pro/matches', { params }),
  syncMatchedJobs: () => apiClient.post('/pro/matches/sync'),
  getTrackedJobs: (params = {}) => apiClient.get('/pro/tracked', { params }),
  trackJob: (jobId) => apiClient.post(`/pro/tracked/${jobId}`),
  untrackJob: (jobId) => apiClient.delete(`/pro/tracked/${jobId}`),
  updateTrackedStatus: (jobId, data) => apiClient.patch(`/pro/tracked/${jobId}/status`, data),
  getDeadlines: () => apiClient.get('/pro/deadlines'),
  getPreferences: () => apiClient.get('/pro/preferences'),
  updatePreferences: (data) => apiClient.put('/pro/preferences', data),
  connectTelegram: (chatId) => apiClient.post('/pro/telegram/connect', { chatId }),
  disconnectTelegram: () => apiClient.post('/pro/telegram/disconnect'),

  // Admin Pro Club Endpoints
  getAdminStats: () => apiClient.get('/admin/pro/stats'),
  getAdminSubscribers: (params = {}) => apiClient.get('/admin/pro/subscribers', { params }),
  getAdminNotificationLogs: (params = {}) => apiClient.get('/admin/pro/notification-logs', { params }),
  triggerAdminReminders: () => apiClient.post('/admin/pro/trigger-reminders'),
  triggerJobMatching: (jobId) => apiClient.post(`/admin/pro/trigger-matching/${jobId}`),
};
