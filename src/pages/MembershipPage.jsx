import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { proApi } from '../api/pro.api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Zap, 
  BellRing, 
  ArrowLeft,
  AlertCircle,
  ArrowRight,
  Briefcase,
  Layers
} from 'lucide-react';

export const MembershipPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isPro, isAdmin, isAgent, user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [proData, setProData] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentProStatus();
    }
  }, [isAuthenticated]);

  const fetchCurrentProStatus = async () => {
    try {
      const res = await proApi.getStatus();
      if (res.data?.success) {
        setProData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load Pro Club status:', err);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/membership' } });
      return;
    }

    if (isAdmin || isAgent) {
      showToast('error', 'Pro Club memberships are exclusive to candidate and aspirant accounts.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await proApi.activate({
        planId: 'PRO_QUARTERLY_249',
        planName: 'maxEvoG Pro Club (Quarterly - 3 Months)',
        amount: 249,
      });

      if (res.data?.success) {
        const msg = 'Congratulations! Your maxEvoG Pro Club membership has been activated for 3 months.';
        setSuccess(msg);
        showToast('success', msg);
        await refreshUser();
        fetchCurrentProStatus();
        setTimeout(() => {
          navigate('/pro');
        }, 1200);
      } else {
        const errMsg = res.data?.message || 'Activation failed';
        setError(errMsg);
        showToast('error', errMsg);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Activation failed. Please try again.';
      setError(errMsg);
      showToast('error', errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} /> Back to Recruitments
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--color-secondary-subtle)',
            color: 'var(--color-secondary)',
            border: '1px solid var(--color-secondary-border)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>
            <Sparkles size={16} /> MAXEVOG PRO CLUB V1
          </div>

          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem', fontWeight: 800 }}>
            Personal Opportunity & Deadline Protection
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.5 }}>
            Personalized government job matching, instant qualification alerts, personal application tracker, urgency deadline reminders, and 1 free application assistance session.
          </p>
        </div>

        {success && (
          <div style={{
            backgroundColor: 'var(--color-accent-subtle)',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={20} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Pricing Card */}
        <div className="card overflow-visible" style={{
          padding: '2.5rem',
          border: '2px solid var(--color-secondary-border)',
          position: 'relative',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'visible'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '24px',
            zIndex: 10,
            backgroundColor: 'var(--color-secondary)',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 2px 6px rgba(217, 93, 15, 0.35)'
          }}>
            Candidate Pro Pass
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Aspirant Pro Pass
              </h2>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Full 3 Months of Continuous Opportunity Matching & Deadline Protection
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }} className="tabular-nums">
                ₹249 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/ 3 Months</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                Includes 1 Free Assistance Session
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

          {/* Perks list */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }} className="perks-grid">
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ color: 'var(--color-text-title)', fontSize: '0.92rem' }}>Personalized Job Matching</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Automated matching against your degree, branch, age, and reservation category with "Why this matches you" breakdowns.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ color: 'var(--color-text-title)', fontSize: '0.92rem' }}>1 Free Assisted Desk Session</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Worth ₹69. Dedicated specialist reviews eligibility and helps submit your application under zero-credential storage.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ color: 'var(--color-text-title)', fontSize: '0.92rem' }}>Multi-Channel Deadline Reminders</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>D-7, D-3, D-1, and final deadline day alerts via Email, Telegram Bot, and in-app notifications.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ color: 'var(--color-text-title)', fontSize: '0.92rem' }}>Personal Application Tracker</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Track jobs through Tracked → In Progress → Submitted. Automatic reminder cancellation upon submission.</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {isAdmin || isAgent ? (
            <div style={{
              backgroundColor: 'var(--color-primary-subtle)',
              border: '1px solid var(--color-border)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontWeight: 600,
              color: 'var(--color-primary)'
            }}>
              Staff Portal Notice: You are signed in as {isAdmin ? 'Admin' : 'Specialist Agent'}. Pro Club passes are designated for candidate / aspirant accounts.
            </div>
          ) : isPro ? (
            <div style={{
              backgroundColor: 'var(--color-accent-subtle)',
              border: '1px solid var(--color-accent-border)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--color-accent)', marginBottom: '0.75rem', fontSize: '1rem' }}>
                Your 3-Month Pro Club Membership is Active!
              </div>
              <Link to="/pro" className="btn btn-primary btn-md" style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                <span>Go to Pro Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="btn btn-secondary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Zap size={18} />
              <span>{loading ? 'Activating Pro Club...' : 'Activate Pro Club (₹249 / 3 Months)'}</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-accent)" />
            <span>Instant 3-month activation. 1 free assistance session included with zero auto-debit obligation.</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .perks-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
