import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Lock, CheckCircle2, Heart, HelpCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-primary)',
      color: '#CBD5E1',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '0.88rem'
    }}>
      {/* Trust & Guarantee Banner */}
      <div style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2.5rem 0',
        backgroundColor: 'rgba(0, 0, 0, 0.15)'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(217, 93, 15, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FED7AA',
              flexShrink: 0
            }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                Never Miss a Deadline
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                Real-time countdown trackers, gazette updates, and proactive deadline reminders.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(21, 128, 61, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#86EFAC',
              flexShrink: 0
            }}>
              <Lock size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                Zero Credential Storage
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                We never store passwords, OTPs, or captchas during assisted sessions. You retain complete control.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#BAE6FD',
              flexShrink: 0
            }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                Candidate Consent Mandate
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                No application is submitted without explicit student preview and 1-click cryptographic consent.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FDE047',
              flexShrink: 0
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                Flat ₹50 Assistance Fee
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                Transparent ledger: Pay only official board examination fee + transparent ₹50 desk assistance charge.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Column 1: Brand & Disclaimer */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-primary)',
                fontWeight: 800,
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                mE
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>maxEvoG</span>
              <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                Startup Initiative
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '480px', marginBottom: '1rem' }}>
              maxEvoG is an independent digital portal providing clean, modern vacancy aggregation and human-guided application assistance.
            </p>
            {/* Explicit Startup Notice requested by User */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              maxWidth: '520px',
              fontSize: '0.78rem',
              color: '#CBD5E1',
              lineHeight: 1.5
            }}>
              <strong style={{ color: '#F8FAFC' }}>Transparency Notice:</strong> maxEvoG is an early-stage startup project and is <em>not affiliated with, endorsed by, or representing</em> any government agency or public recruitment board. All job notifications are curated from official public gazettes.
            </div>
          </div>

          {/* Column 2: Portals */}
          <div>
            <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              Aspirant Services
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><Link to="/" style={{ color: '#94A3B8', transition: 'color 0.2s' }}>Recruitment Explorer</Link></li>
              <li><Link to="/admit-cards" style={{ color: '#94A3B8' }}>Admit Cards & Hall Tickets</Link></li>
              <li><Link to="/results" style={{ color: '#94A3B8' }}>Exam Results & Merit Lists</Link></li>
              <li><Link to="/assistance/book" style={{ color: '#94A3B8' }}>1-on-1 Assisted Application</Link></li>
              <li><Link to="/membership" style={{ color: '#FED7AA', fontWeight: 600 }}>Pro Club (₹99 / 3 Months)</Link></li>
            </ul>
          </div>

          {/* Column 3: Trust & Support */}
          <div>
            <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
              Candidate Support
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><Link to="/feedback" style={{ color: '#94A3B8' }}>Submit Grievance / Feedback</Link></li>
              <li><a href="#privacy" style={{ color: '#94A3B8' }}>Zero-Credential Policy</a></li>
              <li><a href="#terms" style={{ color: '#94A3B8' }}>Terms of Service</a></li>
              <li><a href="#faq" style={{ color: '#94A3B8' }}>How Assistance Works</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.78rem',
          color: '#64748B'
        }}>
          <div>
            © {new Date().getFullYear()} maxEvoG Platform. Built for Indian Aspirants with integrity.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>No Passwords Stored</span>
            <span>Zero OTP Retention</span>
            <span>Candidate First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
