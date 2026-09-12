import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { membershipApi } from '../api/membership.api';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Zap, 
  BellRing, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const MembershipPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isPro, user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [membershipData, setMembershipData] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentMembership();
    }
  }, [isAuthenticated]);

  const fetchCurrentMembership = async () => {
    try {
      const res = await membershipApi.getCurrentMembership();
      if (res.data?.success) {
        setMembershipData(res.data.data.membership || res.data.data);
      }
    } catch (err) {
      console.error('Failed to load membership:', err);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await membershipApi.subscribe({
        plan: 'pro_quarterly',
        durationMonths: 3,
        amount: 99
      });

      if (res.data?.success) {
        setSuccess('Congratulations! Your maxEvoG Pro Membership has been activated.');
        await refreshUser();
        fetchCurrentMembership();
      } else {
        setError(res.data?.message || 'Subscription failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed. Please try again.');
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
            <Sparkles size={16} /> MAXEVOG PRO CLUB
          </div>

          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            Elevate Your Exam Journey
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.5 }}>
            Never miss a closing date, unlock 1 complimentary desk assistance session, and enjoy priority slot allocation.
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
        <div className="card" style={{
          padding: '2.5rem',
          border: '2px solid var(--color-secondary-border)',
          position: 'relative',
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '24px',
            backgroundColor: 'var(--color-secondary)',
            color: '#FFFFFF',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            Most Popular
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                Aspirant Pro Pass
              </h2>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Full 3 Months of Continuous Assistance & Alerts
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)' }} className="tabular-nums">
                ₹99 <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/ 3 Months</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                Only ₹33 per month
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

          {/* Perks list */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }} className="perks-grid">
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ color: 'var(--color-text-title)', fontSize: '0.92rem' }}>1 Free Assisted Desk Session</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Worth ₹50. Use for any central or state recruitment.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ color: 'var(--color-text-title)', fontSize: '0.92rem' }}>Priority Weekend Slots</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Instant access to rush slots before application deadlines.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ color: 'var(--color-text-title)', fontSize: '0.92rem' }}>Multi-Channel Deadline Reminders</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>SMS & WhatsApp alerts 48h and 12h before form close.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <strong style={{ color: 'var(--color-text-title)', fontSize: '0.92rem' }}>Instant Qualification Matching</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Instant notifications when posts matching your degree open.</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {isPro ? (
            <div style={{
              backgroundColor: 'var(--color-accent-subtle)',
              border: '1px solid var(--color-accent-border)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontWeight: 700,
              color: 'var(--color-accent)'
            }}>
              Your Pro Pass is Active! Enjoy free assisted sessions and priority reminders.
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="btn btn-secondary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Zap size={18} />
              <span>{loading ? 'Processing Activation...' : 'Activate Pro Club (₹99 / 3 Months)'}</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            <ShieldCheck size={14} color="var(--color-accent)" />
            <span>Instant activation. Cancel anytime with zero auto-debit obligation.</span>
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
