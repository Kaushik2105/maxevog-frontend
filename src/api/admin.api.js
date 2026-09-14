import apiClient from './client';

export const adminApi = {
  // Analytics & Dashboard
  getDashboardOverview: () => apiClient.get('/admin/dashboard/overview'),
  getUserGrowth: () => apiClient.get('/admin/dashboard/user-growth'),
  getApplicationStats: () => apiClient.get('/admin/dashboard/application-stats'),

  // Users Governance
  getUsers: (params) => apiClient.get('/admin/users', { params }),
  updateUserStatus: (id, status) => apiClient.patch(`/admin/users/${id}/status`, { status }),

  // Recruitment Jobs
  getJobs: (params) => apiClient.get('/admin/jobs', { params }),
  createJob: (data) => apiClient.post('/admin/jobs', data),
  updateJob: (id, data) => apiClient.put(`/admin/jobs/${id}`, data),
  deleteJob: (id) => apiClient.delete(`/admin/jobs/${id}`),

  // Results & Admit Cards
  createResult: (data) => apiClient.post('/admin/results', data),
  deleteResult: (id) => apiClient.delete(`/admin/results/${id}`),
  createAdmitCard: (data) => apiClient.post('/admin/admit-cards', data),
  deleteAdmitCard: (id) => apiClient.delete(`/admin/admit-cards/${id}`),

  // Assistance & Time Slots
  createTimeSlots: (data) => apiClient.post('/admin/time-slots', data),
  getAssistanceSessions: (params) => apiClient.get('/admin/assistance', { params }),
  assignAssistant: (id, data) => apiClient.patch(`/admin/assistance/${id}/assign`, data),

  // Master Applications Ledger
  getAllApplications: (params) => apiClient.get('/admin/applications', { params }),

  // Financials & Transactions
  getFinancials: () => apiClient.get('/admin/financials'),

  // Desk Agents & Workload
  getAgents: () => apiClient.get('/admin/agents'),
  createAgent: (data) => apiClient.post('/admin/agents', data),

  // Audit Logs
  getAuditLogs: (params) => apiClient.get('/admin/audit-logs', { params }),

  // Feedbacks
  getAllFeedbacks: (params) => apiClient.get('/admin/feedback', { params }),
  resolveFeedback: (id, data) => apiClient.patch(`/admin/feedback/${id}/resolve`, data),
};

