import React, { useState, useEffect } from 'react';
import { agentApi } from '../../api/agent.api';
import { adminApi } from '../../api/admin.api';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../utils/socket';
import { 
  Headphones, 
  Video, 
  CheckCircle2, 
  Clock, 
  FileText, 
  FileCheck,
  ShieldAlert, 
  ExternalLink, 
  UserCheck, 
  Upload, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Search,
  Save,
  Plus,
  Award,
  CheckSquare,
  Briefcase,
  X
} from 'lucide-react';
import { Modal } from '../../components/Modal';

const STANDARD_MATCHER_DEGREES = [
  'B.Tech / B.E. (Bachelor of Technology / Engineering)',
  'M.Tech / M.E. (Master of Technology / Engineering)',
  'B.Sc (Bachelor of Science)',
  'M.Sc (Master of Science)',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'B.Com (Bachelor of Commerce)',
  'M.Com (Master of Commerce)',
  'B.A. (Bachelor of Arts)',
  'M.A. (Master of Arts)',
  'BBA / BMS (Business Administration / Management)',
  'MBA / PGDM (Master of Business Administration)',
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

const WORKFLOW_STAGES = [
  { key: 'draft', label: 'Draft Created' },
  { key: 'session_booked', label: 'Session Booked' },
  { key: 'agent_assigned', label: 'Agent Assigned' },
  { key: 'documents_verified', label: 'Documents Verified' },
  { key: 'form_filling', label: 'Form Filling & Preview' },
  { key: 'candidate_consent', label: 'Candidate Consent' },
  { key: 'official_submission', label: 'Official Submission' }
];

const getApplicationStageIndex = (appStatus) => {
  if (!appStatus) return 2;
  const s = String(appStatus).toUpperCase();
  if (s === 'INTERESTED' || s === 'DRAFT') return 0;
  if (s === 'SCHEDULED' || s === 'ASSISTANCE_REQUESTED' || s === 'PAYMENT_PENDING' || s === 'PAYMENT_COMPLETED' || s === 'URGENT_PENDING_REVIEW') return 1;
  if (s === 'ASSIGNED' || s === 'IN_PROGRESS' || s === 'AGENT_ASSIGNED') return 2;
  if (s === 'VERIFICATION_REQUIRED' || s === 'DOCUMENTS_VERIFIED') return 3;
  if (s === 'FORM_FILLING' || s === 'FORM_FILLED' || s === 'READY_FOR_REVIEW') return 4;
  if (s === 'CANDIDATE_AUTHORIZATION_PENDING' || s === 'CANDIDATE_CONSENT' || s === 'SUBMISSION_AUTHORIZED') return 5;
  if (s === 'SUBMITTED' || s === 'ADMIT_CARD_AVAILABLE' || s === 'EXAM_COMPLETED' || s === 'RESULT_AVAILABLE' || s === 'COMPLETED') return 6;
  return 2;
};

const getApplicationStageInfo = (appStatus) => {
  const s = String(appStatus || '').toUpperCase();
  switch (s) {
    case 'INTERESTED':
    case 'DRAFT':
      return { label: 'Draft Created', badgeClass: 'badge-neutral', stageNum: 1 };
    case 'SCHEDULED':
    case 'ASSISTANCE_REQUESTED':
    case 'PAYMENT_PENDING':
    case 'PAYMENT_COMPLETED':
      return { label: 'Session Booked', badgeClass: 'badge-primary', stageNum: 2 };
    case 'ASSIGNED':
    case 'IN_PROGRESS':
    case 'AGENT_ASSIGNED':
      return { label: 'Agent Assigned', badgeClass: 'badge-primary', stageNum: 3 };
    case 'VERIFICATION_REQUIRED':
    case 'DOCUMENTS_VERIFIED':
      return { label: 'Documents Verified', badgeClass: 'badge-primary', stageNum: 4 };
    case 'FORM_FILLING':
    case 'FORM_FILLED':
    case 'READY_FOR_REVIEW':
      return { label: 'Form Filling & Previewed', badgeClass: 'badge-primary', stageNum: 5 };
    case 'CANDIDATE_AUTHORIZATION_PENDING':
      return { label: 'Awaiting Candidate Consent', badgeClass: 'badge-urgent', stageNum: 6 };
    case 'SUBMISSION_AUTHORIZED':
      return { label: 'Consent Granted by Candidate', badgeClass: 'badge-official', stageNum: 6 };
    case 'SUBMITTED':
    case 'COMPLETED':
      return { label: 'Officially Submitted', badgeClass: 'badge-official', stageNum: 7 };
    default:
      return { label: s ? s.replace(/_/g, ' ') : 'Agent Assigned', badgeClass: 'badge-primary', stageNum: 3 };
  }
};

export const AgentDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'applications' | 'history'
  const [agentStatus, setAgentStatus] = useState(user?.profile?.agentStatus || 'IDLE');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Workbench active session
  const [activeSession, setActiveSession] = useState(null);
  const [meetingUrlInput, setMeetingUrlInput] = useState('');
  const [agentNotes, setAgentNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Document receipt modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  // Specialist Publishing Modals
  const [showJobModal, setShowJobModal] = useState(false);
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
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

  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Table Helpers for Job Specs
  const addTable = () => {
    const newTable = {
      title: 'Vacancy & Salary Details',
      rows: [
        { key: 'Post Code', value: '' },
        { key: 'Pay Scale', value: 'Level-7 (₹44,900 - ₹1,42,400)' },
      ],
    };
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
        loadMyJobs();
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.errors?.map((e) => `${e.field || ''}: ${e.message}`).join(', ') ||
        err.response?.data?.message ||
        'Failed to save recruitment notice';
      alert(`Error saving job: ${errMsg}`);
    }
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
    setNewJob({
      title: job.title || '',
      organization: job.organization || '',
      department: job.department || '',
      category: job.category || 'Central',
      qualification: job.qualification || 'Graduate',
      vacancies: job.vacancies !== null && job.vacancies !== undefined ? job.vacancies : '',
      lastDate: job.applicationLastDate ? job.applicationLastDate.split('T')[0] : '',
      fee: job.applicationFee !== undefined ? job.applicationFee : 100,
      officialUrl: job.officialApplicationUrl || job.officialNotificationUrl || '',
      description: job.description || '',
      tables: parsedTables,
      eligibleDegrees: Array.isArray(job.eligibleDegrees) ? job.eligibleDegrees : [],
      eligibleBranches: Array.isArray(job.eligibleBranches) ? job.eligibleBranches : [],
    });
    setShowJobModal(true);
  };

  const loadMyJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await adminApi.getJobs({ myOnly: 'true' });
      if (res.data?.success) {
        setMyJobs(res.data.data?.jobs || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load specialist recruitments:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleCreateResult = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createResult(newResult);
      setNotification('Result notice successfully published to gazette stream!');
      setShowResultModal(false);
      setNewResult({
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
      setNewAdmitCard({
        title: '',
        organization: '',
        examDate: '',
        releaseDate: new Date().toISOString().split('T')[0],
        downloadUrl: '',
        instructions: 'Candidates must carry a printed hall ticket and valid original Government photo ID proof to the exam center.',
        status: 'AVAILABLE',
        isPublished: true,
      });
    } catch (err) {
      alert('Failed to create admit card');
    }
  };

  useEffect(() => {
    loadData();

    const socket = getSocket();
    socket.emit('join_agents');

    const handleRealtimeUpdate = () => {
      // Silently refresh sessions, desk metrics, and applications without disrupting agent typing
      loadData(true);
    };

    socket.on('application_updated', handleRealtimeUpdate);
    socket.on('assistance_updated', handleRealtimeUpdate);

    return () => {
      socket.off('application_updated', handleRealtimeUpdate);
      socket.off('assistance_updated', handleRealtimeUpdate);
    };
  }, []);

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [dashRes, sessionsRes, appsRes] = await Promise.all([
        agentApi.getDashboard(),
        agentApi.getSessions({ limit: 50 }),
        agentApi.getApplications({ limit: 50 }),
      ]);

      if (dashRes.data?.success) {
        setDashboardData(dashRes.data.data);
        if (dashRes.data.data.agentStatus) {
          setAgentStatus(dashRes.data.data.agentStatus);
        }
      }
      if (sessionsRes.data?.success) {
        const list = sessionsRes.data.data.sessions || [];
        setSessions(list);
        if (list.length > 0 && !activeSession) {
          setActiveSession(list[0]);
          setMeetingUrlInput(list[0].meetingLink || list[0].meetingUrl || '');
          setAgentNotes(list[0].notes || '');
        }
      }
      if (appsRes.data?.success) {
        setApplications(appsRes.data.data.applications || []);
      }
      await loadMyJobs();
    } catch (err) {
      console.error('Failed to load agent dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (newStatus) => {
    if (updatingStatus || agentStatus === newStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await agentApi.updateAvailability({ agentStatus: newStatus });
      if (res.data?.success) {
        setAgentStatus(newStatus);
        setNotification(`Live Desk status updated to ${newStatus === 'IDLE' ? 'IDLE (Available for candidate bookings)' : 'ASSISTING (Busy on live desk call)'}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update agent status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSelectSession = (session) => {
    setActiveSession(session);
    setMeetingUrlInput(session.meetingLink || session.meetingUrl || '');
    setAgentNotes(session.notes || '');
  };

  const handleUpdateMeetingUrl = async () => {
    if (!activeSession) return;
    try {
      const url = (meetingUrlInput || '').trim();
      await agentApi.updateSession(activeSession.id, { meetingUrl: url, meetingLink: url });
      setActiveSession(prev => prev ? { ...prev, meetingUrl: url, meetingLink: url } : prev);
      setNotification('Meeting URL updated and saved!');
      loadData();
    } catch (err) {
      alert('Failed to update meeting link');
    }
  };

  const handleSaveNotes = async () => {
    if (!activeSession || savingNotes) return;
    setSavingNotes(true);
    try {
      await agentApi.updateSession(activeSession.id, { notes: agentNotes });
      setNotification('Specialist verification notes saved.');
      loadData();
    } catch (err) {
      alert('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleUpdateSessionStatus = async (status) => {
    if (!activeSession) return;
    try {
      await agentApi.updateSession(activeSession.id, { status });
      setNotification(`Session marked as ${status}`);
      if (status === 'IN_PROGRESS') {
        handleToggleStatus('ASSISTING');
      } else if (status === 'COMPLETED') {
        handleToggleStatus('IDLE');
      }
      loadData();
    } catch (err) {
      alert('Could not update session status');
    }
  };

  const handleAdvanceStage = async (appId, newStatus) => {
    try {
      const res = await agentApi.updateApplicationStage(appId, {
        status: newStatus,
        remarks: `Advanced to ${newStatus} by Desk Specialist ${user?.name || user?.email}`,
      });
      setNotification(`Candidate application stage advanced to: ${newStatus.replace(/_/g, ' ')}`);
      if (res.data?.data?.application) {
        const updatedApp = res.data.data.application;
        setActiveSession(prev => prev ? {
          ...prev,
          application: {
            ...(prev.application || {}),
            ...updatedApp,
            status: updatedApp.status
          }
        } : prev);
        setSessions(prev => prev.map(s => {
          if (s.id === activeSession?.id || s.applicationId === appId || s.application?.id === appId) {
            return {
              ...s,
              application: {
                ...(s.application || {}),
                ...updatedApp,
                status: updatedApp.status
              }
            };
          }
          return s;
        }));
      }
      loadData();
    } catch (err) {
      console.error('Failed to advance application stage:', err);
      alert(err.response?.data?.message || 'Could not advance application stage');
    }
  };

  const handleUploadReceipt = async (e) => {
    e.preventDefault();
    if (uploadingReceipt) return;
    if (!activeSession?.applicationId && !activeSession?.id) return;
    const targetId = activeSession.applicationId || activeSession.id;

    setUploadingReceipt(true);
    const formData = new FormData();
    if (receiptFile) formData.append('receipt', receiptFile);
    if (applicationNumber) formData.append('applicationNumber', applicationNumber);

    try {
      await agentApi.completeSubmission(targetId, formData);
      setNotification('Official board submission receipt successfully uploaded and finalized!');
      setShowReceiptModal(false);
      loadData();
    } catch (err) {
      alert('Failed to upload submission receipt');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const candidate = s.user || s.User;
    const name = candidate?.profile?.fullName || candidate?.email || '';
    const jobTitle = s.job?.title || s.Job?.title || s.customExamTitle || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || jobTitle.toLowerCase().includes(query);
  });

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <Headphones size={16} /> APPLICATION ASSISTANCE SPECIALIST WORKBENCH
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: 0 }}>
              Desk Agent Live Console
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
              Officer: <strong>{user?.name || user?.email}</strong> • Assigned Sector: Central & State Public Commissions
            </p>

            {/* Live Availability Toggle: Idle (Green) vs Assisting (Red) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-title)' }}>
                Desk Availability:
              </span>
              <div style={{
                display: 'inline-flex',
                backgroundColor: '#F3F4F6',
                padding: '0.25rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                gap: '0.25rem'
              }}>
                <button
                  type="button"
                  onClick={() => handleToggleStatus('IDLE')}
                  disabled={updatingStatus}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: updatingStatus ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: agentStatus === 'IDLE' ? '#10B981' : 'transparent',
                    color: agentStatus === 'IDLE' ? '#FFFFFF' : '#4B5563',
                    boxShadow: agentStatus === 'IDLE' ? '0 1px 3px rgba(16, 185, 129, 0.4)' : 'none',
                  }}
                  title="Mark yourself Idle & ready to accept assistance requests"
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: agentStatus === 'IDLE' ? '#FFFFFF' : '#10B981',
                    display: 'inline-block'
                  }} />
                  <span>Idle (Available)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleStatus('ASSISTING')}
                  disabled={updatingStatus}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.9rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: updatingStatus ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                    backgroundColor: agentStatus === 'ASSISTING' ? '#EF4444' : 'transparent',
                    color: agentStatus === 'ASSISTING' ? '#FFFFFF' : '#4B5563',
                    boxShadow: agentStatus === 'ASSISTING' ? '0 1px 3px rgba(239, 68, 68, 0.4)' : 'none',
                  }}
                  title="Mark yourself Assisting & busy with candidate session"
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: agentStatus === 'ASSISTING' ? '#FFFFFF' : '#EF4444',
                    display: 'inline-block'
                  }} />
                  <span>Assisting (Busy)</span>
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={handleOpenCreateJob}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={15} /> Publish Job
            </button>
            <button
              onClick={() => setShowResultModal(true)}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Award size={15} /> Publish Result
            </button>
            <button
              onClick={() => setShowAdmitModal(true)}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <FileText size={15} /> Publish Admit Card
            </button>
            <button
              onClick={loadData}
              className="btn btn-ghost btn-sm"
              style={{ border: '1px solid var(--color-border)' }}
            >
              Sync Live Queue
            </button>
            {(activeSession?.meetingLink || activeSession?.meetingUrl) && (
              <a
                href={activeSession.meetingLink || activeSession.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <Video size={16} /> Open Candidate Meet
                <ExternalLink size={13} />
              </a>
            )}
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

        {/* Live Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>ASSIGNED APPLICANTS</span>
              <UserCheck size={18} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }} className="tabular-nums">
              {dashboardData?.totalAssignedSessions || sessions.length || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Total scheduled sessions in your roster
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>ACTIVE SESSIONS</span>
              <Video size={18} color="var(--color-secondary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-secondary)' }} className="tabular-nums">
              {dashboardData?.inProgressSessions || sessions.filter(s => s.status === 'IN_PROGRESS').length || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
              Desk calls currently live
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>COMPLETED SUBMISSIONS</span>
              <CheckCircle2 size={18} color="var(--color-accent)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent)' }} className="tabular-nums">
              {dashboardData?.completedSessions || sessions.filter(s => s.status === 'COMPLETED').length || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.2rem' }}>
              Successfully verified & submitted
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>QUEUED FOR TODAY</span>
              <Clock size={18} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-title)' }} className="tabular-nums">
              {sessions.filter(s => s.status === 'SCHEDULED').length || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Upcoming desk slots awaiting connection
            </div>
          </div>
        </div>

        {/* WORKBENCH SECTION */}
        {/* WORKBENCH SECTION */}
        {activeSession && (() => {
          const candidateApp = activeSession.application;
          const appStatus = candidateApp?.status || (activeSession.status === 'COMPLETED' ? 'SUBMITTED' : 'IN_PROGRESS');
          const stageIndex = getApplicationStageIndex(appStatus);
          const stageInfo = getApplicationStageInfo(appStatus);
          const targetAppId = candidateApp?.id || activeSession.applicationId || activeSession.id;
          const candidateUser = activeSession.user || activeSession.User || candidateApp?.user;

          return (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              marginBottom: '2.5rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">ACTIVE WORKBENCH APPLICANT</span>
                    <span className="badge badge-neutral">Ref ID: {activeSession.id.slice(0, 8)}</span>
                    <span className={`badge ${activeSession.status === 'IN_PROGRESS' ? 'badge-urgent' : 'badge-official'}`}>
                      Desk Call: {activeSession.status || 'SCHEDULED'}
                    </span>
                    <span className={`badge ${stageInfo.badgeClass}`} style={{ fontWeight: 700 }}>
                      Stage {stageInfo.stageNum}/7: {stageInfo.label}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', margin: 0 }}>
                    Candidate: {candidateUser?.profile?.fullName || candidateUser?.email || 'Registered Aspirant'}
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    Target Exam: <strong>{activeSession.customExamTitle || activeSession.job?.title || activeSession.Job?.title || 'Public Recruitment Examination'}</strong> {activeSession.job?.organization || activeSession.Job?.organization ? `(${activeSession.job?.organization || activeSession.Job?.organization})` : '(Custom Candidate Exam)'}
                  </div>
                  {activeSession.isUrgent && (
                    <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #F87171', fontWeight: 700, fontSize: '0.75rem' }}>
                        ⚡ PRIORITY / URGENT (₹{activeSession.priorityFee || 99})
                      </span>
                      {activeSession.urgencyReason && (
                        <span style={{ fontSize: '0.8rem', color: '#991B1B' }}>
                          <strong>Urgent Note:</strong> "{activeSession.urgencyReason}"
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Status Controls */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {activeSession.status !== 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleUpdateSessionStatus('IN_PROGRESS')}
                      className="btn btn-secondary btn-sm"
                    >
                      <Video size={15} /> Start Desk Session
                    </button>
                  )}
                  {activeSession.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleUpdateSessionStatus('COMPLETED')}
                      className="btn btn-primary btn-sm"
                    >
                      <CheckCircle2 size={15} /> Mark Session Finished
                    </button>
                  )}
                  <button
                    onClick={() => setShowReceiptModal(true)}
                    className="btn btn-outline btn-sm"
                  >
                    <Upload size={14} /> Upload Submission Slip
                  </button>
                </div>
              </div>

              {/* CANDIDATE APPLICATION STATUS JOURNEY STEPPER */}
              <div style={{
                backgroundColor: 'var(--color-surface-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                padding: '1.25rem 1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} color="var(--color-primary)" />
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)', margin: 0, fontWeight: 700 }}>
                      Candidate Application Status Journey
                    </h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Current Status:</span>
                    <span className={`badge ${stageInfo.badgeClass}`} style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      Stage {stageInfo.stageNum} of 7: {stageInfo.label}
                    </span>
                    {String(appStatus).toUpperCase() === 'CANDIDATE_AUTHORIZATION_PENDING' && (
                      <span className="badge badge-urgent" style={{ fontSize: '0.75rem', animation: 'pulse 2s infinite' }}>
                        ⏳ Awaiting Candidate Consent
                      </span>
                    )}
                    {String(appStatus).toUpperCase() === 'SUBMISSION_AUTHORIZED' && (
                      <span className="badge badge-official" style={{ fontSize: '0.75rem' }}>
                        ✓ Consent Authorized by Candidate
                      </span>
                    )}
                  </div>
                </div>

                {/* Stepper Track Visualization */}
                <div style={{ margin: '1rem 0 0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                    {/* Background Track Line */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '25px',
                      right: '25px',
                      height: '3px',
                      backgroundColor: 'var(--color-border)',
                      zIndex: 0
                    }} />

                    {/* Active Progress Line */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '25px',
                      width: `${(stageIndex / (WORKFLOW_STAGES.length - 1)) * 92}%`,
                      height: '3px',
                      backgroundColor: 'var(--color-primary)',
                      zIndex: 1,
                      transition: 'width 0.4s ease'
                    }} />

                    {WORKFLOW_STAGES.map((stage, idx) => {
                      const isCompleted = idx < stageIndex;
                      const isCurrent = idx === stageIndex;

                      return (
                        <div
                          key={stage.key}
                          style={{
                            position: 'relative',
                            zIndex: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            width: '85px'
                          }}
                        >
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? 'var(--color-accent)' : isCurrent ? 'var(--color-primary)' : '#FFFFFF',
                            border: isCompleted ? '2px solid var(--color-accent)' : isCurrent ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                            color: isCompleted || isCurrent ? '#FFFFFF' : 'var(--color-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            marginBottom: '0.35rem',
                            boxShadow: isCurrent ? '0 0 0 4px rgba(11, 37, 69, 0.18)' : 'none'
                          }}>
                            {isCompleted ? <CheckCircle2 size={15} /> : idx + 1}
                          </div>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            lineHeight: 1.2
                          }}>
                            {stage.label}
                          </span>
                          {isCurrent && (
                            <span style={{
                              fontSize: '0.62rem',
                              color: 'var(--color-primary)',
                              fontWeight: 800,
                              marginTop: '0.2rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              ● Current
                            </span>
                          )}
                          {isCompleted && (
                            <span style={{
                              fontSize: '0.6rem',
                              color: 'var(--color-accent)',
                              fontWeight: 600,
                              marginTop: '0.15rem'
                            }}>
                              ✓ Done
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* MANDATORY ETHICAL REMINDER PROMPTER */}
              <div style={{
                backgroundColor: 'var(--color-primary-subtle)',
                border: '1px solid #BFDBFE',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <ShieldAlert size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', lineHeight: 1.45 }}>
                  <strong>CRITICAL ETHICAL DIRECTIVE:</strong> Never request the applicant to share passwords, SMS OTPs, or payment card details. Instruct them to enter credentials directly on their screen while you guide data verification and certificate resizing.
                </div>
              </div>

              {/* Two-Column Workbench Data */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '1.5rem',
                alignItems: 'flex-start'
              }} className="workbench-grid">
                {/* Left Column: Stage Controller & Conference */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Meeting Link Manager */}
                  <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Video size={15} color="var(--color-primary)" />
                        Candidate Google Meet Link
                      </label>
                      <button
                        type="button"
                        onClick={() => window.open('https://meet.google.com/new', '_blank')}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}
                        title="Open Google Meet in a new tab to create a meeting room"
                      >
                        <ExternalLink size={12} style={{ marginRight: '0.25rem' }} /> Create New Meet
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="url"
                        className="form-control"
                        value={meetingUrlInput}
                        onChange={(e) => setMeetingUrlInput(e.target.value)}
                        placeholder="Paste meet link e.g. https://meet.google.com/abc-defg-hij"
                      />
                      <button
                        type="button"
                        onClick={handleUpdateMeetingUrl}
                        className="btn btn-outline btn-sm"
                      >
                        <Save size={14} /> Save Link
                      </button>
                      {(meetingUrlInput || activeSession.meetingLink || activeSession.meetingUrl) && (
                        <a
                          href={meetingUrlInput || activeSession.meetingLink || activeSession.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          Join Call
                        </a>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem', lineHeight: 1.35 }}>
                      Click <strong>Create New Meet</strong> to spin up a meeting room, copy its URL from your browser address bar, paste it here, and click <strong>Save Link</strong>. The candidate's Meet button will become active immediately.
                    </div>
                  </div>

                  {/* Live Stage Advancement Stepper */}
                  <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', margin: 0, fontWeight: 700 }}>
                        Application Workflow Controller
                      </h4>
                      <span className={`badge ${stageInfo.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                        Current: Stage {stageInfo.stageNum}/7
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      <button
                        type="button"
                        onClick={() => handleAdvanceStage(targetAppId, 'VERIFICATION_REQUIRED')}
                        className={`btn btn-sm ${stageIndex === 3 ? 'btn-primary' : 'btn-outline'}`}
                        style={{ justifyContent: 'space-between', padding: '0.65rem 0.85rem' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={15} color={stageIndex >= 4 ? 'var(--color-accent)' : 'currentColor'} />
                          <span>1. Mark Scanned Documents Verified & Ready</span>
                        </div>
                        {stageIndex >= 4 && <span className="badge badge-accent" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>✓ Verified</span>}
                        {stageIndex === 3 && <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>● Current</span>}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdvanceStage(targetAppId, 'READY_FOR_REVIEW')}
                        className={`btn btn-sm ${stageIndex === 4 ? 'btn-primary' : 'btn-outline'}`}
                        style={{ justifyContent: 'space-between', padding: '0.65rem 0.85rem' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText size={15} color={stageIndex >= 5 ? 'var(--color-accent)' : 'currentColor'} />
                          <span>2. Mark Official Board Form Filled & Previewed</span>
                        </div>
                        {stageIndex >= 5 && <span className="badge badge-accent" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>✓ Form Filled</span>}
                        {stageIndex === 4 && <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>● Current</span>}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdvanceStage(targetAppId, 'CANDIDATE_AUTHORIZATION_PENDING')}
                        className={`btn btn-sm ${String(appStatus).toUpperCase() === 'CANDIDATE_AUTHORIZATION_PENDING' ? 'btn-secondary' : 'btn-outline'}`}
                        style={{ justifyContent: 'space-between', padding: '0.65rem 0.85rem' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Sparkles size={15} />
                          <span>3. Request Candidate Consent & Authorization</span>
                        </div>
                        {String(appStatus).toUpperCase() === 'SUBMISSION_AUTHORIZED' ? (
                          <span className="badge badge-official" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>✓ Consent Granted</span>
                        ) : String(appStatus).toUpperCase() === 'CANDIDATE_AUTHORIZATION_PENDING' ? (
                          <span className="badge badge-urgent" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>⏳ Awaiting Consent</span>
                        ) : stageIndex === 5 ? (
                          <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>● Current</span>
                        ) : null}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdvanceStage(targetAppId, 'SUBMITTED')}
                        className={`btn btn-sm ${stageIndex >= 6 ? 'btn-primary' : 'btn-outline'}`}
                        style={{ justifyContent: 'space-between', padding: '0.65rem 0.85rem' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={15} />
                          <span>4. Mark Officially Submitted to Government Board</span>
                        </div>
                        {stageIndex >= 6 && <span className="badge badge-accent" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>✓ Submitted</span>}
                      </button>
                    </div>
                  </div>
                </div>

              {/* Right Column: Candidate Dossier & Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Candidate Info Card */}
                {(() => {
                  const candidate = activeSession.user || activeSession.User || activeSession.application?.user || {};
                  const prof = candidate.profile || {};
                  return (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <UserCheck size={16} color="var(--color-primary)" />
                          Candidate Profile Particulars
                        </h4>
                        {prof.profileCompletionPercentage !== undefined && prof.profileCompletionPercentage !== null && (
                          <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>
                            {prof.profileCompletionPercentage}% Profile
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        <div><strong>Full Name:</strong> {prof.fullName || candidate.fullName || candidate.name || 'Not provided'}</div>
                        <div><strong>Mobile:</strong> {prof.mobileNumber || candidate.phone || candidate.phoneNumber || 'Not provided'}</div>
                        <div><strong>Email:</strong> {candidate.email || prof.email || 'Not provided'}</div>
                        <div><strong>Category:</strong> {prof.category || 'GENERAL'}</div>
                        <div><strong>DOB & Gender:</strong> {prof.dob ? new Date(prof.dob).toLocaleDateString('en-IN') : 'DOB not set'}{prof.gender ? ` • ${prof.gender}` : ''}</div>
                        <div><strong>State & District:</strong> {prof.state || 'Not specified'}{prof.district ? `, ${prof.district}` : ''}</div>
                        <div>
                          <strong>Qualification:</strong>{' '}
                          {[prof.educationLevel, prof.degree, prof.branch].filter(Boolean).join(' - ') || prof.highestQualification || 'Graduate'}
                          {prof.passingYear ? ` (${prof.passingYear})` : ''}
                        </div>
                        {prof.disabilityStatus && (
                          <div><strong>Disability Status (PwD):</strong> Yes</div>
                        )}
                        {prof.address && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            <strong>Address:</strong> {prof.address}
                          </div>
                        )}
                        {activeSession.notes && (
                          <div style={{ marginTop: '0.35rem', color: 'var(--color-secondary)', padding: '0.5rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                            <strong>Applicant Note:</strong> "{activeSession.notes}"
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Candidate Uploaded Documents Dossier */}
                {(() => {
                  const applicantDocs = activeSession.documents || activeSession.application?.documents || [];
                  return (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <FileCheck size={16} color="var(--color-primary)" />
                          Uploaded Documents ({applicantDocs.length})
                        </h4>
                      </div>

                      {applicantDocs.length === 0 ? (
                        <div style={{
                          padding: '0.85rem',
                          backgroundColor: 'var(--color-surface-hover)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-text-muted)',
                          textAlign: 'center',
                          fontSize: '0.8rem'
                        }}>
                          No scanned documents uploaded yet by candidate.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '230px', overflowY: 'auto' }}>
                          {applicantDocs.map((doc, idx) => (
                            <div
                              key={doc.id || idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.55rem 0.75rem',
                                backgroundColor: 'var(--color-surface-hover)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                <FileText size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                                <div style={{ overflow: 'hidden' }}>
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      fontSize: '0.82rem',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '160px'
                                    }}
                                    title={doc.name}
                                  >
                                    {doc.name || `Document #${idx + 1}`}
                                  </div>
                                  {doc.size && (
                                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                      {(doc.size / 1024).toFixed(1)} KB
                                    </div>
                                  )}
                                </div>
                              </div>
                              {doc.url ? (
                                <a
                                  href={doc.url?.replace(/\.pdf\.pdf$/i, '.pdf')}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-outline btn-sm"
                                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                >
                                  <ExternalLink size={12} /> View File
                                </a>
                              ) : (
                                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>No URL</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Desk Verification Notes */}
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                    Internal Specialist Notes
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter notes on category certificate status, fee clearance, or photo adjustments..."
                    value={agentNotes}
                    onChange={(e) => setAgentNotes(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ); })()}

        {/* TAB CONTROLS */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('queue')}
              style={{
                padding: '0.75rem 1rem',
                borderBottom: activeTab === 'queue' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'queue' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: activeTab === 'queue' ? 700 : 500,
                fontSize: '0.95rem',
                marginBottom: '-2px'
              }}
            >
              Assigned Queue ({sessions.length})
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              style={{
                padding: '0.75rem 1rem',
                borderBottom: activeTab === 'applications' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'applications' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: activeTab === 'applications' ? 700 : 500,
                fontSize: '0.95rem',
                marginBottom: '-2px'
              }}
            >
              Candidate Applications ({applications.length})
            </button>

            <button
              onClick={() => setActiveTab('recruitments')}
              style={{
                padding: '0.75rem 1rem',
                borderBottom: activeTab === 'recruitments' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'recruitments' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: activeTab === 'recruitments' ? 700 : 500,
                fontSize: '0.95rem',
                marginBottom: '-2px'
              }}
            >
              My Published Notices ({myJobs.length})
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.35rem 0.75rem',
            gap: '0.5rem',
            width: '280px'
          }}>
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search candidate or job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* TAB 1: ASSIGNED QUEUE */}
        {activeTab === 'queue' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            {filteredSessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No assigned applicants in your queue right now.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {filteredSessions.map((item) => {
                  const isSelected = activeSession?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                          <span className={`badge ${item.status === 'IN_PROGRESS' ? 'badge-urgent' : item.status === 'COMPLETED' ? 'badge-official' : item.status === 'URGENT_PENDING_REVIEW' ? 'badge-urgent' : 'badge-primary'}`}>
                            {item.status === 'URGENT_PENDING_REVIEW' ? 'URGENT REVIEW' : (item.status || 'SCHEDULED')}
                          </span>
                          {(() => {
                            const itemAppStatus = item.application?.status || (item.status === 'COMPLETED' ? 'SUBMITTED' : 'IN_PROGRESS');
                            const itemStage = getApplicationStageInfo(itemAppStatus);
                            return (
                              <span className={`badge ${itemStage.badgeClass}`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                                Stage {itemStage.stageNum}/7: {itemStage.label}
                              </span>
                            );
                          })()}
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={12} /> {item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : (item.date || 'Today')}
                          </span>
                          {item.isUrgent && (
                            <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: '1px solid #F87171', fontWeight: 700, fontSize: '0.72rem' }}>
                              ⚡ URGENT (₹{item.priorityFee || 99})
                            </span>
                          )}
                        </div>

                        <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-title)', margin: '0 0 0.25rem 0' }}>
                          {(item.user || item.User)?.profile?.fullName || (item.user || item.User)?.email || 'Candidate'}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          Exam: <strong>{item.customExamTitle || item.job?.title || item.Job?.title || 'Recruitment Exam'}</strong> {item.job?.organization || item.Job?.organization ? `(${item.job?.organization || item.Job?.organization})` : '(Custom Candidate Exam)'}
                        </div>
                        {item.urgencyReason && (
                          <div style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: '0.25rem' }}>
                            <strong>Urgency Note:</strong> "{item.urgencyReason}"
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                          onClick={() => handleSelectSession(item)}
                          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                        >
                          {isSelected ? 'Currently Loaded' : 'Load into Workbench'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CANDIDATE APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Candidate</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Recruitment Exam</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Board Fee</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Registered Date</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                        {app.user?.profile?.fullName || app.user?.email || 'Candidate'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {app.job?.title || 'Civil Recruitment'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {(() => {
                          const info = getApplicationStageInfo(app.status);
                          return (
                            <span className={`badge ${info.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                              Stage {info.stageNum}/7: {info.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        ₹{app.job?.fee || 0}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)' }}>
                        {new Date(app.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleAdvanceStage(app.id, 'SUBMITTED')}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Mark Submitted
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AGENT CREATED RECRUITMENTS */}
        {activeTab === 'recruitments' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>
                  Recruitments Published by You
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Manage, update, and edit details of recruitment notices created from your specialist desk.
                </div>
              </div>
              <button onClick={handleOpenCreateJob} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Plus size={15} /> Publish New Notice
              </button>
            </div>

            {loadingJobs ? (
              <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading your notices...</p>
            ) : myJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--color-text-muted)' }}>
                <Briefcase size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                <p style={{ margin: 0, fontWeight: 500 }}>You haven't created any recruitment notices yet.</p>
                <button onClick={handleOpenCreateJob} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                  Publish Your First Notice
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Recruitment Title</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Organization</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Sector</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Last Date</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Vacancies</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Fee</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myJobs.map((job) => (
                      <tr key={job.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, maxWidth: '280px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {job.title}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>{job.organization}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{job.category || 'Central'}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', whiteSpace: 'nowrap' }}>
                          {job.applicationLastDate ? new Date(job.applicationLastDate).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          {job.vacancies !== null && job.vacancies !== undefined ? job.vacancies.toLocaleString() : 'N/A'}
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>₹{job.applicationFee ?? job.fee ?? 0}</td>
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <span className={`badge ${job.isPublished ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.72rem' }}>
                            {job.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditJob(job)}
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                          >
                            Edit
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

        {/* MODAL: UPLOAD SUBMISSION RECEIPT */}
        <Modal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          title="Upload Official Board Confirmation Slip"
        >
          <form onSubmit={handleUploadReceipt}>
            <div className="form-group">
              <label className="form-label">Official Board Application / Roll Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. SSC-2026-987654321"
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Acknowledgment PDF / Screenshot</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                required
              />
              <div className="form-helper">PDF, PNG, JPG up to 5MB</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowReceiptModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={uploadingReceipt} className="btn btn-primary">
                {uploadingReceipt ? 'Uploading...' : 'Confirm Submission'}
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL: PUBLISH / EDIT JOB (Desk Specialist) */}
        <Modal
          isOpen={showJobModal}
          onClose={() => setShowJobModal(false)}
          title={isEditingJob ? 'Edit Recruitment Notice & Specifications' : 'Publish Official Recruitment Notice'}
        >
          <form onSubmit={handleSaveJob}>
            <div className="form-group">
              <label className="form-label">Recruitment Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Staff Selection Commission CGL Examination 2026"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                required
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Conducting Authority / Commission *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. SSC, UPSC, IBPS"
                  value={newJob.organization}
                  onChange={(e) => setNewJob({ ...newJob, organization: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department / Wing</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ministry of Finance / Income Tax"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Sector / Category</label>
                <select
                  className="form-control"
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
                  className="form-control"
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
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Total Vacancies (Optional)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 17727 or blank for exam"
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
                <label className="form-label">Official Portal Fee (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={newJob.fee}
                  onChange={(e) => setNewJob({ ...newJob, fee: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Official Application / Notification URL *</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://ssc.gov.in/portal"
                value={newJob.officialUrl}
                onChange={(e) => setNewJob({ ...newJob, officialUrl: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Description & Summary</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Overview of syllabus, reservation guidelines, or selection tiers..."
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              />
            </div>

            {/* Custom Job Data Tables */}
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-title)' }}>
                  Detailed Breakdown Tables (Vacancies, Salary, Eligibility Criteria)
                </span>
                <button
                  type="button"
                  onClick={addTable}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  <Plus size={14} /> Add Table
                </button>
              </div>

              {(newJob.tables || []).length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {newJob.tables.map((tbl, tblIdx) => (
                    <div key={tblIdx} style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-control"
                          style={{ fontWeight: 600, fontSize: '0.85rem' }}
                          value={tbl.title}
                          onChange={(e) => updateTableTitle(tblIdx, e.target.value)}
                          placeholder="Table Title"
                        />
                        <button
                          type="button"
                          onClick={() => removeTable(tblIdx)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.4rem 0.6rem', color: 'var(--color-danger)' }}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {(tbl.rows || []).map((row, rowIdx) => (
                          <div key={rowIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              className="form-control"
                              style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                              placeholder="Key"
                              value={row.key}
                              onChange={(e) => updateTableRow(tblIdx, rowIdx, 'key', e.target.value)}
                            />
                            <input
                              type="text"
                              className="form-control"
                              style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
                              placeholder="Value"
                              value={row.value}
                              onChange={(e) => updateTableRow(tblIdx, rowIdx, 'value', e.target.value)}
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

            {/* Candidate Matcher Setup */}
            <div style={{ marginTop: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckSquare size={16} /> Candidate Job Matcher (Eligibility Criteria)
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Select eligible degrees and branches. Candidates matching these will see "Likely Eligible" tags.
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
                {isEditingJob ? 'Update Recruitment Notice' : 'Publish Recruitment & Specs'}
              </button>
            </div>
          </form>
        </Modal>

        {/* MODAL: PUBLISH RESULT (Desk Specialist) */}
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

        {/* MODAL: PUBLISH ADMIT CARD (Desk Specialist) */}
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
      </div>

      <style>{`
        @media (max-width: 860px) {
          .workbench-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
