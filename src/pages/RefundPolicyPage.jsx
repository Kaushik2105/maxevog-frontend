import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const RefundPolicyPage = () => {
  return (
    <div style={{ padding: '3rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem' }}>
            PAYMENT TRANSPARENCY
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.75rem', fontWeight: 800 }}>
            Refund & Cancellation Policy
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '680px', margin: '0 auto' }}>
            We are committed to fair, transparent service delivery. Our refund policy clearly delineates candidate rights, 
            service guarantees, and conditions governing desk assistance fees.
          </p>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
            Last Updated: <strong>March 2026</strong> • Standard Platform SLA
          </div>
        </div>

        {/* Summary Card Comparison */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {/* Refundable */}
          <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid #10B981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', marginBottom: '1rem' }}>
              <CheckCircle2 size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                Eligible for 100% Refund
              </h3>
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: 0, fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
              <li>
                <strong>Desk Agent Technical Error:</strong> Official application rejected solely due to a documented transcription or entry error made by our assigned specialist contrary to candidate instructions.
              </li>
              <li>
                <strong>MaxEvoG Platform Outage:</strong> Inability to deliver an allocated desk assistant prior to the official government recruitment deadline due to our internal infrastructure failure.
              </li>
              <li>
                <strong>Duplicate Payment:</strong> Multiple payment debits or gateway errors for the same booking session.
              </li>
              <li>
                <strong>Advance Cancellation:</strong> Cancellation requested at least 4 hours prior to the scheduled assistance slot.
              </li>
            </ul>
          </div>

          {/* Non-Refundable */}
          <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid #EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', marginBottom: '1rem' }}>
              <XCircle size={24} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                Non-Refundable Circumstances
              </h3>
            </div>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', margin: 0, fontSize: '0.88rem', color: 'var(--color-text-body)' }}>
              <li>
                <strong>Late Cancellation or No-Show:</strong> Cancellation initiated within 2 hours of the slot start time, or candidate failing to join the Google Meet session.
              </li>
              <li>
                <strong>Candidate Hardware / Internet Outage:</strong> Disconnections or device freezes on candidate's end exceeding the 1-hour grace window where the agent was ready.
              </li>
              <li>
                <strong>Wrong OTP / Password Lockout:</strong> Session aborted due to candidate entering repeated incorrect OTPs or credentials, causing portal temporary ban.
              </li>
              <li>
                <strong>Board Eligibility Rejection:</strong> Form rejection by the government board due to candidate's age criteria, education mismatch, or invalid certificates.
              </li>
              <li>
                <strong>Official Government Exam Fees:</strong> Fees paid directly to the government recruitment portal (e.g. UPSC / SSC / IBPS) are strictly subject to the respective board's rules.
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CreditCard size={20} /> 1. Fee Structure Breakdown
            </h2>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              The flat <strong>₹69 Assisted Desk Fee</strong> (or ₹0 for <strong>Pro Club Members</strong>) pays exclusively for dedicated, one-on-one professional form filling assistance, document compression, and live remote guidance provided by our trained specialists. It does <em>not</em> encompass official application charges levied by government commissions (which candidates pay directly on the official portal during the live handoff step).
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Clock size={20} /> 2. Re-scheduling & Disconnection Grace Window
            </h2>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              If your remote session is interrupted due to unexpected power failure or network loss, maxEvoG holds your session active for <strong>30 minutes to 1 hour</strong>. If the connection cannot be restored within this window, you may request one complimentary re-slot within 24 hours rather than forfeiting your booking.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <RotateCcw size={20} /> 3. Refund Claim Procedure & Timelines
            </h2>
            <div style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              <p style={{ margin: '0 0 1rem 0' }}>
                To lodge a refund inquiry or dispute:
              </p>
              <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0 0 1rem 0' }}>
                <li>Navigate to your candidate dashboard and open the <strong>Grievance Desk</strong> or email our grievance cell at <code>support@maxevog.com</code>.</li>
                <li>Specify your booking ID, date of session, assigned desk officer name, and attach any relevant documentation (e.g. proof of double charge or board rejection notice).</li>
                <li>Our operations team investigates session logs, audit recordings, and timestamps within <strong>48 hours</strong>.</li>
                <li>Upon approval, the refund is initiated automatically to your original source of payment (UPI / Netbanking / Card) within <strong>5 to 7 business days</strong>.</li>
              </ol>
            </div>
          </section>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '2.5rem' }}>
          <Link to="/terms" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            Read Terms & Conditions <ArrowRight size={15} />
          </Link>
          <Link to="/assistance/book" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            Book Assisted Form Filling (₹69) <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};
