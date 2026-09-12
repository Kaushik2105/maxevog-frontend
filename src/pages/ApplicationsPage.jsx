import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { applicationsApi } from '../api/applications.api';
import { 
  FileText, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Building2,
  Video
} from 'lucide-react';

export const ApplicationsPage = () => {
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [bannerMessage, setBannerMessage] = useState(location.state?.message || '');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationsApi.getMyApplications();
      if (res.data?.success) {
        const list = res.data.data.applications || res.data.data || [];
        setApplications(list);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'candidate_authorization_pending':
        return (
          <span className="badge badge-urgent" style={{ animation: 'pulse 2s infinite' }}>
            Consent Required
          </span>
        );
      case 'submitted':
      case 'verified':
        return <span className="badge badge-official">Submitted & Validated</span>;
      case 'assistance_scheduled':
        return <span className="badge badge-primary">Session Scheduled</span>;
      case 'admit_card_ready':
        return <span className="badge badge-official">Admit Card Active</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-neutral">{status?.replace(/_/g, ' ') || 'In Progress'}</span>;
    }
  };

  const filtered = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Banner for newly booked sessions */}
        {bannerMessage && (
          <div style={{
            backgroundColor: 'var(--color-accent-subtle)',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={20} />
              <span>{bannerMessage}</span>
            </div>
            <button
              onClick={() => setBannerMessage('')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-accent)' }}
            >
              Dismiss
            </button>
          </div>
        )}

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
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
              My Applications & Assisted Sessions
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
              Track real-time multi-stage status, access Google Meet assistance sessions, and grant submission consents.
            </p>
          </div>

          <Link to="/assistance/book" className="btn btn-secondary">
            <Sparkles size={16} /> Book New Assisted Session
          </Link>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'All Applications', value: 'ALL' },
            { label: 'Scheduled Sessions', value: 'assistance_scheduled' },
            { label: 'Pending My Consent', value: 'candidate_authorization_pending' },
            { label: 'Submitted', value: 'submitted' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: filterStatus === f.value ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: filterStatus === f.value ? 'var(--color-primary)' : '#FFFFFF',
                color: filterStatus === f.value ? '#FFFFFF' : 'var(--color-text-body)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="card" style={{ height: '120px', padding: '1.5rem' }}>
                <div className="skeleton" style={{ height: '1.5rem', width: '30%', marginBottom: '0.75rem' }} />
                <div className="skeleton" style={{ height: '2rem', width: '60%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((app) => {
              const jobTitle = app.Job?.title || app.jobTitle || 'Recruitment Examination';
              const org = app.Job?.organization || app.organization || 'Government Board';

              return (
                <div
                  key={app.id}
                  className="card card-interactive"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.25rem',
                    borderLeft: app.status === 'candidate_authorization_pending' ? '4px solid var(--color-secondary)' : undefined
                  }}
                >
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                      <span className="badge badge-neutral">
                        <Building2 size={12} /> {org}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-title)', marginBottom: '0.4rem' }}>
                      {jobTitle}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                      <div>
                        Ref ID: <strong style={{ color: 'var(--color-text-title)' }}>{app.applicationNumber || app.id.slice(0, 8)}</strong>
                      </div>
                      <div>
                        Applied: {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      {app.assistanceSession?.scheduledAt && (
                        <div style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Video size={14} />
                          Meet: {new Date(app.assistanceSession.scheduledAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Link
                      to={`/applications/${app.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Track Progress</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <FileText size={42} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Applications Yet</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
              Explore live government recruitment notices and book your first 1-on-1 guided desk session.
            </p>
            <Link to="/" className="btn btn-primary">
              Explore Active Recruitments
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};
