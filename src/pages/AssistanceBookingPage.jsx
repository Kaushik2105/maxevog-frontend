import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { jobsApi } from '../api/jobs.api';
import { timeSlotsApi } from '../api/timeSlots.api';
import { assistanceApi } from '../api/assistance.api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  Video, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  ArrowLeft 
} from 'lucide-react';

export const AssistanceBookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isPro, user } = useAuth();

  const preselectedJobId = searchParams.get('jobId');

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(preselectedJobId || '');
  const [selectedJob, setSelectedJob] = useState(null);

  // 7-day selector
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Security / Trust confirmation checkboxes
  const [consentCreds, setConsentCreds] = useState(false);
  const [consentAuthorization, setConsentAuthorization] = useState(false);
  const [bookingNotes, setBookingNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Generate next 7 dates
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        full: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-IN', { month: 'short' })
      });
    }
    setAvailableDates(dates);
    setSelectedDate(dates[0].full);
  }, []);

  // Fetch jobs for dropdown selection
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await jobsApi.getJobs({ limit: 50 });
        if (res.data?.success) {
          const list = res.data.data.jobs || res.data.data || [];
          setJobs(list);
          if (preselectedJobId) {
            const found = list.find((j) => String(j.id) === String(preselectedJobId));
            if (found) setSelectedJob(found);
          } else if (list.length > 0) {
            setSelectedJobId(list[0].id);
            setSelectedJob(list[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
      }
    };
    loadJobs();
  }, [preselectedJobId]);

  // Update selected job object when selectedJobId changes
  useEffect(() => {
    if (selectedJobId && jobs.length > 0) {
      const found = jobs.find((j) => String(j.id) === String(selectedJobId));
      setSelectedJob(found || null);
    }
  }, [selectedJobId, jobs]);

  // Fetch time slots when selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const res = await timeSlotsApi.getAvailableSlots(selectedDate);
        if (res.data?.success && res.data.data?.length > 0) {
          setSlots(res.data.data);
        } else {
          // Fallback realistic time slots
          setSlots([
            { id: `slot-1-${selectedDate}`, startTime: '10:00 AM', endTime: '10:45 AM', available: true },
            { id: `slot-2-${selectedDate}`, startTime: '11:30 AM', endTime: '12:15 PM', available: true },
            { id: `slot-3-${selectedDate}`, startTime: '02:00 PM', endTime: '02:45 PM', available: true },
            { id: `slot-4-${selectedDate}`, startTime: '03:30 PM', endTime: '04:15 PM', available: true },
            { id: `slot-5-${selectedDate}`, startTime: '05:00 PM', endTime: '05:45 PM', available: true },
            { id: `slot-6-${selectedDate}`, startTime: '06:30 PM', endTime: '07:15 PM', available: true },
          ]);
        }
      } catch (err) {
        // Fallback slots on network/server error
        setSlots([
          { id: `slot-1-${selectedDate}`, startTime: '10:00 AM', endTime: '10:45 AM', available: true },
          { id: `slot-2-${selectedDate}`, startTime: '02:00 PM', endTime: '02:45 PM', available: true },
          { id: `slot-3-${selectedDate}`, startTime: '05:00 PM', endTime: '05:45 PM', available: true },
        ]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedDate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    if (!selectedJobId) {
      setError('Please select a recruitment opening');
      return;
    }

    if (!selectedSlot) {
      setError('Please choose a time slot for the assisted session');
      return;
    }

    if (!consentCreds || !consentAuthorization) {
      setError('Please acknowledge our Zero Credential Storage and Candidate Consent commitments');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await assistanceApi.bookSession({
        jobId: selectedJobId,
        date: selectedDate,
        timeSlot: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
        timeSlotId: selectedSlot.id,
        notes: bookingNotes,
      });

      if (res.data?.success) {
        // Redirect to applications list or session detail
        navigate('/applications', {
          state: { message: 'Assistance session confirmed! Your specialist will connect via Google Meet.' }
        });
      } else {
        setError(res.data?.message || 'Booking could not be confirmed');
      }
    } catch (err) {
      // If mock backend succeeds or fails with standard message
      setError(err.response?.data?.message || err.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const govtFee = selectedJob?.fee || 0;
  const assistanceFee = isPro ? 0 : 69; // Pro members get free assistance
  const totalAmount = govtFee + assistanceFee;

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} /> Back to Recruitments
          </Link>
        </div>

        {/* Page Title & Intro */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> 1-ON-1 GUIDED APPLICATION SERVICE
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            Book Assisted Application Session
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
            Connect with an expert over Google Meet. We navigate complex board forms, resize documents, and verify all details live before submission.
          </p>
        </div>

        {/* Startup Trust Guarantee Banner */}
        <div style={{
          backgroundColor: 'var(--color-accent-subtle)',
          border: '1px solid var(--color-accent-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <ShieldCheck size={24} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <strong style={{ color: 'var(--color-accent)', fontSize: '0.92rem' }}>
              Your Credentials Never Leave Your Hands
            </strong>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-body)', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
              During your live session, our assistant guides your screen. When entering passwords, banking PINs, or receiving OTPs, you type them directly into the official portal. We do not store, log, or request access to any personal passwords.
            </p>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleBooking}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1.2fr',
            gap: '2rem',
            alignItems: 'flex-start'
          }} className="booking-grid">
            {/* Left Column: Form & Schedule */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Step 1: Select Recruitment Opening */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  1. Choose Recruitment Opening
                </h3>

                <div className="form-group">
                  <label className="form-label">Target Examination / Commission</label>
                  <select
                    className="form-control form-select"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    required
                  >
                    <option value="">-- Select an active recruitment --</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.organization} - {j.title} (Vacancies: {j.vacancies || 'Open'})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedJob && (
                  <div style={{
                    padding: '0.85rem',
                    backgroundColor: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem'
                  }}>
                    <div><strong>Department:</strong> {selectedJob.department || 'Central/State Service'}</div>
                    <div><strong>Last Date:</strong> {selectedJob.lastDate ? new Date(selectedJob.lastDate).toLocaleDateString('en-IN') : 'TBA'}</div>
                    <div><strong>Official Board Fee:</strong> ₹{selectedJob.fee || 0}</div>
                  </div>
                )}
              </div>

              {/* Step 2: Choose 7-Day Date & Slot */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                  2. Select Session Date & Time
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Choose a date in the next 7 days when you are at your laptop with your certificates ready.
                </p>

                {/* 7-Day Horizontal Scroll/Pills */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))',
                  gap: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  {availableDates.map((d) => {
                    const isSelected = selectedDate === d.full;
                    return (
                      <button
                        type="button"
                        key={d.full}
                        onClick={() => setSelectedDate(d.full)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '0.65rem 0.25rem',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-primary-subtle)' : '#FFFFFF',
                          color: isSelected ? 'var(--color-primary)' : 'var(--color-text-title)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                          {d.dayName}
                        </span>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0.2rem 0' }}>
                          {d.dayNum}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                          {d.month}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Available Slots */}
                <div className="form-label" style={{ marginBottom: '0.5rem' }}>
                  Available Specialist Slots ({selectedDate ? new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''})
                </div>

                {loadingSlots ? (
                  <div style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    Loading available desk slots...
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                    gap: '0.6rem'
                  }}>
                    {slots.map((slot) => {
                      const isChosen = selectedSlot?.id === slot.id;
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            padding: '0.6rem 0.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: isChosen ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                            backgroundColor: isChosen ? 'var(--color-secondary-subtle)' : '#FFFFFF',
                            color: isChosen ? 'var(--color-secondary)' : 'var(--color-text-title)',
                            fontWeight: isChosen ? 700 : 500,
                            fontSize: '0.82rem',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          <Clock size={13} />
                          <span>{slot.startTime}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 3: Candidate Notes */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                  3. Candidate Instructions (Optional)
                </h3>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Mention if you have special category certificates (OBC-NCL, EWS, PwD) or need photo/signature resizing assistance..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column: Fee Ledger & Security Consent */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.5rem', border: '2px solid var(--color-primary-subtle)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  Transparent Fee Ledger
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Official Board Exam Fee:</span>
                    <strong>₹{govtFee}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>maxEvoG Desk Assistance:</span>
                    <div>
                      {isPro ? (
                        <span>
                          <s style={{ color: 'var(--color-text-muted)', marginRight: '0.4rem' }}>₹69</s>
                          <strong style={{ color: 'var(--color-accent)' }}>FREE (Pro)</strong>
                        </span>
                      ) : (
                        <strong>₹69</strong>
                      )}
                    </div>
                  </div>

                  <div style={{
                    borderTop: '2px dashed var(--color-border)',
                    paddingTop: '0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.1rem'
                  }}>
                    <strong>Total Payable:</strong>
                    <strong style={{ color: 'var(--color-primary)' }}>₹{totalAmount}</strong>
                  </div>
                </div>

                {/* Pro Club Promo if not pro */}
                {!isPro && (
                  <div style={{
                    backgroundColor: 'var(--color-secondary-subtle)',
                    border: '1px solid var(--color-secondary-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.78rem',
                    color: 'var(--color-secondary)'
                  }}>
                    <strong>Aspirant Pro:</strong> Get 1 free assistance session + WhatsApp alerts for ₹249/3 months.{' '}
                    <Link to="/membership" style={{ textDecoration: 'underline', fontWeight: 700 }}>
                      View Plan
                    </Link>
                  </div>
                )}

                {/* Mandatory Security & Consent Checkboxes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <input
                      type="checkbox"
                      checked={consentCreds}
                      onChange={(e) => setConsentCreds(e.target.checked)}
                      style={{ marginTop: '0.2rem' }}
                      required
                    />
                    <span style={{ color: 'var(--color-text-title)' }}>
                      <strong>Zero Password Sharing:</strong> I understand that during the Google Meet session, I will type my passwords, OTPs, and payment card details myself.
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <input
                      type="checkbox"
                      checked={consentAuthorization}
                      onChange={(e) => setConsentAuthorization(e.target.checked)}
                      style={{ marginTop: '0.2rem' }}
                      required
                    />
                    <span style={{ color: 'var(--color-text-title)' }}>
                      <strong>Candidate Consent Mandate:</strong> I understand that no form will be officially submitted until I click 'Authorize Submission' on the live draft preview.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedSlot || !consentCreds || !consentAuthorization}
                  className="btn btn-secondary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Video size={18} />
                  <span>{submitting ? 'Confirming Desk Slot...' : `Confirm & Book (₹${totalAmount})`}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <ShieldCheck size={14} color="var(--color-accent)" />
                  <span>Google Meet invite sent instantly upon booking</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .booking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
