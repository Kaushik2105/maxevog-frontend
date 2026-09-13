import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import { jobsApi } from '../../api/jobs.api';
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
  Lock
} from 'lucide-react';
import { Modal } from '../../components/Modal';

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
  const [loading, setLoading] = useState(true);

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
    description: ''
  });

  const [showResultModal, setShowResultModal] = useState(false);
  const [newResult, setNewResult] = useState({
    title: '',
    organization: '',
    declaredDate: new Date().toISOString().split('T')[0],
    cutoffMarks: 'UR: 132.5 | OBC: 124.0 | SC: 110.0',
    pdfUrl: ''
  });

  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [newAdmitCard, setNewAdmitCard] = useState({
    title: '',
    organization: '',
    examDate: '',
    releaseDate: new Date().toISOString().split('T')[0],
    downloadUrl: ''
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
        const res = await adminApi.getAllApplications({ limit: 100 });
        if (res.data?.success) {
          setApplications(res.data.data.applications || []);
        }
      } else if (activeTab === 'recruitments') {
        const res = await jobsApi.getJobs({ limit: 100 });
        if (res.data?.success) {
          setJobs(res.data.data.jobs || res.data.data || []);
        }
      } else if (activeTab === 'users') {
        const res = await adminApi.getUsers({ limit: 100 });
        if (res.data?.success) {
          setUsersList(res.data.data.users || []);
        }
      } else if (activeTab === 'assistance') {
        const res = await adminApi.getAssistanceSessions({ limit: 100 });
        if (res.data?.success) {
          setAssistanceSessions(res.data.data.sessions || res.data.data.requests || []);
        }
      } else if (activeTab === 'financials') {
        const res = await adminApi.getFinancials();
        if (res.data?.success) {
          setFinancials(res.data.data);
        }
      } else if (activeTab === 'feedback') {
        const res = await adminApi.getAllFeedbacks({ limit: 100 });
        if (res.data?.success) {
          setFeedbacks(res.data.data.feedbacks || []);
        }
      } else if (activeTab === 'agents') {
        const res = await adminApi.getAgents();
        if (res.data?.success) {
          setAgentsList(res.data.data.agents || []);
        }
      }
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await adminApi.updateUserStatus(userId, nextStatus);
      setNotification(`Candidate account status updated to ${nextStatus}`);
      loadTabData();
    } catch (err) {
      alert('Failed to update candidate account');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const res = await adminApi.createJob(newJob);
      if (res.data?.success) {
        setNotification('Official recruitment notice published successfully!');
        setShowJobModal(false);
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
          description: ''
        });
        loadTabData();
      }
    } catch (err) {
      alert('Failed to create job');
    }
  };

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
              onClick={() => setShowJobModal(true)}
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
            { key: 'applications', label: 'Master Applications', icon: Layers },
            { key: 'recruitments', label: 'Recruitments (CRUD)', icon: Briefcase },
            { key: 'assistance', label: 'Assistance Dispatch', icon: Video },
            { key: 'agents', label: 'Desk Agents', icon: UserCheck },
            { key: 'users', label: 'Candidate Accounts', icon: Users },
            { key: 'financials', label: 'Financials & Revenue', icon: IndianRupee },
            { key: 'feedback', label: 'Grievance Desk', icon: MessageSquare },
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
                  {stats?.totalUsers || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.2rem' }}>
                  +{stats?.newUsersThisMonth || 0} enrolled this month
                </div>
              </div>

              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <span>ACTIVE RECRUITMENTS</span>
                  <Briefcase size={18} color="var(--color-secondary)" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-secondary)' }} className="tabular-nums">
                  {stats?.activeJobs || 0}
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
                  {stats?.totalAssistanceSessions || 0}
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
                  ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9333EA', fontWeight: 600, marginTop: '0.2rem' }}>
                  {stats?.activePaidMembers || 0} Active Pro Passes (₹99 / 3 Mo)
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
                onClick={() => setShowJobModal(true)}
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
                        <td style={{ padding: '0.75rem 0.5rem' }} className="tabular-nums">
                          {job.vacancies ? job.vacancies.toLocaleString('en-IN') : 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                          {job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN') : 'TBA'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>₹{job.fee}</td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-border)' }}
                            title="Delete Notice"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="badge badge-primary">{session.status || 'SCHEDULED'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Ref: {session.id.slice(0, 8)}</span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-title)', margin: '0 0 0.35rem 0' }}>
                        Candidate: {session.user?.profile?.fullName || session.user?.email || 'Aspirant'}
                      </h4>

                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        Slot: <strong>{session.timeSlot?.startTime || session.timeSlot || 'Scheduled'}</strong> • Target: {session.job?.title || 'Examination'}
                      </div>

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
                      className="btn btn-primary btn-sm"
                    >
                      <Video size={14} /> Assign Specialist / Meet URL
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
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-urgent' : u.role === 'AGENT' ? 'badge-primary' : 'badge-neutral'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>{u.profile?.category || 'General'}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {u.isProMember ? <span className="badge badge-urgent">PRO</span> : <span className="badge badge-neutral">Standard</span>}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className={`badge ${u.status === 'suspended' ? 'badge-danger' : 'badge-official'}`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status || 'active')}
                          className={`btn btn-sm ${u.status === 'suspended' ? 'btn-primary' : 'btn-outline'}`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {u.status === 'suspended' ? <UserCheck size={14} /> : <UserX size={14} />}
                          <span>{u.status === 'suspended' ? 'Reactivate' : 'Suspend'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                      <th style={{ padding: '0.75rem 0.5rem' }}>Active Sessions</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Completed Sessions</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Account Status</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Created Date</th>
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
                          <span className={`badge ${ag.status === 'suspended' ? 'badge-danger' : 'badge-official'}`}>
                            {ag.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)' }}>
                          {new Date(ag.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  DESK ASSISTANCE CHARGES (₹50)
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
                  PRO CLUB MEMBERSHIPS (₹99)
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
          </div>
        )}

        {/* MODAL: PUBLISH JOB */}
        <Modal
          isOpen={showJobModal}
          onClose={() => setShowJobModal(false)}
          title="Publish Official Recruitment Notice"
          maxWidth="640px"
        >
          <form onSubmit={handleCreateJob}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="modal-grid">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Recruitment Post Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Combined Graduate Level Examination 2026"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Authority / Commission</label>
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
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Department of Personnel"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sector</label>
                <select
                  className="form-control form-select"
                  value={newJob.category}
                  onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                >
                  <option value="Central">Central Govt</option>
                  <option value="State">State Govt</option>
                  <option value="Banking">Banking & Financial</option>
                  <option value="Railways">Railways (RRB)</option>
                  <option value="Defence">Defence & Police</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Total Vacancies</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 17727"
                  value={newJob.vacancies}
                  onChange={(e) => setNewJob({ ...newJob, vacancies: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Date to Apply</label>
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

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Official Gazette / Board Portal URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://ssc.gov.in"
                  value={newJob.officialUrl}
                  onChange={(e) => setNewJob({ ...newJob, officialUrl: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowJobModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Publish Notice
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
              <label className="form-label">Examination Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Civil Services Prelims 2026 Merit List"
                value={newResult.title}
                onChange={(e) => setNewResult({ ...newResult, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Authority / Commission</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Union Public Service Commission (UPSC)"
                value={newResult.organization}
                onChange={(e) => setNewResult({ ...newResult, organization: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cutoff Marks Overview</label>
              <input
                type="text"
                className="form-control"
                value={newResult.cutoffMarks}
                onChange={(e) => setNewResult({ ...newResult, cutoffMarks: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Official PDF Merit List URL</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://upsc.gov.in/results.pdf"
                value={newResult.pdfUrl}
                onChange={(e) => setNewResult({ ...newResult, pdfUrl: e.target.value })}
              />
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
              <label className="form-label">Exam Hall Ticket Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. IBPS PO Tier 1 Hall Ticket"
                value={newAdmitCard.title}
                onChange={(e) => setNewAdmitCard({ ...newAdmitCard, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Authority / Commission</label>
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
              <label className="form-label">Exam Date</label>
              <input
                type="date"
                className="form-control"
                value={newAdmitCard.examDate}
                onChange={(e) => setNewAdmitCard({ ...newAdmitCard, examDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Official Download Portal Link</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://ibps.in/hallticket"
                value={newAdmitCard.downloadUrl}
                onChange={(e) => setNewAdmitCard({ ...newAdmitCard, downloadUrl: e.target.value })}
              />
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
            <div className="form-group">
              <label className="form-label">Specialist Desk Officer Name</label>
              <input
                type="text"
                className="form-control"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
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
