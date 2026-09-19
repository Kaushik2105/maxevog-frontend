import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { proApi } from '../api/pro.api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NotificationPreferencesModal } from '../components/NotificationPreferencesModal';
import {
  Sparkles,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Send,
  Building2,
  Trash2,
  Sliders,
  Award,
  ChevronDown,
  ChevronUp,
  MapPin,
  FileCheck,
  CheckSquare,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export const ProDashboardPage = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('matched'); 
  // 'matched' | 'tracked' | 'deadlines' | 'applications' | 'assistance'

  const [loading, setLoading] = useState(true);
  const [syncingMatches, setSyncingMatches] = useState(false);
  const [proStatus, setProStatus] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [deadlineData, setDeadlineData] = useState({ deadlines: [], counts: {} });
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Application tracker filter: 'ALL' | 'TRACKED' | 'IN_PROGRESS' | 'APPLIED' | 'EXPIRED'
  const [trackerFilter, setTrackerFilter] = useState('ALL');

  useEffect(() => {
    loadProData();
  }, []);

  const loadProData = async () => {
    setLoading(true);
    try {
      const [statusRes, matchesRes, trackedRes, deadlinesRes] = await Promise.all([
        proApi.getStatus(),
        proApi.getMatchedJobs({ limit: 20 }),
        proApi.getTrackedJobs({ limit: 50 }),
        proApi.getDeadlines(),
      ]);

      if (statusRes.data?.success) {
        setProStatus(statusRes.data.data);
      }
      if (matchesRes.data?.success) {
        setMatchedJobs(matchesRes.data.data.matches || []);
      }
      if (trackedRes.data?.success) {
        setTrackedJobs(trackedRes.data.data.trackedJobs || []);
      }
      if (deadlinesRes.data?.success) {
        setDeadlineData(deadlinesRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load Pro Club dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncMatches = async () => {
    setSyncingMatches(true);
    try {
      const res = await proApi.syncMatchedJobs();
      if (res.data?.success) {
        showToast('success', res.data.message || 'Job matching synchronized with your profile!');
        setMatchedJobs(res.data.data.matches || []);
      }
    } catch (err) {
      showToast('error', 'Failed to refresh matched jobs');
    } finally {
      setSyncingMatches(false);
    }
  };

  const handleTrackJob = async (jobId) => {
    try {
      const res = await proApi.trackJob(jobId);
      if (res.data?.success) {
        showToast('success', res.data.message || 'Recruitment added to tracking list!');
        // Refresh tracked and deadlines
        const [tRes, dRes] = await Promise.all([proApi.getTrackedJobs(), proApi.getDeadlines()]);
        if (tRes.data?.success) setTrackedJobs(tRes.data.data.trackedJobs || []);
        if (dRes.data?.success) setDeadlineData(dRes.data.data);
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to track recruitment');
    }
  };

  const handleUntrackJob = async (jobId) => {
    try {
      const res = await proApi.untrackJob(jobId);
      if (res.data?.success) {
        showToast('info', 'Removed from tracked recruitments');
        setTrackedJobs((prev) => prev.filter((j) => j.jobId !== jobId));
        setDeadlineData((prev) => ({
          ...prev,
          deadlines: prev.deadlines.filter((d) => d.jobId !== jobId),
        }));
      }
    } catch (err) {
      showToast('error', 'Failed to untrack recruitment');
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      const res = await proApi.updateTrackedStatus(jobId, { status: newStatus });
      if (res.data?.success) {
        showToast('success', res.data.message || 'Application status updated');
        // Refresh tracked and deadlines
        const [tRes, dRes] = await Promise.all([proApi.getTrackedJobs(), proApi.getDeadlines()]);
        if (tRes.data?.success) setTrackedJobs(tRes.data.data.trackedJobs || []);
        if (dRes.data?.success) setDeadlineData(dRes.data.data);
      }
    } catch (err) {
      showToast('error', 'Failed to update application status');
    }
  };

  const isJobTracked = (jobId) => {
    return trackedJobs.some((t) => t.jobId === jobId);
  };

  const filteredTrackedApplications = trackedJobs.filter((item) => {
    if (trackerFilter === 'ALL') return true;
    return item.status === trackerFilter;
  });

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-secondary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }}
        />
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Loading your personalized Pro Club opportunity center...
        </div>
      </div>
    );
  }

  // Not Pro Member Prompt
  if (!proStatus?.isPro) {
    return (
      <div className="container" style={{ padding: '3.5rem 0', maxWidth: '780px' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-secondary-subtle)',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            maxEvoG Pro Club
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.5 }}>
            Personalized government recruitment matching, deadline protection reminders, personal application tracking, and 1 free desk assistance session.
          </p>
          <Link to="/membership" className="btn btn-secondary btn-lg" style={{ display: 'inline-flex', gap: '0.5rem' }}>
            <Zap size={18} />
            <span>Activate 3-Month Pro Club (₹249)</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 5rem', backgroundColor: '#F8FAFC', minHeight: 'calc(100vh - 4.5rem)' }}>
      <div className="container">
        {/* Top Header Card */}
        <div
          className="card"
          style={{
            padding: '1.75rem 2rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            marginBottom: '1.75rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    border: '1px solid #FCD34D',
                    padding: '0.2rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  <Sparkles size={13} color="#D97706" /> PRO MEMBER
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Valid until: <strong>{new Date(proStatus.subscription.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </span>
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                Opportunity & Deadline Center
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setPreferencesOpen(true)}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Sliders size={15} />
                <span>Notification Preferences</span>
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: proStatus.assistanceCredits.available ? '#ECFDF5' : '#F1F5F9',
                  border: proStatus.assistanceCredits.available ? '1px solid #A7F3D0' : '1px solid var(--color-border)',
                  color: proStatus.assistanceCredits.available ? '#047857' : 'var(--color-text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                }}
              >
                <ShieldCheck size={16} />
                <span>
                  {proStatus.assistanceCredits.available
                    ? '1 Free Assistance Session Available'
                    : 'Free Assistance Session Consumed'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Completion Prompt if incomplete */}
          {proStatus.isProfileIncomplete && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Info size={18} color="var(--color-primary)" />
                <span style={{ fontSize: '0.85rem', color: '#1E3A8A' }}>
                  Your profile is <strong>{proStatus.profileCompletionPercentage}% complete</strong>. Fill in your degree, DOB, and category to receive 100% accurate personalized match alerts.
                </span>
              </div>
              <Link to="/profile" className="btn btn-primary btn-sm" style={{ fontSize: '0.78rem' }}>
                Complete Profile
              </Link>
            </div>
          )}
        </div>

        {/* 5 Primary Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
          }}
        >
          <button
            onClick={() => setActiveTab('matched')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.75rem 1.15rem',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'matched' ? '3px solid var(--color-primary)' : '3px solid transparent',
              backgroundColor: activeTab === 'matched' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'matched' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Sparkles size={16} />
            <span>Matched For You</span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'matched' ? 'var(--color-primary-subtle)' : '#E2E8F0',
                color: activeTab === 'matched' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              }}
            >
              {matchedJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tracked')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.75rem 1.15rem',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'tracked' ? '3px solid var(--color-primary)' : '3px solid transparent',
              backgroundColor: activeTab === 'tracked' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'tracked' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Briefcase size={16} />
            <span>Tracked Jobs</span>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeTab === 'tracked' ? 'var(--color-primary-subtle)' : '#E2E8F0',
                color: activeTab === 'tracked' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              }}
            >
              {trackedJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('deadlines')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.75rem 1.15rem',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'deadlines' ? '3px solid #DC2626' : '3px solid transparent',
              backgroundColor: activeTab === 'deadlines' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'deadlines' ? '#DC2626' : 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Clock size={16} />
            <span>Upcoming Deadlines</span>
            {deadlineData.counts?.urgentCount > 0 && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  fontWeight: 800,
                }}
              >
                {deadlineData.counts.urgentCount} Urgent
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.75rem 1.15rem',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'applications' ? '3px solid var(--color-primary)' : '3px solid transparent',
              backgroundColor: activeTab === 'applications' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'applications' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Layers size={16} />
            <span>My Applications</span>
          </button>

          <button
            onClick={() => setActiveTab('assistance')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.75rem 1.15rem',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              border: 'none',
              borderBottom: activeTab === 'assistance' ? '3px solid var(--color-secondary)' : '3px solid transparent',
              backgroundColor: activeTab === 'assistance' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'assistance' ? 'var(--color-secondary)' : 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <ShieldCheck size={16} />
            <span>Pro Assistance</span>
            {proStatus.assistanceCredits.available && (
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  fontWeight: 800,
                }}
              >
                1 Free
              </span>
            )}
          </button>
        </div>

        {/* SECTION 1: MATCHED FOR YOU */}
        {activeTab === 'matched' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  Personalized Matched Recruitments
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Evaluated automatically against your education, degree, age, category, and state.
                </p>
              </div>

              <button
                onClick={handleSyncMatches}
                disabled={syncingMatches}
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={14} className={syncingMatches ? 'animate-spin' : ''} />
                <span>{syncingMatches ? 'Evaluating...' : 'Refresh Matches'}</span>
              </button>
            </div>

            {/* Official Authority Disclaimer */}
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                color: '#92400E',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Info size={16} style={{ flexShrink: 0 }} />
              <span>
                <strong>Official Notification Disclaimer:</strong> maxEvoG provides personalized matching based on candidate profile data. The official recruitment notification remains the final authority; you must verify your eligibility on the official notification before applying.
              </span>
            </div>

            {matchedJobs.length === 0 ? (
              <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Sparkles size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-title)', marginBottom: '0.5rem' }}>
                  No matches discovered yet
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Make sure your candidate profile contains your full educational degree, branch, passing year, and date of birth so our matching engine can evaluate new vacancies.
                </p>
                <Link to="/profile" className="btn btn-primary btn-sm">
                  Review & Update Profile
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
                {matchedJobs.map((item) => {
                  const job = item.job;
                  if (!job) return null;
                  const isTracked = isJobTracked(job.id);
                  const isExpanded = expandedMatchId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* Meta header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: 'var(--color-primary)',
                              backgroundColor: 'var(--color-primary-subtle)',
                              padding: '0.2rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            {job.organization || 'Public Commission'}
                          </span>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: item.matchStatus === 'LIKELY_ELIGIBLE' ? '#16A34A' : '#D97706',
                              backgroundColor: item.matchStatus === 'LIKELY_ELIGIBLE' ? '#DCFCE7' : '#FEF3C7',
                              padding: '0.15rem 0.5rem',
                              borderRadius: 'var(--radius-full)',
                            }}
                          >
                            {item.matchStatus === 'LIKELY_ELIGIBLE' ? 'Likely Eligible' : 'May Be Eligible'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.5rem', color: 'var(--color-text-title)' }}>
                          <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
                            {job.title}
                          </Link>
                        </h3>

                        {/* Key Specs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.8rem', border: '1px solid var(--color-border)' }}>
                          <div>
                            <span style={{ color: 'var(--color-text-muted)' }}>Deadline:</span>{' '}
                            <strong>{new Date(job.applicationLastDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</strong>
                          </div>
                          <div>
                            <span style={{ color: 'var(--color-text-muted)' }}>Location:</span>{' '}
                            <strong>{job.state || 'All India'}</strong>
                          </div>
                        </div>

                        {/* "Why this matches you" Collapsible */}
                        <div style={{ marginBottom: '1rem' }}>
                          <button
                            type="button"
                            onClick={() => setExpandedMatchId(isExpanded ? null : item.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: '#F1F5F9',
                              border: 'none',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Sparkles size={14} color="#D97706" /> Why this matches you ({item.reasons?.length || 0})
                            </span>
                            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                          </button>

                          {isExpanded && (
                            <div style={{ padding: '0.75rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderTop: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)', fontSize: '0.78rem' }}>
                              <ul style={{ paddingLeft: '1.1rem', margin: 0, color: 'var(--color-text-body)', lineHeight: 1.5 }}>
                                {item.reasons?.map((reason, rIdx) => (
                                  <li key={rIdx} style={{ marginBottom: '0.25rem' }}>
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="btn btn-outline btn-sm"
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          Specs & Details
                        </Link>

                        {isTracked ? (
                          <button
                            onClick={() => handleUntrackJob(job.id)}
                            className="btn btn-sm"
                            style={{ flex: 1, backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Tracking</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleTrackJob(job.id)}
                            className="btn btn-primary btn-sm"
                            style={{ flex: 1, justifyContent: 'center' }}
                          >
                            Track Deadline
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: TRACKED JOBS */}
        {activeTab === 'tracked' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  Actively Monitored Recruitments
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Track applications, receive D-7/D-3/D-1 deadline alerts, and update your personal progress.
                </p>
              </div>
            </div>

            {trackedJobs.length === 0 ? (
              <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Briefcase size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-title)', marginBottom: '0.5rem' }}>
                  No tracked recruitments yet
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Click "Track Deadline" on any recruitment card to add it to your tracking list and protect closing deadlines.
                </p>
                <button onClick={() => setActiveTab('matched')} className="btn btn-primary btn-sm">
                  Explore Matched Opportunities
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {trackedJobs.map((item) => {
                  const job = item.job;
                  if (!job) return null;

                  return (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: '1.25rem 1.5rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ flex: '1 1 320px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                          {job.organization}
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-title)', margin: '0 0 0.35rem 0' }}>
                          <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
                            {job.title}
                          </Link>
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          <span>
                            Deadline: <strong>{new Date(job.applicationLastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                          </span>
                          <span>•</span>
                          <span style={{ color: item.daysRemaining <= 3 ? '#DC2626' : 'inherit', fontWeight: item.daysRemaining <= 3 ? 700 : 500 }}>
                            {item.daysRemaining > 0 ? `${item.daysRemaining} days remaining` : item.daysRemaining === 0 ? 'Closes today!' : 'Deadline passed'}
                          </span>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div>
                          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                            APPLICATION STATUS
                          </label>
                          <select
                            value={item.status}
                            onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                            style={{
                              padding: '0.4rem 0.65rem',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              backgroundColor:
                                item.status === 'APPLIED'
                                  ? '#DCFCE7'
                                  : item.status === 'IN_PROGRESS'
                                  ? '#FEF3C7'
                                  : '#F1F5F9',
                              color:
                                item.status === 'APPLIED'
                                  ? '#16A34A'
                                  : item.status === 'IN_PROGRESS'
                                  ? '#B45309'
                                  : '#334155',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="TRACKED">Tracked / Not Applied</option>
                            <option value="IN_PROGRESS">Application In Progress</option>
                            <option value="APPLIED">Application Submitted (Stops Reminders)</option>
                          </select>
                        </div>

                        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
                          View Specs
                        </Link>

                        <button
                          onClick={() => handleUntrackJob(job.id)}
                          className="btn btn-outline btn-sm"
                          title="Untrack recruitment"
                          style={{ padding: '0.45rem', color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: UPCOMING DEADLINES (DEADLINE CENTER) */}
        {activeTab === 'deadlines' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  Urgent Deadline Center
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Monitored recruitments ordered by deadline urgency. Closest application dates appear first.
                </p>
              </div>
            </div>

            {deadlineData.deadlines.length === 0 ? (
              <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Clock size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-title)', marginBottom: '0.5rem' }}>
                  No upcoming deadlines scheduled
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Track jobs from your matched opportunities to receive urgency-sorted reminders (D-7, D-3, D-1, D-0).
                </p>
                <button onClick={() => setActiveTab('matched')} className="btn btn-primary btn-sm">
                  View Matched Jobs
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {deadlineData.deadlines.map((item) => {
                  const isApplied = item.status === 'APPLIED';

                  return (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: '1.25rem 1.5rem',
                        backgroundColor: '#FFFFFF',
                        borderLeft: `4px solid ${item.urgencyColor}`,
                        borderTop: '1px solid var(--color-border)',
                        borderRight: '1px solid var(--color-border)',
                        borderBottom: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        opacity: isApplied ? 0.75 : 1,
                      }}
                    >
                      <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: '#FFFFFF',
                              backgroundColor: item.urgencyColor,
                              padding: '0.15rem 0.55rem',
                              borderRadius: 'var(--radius-sm)',
                              letterSpacing: '0.02em',
                            }}
                          >
                            {item.daysRemaining > 0
                              ? `${item.daysRemaining} DAYS REMAINING`
                              : item.isDeadlineDay
                              ? 'CLOSES TODAY!'
                              : 'EXPIRED'}
                          </span>

                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {item.organization}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-title)', margin: '0 0 0.25rem 0' }}>
                          <Link to={`/jobs/${item.jobId}`} style={{ color: 'inherit' }}>
                            {item.title}
                          </Link>
                        </h3>

                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          Closing Date: <strong>{new Date(item.deadlineAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                          {isApplied && (
                            <span style={{ marginLeft: '0.75rem', color: '#16A34A', fontWeight: 700 }}>
                              • Application Submitted (Reminders Stopped)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {item.officialApplicationUrl && (
                          <a
                            href={item.officialApplicationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                          >
                            <span>Official Portal</span>
                            <ExternalLink size={13} />
                          </a>
                        )}

                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item.jobId, e.target.value)}
                          style={{
                            padding: '0.4rem 0.65rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            backgroundColor: isApplied ? '#DCFCE7' : '#F1F5F9',
                            color: isApplied ? '#16A34A' : 'inherit',
                          }}
                        >
                          <option value="TRACKED">Not Applied</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="APPLIED">Submitted</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: MY APPLICATIONS (PERSONAL TRACKER) */}
        {activeTab === 'applications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                  Personal Application Tracker
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Organize your government job application pipeline from discovery to submission.
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#FFFFFF', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                {['ALL', 'TRACKED', 'IN_PROGRESS', 'APPLIED'].map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setTrackerFilter(filterKey)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: trackerFilter === filterKey ? 'var(--color-primary)' : 'transparent',
                      color: trackerFilter === filterKey ? '#FFFFFF' : 'var(--color-text-body)',
                    }}
                  >
                    {filterKey === 'ALL'
                      ? 'All'
                      : filterKey === 'TRACKED'
                      ? 'Not Applied'
                      : filterKey === 'IN_PROGRESS'
                      ? 'In Progress'
                      : 'Submitted'}
                  </button>
                ))}
              </div>
            </div>

            {filteredTrackedApplications.length === 0 ? (
              <div className="card" style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <Layers size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-title)', marginBottom: '0.5rem' }}>
                  No applications in this category
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  Switch filters above or track new vacancies to organize your application progress.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {filteredTrackedApplications.map((item) => {
                  const job = item.job;
                  if (!job) return null;

                  return (
                    <div
                      key={item.id}
                      className="card"
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                            {job.organization}
                          </span>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.55rem',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor:
                                item.status === 'APPLIED'
                                  ? '#DCFCE7'
                                  : item.status === 'IN_PROGRESS'
                                  ? '#FEF3C7'
                                  : '#F1F5F9',
                              color:
                                item.status === 'APPLIED'
                                  ? '#16A34A'
                                  : item.status === 'IN_PROGRESS'
                                  ? '#B45309'
                                  : '#475569',
                            }}
                          >
                            {item.status === 'APPLIED'
                              ? 'Submitted'
                              : item.status === 'IN_PROGRESS'
                              ? 'In Progress'
                              : 'Not Applied'}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-title)', marginBottom: '0.75rem' }}>
                          <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
                            {job.title}
                          </Link>
                        </h3>

                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                          Application Closing Date: <strong>{new Date(job.applicationLastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                        <button
                          onClick={() => handleUpdateStatus(job.id, item.status === 'APPLIED' ? 'IN_PROGRESS' : 'APPLIED')}
                          className={item.status === 'APPLIED' ? 'btn btn-outline btn-sm' : 'btn btn-primary btn-sm'}
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          {item.status === 'APPLIED' ? 'Mark In Progress' : 'Mark as Submitted'}
                        </button>

                        <Link to={`/jobs/${job.id}`} className="btn btn-outline btn-sm">
                          Specs
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: PRO ASSISTANCE CREDIT */}
        {activeTab === 'assistance' && (
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <div
              className="card"
              style={{
                padding: '2.5rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: proStatus.assistanceCredits.available ? '#ECFDF5' : '#F1F5F9',
                    color: proStatus.assistanceCredits.available ? '#059669' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                    1 Complimentary Application Assistance
                  </h2>
                  <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    Included with your 3-Month Pro Club Pass (Worth ₹69)
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: proStatus.assistanceCredits.available ? '#ECFDF5' : '#F8FAFC',
                  border: proStatus.assistanceCredits.available ? '1px solid #A7F3D0' : '1px solid var(--color-border)',
                  marginBottom: '1.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: proStatus.assistanceCredits.available ? '#047857' : 'var(--color-text-title)' }}>
                    Credit Status: {proStatus.assistanceCredits.available ? 'AVAILABLE TO USE' : 'CONSUMED'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: proStatus.assistanceCredits.available ? '#10B981' : '#64748B',
                      color: '#FFFFFF',
                    }}
                  >
                    {proStatus.assistanceCredits.remaining} / 1 Remaining
                  </span>
                </div>
              </div>

              {/* How it works */}
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-title)', marginBottom: '0.75rem' }}>
                How Your Free Assistance Session Works:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <div>
                    <strong>Pick any eligible government recruitment</strong> on maxEvoG (UPSC, SSC, Railways, State PSC, Banking, etc.).
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <div>
                    <strong>Book an assisted session</strong> — your ₹69 service fee will automatically be waived to <strong>₹0</strong>.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <div>
                    <strong>A dedicated desk specialist</strong> joins a live secure screen-share session with you to review eligibility and complete your form error-free under our Zero-Credential Storage Guarantee.
                  </div>
                </div>
              </div>

              {/* Action */}
              {proStatus.assistanceCredits.available ? (
                <Link
                  to="/assistance/book"
                  className="btn btn-secondary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Sparkles size={18} />
                  <span>Book Free Assisted Application Session</span>
                </Link>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  You have already used your 1 complimentary assistance credit for this subscription period. Standard assisted sessions remain available at ₹69.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        onUpdated={loadProData}
      />
    </div>
  );
};
