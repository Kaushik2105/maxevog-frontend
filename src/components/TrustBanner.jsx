import React from 'react';
import { ShieldAlert, BellRing, Lock, BadgePercent } from 'lucide-react';

export const TrustBanner = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0B2545 0%, #163A66 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.75rem 2rem',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-md)',
      marginBottom: '2.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            backgroundColor: '#D95D0F',
            color: '#FFFFFF',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            Our Core Aspirant Assurances
          </span>
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: 0, fontWeight: 700 }}>
            Radical Transparency & Candidate Security
          </h3>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
          Independent Aspirant Assistance Initiative
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FED7AA',
            flexShrink: 0
          }}>
            <BellRing size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>
              Never Miss a Deadline
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.4, margin: 0 }}>
              Live countdown timers and automated reminders prior to application closing dates.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#86EFAC',
            flexShrink: 0
          }}>
            <Lock size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>
              Zero Credential Storage
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.4, margin: 0 }}>
              We never save or ask for your recruitment passwords, SMS OTPs, or captchas.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#BAE6FD',
            flexShrink: 0
          }}>
            <BadgePercent size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>
              Fixed ₹50 Assistance
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.4, margin: 0 }}>
              No arbitrary cyber café markups. Exact government board fee + flat ₹50 desk charge.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FDE047',
            flexShrink: 0
          }}>
            <ShieldAlert size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '0.2rem' }}>
              Explicit Candidate Consent
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.4, margin: 0 }}>
              Every form is previewed by you live before final submission is digitally signed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
