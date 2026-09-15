import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  EyeOff, 
  AlertTriangle, 
  RefreshCw, 
  Scale, 
  CheckCircle2, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const TermsPage = () => {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>
            LEGAL & USAGE GOVERNANCE
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem', fontWeight: 800 }}>
            Terms and Conditions
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
            Please read these terms carefully before scheduling desk assistance or utilizing the maxEvoG platform. 
            By accessing or using our services, you agree to be bound by these legal provisions.
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
            Effective Date & Last Revised: <strong>March 2026</strong> • Version 2.4
          </div>
        </div>

        {/* Essential Highlights Banner */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '2px solid var(--color-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
            <ShieldCheck size={24} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
              The maxEvoG Core Trust & Zero-Credential Commitment
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Lock size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
                <strong>Zero Secret Storage:</strong> We NEVER ask for, store, or record your OTPs, account passwords, or visual captchas.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <EyeOff size={18} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
                <strong>Remote Handoff:</strong> When sensitive credentials or payments appear, desk specialists immediately hand over control to you.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <RefreshCw size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
                <strong>Reconnection SLA:</strong> 30-minute to 1-hour reconnection grace period in case of device reboot or internet drop.
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
          {/* Section 1 */}
          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Scale size={20} /> 1. Platform Identity & Non-Affiliation Disclaimer
            </h2>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              <strong>maxEvoG</strong> is an independent digital advisory, tracking, and application facilitation platform developed to assist candidates in navigating public service commission, defense, banking, railway, and government exam recruitment notices. maxEvoG is <strong>NOT</strong> an official government agency, public sector undertaking, or recruitment board, nor are we associated, partnered, or endorsed by UPSC, SSC, IBPS, NTA, or any State Public Service Commission. All trademarks, official logos, and examination designations referenced belong exclusively to their respective government owners.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Lock size={20} /> 2. Zero-Credential Storage & Anti-Fraud Architecture
            </h2>
            <div style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                To safeguard candidate privacy and prevent unauthorized account takeover, maxEvoG operates under a strict <strong>Zero-Credential Architecture</strong>:
              </p>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: 0 }}>
                <li>
                  <strong>No OTPs, Passwords, or Captchas Ever Requested:</strong> maxEvoG desk agents, officers, and automated systems will <em>never</em> ask candidates to dictate, email, SMS, or transmit any One-Time Passwords (OTPs), portal login passwords, net banking pins, or captcha solutions.
                </li>
                <li>
                  <strong>Chrome Remote Desktop Handoff Protocol:</strong> During live guided assistance, the desk specialist and candidate connect via Google Chrome Remote Desktop (<a href="https://remotedesktop.google.com/support" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>remotedesktop.google.com/support</a>). Whenever a government portal prompts for an OTP verification, password entry, captcha solving, or payment gateway information, the desk specialist is mandated to immediately pause all inputs and hand full browser control back to the candidate so the candidate inputs these confidential credentials directly into their own browser session.
                </li>
                <li>
                  <strong>Candidate Liability Immunity for maxEvoG:</strong> Because maxEvoG never solicits, collects, logs, or stores any candidate authentication secrets, personal passwords, or financial credentials, maxEvoG, its management, founders, and desk agents are completely absolved, released, and held harmless from any subsequent fraud, account compromises, unauthorized transactions, or cyber incidents occurring on the candidate’s personal accounts. Candidates acknowledge that they retain sole custody of their credentials at all times.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Service Fee & Direct Payment */}
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Scale size={20} /> 3. Transparent Flat ₹69 Service Charge & Direct Candidate Portal Payment
            </h2>
            <div style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                To avoid confusion arising from varying candidate category fee structures (e.g., ₹0 for SC, ST, PwD, and female candidates vs. full fees for General/OBC candidates), maxEvoG adheres to an absolute separation between technical service fees and government examination fees:
              </p>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: 0 }}>
                <li>
                  <strong>maxEvoG Only Collects Flat ₹69 Service Charge:</strong> When reserving a 1-on-1 cyber desk assistance session, candidates pay solely maxEvoG's flat service charge of ₹69 (or ₹0 for active maxEvoG Pro Club members).
                </li>
                <li>
                  <strong>Direct Candidate Board Payment:</strong> Candidates are solely responsible for paying their official application fee directly on the government recruitment portal (via their own UPI, debit card, or net banking) during the live session handoff.
                </li>
                <li>
                  <strong>No Handling of Examination Funds:</strong> maxEvoG agents and systems will NEVER ask candidates to send examination fee amounts to personal agent accounts, nor will agents ever ask for candidate card details, UPI MPINs, or bank passwords.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldAlert size={20} /> 4. Candidate Code of Conduct & Strict Anti-Harassment Terms
            </h2>
            <div style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                Remote screen-sharing and browser access is granted strictly for the professional purpose of completing the candidate's designated examination application form. Candidates agree to maintain professional decorum at all times:
              </p>
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #F87171', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1rem', color: '#991B1B', fontSize: '0.88rem', fontWeight: 600 }}>
                CRITICAL WARNING: Any misuse of the remote desktop session, unauthorized browsing of agent files, malicious script execution, verbal harassment, sexual harassment, intimidation, or abuse toward desk agents will result in immediate session termination without refund, permanent platform blacklisting, and instant escalation to law enforcement agencies under the Information Technology Act, 2000 and Bharatiya Nyaya Sanhita / Indian Penal Code.
              </div>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0 }}>
                <li>Candidates shall not attempt to inspect, alter, copy, or access files or windows outside the official examination portal being completed.</li>
                <li>Desk sessions are digitally monitored and auditable by supervisory administrators for compliance and safety.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <RefreshCw size={20} /> 5. Reconnection Protocol & Technical Disruptions
            </h2>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: '0 0 1rem 0' }}>
              We understand that power fluctuations, ISP downtimes, or system reboots may occur. In the event of an unexpected disconnection during a live assistance session:
            </p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 0, fontSize: '0.92rem' }}>
              <li>
                <strong>30 to 60 Minutes Grace Window:</strong> The assigned desk specialist will keep the session queue active for up to <strong>30 minutes to 1 hour</strong> to permit the candidate to reboot their device, restore their internet connection, and regenerate a new Chrome Remote Desktop code.
              </li>
              <li>
                <strong>Slot Rescheduling:</strong> If severe line failure persists beyond 1 hour on the candidate's side, maxEvoG will offer one complimentary rescheduling slot within 24 hours, subject to availability prior to the official board closure date.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <AlertTriangle size={20} /> 6. Board Authority Jurisdiction & Eligibility Disclaimer
            </h2>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              The applicant is solely responsible for the authenticity, correctness, and eligibility qualifications (including age limit, degree recognition, caste/category certificates, and domicile validity) provided during the application process. maxEvoG desk agents provide technical form-entry assistance only. Final examination scheduling, center allocation, admit card generation, eligibility clearance, cutoff determination, and appointment orders are strictly within the sovereign purview of the conducting government boards. maxEvoG assumes zero liability for rejection caused by candidate ineligibility.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={20} /> 7. Account Suspension & Immediate Invalidation
            </h2>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              maxEvoG reserves the right to suspend or terminate any candidate or agent account found in violation of these terms, engaging in unauthorized scraping, automated bot queries, fraudulent payment chargebacks, or abusive conduct. Upon suspension, all active authentication sessions, tokens, and portal access privileges are invalidated immediately in real-time, resulting in prompt disconnection from the platform.
            </p>
          </section>
        </div>

        {/* Footer Navigation CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '2.5rem' }}>
          <Link to="/refund-policy" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            View Refund & Cancellation Policy <ArrowRight size={15} />
          </Link>
          <Link to="/how-assistance-works" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            See How Remote Assistance Works <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};
