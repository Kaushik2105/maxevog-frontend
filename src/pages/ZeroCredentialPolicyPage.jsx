import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  EyeOff, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Cpu,
  RefreshCw,
  FileCheck
} from 'lucide-react';

export const ZeroCredentialPolicyPage = () => {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-accent" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>
            CYBERSECURITY & DATA PRIVACY
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem', fontWeight: 800 }}>
            Zero-Credential Architecture
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '700px', margin: '0 auto' }}>
            How maxEvoG revolutionizes government recruitment assistance by eliminating credential risk. 
            We never see, record, or store your passwords, OTPs, or captchas.
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
            Privacy Standards: <strong>Zero-Trust Remote Support</strong> • WebRTC Encrypted
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              <Key size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Zero Password Storage
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.6, margin: 0 }}>
              Our servers store zero recruitment portal passwords. When logging into official portals (e.g. UPSC, SSC, IBPS), you enter your password yourself via your own browser.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-secondary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
              <Smartphone size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-secondary)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Zero OTP Interception
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.6, margin: 0 }}>
              Never read an OTP to a desk agent. When an SMS or email OTP is required, the agent releases control of the session so you enter the digits directly.
            </p>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', marginBottom: '1rem' }}>
              <EyeOff size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-accent)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Zero Captcha Solvers
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-body)', lineHeight: 1.6, margin: 0 }}>
              Official government security captchas must be validated by the applicant in person. The desk specialist pauses and waits for you to solve the captcha test.
            </p>
          </div>
        </div>

        {/* Technical Architecture Deep Dive */}
        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
          <section>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={22} /> Why Traditional Cyber Cafe Models Are Risky
            </h2>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              In conventional cyber cafes and informal form-filling kiosks, operators routinely ask candidates for written passwords, read OTPs out loud, and save sensitive identity documents on shared public computers. This leads to leaked aadhaar cards, compromised bank OTPs, and unauthorized application tampering. maxEvoG was specifically architected to eliminate this attack surface entirely through <strong>Google Chrome Remote Desktop</strong> and <strong>Zero-Credential Handoff</strong>.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Cpu size={22} /> The Chrome Remote Desktop Security Model
            </h2>
            <div style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                All assistance is rendered directly through Google's official, end-to-end encrypted remote desktop utility (<a href="https://remotedesktop.google.com/support" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>remotedesktop.google.com/support</a>):
              </p>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: 0 }}>
                <li>
                  <strong>One-Time Ephemeral Code:</strong> You generate a temporary 12-digit code on your own browser. The code expires in 5 minutes and can only be used once.
                </li>
                <li>
                  <strong>Full Candidate Observability:</strong> You watch every mouse movement, selection, and keystroke on your own screen in real time.
                </li>
                <li>
                  <strong>Instant Kill Switch:</strong> You have an on-screen "Stop Sharing" button at all times. Clicking it severs connection immediately.
                </li>
                <li>
                  <strong>WebRTC & TLS Encryption:</strong> All video and input streams are transmitted through Google's encrypted WebRTC channels.
                </li>
              </ul>
            </div>
          </section>

          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <RefreshCw size={22} /> The Sensitive Action Handoff Protocol
            </h2>
            <div style={{ backgroundColor: 'var(--color-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>1</div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>Google Meet Live Form Entry:</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Specialist inputs qualifications, post codes, exam city preferences, and documents swiftly while the candidate verifies all entries live.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'var(--color-secondary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>2</div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-secondary)' }}>Chrome Remote Desktop Handoff:</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>When the portal requests passwords, OTPs, or captchas, control is handed directly to the candidate to input credentials securely without disclosing them.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#0284C7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>3</div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#0284C7' }}>Direct Candidate Portal Payment:</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>The candidate completes the official examination fee payment directly on the recruitment portal using their own UPI/cards. maxEvoG never charges or handles portal fees.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: 'var(--color-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>4</div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-accent)' }}>Confirmation Slip & Candidate Feedback:</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>The final confirmation slip is downloaded, candidate submits rating/feedback on maxEvoG, and the assisted session concludes.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Navigation CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '2.5rem' }}>
          <Link to="/how-assistance-works" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            Visual Step-by-Step Walkthrough <ArrowRight size={15} />
          </Link>
          <Link to="/assistance/book" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            Book Assisted Form Filling (₹69) <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};
