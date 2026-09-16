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
                <strong>Desk Specialist Technical Fault:</strong> Application rejected by recruitment authorities solely due to a documented transcription error made by our desk agent contrary to explicit candidate inputs.
              </li>
              <li>
                <strong>MaxEvoG Platform Outage:</strong> Inability to deliver an allocated desk assistant prior to the official government recruitment deadline due to our internal system outage.
              </li>
              <li>
                <strong>Duplicate Charge:</strong> Multiple payment debits or gateway errors for the same assistance request.
              </li>
              <li>
                <strong>Advance Cancellation:</strong> Standard assistance cancellation initiated at least 4 hours prior to desk operating hours on the booked date.
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
                <strong>Urgent / Priority Triage Fee (₹30):</strong> For Urgent Requests (₹99), once a specialist has accepted and initiated expedited review of your application, the ₹30 priority surcharge is non-refundable.
              </li>
              <li>
                <strong>Candidate No-Show or Late Cancellation:</strong> Cancellation initiated less than 2 hours before scheduled session or failure to join the Google Meet call.
              </li>
              <li>
                <strong>Candidate Hardware / Internet Outage:</strong> Disconnections on candidate's end exceeding the 1-hour live grace window.
              </li>
              <li>
                <strong>Wrong OTP / Password Lockout:</strong> Portal bans or lockouts caused by repeated incorrect OTP or password inputs by the candidate.
              </li>
              <li>
                <strong>Official Government Exam Fees:</strong> Fees paid directly to government examination boards (e.g. UPSC / SSC / IBPS) are strictly non-refundable through maxEvoG.
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <CreditCard size={20} /> 1. Fee Structure Breakdown (Standard ₹69 vs Urgent ₹99)
            </h2>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: '0 0 0.75rem 0' }}>
              The flat <strong>₹69 Assisted Desk Fee</strong> (or ₹0 for <strong>Pro Club Members</strong>) covers dedicated, one-on-one professional form filling assistance, document resizing, and live remote guidance on your chosen date.
            </p>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              The <strong>₹99 Urgent / Priority Fee</strong> includes the ₹69 base service charge plus a ₹30 priority allocation fee for dates where standard daily desk capacity is exhausted or the recruitment deadline closes within 24–48 hours. Official portal examination charges are paid directly by candidates on the official board website during the live handoff step.
            </p>
          </section>

          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Clock size={20} /> 2. Date Rescheduling & Disconnection Grace Window
            </h2>
            <p style={{ color: 'var(--color-text-body)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              If your remote session is interrupted due to power failure or network disruption, maxEvoG holds your session active for <strong>30 minutes to 1 hour</strong>. If personal circumstances prevent attendance on your booked date, you may request one complimentary date rescheduling with at least <strong>4 hours advance notice</strong>, subject to desk capacity.
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
