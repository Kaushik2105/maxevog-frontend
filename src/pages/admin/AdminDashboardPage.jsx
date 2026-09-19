import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { jobsApi } from '../../api/jobs.api';
import { proApi } from '../../api/pro.api';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Briefcase, 
  Video, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  FileText, 
  Award, 
  MessageSquare,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  Trash2,
  Calendar,
  Layers,
  Lock,
  Table,
  CheckSquare,
  Square,
  X,
  Edit,
  Eye,
  EyeOff,
  Bell,
  Send,
  RefreshCw
} from 'lucide-react';
import { Modal } from '../../components/Modal';

const STANDARD_MATCHER_DEGREES = [
  'Any Graduate',
  'B.Tech / B.E. (Bachelor of Technology / Engineering)',
  'B.Sc (Bachelor of Science)',
  'B.Com (Bachelor of Commerce)',
  'B.A. (Bachelor of Arts)',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'M.Tech / M.E. (Master of Technology / Engineering)',
  'MBA (Master of Business Administration)',
  'M.Sc (Master of Science)',
  'M.Com (Master of Commerce)',
  'M.A. (Master of Arts)',
  'MBBS (Bachelor of Medicine & Surgery)',
  'BDS (Dental Surgery)',
  'B.Pharm (Bachelor of Pharmacy)',
  'B.Ed (Bachelor of Education)',
  'LLB (Bachelor of Legislative Law)',
  'Diploma (Polytechnic / Technical)',
  '12th / Intermediate (Higher Secondary)',
  '10th (Matriculation)',
  'Others',
];

const STANDARD_MATCHER_BRANCHES = [
  'Any Branch / All Disciplines',
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics & Communication (ECE)',
  'Data Science & Artificial Intelligence',
  'Chemical Engineering',
  'Commerce / Accounting / Finance',
  'Economics',
  'Arts / Humanities / Social Sciences',
  'Physics / Chemistry / Mathematics (PCM)',
  'Biology / Life Sciences / Biotechnology',
  'General Medicine / Clinical Practice',
  'Nursing & Paramedical Sciences',
  'Pharmacy / Pharmacology',
  'Law & Jurisprudence',
  'General / Non-Technical Stream',
  'Others',
];

