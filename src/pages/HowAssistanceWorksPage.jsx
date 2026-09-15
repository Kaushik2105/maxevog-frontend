import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Video, 
  Monitor, 
  Key, 
  FileEdit, 
  ShieldCheck, 
  FileCheck, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Headphones
} from 'lucide-react';

const STEPS = [
  {
    step: 1,
    title: 'Select Job Notice & Book Assistance Slot',
    icon: Calendar,
    color: 'var(--color-primary)',
    desc: 'Browse active Central and State government recruitment notices on maxEvoG. Click "Apply Assisted", select an available 30-minute time slot, and confirm booking for ₹69 (or ₹0 for Pro Members).'
  },
  {
    step: 2,
    title: 'Instant Desk Specialist Allocation & Google Meet Invitation',
    icon: Video,
    color: 'var(--color-secondary)',
    desc: 'Your designated recruitment desk specialist is assigned to your booking. You receive an instant Google Meet conference link in your candidate dashboard and email to connect face-to-face.'
  },
  {
    step: 3,
    title: 'Open Google Chrome Remote Desktop',
    icon: Monitor,
    color: 'var(--color-primary)',
    desc: 'On your laptop or computer, visit remotedesktop.google.com/support in Google Chrome. Under the "Share this screen" section, click "Generate Code" to create a secure, temporary connection key.',
    link: 'https://remotedesktop.google.com/support'
  },
  {
    step: 4,
    title: 'Share the One-Time 12-Digit Access Code',
    icon: Key,
    color: 'var(--color-secondary)',
    desc: 'Provide the 12-digit code to your desk specialist via the Google Meet call. The specialist connects to your browser session. You retain 100% visibility of your screen and can click "Stop Sharing" anytime.'
  },
  {
    step: 5,
    title: 'Live Form Filling & Exact Document Resizing',
    icon: FileEdit,
    color: 'var(--color-accent)',
    desc: 'The specialist enters your educational qualifications, reservation categories, post preference codes, and exam center choices. They compress photographs and signatures to exact official kilobyte specifications.'
  },
  {
    step: 6,
    title: 'Zero-Credential Handoff: Enter OTPs, Passwords & Captchas',
    icon: Lock,
    color: '#D97706',
    desc: 'When the government portal asks for your portal password, SMS OTP, visual captcha, or fee payment, the specialist halts all inputs and hands control back to you. You type your confidential secrets directly!'
  },
  {
    step: 7,
    title: 'Download Official Board Receipt & Confirmation Slip',
    icon: FileCheck,
    color: '#10B981',
    desc: 'Together, you review the application preview page. Once submitted, the official government confirmation PDF is downloaded directly to your device and mirrored to your maxEvoG application ledger.'
  }
];

export const HowAssistanceWorksPage = () => {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>
            DESK ASSISTED WORKFLOW
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem', fontWeight: 800 }}>
            How Application Assistance Works
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto' }}>
            Experience error-free government exam applications from the comfort of your home. 
            Here is our transparent, 7-step guided remote desk process.
          </p>
        </div>

        {/* Remote Desktop Banner */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '3rem',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
              <Monitor size={20} />
              Powered by Google Chrome Remote Desktop
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '600px' }}>
              We use Google's official, zero-install WebRTC remote desktop engine (<a href="https://remotedesktop.google.com/support" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>remotedesktop.google.com/support</a>) to guarantee bank-grade encrypted screen sharing without storing any candidate credentials.
            </div>
          </div>
          <a 
            href="https://remotedesktop.google.com/support" 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
          >
            Open Chrome Support Tool <ExternalLink size={15} />
          </a>
        </div>

        {/* Step-by-Step Timeline Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step} 
                className="card" 
                style={{ 
                  padding: '1.75rem', 
                  display: 'flex', 
                  gap: '1.5rem', 
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-bg)',
                  border: `2px solid ${item.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: item.color,
                  fontWeight: 800,
                  fontSize: '1.2rem'
                }}>
                  <Icon size={24} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                      STEP {item.step} OF 7
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      {item.title}
                    </h3>
                  </div>
                  <p style={{ color: 'var(--color-text-body)', lineHeight: 1.6, fontSize: '0.92rem', margin: 0 }}>
                    {item.desc}
                  </p>
                  {item.link && (
                    <div style={{ marginTop: '0.6rem' }}>
                      <a href={item.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        Visit {item.link} <ExternalLink size={13} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Callout */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>
            PEACE OF MIND GUARANTEE
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '1rem', fontWeight: 800 }}>
            Never Risk Rejection Due to Minor Form Errors
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto 1.75rem' }}>
            Over 23% of government job applications are rejected due to invalid photo formats, inverted signatures, or wrong post codes. Our desk specialists ensure zero errors before submission.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/assistance/book" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.75rem' }}>
              Book Assisted Desk Session (₹69) <ArrowRight size={16} />
            </Link>
            <Link to="/membership" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.75rem' }}>
              Join Pro Club (₹249 / 3 Months) <Sparkles size={16} color="var(--color-secondary)" />
            </Link>
          </div>
        </div>

        {/* Links to Policies */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/zero-credential-policy" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)' }}>
            <Lock size={15} /> Read Zero-Credential Architecture
          </Link>
          <Link to="/terms" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)' }}>
            <ShieldCheck size={15} /> Read Terms of Service & Conduct
          </Link>
        </div>
      </div>
    </div>
  );
};
