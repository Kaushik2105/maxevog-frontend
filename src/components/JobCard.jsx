import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, GraduationCap, Users, Calendar, ArrowRight, Sparkles, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { useAuth } from '../context/AuthContext';
import { evaluateCandidateEligibility, ELIGIBILITY_STATUS } from '../utils/eligibility';

export const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isAgent, user } = useAuth();

  if (!job) return null;

  const isClosingSoon = () => {
    if (!job.lastDate) return false;
    const diff = new Date(job.lastDate).getTime() - new Date().getTime();
    return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000;
  };

  // Evaluate candidate eligibility against job specifications
  const matchInfo = isAuthenticated ? evaluateCandidateEligibility(user, job) : null;

  const handleApplyAssisted = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: `/assistance/book?jobId=${job.id}` } });
    }
  };

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem',
        position: 'relative',
        border: isClosingSoon() ? '1px solid var(--color-secondary-border)' : '1px solid var(--color-border)',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Top Meta Bar */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          marginBottom: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-subtle)',
              padding: '0.2rem 0.55rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              <Building2 size={13} />
              {job.organization || 'Public Commission'}
            </span>

            {matchInfo && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: matchInfo.color,
                backgroundColor: matchInfo.bgColor,
                border: `1px solid ${matchInfo.borderColor}`,
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {matchInfo.status === ELIGIBILITY_STATUS.LIKELY_ELIGIBLE && <CheckCircle2 size={12} />}
                {matchInfo.status === ELIGIBILITY_STATUS.MAY_BE_ELIGIBLE && <AlertCircle size={12} />}
                {matchInfo.status === ELIGIBILITY_STATUS.LIKELY_NOT_ELIGIBLE && <XCircle size={12} />}
                <span>{matchInfo.label}</span>
              </span>
            )}
          </div>

          <CountdownTimer targetDate={job.lastDate} compact={true} />
        </div>

        {/* Job Title */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          lineHeight: 1.35,
          marginBottom: '0.6rem',
          color: 'var(--color-text-title)'
        }}>
          <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
            {job.title}
          </Link>
        </h3>

        {/* Department / Category info */}
        {job.department && (
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)',
            marginBottom: '1rem',
            lineHeight: 1.4
          }}>
            {job.department}
          </p>
        )}

        {/* Key Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.6rem',
          padding: '0.85rem',
          backgroundColor: 'var(--color-bg)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <Users size={15} color="var(--color-text-muted)" />
            <span>
              {job.vacancies ? (
                <><strong>{job.vacancies.toLocaleString('en-IN')}</strong> Vacancies</>
              ) : (
                <strong>Exam / Merit Based</strong>
              )}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <GraduationCap size={15} color="var(--color-text-muted)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {job.qualification || 'Graduation'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <MapPin size={15} color="var(--color-text-muted)" />
            <span>{job.state || 'All India'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
            <Calendar size={15} color="var(--color-text-muted)" />
            <span>Last: {job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'TBA'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--color-border)',
        marginTop: 'auto'
      }}>
        <Link
          to={`/jobs/${job.id}`}
          className={isAdmin || isAgent ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
          style={{ flex: 1, justifyContent: 'center' }}
        >
          <span>View Specs</span>
          <ArrowRight size={14} />
        </Link>

        {/* Hide Apply Assisted button for staff (Admin / Agent) */}
        {!isAdmin && !isAgent && (
          <Link
            to={`/assistance/book?jobId=${job.id}`}
            onClick={handleApplyAssisted}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Sparkles size={14} />
            <span>Apply Assisted (₹69)</span>
          </Link>
        )}
      </div>
    </div>
  );
};