export const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); 
  // 'overview' | 'applications' | 'recruitments' | 'users' | 'assistance' | 'financials' | 'results' | 'feedback'

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [assistanceSessions, setAssistanceSessions] = useState([]);
  const [financials, setFinancials] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [agentsList, setAgentsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);
  const [loading, setLoading] = useState(true);

  // 15-Item Pagination States across 7 sections
  const [auditPage, setAuditPage] = useState(1);
  const [hasMoreAudit, setHasMoreAudit] = useState(false);
  const [loadingMoreAudit, setLoadingMoreAudit] = useState(false);

  const [financialsPage, setFinancialsPage] = useState(1);
  const [hasMoreFinancials, setHasMoreFinancials] = useState(false);
  const [loadingMoreFinancials, setLoadingMoreFinancials] = useState(false);

  const [usersPage, setUsersPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(false);
  const [loadingMoreUsers, setLoadingMoreUsers] = useState(false);

  const [agentsPage, setAgentsPage] = useState(1);
  const [hasMoreAgents, setHasMoreAgents] = useState(false);
  const [loadingMoreAgents, setLoadingMoreAgents] = useState(false);

  const [jobsPage, setJobsPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(false);
  const [loadingMoreJobs, setLoadingMoreJobs] = useState(false);

  const [applicationsPage, setApplicationsPage] = useState(1);
  const [hasMoreApplications, setHasMoreApplications] = useState(false);
  const [loadingMoreApplications, setLoadingMoreApplications] = useState(false);

  const [feedbackPage, setFeedbackPage] = useState(1);
  const [hasMoreFeedback, setHasMoreFeedback] = useState(false);
  const [loadingMoreFeedback, setLoadingMoreFeedback] = useState(false);

  // Pro Club Management States
  const [proStats, setProStats] = useState(null);
  const [proSubscribers, setProSubscribers] = useState([]);
  const [proLogs, setProLogs] = useState([]);
  const [proSubscribersPage, setProSubscribersPage] = useState(1);
  const [hasMoreProSubscribers, setHasMoreProSubscribers] = useState(false);
  const [loadingMoreProSubscribers, setLoadingMoreProSubscribers] = useState(false);
  const [proLogsPage, setProLogsPage] = useState(1);
  const [hasMoreProLogs, setHasMoreProLogs] = useState(false);
  const [loadingMoreProLogs, setLoadingMoreProLogs] = useState(false);
  const [triggeringReminders, setTriggeringReminders] = useState(false);

  // Daily Assistance Capacity Controls
  const [selectedLimitDate, setSelectedLimitDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyLimitsData, setDailyLimitsData] = useState([]);
  const [currentDateLimit, setCurrentDateLimit] = useState(10);
  const [updatingLimit, setUpdatingLimit] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [agentSubmitting, setAgentSubmitting] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    organization: '',
    department: '',
    category: 'Central',
    qualification: 'Graduate',
    vacancies: '',
    lastDate: '',
    fee: 100,
    officialUrl: '',
    description: '',
    tables: [],
    eligibleDegrees: [],
    eligibleBranches: [],
  });

  const [showResultModal, setShowResultModal] = useState(false);
  const [newResult, setNewResult] = useState({
    title: '',
    organization: '',
    resultType: 'Merit List',
    declaredDate: new Date().toISOString().split('T')[0],
    cutoffMarks: 'UR: 132.5 | OBC: 124.0 | SC: 110.0',
    pdfUrl: '',
    description: '',
    nextStageInfo: '',
    isPublished: true,
  });

  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [newAdmitCard, setNewAdmitCard] = useState({
    title: '',
    organization: '',
    examDate: '',
    releaseDate: new Date().toISOString().split('T')[0],
    downloadUrl: '',
    instructions: 'Candidates must carry a printed hall ticket and valid original Government photo ID proof to the exam center.',
    status: 'AVAILABLE',
    isPublished: true,
  });

  // Assign Assistant
  const [selectedSession, setSelectedSession] = useState(null);
  const [agentName, setAgentName] = useState('Desk Officer Rajesh Kumar');
  const [meetingUrl, setMeetingUrl] = useState('https://meet.google.com/xyz-recruitment');

  // Feedback Resolution
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadTabData();
  }, [activeTab]);

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const [overviewRes, appStatsRes] = await Promise.all([
          adminApi.getDashboardOverview(),
          adminApi.getApplicationStats()
        ]);
        if (overviewRes.data?.success) {
          setStats({
            ...overviewRes.data.data,
            distribution: appStatsRes.data?.data?.stats || {}
          });
        }
      } else if (activeTab === 'applications') {
        setApplicationsPage(1);
        const res = await adminApi.getAllApplications({ page: 1, limit: 15 });
        if (res.data?.success) {
          const list = res.data.data.applications || [];
          setApplications(list);
          const total = res.data.meta?.total;
          setHasMoreApplications(total !== undefined ? list.length < total : list.length === 15);
        }
      } else if (activeTab === 'recruitments') {
        setJobsPage(1);
        const res = await adminApi.getJobs({ page: 1, limit: 15 });
        if (res.data?.success) {
          const list = res.data.data.jobs || res.data.data || [];
          setJobs(list);
          const total = res.data.meta?.total;
          setHasMoreJobs(total !== undefined ? list.length < total : list.length === 15);
        }
      } else if (activeTab === 'users') {
        setUsersPage(1);
        const res = await adminApi.getUsers({ page: 1, limit: 15, role: 'USER' });
        if (res.data?.success) {
          const list = res.data.data.users || [];
          setUsersList(list);
          const total = res.data.meta?.total;
          setHasMoreUsers(total !== undefined ? list.length < total : list.length === 15);
        }
      } else if (activeTab === 'assistance') {
        const [sessionsRes, limitsRes, agentsRes] = await Promise.all([
          adminApi.getAssistanceSessions({ limit: 100 }),
          adminApi.getDailyLimits({ startDate: new Date().toISOString().split('T')[0], days: 14 }),
          adminApi.getAgents()
        ]);
        if (sessionsRes.data?.success) {
          setAssistanceSessions(sessionsRes.data.data.sessions || sessionsRes.data.data.requests || []);
        }
        if (limitsRes.data?.success) {
          const list = limitsRes.data.data || [];
          setDailyLimitsData(list);
          const currentEntry = list.find((l) => l.date === selectedLimitDate);
          if (currentEntry) {
            setCurrentDateLimit(currentEntry.limit);
          }
        }
        if (agentsRes.data?.success) {
          setAgentsList(agentsRes.data.data.agents || []);
        }
      } else if (activeTab === 'financials') {
        setFinancialsPage(1);
        const res = await adminApi.getFinancials({ page: 1, limit: 15 });
        if (res.data?.success) {
          setFinancials(res.data.data);
          const list = res.data.data?.recentTransactions || [];
          const total = res.data.meta?.total;
          setHasMoreFinancials(total !== undefined ? list.length < total : list.length === 15);
        }
      } else if (activeTab === 'feedback') {
        setFeedbackPage(1);
        const res = await adminApi.getAllFeedbacks({ page: 1, limit: 15 });
        if (res.data?.success) {
          const list = res.data.data.feedbacks || [];
          setFeedbacks(list);
          const total = res.data.meta?.total;
          setHasMoreFeedback(total !== undefined ? list.length < total : list.length === 15);
        }
      } else if (activeTab === 'agents') {
        setAgentsPage(1);
        const res = await adminApi.getAgents({ page: 1, limit: 15 });
        if (res.data?.success) {
          const list = res.data.data.agents || [];
          setAgentsList(list);
          const total = res.data.meta?.total;
          setHasMoreAgents(total !== undefined ? list.length < total : list.length === 15);
        }
      } else if (activeTab === 'audit') {
        setAuditPage(1);
        const res = await adminApi.getAuditLogs({ page: 1, limit: 15 });
        if (res.data?.success) {
          const list = res.data.data.logs || [];
          setAuditLogs(list);
          const total = res.data.meta?.total;
          setHasMoreAudit(total !== undefined ? list.length < total : list.length === 15);
        }
      } else if (activeTab === 'proClub') {
        setProSubscribersPage(1);
        setProLogsPage(1);
        const [statsRes, subsRes, logsRes] = await Promise.all([
          proApi.getAdminStats(),
          proApi.getAdminSubscribers({ page: 1, limit: 15 }),
          proApi.getAdminNotificationLogs({ page: 1, limit: 15 }),
        ]);
        if (statsRes.data?.success) {
          setProStats(statsRes.data.data);
        }
        if (subsRes.data?.success) {
          const list = subsRes.data.data.subscribers || [];
          setProSubscribers(list);
          const total = subsRes.data.meta?.total;
          setHasMoreProSubscribers(total !== undefined ? list.length < total : list.length === 15);
        }
        if (logsRes.data?.success) {
          const list = logsRes.data.data.logs || [];
          setProLogs(list);
          const total = logsRes.data.meta?.total;
          setHasMoreProLogs(total !== undefined ? list.length < total : list.length === 15);
        }
      }
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pro Club Pagination & Engine Handlers
  const handleLoadMoreProSubscribers = async () => {
    if (loadingMoreProSubscribers) return;
    setLoadingMoreProSubscribers(true);
    try {
      const nextPage = proSubscribersPage + 1;
      const res = await proApi.getAdminSubscribers({ page: nextPage, limit: 15 });
      if (res.data?.success) {
        const nextSubs = res.data.data.subscribers || [];
        setProSubscribers((prev) => [...prev, ...nextSubs]);
        setProSubscribersPage(nextPage);
        const total = res.data.meta?.total;
        setHasMoreProSubscribers(total !== undefined ? (proSubscribers.length + nextSubs.length) < total : nextSubs.length === 15);
      }
    } catch (err) {
      console.error('Error loading more Pro subscribers:', err);
    } finally {
      setLoadingMoreProSubscribers(false);
    }
  };

  const handleLoadMoreProLogs = async () => {
    if (loadingMoreProLogs) return;
    setLoadingMoreProLogs(true);
    try {
      const nextPage = proLogsPage + 1;
      const res = await proApi.getAdminNotificationLogs({ page: nextPage, limit: 15 });
      if (res.data?.success) {
        const nextLogs = res.data.data.logs || [];
        setProLogs((prev) => [...prev, ...nextLogs]);
        setProLogsPage(nextPage);
        const total = res.data.meta?.total;
        setHasMoreProLogs(total !== undefined ? (proLogs.length + nextLogs.length) < total : nextLogs.length === 15);
      }
    } catch (err) {
      console.error('Error loading more notification logs:', err);
    } finally {
      setLoadingMoreProLogs(false);
    }
  };

  const handleTriggerReminders = async () => {
    setTriggeringReminders(true);
    try {
      const res = await proApi.triggerAdminReminders();
      if (res.data?.success) {
        setNotification(`Deadline protection run completed! ${res.data.data?.processed || 0} reminders processed.`);
        loadTabData();
      }
    } catch (err) {
      setNotification(err.response?.data?.message || 'Failed to trigger deadline reminders.');
    } finally {
      setTriggeringReminders(false);
    }
  };

  // Load More 15 Handlers for 7 Admin Sections
  const handleLoadMoreAudit = async () => {
    if (loadingMoreAudit) return;
    setLoadingMoreAudit(true);
    try {
      const nextPage = auditPage + 1;
      const res = await adminApi.getAuditLogs({ page: nextPage, limit: 15 });
      if (res.data?.success) {
        const nextLogs = res.data.data.logs || [];
        setAuditLogs((prev) => [...prev, ...nextLogs]);
        setAuditPage(nextPage);
        const total = res.data.meta?.total;
        setHasMoreAudit(total !== undefined ? (auditLogs.length + nextLogs.length) < total : nextLogs.length === 15);
      }
    } catch (err) {
      console.error('Error loading more audit logs:', err);
    } finally {
      setLoadingMoreAudit(false);
    }
  };

  const handleLoadMoreFinancials = async () => {
    if (loadingMoreFinancials) return;
    setLoadingMoreFinancials(true);
    try {
      const nextPage = financialsPage + 1;
      const res = await adminApi.getFinancials({ page: nextPage, limit: 15 });
      if (res.data?.success) {
        const nextTxs = res.data.data?.recentTransactions || [];
        setFinancials((prev) => ({
          ...prev,
          recentTransactions: [...(prev?.recentTransactions || []), ...nextTxs],
        }));
        setFinancialsPage(nextPage);
        const total = res.data.meta?.total;
        const currentCount = (financials?.recentTransactions?.length || 0) + nextTxs.length;
        setHasMoreFinancials(total !== undefined ? currentCount < total : nextTxs.length === 15);
      }
    } catch (err) {
      console.error('Error loading more financials:', err);
    } finally {
      setLoadingMoreFinancials(false);
    }
  };

  const handleLoadMoreUsers = async () => {
    if (loadingMoreUsers) return;
    setLoadingMoreUsers(true);
    try {
      const nextPage = usersPage + 1;
      const res = await adminApi.getUsers({ page: nextPage, limit: 15, role: 'USER' });
      if (res.data?.success) {
        const nextUsers = res.data.data.users || [];
        setUsersList((prev) => [...prev, ...nextUsers]);
        setUsersPage(nextPage);
        const total = res.data.meta?.total;
        setHasMoreUsers(total !== undefined ? (usersList.length + nextUsers.length) < total : nextUsers.length === 15);
      }
    } catch (err) {
      console.error('Error loading more users:', err);
    } finally {
      setLoadingMoreUsers(false);
    }
  };

  const handleLoadMoreAgents = async () => {
    if (loadingMoreAgents) return;
    setLoadingMoreAgents(true);
    try {
      const nextPage = agentsPage + 1;
      const res = await adminApi.getAgents({ page: nextPage, limit: 15 });
      if (res.data?.success) {
        const nextAgents = res.data.data.agents || [];
        setAgentsList((prev) => [...prev, ...nextAgents]);
        setAgentsPage(nextPage);
        const total = res.data.meta?.total;
        setHasMoreAgents(total !== undefined ? (agentsList.length + nextAgents.length) < total : nextAgents.length === 15);
      }
    } catch (err) {
      console.error('Error loading more agents:', err);
    } finally {
      setLoadingMoreAgents(false);
    }
  };

  const handleLoadMoreJobs = async () => {
    if (loadingMoreJobs) return;
    setLoadingMoreJobs(true);
    try {
      const nextPage = jobsPage + 1;
      const res = await adminApi.getJobs({ page: nextPage, limit: 15 });
      if (res.data?.success) {
        const nextJobs = res.data.data.jobs || res.data.data || [];
        setJobs((prev) => [...prev, ...nextJobs]);
        setJobsPage(nextPage);
        const total = res.data.meta?.total;
        setHasMoreJobs(total !== undefined ? (jobs.length + nextJobs.length) < total : nextJobs.length === 15);
      }
    } catch (err) {
      console.error('Error loading more jobs:', err);
    } finally {
      setLoadingMoreJobs(false);
    }
  };

  const handleLoadMoreApplications = async () => {
    if (loadingMoreApplications) return;
    setLoadingMoreApplications(true);
    try {
      const nextPage = applicationsPage + 1;
      const res = await adminApi.getAllApplications({ page: nextPage, limit: 15 });
      if (res.data?.success) {
        const nextApps = res.data.data.applications || [];
        setApplications((prev) => [...prev, ...nextApps]);
        setApplicationsPage(nextPage);
        const total = res.data.meta?.total;
        setHasMoreApplications(total !== undefined ? (applications.length + nextApps.length) < total : nextApps.length === 15);
      }
    } catch (err) {
      console.error('Error loading more applications:', err);
    } finally {
      setLoadingMoreApplications(false);
    }
  };

  const handleLoadMoreFeedback = async () => {
    if (loadingMoreFeedback) return;
    setLoadingMoreFeedback(true);
    try {
      const nextPage = feedbackPage + 1;
      const res = await adminApi.getAllFeedbacks({ page: nextPage, limit: 15 });
      if (res.data?.success) {
        const nextFeedbacks = res.data.data.feedbacks || [];
        setFeedbacks((prev) => [...prev, ...nextFeedbacks]);
        setFeedbackPage(nextPage);
        const total = res.data.meta?.total;
        setHasMoreFeedback(total !== undefined ? (feedbacks.length + nextFeedbacks.length) < total : nextFeedbacks.length === 15);
      }
    } catch (err) {
      console.error('Error loading more feedbacks:', err);
    } finally {
      setLoadingMoreFeedback(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const isSuspended = String(currentStatus).toUpperCase() === 'SUSPENDED';
    const nextStatus = isSuspended ? 'ACTIVE' : 'SUSPENDED';
    try {
      await adminApi.updateUserStatus(userId, nextStatus);
      setNotification(`Account status updated to ${nextStatus}`);
      loadTabData();
    } catch (err) {
      alert('Failed to update account status');
    }
  };

  const handleUpdateLimitForDate = async (targetDate, newLimit) => {
    if (updatingLimit) return;
    setUpdatingLimit(true);
    try {
      const res = await adminApi.updateDailyLimit({ date: targetDate, limit: Number(newLimit) });
      if (res.data?.success) {
        setNotification(`Daily assistance capacity for ${targetDate} set to ${newLimit} sessions.`);
        loadTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update daily capacity limit');
    } finally {
      setUpdatingLimit(false);
    }
  };

  const addPresetTable = (presetType) => {
    let newTable = null;
    if (presetType === 'OVERVIEW') {
      newTable = {
        title: 'Recruitment Overview',
        rows: [
          { key: 'Authority / Commission', value: newJob.organization || 'Staff Selection Commission' },
          { key: 'Exam / Recruitment Name', value: newJob.title || '' },
          { key: 'Total Vacancies', value: newJob.vacancies ? `${newJob.vacancies} Posts` : 'TBA' },
          { key: 'Application Last Date', value: newJob.lastDate || '' },
          { key: 'Minimum Age Limit', value: '18 Years' },
          { key: 'Maximum Age Limit', value: '27 - 30 Years (Category relaxations applicable)' },
        ],
      };
    } else if (presetType === 'FEES') {
      newTable = {
        title: 'Application Examination Fees',
        rows: [
          { key: 'General / OBC / EWS', value: `₹${newJob.fee || 100}` },
          { key: 'SC / ST / PwD Candidates', value: '₹0 (Exempted)' },
          { key: 'Female Candidates (All Categories)', value: '₹0 (Exempted)' },
          { key: 'Correction Charge (1st Time)', value: '₹200' },
          { key: 'Correction Charge (2nd Time)', value: '₹500' },
          { key: 'Fee Payment Mode', value: 'Online via Net Banking, UPI, Debit / Credit Card' },
        ],
      };
    } else if (presetType === 'VACANCIES') {
      newTable = {
        title: 'Post Wise Vacancy & Eligibility Details',
        rows: [
          { key: 'Post Designation / Cadre', value: newJob.title || 'General Post' },
          { key: 'Total Vacancy Count', value: newJob.vacancies ? `${newJob.vacancies} Posts` : 'As per official notification' },
          { key: 'Educational Eligibility', value: newJob.qualification || 'Graduation in any stream from recognized university' },
        ],
      };
    } else {
      newTable = {
        title: 'Custom Details Table',
        rows: [{ key: '', value: '' }],
      };
    }
    setNewJob((prev) => ({
      ...prev,
      tables: [...(prev.tables || []), newTable],
    }));
  };

  const updateTableTitle = (tableIdx, title) => {
    setNewJob((prev) => {
      const updated = [...(prev.tables || [])];
      updated[tableIdx] = { ...updated[tableIdx], title };
      return { ...prev, tables: updated };
    });
  };

  const addTableRow = (tableIdx) => {
    setNewJob((prev) => {
      const updated = [...(prev.tables || [])];
      updated[tableIdx] = {
        ...updated[tableIdx],
        rows: [...(updated[tableIdx].rows || []), { key: '', value: '' }],
      };
      return { ...prev, tables: updated };
    });
  };

  const updateTableRow = (tableIdx, rowIdx, field, val) => {
    setNewJob((prev) => {
      const updated = [...(prev.tables || [])];
      const rows = [...(updated[tableIdx].rows || [])];
      rows[rowIdx] = { ...rows[rowIdx], [field]: val };
      updated[tableIdx] = { ...updated[tableIdx], rows };
      return { ...prev, tables: updated };
    });
  };

  const removeTableRow = (tableIdx, rowIdx) => {
    setNewJob((prev) => {
      const updated = [...(prev.tables || [])];
      const rows = updated[tableIdx].rows.filter((_, idx) => idx !== rowIdx);
      updated[tableIdx] = { ...updated[tableIdx], rows };
      return { ...prev, tables: updated };
    });
  };

  const removeTable = (tableIdx) => {
    setNewJob((prev) => ({
      ...prev,
      tables: (prev.tables || []).filter((_, idx) => idx !== tableIdx),
    }));
  };

  const toggleDegreeMatch = (degree) => {
    setNewJob((prev) => {
      const current = prev.eligibleDegrees || [];
      const exists = current.includes(degree);
      return {
        ...prev,
        eligibleDegrees: exists ? current.filter((d) => d !== degree) : [...current, degree],
      };
    });
  };

  const toggleBranchMatch = (branch) => {
    setNewJob((prev) => {
      const current = prev.eligibleBranches || [];
      const exists = current.includes(branch);
      return {
        ...prev,
        eligibleBranches: exists ? current.filter((b) => b !== branch) : [...current, branch],
      };
    });
  };

  const handleOpenCreateJob = () => {
    setIsEditingJob(false);
    setEditingJobId(null);
    setNewJob({
      title: '',
      organization: '',
      department: '',
      category: 'Central',
      qualification: 'Graduate',
      vacancies: '',
      lastDate: '',
      fee: 100,
      officialUrl: '',
      description: '',
      tables: [],
      eligibleDegrees: [],
      eligibleBranches: [],
    });
    setShowJobModal(true);
  };

  const handleOpenEditJob = (job) => {
    setIsEditingJob(true);
    setEditingJobId(job.id);
    let parsedTables = [];
    if (Array.isArray(job.tables)) {
      parsedTables = job.tables;
    } else if (typeof job.tables === 'string') {
      try {
        parsedTables = JSON.parse(job.tables);
      } catch {
        parsedTables = [];
      }
    }

    let parsedDegrees = [];
    if (Array.isArray(job.eligibleDegrees)) {
      parsedDegrees = job.eligibleDegrees;
    } else if (typeof job.eligibleDegrees === 'string') {
      try {
        parsedDegrees = JSON.parse(job.eligibleDegrees);
      } catch {
        parsedDegrees = [];
      }
    }

    let parsedBranches = [];
    if (Array.isArray(job.eligibleBranches)) {
      parsedBranches = job.eligibleBranches;
    } else if (typeof job.eligibleBranches === 'string') {
      try {
        parsedBranches = JSON.parse(job.eligibleBranches);
      } catch {
        parsedBranches = [];
      }
    }

    const lastDateStr = job.applicationLastDate
      ? new Date(job.applicationLastDate).toISOString().split('T')[0]
      : job.lastDate
      ? new Date(job.lastDate).toISOString().split('T')[0]
      : '';

    setNewJob({
      title: job.title || '',
      organization: job.organization || '',
      department: job.department || '',
      category: job.category || 'Central',
      qualification: job.qualification || 'Graduate',
      vacancies: job.vacancies !== undefined ? job.vacancies : '',
      lastDate: lastDateStr,
      fee: job.applicationFee !== undefined ? job.applicationFee : (job.fee !== undefined ? job.fee : 100),
      officialUrl: job.officialApplicationUrl || job.officialNotificationUrl || job.officialUrl || '',
      description: job.description || '',
      tables: parsedTables,
      eligibleDegrees: parsedDegrees,
      eligibleBranches: parsedBranches,
    });
    setShowJobModal(true);
  };

  const handleToggleJobPublish = async (jobId, currentPublished) => {
    try {
      await adminApi.updateJob(jobId, { isPublished: !currentPublished });
      setNotification(`Recruitment notice status updated to ${!currentPublished ? 'Published' : 'Draft'}.`);
      loadTabData();
    } catch (err) {
      alert('Failed to update recruitment publication status');
    }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newJob,
        applicationLastDate: newJob.lastDate,
        applicationFee: Number(newJob.fee) || 0,
        officialApplicationUrl: newJob.officialUrl,
        officialNotificationUrl: newJob.officialUrl,
      };

      let res;
      if (isEditingJob && editingJobId) {
        res = await adminApi.updateJob(editingJobId, payload);
      } else {
        res = await adminApi.createJob(payload);
      }

      if (res.data?.success) {
        setNotification(
          isEditingJob
            ? 'Official recruitment notice updated successfully!'
            : 'Official recruitment notice published successfully!'
        );
        setShowJobModal(false);
        setIsEditingJob(false);
        setEditingJobId(null);
        setNewJob({
          title: '',
          organization: '',
          department: '',
          category: 'Central',
          qualification: 'Graduate',
          vacancies: '',
          lastDate: '',
          fee: 100,
          officialUrl: '',
          description: '',
          tables: [],
          eligibleDegrees: [],
          eligibleBranches: [],
        });
        loadTabData();
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.errors?.map((e) => `${e.field || ''}: ${e.message}`).join(', ') ||
        err.response?.data?.message ||
        'Failed to save recruitment notice';
      alert(`Error saving job: ${errMsg}`);
    }
  };
  const handleCreateJob = handleSaveJob;

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this recruitment notice?')) return;
    try {
      await adminApi.deleteJob(jobId);
      setNotification('Recruitment notice removed.');
      loadTabData();
    } catch (err) {
      alert('Could not delete job notice');
    }
  };

  const handleCreateResult = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createResult(newResult);
      setNotification('Result notice successfully published to gazette stream!');
      setShowResultModal(false);
      loadTabData();
    } catch (err) {
      alert('Failed to create result');
    }
  };

  const handleCreateAdmitCard = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createAdmitCard(newAdmitCard);
      setNotification('Admit card successfully published for candidates!');
      setShowAdmitModal(false);
      loadTabData();
    } catch (err) {
      alert('Failed to create admit card');
    }
  };

  const handleAssignSpecialist = async () => {
    if (!selectedSession) return;
    try {
      await adminApi.assignAssistant(selectedSession.id, {
        agentName,
        meetingUrl
      });
      setNotification('Desk specialist assigned and Meet invitation dispatched!');
      setSelectedSession(null);
      loadTabData();
    } catch (err) {
      alert('Failed to assign assistant');
    }
  };

  const handleResolveFeedback = async () => {
    if (!selectedFeedback) return;
    try {
      await adminApi.resolveFeedback(selectedFeedback.id, {
        adminResponse: resolutionNote,
        status: 'RESOLVED'
      });
      setNotification('Grievance ticket marked resolved.');
      setSelectedFeedback(null);
      loadTabData();
    } catch (err) {
      alert('Failed to resolve grievance');
    }
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    if (agentSubmitting) return;
    setAgentSubmitting(true);
    try {
      const res = await adminApi.createAgent(newAgent);
      if (res.data?.success) {
        setNotification(`Desk Agent "${newAgent.fullName}" created successfully!`);
        setShowAgentModal(false);
        setNewAgent({ fullName: '', email: '', password: '', phone: '' });
        loadTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create Desk Agent account');
    } finally {
      setAgentSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#9333EA', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <ShieldCheck size={16} /> SOVEREIGN CIVIC GOVERNANCE CONSOLE
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--color-primary)', margin: 0 }}>
              Master Administration System
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
              Authenticated Administrator: <strong>{user?.email}</strong> • Full Data & User Governance Control
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleOpenCreateJob}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} /> Publish Recruitment
            </button>
            <button
              onClick={() => setShowAgentModal(true)}
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
            >
              <UserCheck size={15} /> Add Desk Agent
            </button>
            <button
              onClick={() => setShowResultModal(true)}
              className="btn btn-outline btn-sm"
            >
              <Award size={15} /> Publish Result
            </button>
            <button
              onClick={() => setShowAdmitModal(true)}
              className="btn btn-outline btn-sm"
            >
              <FileText size={15} /> Publish Admit Card
            </button>
          </div>
        </div>

        {notification && (
          <div style={{
            backgroundColor: 'var(--color-accent-subtle)',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification('')} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent)' }}>
              Dismiss
            </button>
          </div>
        )}

        {/* Master Admin Navigation Bar */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '2rem',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {[
            { key: 'overview', label: 'Platform KPIs & Stats', icon: TrendingUp },
            { key: 'proClub', label: 'Pro Club & Protection', icon: Sparkles },
            { key: 'applications', label: 'Master Applications', icon: Layers },
            { key: 'recruitments', label: 'Recruitments (CRUD)', icon: Briefcase },
            { key: 'assistance', label: 'Assistance Dispatch', icon: Video },
            { key: 'agents', label: 'Desk Agents', icon: UserCheck },
            { key: 'users', label: 'Candidate Accounts', icon: Users },
            { key: 'financials', label: 'Financials & Revenue', icon: IndianRupee },
            { key: 'feedback', label: 'Grievance Desk', icon: MessageSquare },
            { key: 'audit', label: 'System Audit Logs', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.75rem 1rem',
                  borderBottom: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  marginBottom: '-2px'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <span>TOTAL REGISTERED CANDIDATES</span>
                  <Users size={18} color="var(--color-primary)" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text-title)' }} className="tabular-nums">
                  {stats?.totalUsers ?? stats?.users?.total ?? 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.2rem' }}>
                  +{stats?.newUsersThisMonth ?? stats?.users?.newThisMonth ?? 0} enrolled this month
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <span>ACTIVE RECRUITMENTS</span>
                  <Briefcase size={18} color="var(--color-secondary)" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-secondary)' }} className="tabular-nums">
                  {stats?.activeJobs ?? stats?.jobs?.active ?? 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
                  Live Gazette Openings
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <span>ASSISTED SESSIONS PROCESSED</span>
                  <Video size={18} color="var(--color-accent)" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent)' }} className="tabular-nums">
                  {stats?.totalAssistanceSessions ?? stats?.assistance?.total ?? 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.2rem' }}>
                  1-on-1 Guided Sessions
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <span>PRO MEMBERS / REVENUE</span>
                  <IndianRupee size={18} color="#9333EA" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-text-title)' }} className="tabular-nums">
                  ₹{(stats?.totalRevenue ?? stats?.revenue?.total ?? 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9333EA', fontWeight: 600, marginTop: '0.2rem' }}>
                  {stats?.activePaidMembers ?? stats?.memberships?.active ?? 0} Active Pro Passes (₹249 / 3 Mo)
                </div>
              </div>
            </div>

            {/* Application Funnel Breakdown */}
            <div className="card" style={{ padding: '1.75rem', backgroundColor: '#FFFFFF', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                Recruitment Application Lifecycle Distribution
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem'
              }}>
                {[
                  { label: 'Drafts Created', count: stats?.distribution?.DRAFT || 0, color: 'var(--color-text-muted)' },
                  { label: 'Assistance Scheduled', count: stats?.distribution?.ASSISTANCE_SCHEDULED || 0, color: 'var(--color-primary)' },
                  { label: 'Docs Verified', count: stats?.distribution?.DOCUMENTS_VERIFIED || 0, color: 'var(--color-accent)' },
                  { label: 'Consent Pending', count: stats?.distribution?.CANDIDATE_AUTHORIZATION_PENDING || 0, color: 'var(--color-secondary)' },
                  { label: 'Officially Submitted', count: stats?.distribution?.SUBMITTED || 0, color: 'var(--color-accent)' },
                  { label: 'Admit Card Issued', count: stats?.distribution?.ADMIT_CARD_READY || 0, color: '#9333EA' },
                ].map((st) => (
                  <div
                    key={st.label}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'var(--color-bg)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                      {st.label}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: st.color }} className="tabular-nums">
                      {st.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: PRO CLUB & PROTECTION */}
        {activeTab === 'proClub' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Top Toolbar */}
            <div className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                  <Sparkles size={16} /> MAXEVOG PRO CLUB V1 ENGINE
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0 }}>
                  Pro Club Governance & Deadline Protection
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Quarterly subscriber lifecycle (3 Months), match pipeline, 1 free assistance credit allocation, and multi-channel audit trail.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleTriggerReminders}
                  disabled={triggeringReminders}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Send size={14} />
                  <span>{triggeringReminders ? 'Evaluating Windows...' : 'Run Deadline Engine Now'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadTabData()}
                  className="btn btn-outline btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <RefreshCw size={14} />
                  <span>Refresh Dataset</span>
                </button>
              </div>
            </div>

            {/* Ecosystem KPI Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>ACTIVE PRO SUBSCRIBERS</span>
                  <Users size={16} color="var(--color-primary)" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }} className="tabular-nums">
                  {proStats?.subscribers?.active || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Total enrolled: {proStats?.subscribers?.total || 0}
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>TRACKED OPPORTUNITIES</span>
                  <Briefcase size={16} color="var(--color-secondary)" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-secondary)' }} className="tabular-nums">
                  {proStats?.trackedJobsCount || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  In candidate personal trackers
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>AUTO-MATCHES GENERATED</span>
                  <Sparkles size={16} color="#8B5CF6" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8B5CF6' }} className="tabular-nums">
                  {proStats?.matchesGeneratedCount || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Eligible openings identified
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>FREE ASSISTANCE CREDITS</span>
                  <Video size={16} color="var(--color-accent)" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-accent)' }} className="tabular-nums">
                  {proStats?.subscribers?.totalCreditsUsed || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Credits used ({proStats?.subscribers?.totalCreditsRemaining || 0} available)
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  <span>NOTIFICATIONS SENT</span>
                  <Bell size={16} color="#EC4899" />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#EC4899' }} className="tabular-nums">
                  {proStats?.notifications?.sent || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: proStats?.notifications?.failed > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  {proStats?.notifications?.failed || 0} failed attempts
                </div>
              </div>
            </div>

            {/* Section 1: Active Subscribers */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>
                    Pro Club Members (Quarterly Passes)
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Active 3-month subscriptions with 1 free assistance credit status.
                  </div>
                </div>
                <span className="badge badge-primary" style={{ fontWeight: 700 }}>
                  {proSubscribers.length} Members Loaded
                </span>
              </div>

              {proSubscribers.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                  No Pro Club subscribers found in this view.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Candidate</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Plan Tier</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Active Period</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Free 1-on-1 Credit</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proSubscribers.map((sub) => {
                        const hasCreditAvailable = (sub.assistanceCreditsTotal || 1) > (sub.assistanceCreditsUsed || 0);
                        const isExpired = sub.status === 'EXPIRED' || (sub.endDate && new Date(sub.endDate) < new Date());
                        return (
                          <tr key={sub.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              <div style={{ fontWeight: 600, color: 'var(--color-text-title)' }}>
                                {sub.user?.profile?.fullName || 'Pro Candidate'}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                                {sub.user?.email} {sub.user?.profile?.mobileNumber ? `• ${sub.user.profile.mobileNumber}` : ''}
                              </div>
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                              <span style={{ color: 'var(--color-secondary)' }}>Quarterly Pass</span>
                              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>3 Months Protection</div>
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-body)', whiteSpace: 'nowrap' }}>
                              <div style={{ fontSize: '0.82rem' }}>
                                Started: {sub.startDate ? new Date(sub.startDate).toLocaleDateString('en-IN') : '—'}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: isExpired ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
                                Valid till: {sub.endDate ? new Date(sub.endDate).toLocaleDateString('en-IN') : '—'}
                              </div>
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              {hasCreditAvailable ? (
                                <span className="badge" style={{ backgroundColor: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', fontWeight: 700 }}>
                                  1 Credit Ready (₹69 Waived)
                                </span>
                              ) : (
                                <span className="badge" style={{ backgroundColor: '#F3F4F6', color: '#6B7280', border: '1px solid #E5E7EB' }}>
                                  Credit Consumed
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              <span
                                className="badge"
                                style={{
                                  backgroundColor: isExpired ? '#FEE2E2' : '#EDE9FE',
                                  color: isExpired ? '#DC2626' : '#6D28D9',
                                  border: `1px solid ${isExpired ? '#FCA5A5' : '#C4B5FD'}`,
                                  fontWeight: 700
                                }}
                              >
                                {isExpired ? 'EXPIRED' : (sub.status || 'ACTIVE')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {hasMoreProSubscribers && (
                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={handleLoadMoreProSubscribers}
                    disabled={loadingMoreProSubscribers}
                    className="btn btn-outline btn-sm"
                  >
                    {loadingMoreProSubscribers ? 'Loading...' : 'Load More Subscribers'}
                  </button>
                </div>
              )}
            </div>

            {/* Section 2: Multi-Channel Notification Audit Trail */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>
                    Deadline Protection & Matching Dispatch Log
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Idempotent record of automated D-7, D-3, D-1, D-0 deadline alerts and new recruitment notifications.
                  </div>
                </div>
                <span className="badge badge-official" style={{ fontWeight: 700 }}>
                  {proLogs.length} Delivery Records
                </span>
              </div>

              {proLogs.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                  No notification logs recorded yet. Reminders run automatically or via "Run Deadline Engine Now".
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Timestamp</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Notification Event</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Channel</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Candidate / Recipient</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Target Recruitment</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proLogs.map((log) => (
                        <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                            {new Date(log.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span
                              className="badge"
                              style={{
                                fontFamily: 'monospace',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                backgroundColor: log.notificationType?.includes('D0') || log.notificationType?.includes('D1') ? '#FEE2E2' : '#EFF6FF',
                                color: log.notificationType?.includes('D0') || log.notificationType?.includes('D1') ? '#DC2626' : '#1D4ED8',
                                border: `1px solid ${log.notificationType?.includes('D0') || log.notificationType?.includes('D1') ? '#FCA5A5' : '#BFDBFE'}`
                              }}
                            >
                              {log.notificationType}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span
                              className="badge"
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: log.channel === 'TELEGRAM' ? '#E0F2FE' : log.channel === 'EMAIL' ? '#FEF3C7' : '#F3F4F6',
                                color: log.channel === 'TELEGRAM' ? '#0369A1' : log.channel === 'EMAIL' ? '#B45309' : '#374151',
                                border: `1px solid ${log.channel === 'TELEGRAM' ? '#7DD3FC' : log.channel === 'EMAIL' ? '#FCD34D' : '#E5E7EB'}`
                              }}
                            >
                              {log.channel}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontWeight: 600, color: 'var(--color-text-title)' }}>
                              {log.user?.profile?.fullName || log.user?.email || 'Candidate'}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                              {log.recipient || log.user?.email}
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <div style={{ fontWeight: 600, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {log.job?.title || 'General Account Event'}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                              {log.job?.organization || '—'}
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span
                              className="badge"
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: log.status === 'SENT' ? '#DCFCE7' : log.status === 'SIMULATED' ? '#EDE9FE' : '#FEE2E2',
                                color: log.status === 'SENT' ? '#15803D' : log.status === 'SIMULATED' ? '#6D28D9' : '#DC2626',
                                border: `1px solid ${log.status === 'SENT' ? '#86EFAC' : log.status === 'SIMULATED' ? '#C4B5FD' : '#FCA5A5'}`
                              }}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {hasMoreProLogs && (
                <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={handleLoadMoreProLogs}
                    disabled={loadingMoreProLogs}
                    className="btn btn-outline btn-sm"
                  >
                    {loadingMoreProLogs ? 'Loading...' : 'Load More Logs'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MASTER APPLICATIONS LEDGER */}
        {activeTab === 'applications' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>
                  Master Candidate Applications Ledger
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  All applications registered across all public boards with candidate and specialist records.
                </div>
              </div>
            </div>

            {applications.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No candidate applications found.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Application ID</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Applicant Name / Email</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Target Recruitment</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Stage Status</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Board Fee</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Assigned Specialist</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Date Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {app.applicationNumber || app.id.slice(0, 8)}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ fontWeight: 600 }}>{app.user?.profile?.fullName || 'Candidate'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{app.user?.email}</div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div>{app.job?.title || 'Recruitment Exam'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{app.job?.organization}</div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className={`badge ${app.status === 'submitted' ? 'badge-official' : app.status === 'candidate_authorization_pending' ? 'badge-urgent' : 'badge-primary'}`}>
                            {app.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }} className="tabular-nums">
                          ₹{app.job?.fee || 0}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {app.assignedAgent?.profile?.fullName || app.assignedAgent?.email || <span style={{ color: 'var(--color-text-muted)' }}>Unassigned</span>}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)' }}>
                          {new Date(app.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {hasMoreApplications && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleLoadMoreApplications}
                  disabled={loadingMoreApplications}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.55rem 1.4rem', fontWeight: 600, borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >
                  {loadingMoreApplications ? 'Loading More Applications...' : 'See More Applications (Load Next 15)'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RECRUITMENTS CRUD */}
        {activeTab === 'recruitments' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>
                  Recruitment Notifications Directory
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Published gazette notices visible to all Indian aspirants.
                </div>
              </div>

              <button
                onClick={handleOpenCreateJob}
                className="btn btn-primary btn-sm"
              >
                <Plus size={15} /> Add New Vacancy Notice
              </button>
            </div>

            {jobs.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No recruitments active in database.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Authority / Commission</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Recruitment Post Title</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Sector</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Vacancies</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Last Date</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Fee</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{job.organization}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{job.title}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className="badge badge-neutral">{job.category || 'Central'}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {job.vacancies ? <span className="tabular-nums">{job.vacancies.toLocaleString('en-IN')}</span> : <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Exam / Merit Based</span>}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                          {job.applicationLastDate
                            ? new Date(job.applicationLastDate).toLocaleDateString('en-IN')
                            : job.lastDate
                            ? new Date(job.lastDate).toLocaleDateString('en-IN')
                            : 'TBA'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>₹{job.applicationFee ?? job.fee ?? 0}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleJobPublish(job.id, job.isPublished !== false)}
                            className={`badge ${job.isPublished !== false ? 'badge-official' : 'badge-neutral'}`}
                            style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            title="Click to toggle publish status"
                          >
                            {job.isPublished !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                            <span>{job.isPublished !== false ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleOpenEditJob(job)}
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--color-primary)', borderColor: 'var(--color-border)' }}
                              title="Edit Notice & Specifications"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-border)' }}
                              title="Delete Notice"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {hasMoreJobs && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleLoadMoreJobs}
                  disabled={loadingMoreJobs}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.55rem 1.4rem', fontWeight: 600, borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >
                  {loadingMoreJobs ? 'Loading More Recruitments...' : 'See More Recruitments (Load Next 15)'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ASSISTANCE DISPATCH DESK */}
        {activeTab === 'assistance' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              Assisted Booking Queue & Specialist Allocations
            </h3>

            {/* Daily Assistance Capacity Settings widget */}
            <div style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={16} /> Daily Assistance Capacity Manager
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Configure the maximum standard assistance bookings candidate intake for each day.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => loadTabData()}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  Refresh Capacity
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    Select Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem' }}
                    value={selectedLimitDate}
                    onChange={(e) => {
                      const newD = e.target.value;
                      setSelectedLimitDate(newD);
                      const entry = dailyLimitsData.find((l) => l.date === newD);
                      setCurrentDateLimit(entry ? entry.limit : 10);
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                    Max Daily Sessions
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    className="form-control"
                    style={{ fontSize: '0.85rem', width: '130px', padding: '0.35rem 0.6rem' }}
                    value={currentDateLimit}
                    onChange={(e) => setCurrentDateLimit(Number(e.target.value))}
                  />
                </div>

                <div style={{ paddingTop: '1.2rem' }}>
                  <button
                    type="button"
                    onClick={() => handleUpdateLimitForDate(selectedLimitDate, currentDateLimit)}
                    disabled={updatingLimit}
                    className="btn btn-primary btn-sm"
                  >
                    {updatingLimit ? 'Saving...' : 'Save Limit for Date'}
                  </button>
                </div>

                {/* Capacity summary pill */}
                {(() => {
                  const entry = dailyLimitsData.find((l) => l.date === selectedLimitDate);
                  const booked = entry ? entry.bookedCount : 0;
                  const maxLimit = entry ? entry.limit : currentDateLimit;
                  const remaining = Math.max(0, maxLimit - booked);
                  return (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.8rem',
                      marginTop: '1.2rem'
                    }}>
                      <span>Booked: <strong>{booked}</strong></span>
                      <span>•</span>
                      <span>Capacity: <strong>{maxLimit}</strong></span>
                      <span>•</span>
                      <span style={{ color: remaining === 0 ? '#DC2626' : '#16A34A', fontWeight: 700 }}>
                        {remaining === 0 ? 'Capacity Full' : `${remaining} Slots Left`}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {assistanceSessions.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No assistance bookings in queue.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {assistanceSessions.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      padding: '1.25rem',
                      border: session.status === 'URGENT_PENDING_REVIEW' ? '2px solid #F87171' : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: session.status === 'URGENT_PENDING_REVIEW' ? '#FEF2F2' : 'var(--color-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        {session.status === 'URGENT_PENDING_REVIEW' ? (
                          <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #F87171', fontWeight: 700 }}>
                            ⚡ URGENT REVIEW PENDING
                          </span>
                        ) : (
                          <span className="badge badge-primary">{session.status || 'SCHEDULED'}</span>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Ref: {session.id.slice(0, 8)}</span>
                        {session.isUrgent && (
                          <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #F87171', fontWeight: 700, fontSize: '0.72rem' }}>
                            ⚡ URGENT (₹{session.priorityFee || 99})
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-title)', margin: '0 0 0.35rem 0' }}>
                        Candidate: {session.user?.profile?.fullName || session.user?.email || 'Aspirant'}
                      </h4>

                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        Date: <strong>{session.bookingDate ? new Date(session.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (session.date || 'Scheduled')}</strong> • Target: <strong>{session.customExamTitle || session.job?.title || 'Examination'}</strong> {session.job?.organization ? `(${session.job.organization})` : ''}
                      </div>

                      {session.urgencyReason && (
                        <div style={{ fontSize: '0.8rem', color: '#DC2626', marginTop: '0.35rem' }}>
                          <strong>Urgency Deadline/Reason:</strong> "{session.urgencyReason}"
                        </div>
                      )}

                      {session.assignedAgent && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', marginTop: '0.25rem' }}>
                          Assigned Officer: {session.assignedAgent.profile?.fullName || session.assignedAgent.email}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSession(session);
                      }}
                      className={session.status === 'URGENT_PENDING_REVIEW' ? "btn btn-sm" : "btn btn-primary btn-sm"}
                      style={session.status === 'URGENT_PENDING_REVIEW' ? {
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      } : {}}
                    >
                      <Video size={14} /> {session.status === 'URGENT_PENDING_REVIEW' ? 'Assign Idle Specialist' : 'Assign Specialist / Meet URL'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CANDIDATE USERS GOVERNANCE */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              Candidate Directory & Account Governance
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Candidate</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Email / Phone</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Pro Pass</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{u.profile?.fullName || u.name || 'Candidate'}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className="badge badge-neutral">
                          {u.profile?.position === 'CANDIDATE' || u.role === 'USER' ? 'Candidate' : u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{u.profile?.category || 'General'}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {u.isProMember ? <span className="badge badge-urgent">PRO</span> : <span className="badge badge-neutral">Standard</span>}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className={`badge ${String(u.status).toUpperCase() === 'SUSPENDED' ? 'badge-danger' : 'badge-official'}`}>
                          {u.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status || 'ACTIVE')}
                          className={`btn btn-sm ${String(u.status).toUpperCase() === 'SUSPENDED' ? 'btn-primary' : 'btn-outline'}`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {String(u.status).toUpperCase() === 'SUSPENDED' ? <UserCheck size={14} /> : <UserX size={14} />}
                          <span>{String(u.status).toUpperCase() === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasMoreUsers && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleLoadMoreUsers}
                  disabled={loadingMoreUsers}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.55rem 1.4rem', fontWeight: 600, borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >
                  {loadingMoreUsers ? 'Loading More Candidates...' : 'See More Candidates (Load Next 15)'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5.5: DESK AGENTS GOVERNANCE */}
        {activeTab === 'agents' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>
                  Desk Agent Officers Directory
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Only master administrators can create desk agents who assist candidates with government form submissions.
                </div>
              </div>

              <button
                onClick={() => setShowAgentModal(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={15} /> Create New Desk Agent
              </button>
            </div>

            {agentsList.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No desk agents registered in platform yet. Click "+ Create New Desk Agent" to register an agent.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Officer Name</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Official Email</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Mobile Number</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Live Availability</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Active Sessions</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Completed Sessions</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Account Status</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Created Date</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentsList.map((ag) => (
                      <tr key={ag.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--color-text-title)' }}>
                          {ag.profile?.fullName || ag.email}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-primary)' }}>
                          {ag.email}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)' }}>
                          {ag.profile?.mobileNumber || '—'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {ag.profile?.agentStatus === 'ASSISTING' ? (
                            <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #F87171', fontWeight: 700, fontSize: '0.75rem' }}>
                              ● ASSISTING
                            </span>
                          ) : (
                            <span className="badge" style={{ backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #86EFAC', fontWeight: 700, fontSize: '0.75rem' }}>
                              ● IDLE
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className="badge badge-primary">
                            {ag.activeSessions || 0} active
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className="badge badge-official">
                            {ag.completedSessions || 0} finished
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className={`badge ${String(ag.status).toUpperCase() === 'SUSPENDED' ? 'badge-danger' : 'badge-official'}`}>
                            {ag.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)' }}>
                          {new Date(ag.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleToggleUserStatus(ag.id, ag.status || 'ACTIVE')}
                            className={`btn btn-sm ${String(ag.status).toUpperCase() === 'SUSPENDED' ? 'btn-primary' : 'btn-outline'}`}
                            style={{ fontSize: '0.75rem' }}
                          >
                            {String(ag.status).toUpperCase() === 'SUSPENDED' ? <UserCheck size={14} /> : <UserX size={14} />}
                            <span>{String(ag.status).toUpperCase() === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {hasMoreAgents && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  onClick={handleLoadMoreAgents}
                  disabled={loadingMoreAgents}
                  className="btn btn-outline"
                  style={{ minWidth: '180px' }}
                >
                  {loadingMoreAgents ? 'Loading more...' : 'See More Desk Agents'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: FINANCIALS & REVENUE */}
        {activeTab === 'financials' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem'
            }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                  TOTAL PLATFORM REVENUE
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }} className="tabular-nums">
                  ₹{(financials?.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.2rem' }}>
                  Settled Collections
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                  DESK ASSISTANCE CHARGES (₹69)
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-secondary)' }} className="tabular-nums">
                  ₹{(financials?.assistanceRevenue || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Transparent application assistance
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
                  PRO CLUB MEMBERSHIPS (₹249)
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#9333EA' }} className="tabular-nums">
                  ₹{(financials?.membershipRevenue || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Quarterly aspirant subscriptions
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                Recent Financial Ledger Entries
              </h3>

              {financials?.recentTransactions?.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Transaction ID</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Candidate</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Amount</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Type</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financials.recentTransactions.map((tx) => (
                        <tr key={tx.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{tx.id.slice(0, 10)}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{tx.user?.profile?.fullName || tx.user?.email}</td>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }} className="tabular-nums">₹{tx.amount}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{tx.type || 'ASSISTANCE_FEE'}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span className="badge badge-official">{tx.status || 'SUCCESS'}</span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)' }}>
                            {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>
                  Ledger active. Transactions will be recorded upon session checkout.
                </p>
              )}
              {hasMoreFinancials && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button
                    onClick={handleLoadMoreFinancials}
                    disabled={loadingMoreFinancials}
                    className="btn btn-outline"
                    style={{ minWidth: '180px' }}
                  >
                    {loadingMoreFinancials ? 'Loading more...' : 'See More Transactions'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: GRIEVANCE RESOLUTION */}
        {activeTab === 'feedback' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
              Candidate Grievances & Service Feedback
            </h3>

            {feedbacks.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No grievance tickets currently open.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {feedbacks.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '1.25rem',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-neutral">{item.category}</span>
                      <span className={`badge ${item.status === 'RESOLVED' ? 'badge-official' : 'badge-urgent'}`}>
                        {item.status || 'OPEN'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', color: 'var(--color-text-title)', marginBottom: '0.35rem' }}>
                      {item.subject}
                    </h4>

                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-body)', marginBottom: '0.75rem' }}>
                      "{item.message}"
                    </p>

                    {item.adminResponse ? (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>
                        <strong>Resolution:</strong> {item.adminResponse}
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedFeedback(item)}
                        className="btn btn-outline btn-sm"
                      >
                        Respond & Resolve Grievance
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {hasMoreFeedback && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  onClick={handleLoadMoreFeedback}
                  disabled={loadingMoreFeedback}
                  className="btn btn-outline"
                  style={{ minWidth: '180px' }}
                >
                  {loadingMoreFeedback ? 'Loading more...' : 'See More Grievances'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: SYSTEM AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', margin: 0 }}>
                  System Audit Ledger & Governance History
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Immutable record of administrative, recruitment, application, and financial activities.
                </div>
              </div>
              <button onClick={() => loadTabData()} className="btn btn-outline btn-sm">
                Refresh Logs
              </button>
            </div>

            {auditLogs.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No audit entries recorded yet.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Timestamp</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Action Event</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Entity / Target</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Actor</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Metadata / Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap', color: 'var(--color-text-muted)' }}>
                          {new Date(log.createdAt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span
                            className="badge"
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              backgroundColor: log.action?.startsWith('AGENT_') ? '#CCFBF1' : log.action?.startsWith('ADMIN_') ? '#EDE9FE' : '#EFF6FF',
                              color: log.action?.startsWith('AGENT_') ? '#0F766E' : log.action?.startsWith('ADMIN_') ? '#6D28D9' : '#1D4ED8',
                              border: `1px solid ${log.action?.startsWith('AGENT_') ? '#5EEAD4' : log.action?.startsWith('ADMIN_') ? '#C4B5FD' : '#BFDBFE'}`
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                          {log.entityType} {log.entityId ? <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '0.78rem' }}>#{log.entityId.slice(0, 8)}</span> : ''}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span
                            className="badge"
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: log.actorRole === 'ADMIN' ? '#FEE2E2' : log.actorRole === 'AGENT' ? '#DCFCE7' : '#F3F4F6',
                              color: log.actorRole === 'ADMIN' ? '#DC2626' : log.actorRole === 'AGENT' ? '#15803D' : '#4B5563',
                              border: `1px solid ${log.actorRole === 'ADMIN' ? '#FCA5A5' : log.actorRole === 'AGENT' ? '#86EFAC' : '#E5E7EB'}`
                            }}
                          >
                            {log.actorRole || 'SYSTEM'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>
                          {log.actor?.profile?.fullName || log.actor?.email || (log.actorId ? `User #${log.actorId.slice(0, 8)}` : 'System / Auto')}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                              {log.metadata ? (typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : String(log.metadata)) : '—'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedAuditLog(log)}
                              className="btn btn-outline"
                              style={{
                                padding: '0.2rem 0.55rem',
                                fontSize: '0.72rem',
                                whiteSpace: 'nowrap',
                                height: 'auto',
                                lineHeight: 1.2
                              }}
                            >
                              Full View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {hasMoreAudit && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                  onClick={handleLoadMoreAudit}
                  disabled={loadingMoreAudit}
                  className="btn btn-outline"
                  style={{ minWidth: '180px' }}
                >
                  {loadingMoreAudit ? 'Loading more...' : 'See More Audit Logs'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODAL: FULL AUDIT LOG DETAILS */}
        <Modal
          isOpen={!!selectedAuditLog}
          onClose={() => setSelectedAuditLog(null)}
          title="Audit Log Event Details"
          maxWidth="700px"
        >
          {selectedAuditLog && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Action Event</div>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                    {selectedAuditLog.action}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Timestamp</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-body)', marginTop: '0.2rem' }}>
                    {new Date(selectedAuditLog.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Actor Name</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-body)', marginTop: '0.2rem' }}>
                    {selectedAuditLog.actor?.profile?.fullName || selectedAuditLog.actor?.email || 'System / Automated'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Actor Role & ID</div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-body)', marginTop: '0.2rem', fontSize: '0.85rem' }}>
                    <span className="badge" style={{ marginRight: '0.4rem' }}>{selectedAuditLog.actorRole || 'SYSTEM'}</span>
                    {selectedAuditLog.actorId ? <code style={{ fontSize: '0.76rem' }}>{selectedAuditLog.actorId}</code> : 'None'}
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Entity / Target</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-body)', marginTop: '0.2rem' }}>
                    {selectedAuditLog.entityType} {selectedAuditLog.entityId && <code style={{ fontSize: '0.76rem' }}>({selectedAuditLog.entityId})</code>}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                  Complete Metadata & Context:
                </div>
                <pre style={{
                  backgroundColor: '#0F172A',
                  color: '#38BDF8',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  maxHeight: '320px',
                  fontFamily: 'Consolas, Monaco, monospace'
                }}>
                  {selectedAuditLog.metadata 
                    ? JSON.stringify(selectedAuditLog.metadata, null, 2)
                    : '{\n  "status": "No additional metadata recorded for this action"\n}'}
                </pre>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(JSON.stringify(selectedAuditLog.metadata || {}, null, 2));
                    setNotification('Audit metadata copied to clipboard!');
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Copy JSON
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAuditLog(null)}
                  className="btn btn-primary btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* MODAL: PUBLISH / EDIT JOB */}
        <Modal
          isOpen={showJobModal}
          onClose={() => setShowJobModal(false)}
          title={isEditingJob ? 'Edit Recruitment Notice & Specifications' : 'Publish Official Recruitment Notice'}
          maxWidth="900px"
        >
          <form onSubmit={handleSaveJob} style={{ maxHeight: '78vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="modal-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Recruitment Post Title *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. SSC 10+2 CHSL Recruitment 2026 for 2536 Post"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Authority / Commission *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Staff Selection Commission (SSC)"
                  value={newJob.organization}
                  onChange={(e) => setNewJob({ ...newJob, organization: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department / Office</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Constitutional Bodies & Government Offices"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sector / Category</label>
                <select
                  className="form-control form-select"
                  value={newJob.category}
                  onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                >
                  <option value="Central">Central Government</option>
                  <option value="State">State Government</option>
                  <option value="Defense">Defense / Armed Forces</option>
                  <option value="Banking">Banking & Financial</option>
                  <option value="Railways">Indian Railways</option>
                  <option value="Engineering">PSU / Technical Services</option>
                  <option value="Medical">Medical & Paramedical</option>
                  <option value="Police">Police & Paramilitary</option>
                  <option value="Teaching">Education & Teaching</option>
                  <option value="Other">Other Public Entity</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Qualification Base</label>
                <select
                  className="form-control form-select"
                  value={newJob.qualification}
                  onChange={(e) => setNewJob({ ...newJob, qualification: e.target.value })}
                >
                  <option value="10th">10th Pass (Matriculation)</option>
                  <option value="12th">12th Pass (Higher Secondary)</option>
                  <option value="Diploma">Diploma / Polytechnic</option>
                  <option value="Graduate">Bachelor Degree (Graduate)</option>
                  <option value="Post Graduate">Master Degree (Post Graduate)</option>
                  <option value="Doctorate">Doctorate / Ph.D.</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Total Vacancies (Optional)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 2536 or leave blank for exam/merit based (e.g. GATE/JEE/STET)"
                  value={newJob.vacancies}
                  onChange={(e) => setNewJob({ ...newJob, vacancies: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Application Last Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={newJob.lastDate}
                  onChange={(e) => setNewJob({ ...newJob, lastDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Board Exam Fee (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newJob.fee}
                  onChange={(e) => setNewJob({ ...newJob, fee: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Official Gazette / Portal URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://ssc.gov.in"
                  value={newJob.officialUrl}
                  onChange={(e) => setNewJob({ ...newJob, officialUrl: e.target.value })}
                />
              </div>

              {/* Notification Description Input */}
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Official Notification Description / Summary</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Enter detailed notification summary, syllabus notes, or official gazette circular..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            {/* SECTION: SPECIFICATION TABLES BUILDER */}
            <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Table size={16} /> Specification Tables (Overview, Fees, Vacancies & Details)
                  </h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Create structured key-value tables displayed on the candidate job specs page.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => addPresetTable('OVERVIEW')} className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                    + Overview Table
                  </button>
                  <button type="button" onClick={() => addPresetTable('FEES')} className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                    + Fee Table
                  </button>
                  <button type="button" onClick={() => addPresetTable('VACANCIES')} className="btn btn-outline btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                    + Vacancy Details Table
                  </button>
                  <button type="button" onClick={() => addPresetTable('CUSTOM')} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                    + Custom Table
                  </button>
                </div>
              </div>

              {(!newJob.tables || newJob.tables.length === 0) ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  No specification tables created yet. Click any button above to generate a structured table (Overview, Fees, Vacancy, or Custom).
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {newJob.tables.map((tbl, tblIdx) => (
                    <div key={tblIdx} style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-xs)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>Table {tblIdx + 1}:</span>
                          <input
                            type="text"
                            className="form-control"
                            value={tbl.title}
                            onChange={(e) => updateTableTitle(tblIdx, e.target.value)}
                            placeholder="e.g. Overview / Application Fees / Vacancy Details"
                            style={{ fontWeight: 600, fontSize: '0.88rem', height: '2rem' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTable(tblIdx)}
                          className="btn btn-outline btn-sm"
                          style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-border)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          <Trash2 size={13} /> Delete Table
                        </button>
                      </div>

                      {/* Rows container */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tbl.rows?.map((row, rowIdx) => (
                          <div key={rowIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Key (e.g. Exam Name / Fee / Minimum Age)"
                              value={row.key}
                              onChange={(e) => updateTableRow(tblIdx, rowIdx, 'key', e.target.value)}
                              style={{ flex: 1, fontSize: '0.82rem' }}
                            />
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Value (e.g. SSC CHSL / ₹100 / 18 Years)"
                              value={row.value}
                              onChange={(e) => updateTableRow(tblIdx, rowIdx, 'value', e.target.value)}
                              style={{ flex: 1.5, fontSize: '0.82rem' }}
                            />
                            <button
                              type="button"
                              onClick={() => removeTableRow(tblIdx, rowIdx)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '0.35rem 0.5rem', color: 'var(--color-text-muted)' }}
                              title="Delete Row"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => addTableRow(tblIdx)}
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: '0.75rem', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                      >
                        <Plus size={13} /> Add Row
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION: CANDIDATE JOB MATCHER (ELIGIBILITY ENGINE) */}
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckSquare size={16} /> Candidate Job Matcher (Eligibility Criteria)
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Select eligible degrees and branches. Candidates matching these will see "Likely Eligible" or "May Be Eligible / Needs Review" tags.
                </div>
              </div>

              {/* Degrees Grid */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-title)' }}>
                    Eligible Degree / Certificate Titles:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const all = STANDARD_MATCHER_DEGREES;
                      const isAll = (newJob.eligibleDegrees || []).length === all.length;
                      setNewJob((p) => ({ ...p, eligibleDegrees: isAll ? [] : all }));
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {(newJob.eligibleDegrees || []).length === STANDARD_MATCHER_DEGREES.length ? 'Deselect All' : 'Select All Degrees'}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto', padding: '0.5rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  {STANDARD_MATCHER_DEGREES.map((deg) => {
                    const checked = (newJob.eligibleDegrees || []).includes(deg);
                    return (
                      <label key={deg} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', color: checked ? 'var(--color-primary)' : 'var(--color-text-body)', fontWeight: checked ? 600 : 400 }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDegreeMatch(deg)}
                        />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deg}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Branches Grid */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-title)' }}>
                    Eligible Major Branches / Specializations:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const all = STANDARD_MATCHER_BRANCHES;
                      const isAll = (newJob.eligibleBranches || []).length === all.length;
                      setNewJob((p) => ({ ...p, eligibleBranches: isAll ? [] : all }));
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {(newJob.eligibleBranches || []).length === STANDARD_MATCHER_BRANCHES.length ? 'Deselect All' : 'Select All Branches'}
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto', padding: '0.5rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  {STANDARD_MATCHER_BRANCHES.map((br) => {
                    const checked = (newJob.eligibleBranches || []).includes(br);
                    return (
                      <label key={br} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer', color: checked ? 'var(--color-primary)' : 'var(--color-text-body)', fontWeight: checked ? 600 : 400 }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBranchMatch(br)}
                        />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{br}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <button type="button" onClick={() => setShowJobModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditingJob ? 'Save Changes' : 'Publish Recruitment & Specs'}
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL: PUBLISH RESULT */}
        <Modal
          isOpen={showResultModal}
          onClose={() => setShowResultModal(false)}
          title="Publish Official Exam Result"
        >
          <form onSubmit={handleCreateResult}>
            <div className="form-group">
              <label className="form-label">Examination Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Indian Airforce AFCAT 02/2026 Batch Recruitment Result"
                value={newResult.title}
                onChange={(e) => setNewResult({ ...newResult, title: e.target.value })}
                required
              />
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Authority / Commission *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Air Force Common Admission Test (AFCAT)"
                  value={newResult.organization}
                  onChange={(e) => setNewResult({ ...newResult, organization: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Result Stage / Type</label>
                <select
                  className="form-control"
                  value={newResult.resultType}
                  onChange={(e) => setNewResult({ ...newResult, resultType: e.target.value })}
                >
                  <option value="Final Merit List">Final Merit List</option>
                  <option value="Prelims / Tier-1 Result">Prelims / Tier-1 Result</option>
                  <option value="Mains / Tier-2 Result">Mains / Tier-2 Result</option>
                  <option value="Interview / PET Shortlist">Interview / PET Shortlist</option>
                  <option value="Cut-Off Marks & Scorecard">Cut-Off Marks & Scorecard</option>
                </select>
              </div>
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Declaration Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={newResult.declaredDate}
                  onChange={(e) => setNewResult({ ...newResult, declaredDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cutoff Marks Overview</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ALL: 135.0 | AE(L): 115.0 | AE(M): 85.0"
                  value={newResult.cutoffMarks}
                  onChange={(e) => setNewResult({ ...newResult, cutoffMarks: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Official Merit List / Portal PDF URL *</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://afcat.edcil.co.in/ or https://domain.gov.in/result.pdf"
                value={newResult.pdfUrl}
                onChange={(e) => setNewResult({ ...newResult, pdfUrl: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gazette Description / Remarks</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Official notes regarding normalized marks, qualifying standards, or tie-breaking criteria..."
                value={newResult.description}
                onChange={(e) => setNewResult({ ...newResult, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Next Stage / Document Verification Schedule</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Details on AFSB interview reporting dates, medical examination, or document verification..."
                value={newResult.nextStageInfo}
                onChange={(e) => setNewResult({ ...newResult, nextStageInfo: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <input
                type="checkbox"
                id="resultIsPublished"
                checked={newResult.isPublished}
                onChange={(e) => setNewResult({ ...newResult, isPublished: e.target.checked })}
              />
              <label htmlFor="resultIsPublished" style={{ fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                Publish immediately to homepage and official result stream
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowResultModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Publish Result
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL: PUBLISH ADMIT CARD */}
        <Modal
          isOpen={showAdmitModal}
          onClose={() => setShowAdmitModal(false)}
          title="Publish Official Admit Card Notice"
        >
          <form onSubmit={handleCreateAdmitCard}>
            <div className="form-group">
              <label className="form-label">Exam Hall Ticket Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. IBPS PO Tier 1 Hall Ticket / Admit Card"
                value={newAdmitCard.title}
                onChange={(e) => setNewAdmitCard({ ...newAdmitCard, title: e.target.value })}
                required
              />
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Authority / Commission *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Institute of Banking Personnel Selection (IBPS)"
                  value={newAdmitCard.organization}
                  onChange={(e) => setNewAdmitCard({ ...newAdmitCard, organization: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Issuance Status</label>
                <select
                  className="form-control"
                  value={newAdmitCard.status}
                  onChange={(e) => setNewAdmitCard({ ...newAdmitCard, status: e.target.value })}
                >
                  <option value="AVAILABLE">AVAILABLE (Active Download)</option>
                  <option value="RELEASED">RELEASED (Recently Issued)</option>
                  <option value="SCHEDULED">SCHEDULED (Exam Dates Announced)</option>
                  <option value="POSTPONED">POSTPONED</option>
                </select>
              </div>
            </div>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Exam Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={newAdmitCard.examDate}
                  onChange={(e) => setNewAdmitCard({ ...newAdmitCard, examDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Release / Availability Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={newAdmitCard.releaseDate}
                  onChange={(e) => setNewAdmitCard({ ...newAdmitCard, releaseDate: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Official Download Portal Link *</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://ibps.in/hallticket or official board URL"
                value={newAdmitCard.downloadUrl}
                onChange={(e) => setNewAdmitCard({ ...newAdmitCard, downloadUrl: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Exam Center & Hall Ticket Instructions</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="e.g. Bring original Aadhaar Card / Voter ID, 2 passport size photos, and printed ballpoint pen..."
                value={newAdmitCard.instructions}
                onChange={(e) => setNewAdmitCard({ ...newAdmitCard, instructions: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <input
                type="checkbox"
                id="admitIsPublished"
                checked={newAdmitCard.isPublished}
                onChange={(e) => setNewAdmitCard({ ...newAdmitCard, isPublished: e.target.checked })}
              />
              <label htmlFor="admitIsPublished" style={{ fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                Publish immediately to homepage and admit card repository
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowAdmitModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Publish Admit Card
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL: ASSIGN SPECIALIST */}
        <Modal
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          title="Dispatch Desk Specialist & Meeting Link"
        >
          <div>
            {selectedSession?.isUrgent && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                color: '#991B1B',
                marginBottom: '1rem'
              }}>
                <strong>⚡ Priority / Urgent Request (₹{selectedSession.priorityFee || 99}):</strong>
                <div>Candidate Deadline Note: "{selectedSession.urgencyReason}"</div>
              </div>
            )}

            {agentsList.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ marginBottom: '0.35rem', display: 'block' }}>
                  Pick Available Specialist (Live Status):
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '120px', overflowY: 'auto' }}>
                  {agentsList.map((ag) => {
                    const isIdle = ag.profile?.agentStatus !== 'ASSISTING';
                    const name = ag.profile?.fullName || ag.email;
                    const isPicked = agentName === name;
                    return (
                      <button
                        type="button"
                        key={ag.id}
                        onClick={() => setAgentName(name)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isPicked ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                          backgroundColor: isPicked ? 'var(--color-primary-subtle)' : isIdle ? '#F0FDF4' : '#FEF2F2',
                          color: isPicked ? 'var(--color-primary)' : 'var(--color-text-title)',
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: isIdle ? '#10B981' : '#EF4444',
                          display: 'inline-block'
                        }} />
                        <strong>{name}</strong>
                        <span style={{ fontSize: '0.7rem', color: isIdle ? '#16A34A' : '#DC2626', fontWeight: 600 }}>
                          ({isIdle ? 'Idle' : 'Busy'})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Specialist Desk Officer Name *</label>
              <input
                type="text"
                className="form-control"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Click an agent above or enter name..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Google Meet / Video Conference Link</label>
              <input
                type="url"
                className="form-control"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setSelectedSession(null)} className="btn btn-outline">
                Cancel
              </button>
              <button type="button" onClick={handleAssignSpecialist} className="btn btn-primary">
                Confirm Allocation
              </button>
            </div>
          </div>
        </Modal>

        {/* MODAL: RESOLVE FEEDBACK */}
        <Modal
          isOpen={!!selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          title="Respond to Candidate Grievance"
        >
          <div>
            <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
              <strong>Grievance:</strong> {selectedFeedback?.subject}
              <div style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                "{selectedFeedback?.message}"
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Official Resolution Note</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Detail resolution steps taken or instructions for candidate..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setSelectedFeedback(null)} className="btn btn-outline">
                Cancel
              </button>
              <button type="button" onClick={handleResolveFeedback} className="btn btn-primary">
                Mark Resolved
              </button>
            </div>
          </div>
        </Modal>

        {/* MODAL: CREATE DESK AGENT (Admin Only) */}
        <Modal
          isOpen={showAgentModal}
          onClose={() => setShowAgentModal(false)}
          title="Create Official Desk Agent Account"
        >
          <form onSubmit={handleCreateAgent}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Only master administrators can create desk agents. Agents receive credentials to log in and manage candidate assistance sessions.
            </p>

            <div className="form-group">
              <label className="form-label">Desk Agent Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Desk Officer Ramesh Verma"
                value={newAgent.fullName}
                onChange={(e) => setNewAgent({ ...newAgent, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Portal / Agency Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="officer.verma@recruitment.gov.in"
                value={newAgent.email}
                onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Temporary Account Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={newAgent.password}
                onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Desk Contact Mobile Number (Optional)</label>
              <input
                type="tel"
                className="form-control"
                placeholder="10-digit mobile number"
                value={newAgent.phone}
                onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setShowAgentModal(false)}
                className="btn btn-outline"
                disabled={agentSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={agentSubmitting}
              >
                <UserCheck size={16} />
                <span>{agentSubmitting ? 'Creating Agent...' : 'Create Desk Agent'}</span>
              </button>
            </div>
          </form>
        </Modal>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .modal-grid { grid-template-columns: 1fr !important; }
          .modal-grid > div { grid-column: span 1 !important; }
        }
      `}</style>
    </div>
  );
};
