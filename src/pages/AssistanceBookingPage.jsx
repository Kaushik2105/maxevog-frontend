import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { jobsApi } from '../api/jobs.api';
import { assistanceApi } from '../api/assistance.api';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Video, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  ArrowLeft,
  Clock,
  Zap,
  Check
} from 'lucide-react';

export const AssistanceBookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isPro, user, refreshUser } = useAuth();

  const preselectedJobId = searchParams.get('jobId');

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(preselectedJobId || '');
  const [selectedJob, setSelectedJob] = useState(null);
  const [customExamTitle, setCustomExamTitle] = useState('');

  // 7-day selector & daily capacity availability
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Security / Trust confirmation checkboxes
  const [consentCreds, setConsentCreds] = useState(false);
  const [consentAuthorization, setConsentAuthorization] = useState(false);
  const [bookingNotes, setBookingNotes] = useState('');

  // Urgent Request Modal State
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [urgencyReason, setUrgencyReason] = useState('');
  const [submittingUrgent, setSubmittingUrgent] = useState(false);
  const [urgentError, setUrgentError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Generate next 7 dates
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().split('T')[0];
      dates.push({
        full: isoDate,
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
            if (found) {
              setSelectedJob(found);
              setSelectedJobId(String(found.id));
            }
          } else if (list.length > 0) {
            setSelectedJobId(String(list[0].id));
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
    if (selectedJobId === 'OTHER') {
      setSelectedJob(null);
    } else if (selectedJobId && jobs.length > 0) {
      const found = jobs.find((j) => String(j.id) === String(selectedJobId));
      setSelectedJob(found || null);
    }
  }, [selectedJobId, jobs]);

  // Fetch live daily capacity availability
  useEffect(() => {
    if (availableDates.length === 0) return;
    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const startDate = availableDates[0].full;
        const res = await assistanceApi.getAvailability({ startDate, days: 7 });
        if (res.data?.success && Array.isArray(res.data.data)) {
          const map = {};
          res.data.data.forEach((item) => {
            map[item.date] = item;
          });
          setAvailabilityMap(map);
        }
      } catch (err) {
        console.error('Failed to load daily availability:', err);
      } finally {
        setLoadingAvailability(false);
      }
    };
    fetchAvailability();
  }, [availableDates]);

  // Current selected date availability
  const currentAvail = availabilityMap[selectedDate] || {
    limit: 10,
    bookedCount: 0,
    remaining: 10,
    isFull: false
  };

  const isSelectedDateFull = currentAvail.isFull || currentAvail.remaining <= 0;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/assistance/book${selectedJobId ? `?jobId=${selectedJobId}` : ''}` } });
      return;
    }

    if (!selectedJobId) {
      setError('Please select a recruitment opening or choose "Other"');
      return;
    }

    if (selectedJobId === 'OTHER' && !customExamTitle.trim()) {
      setError('Please specify the government examination name');
      return;
    }

    if (isSelectedDateFull) {
      setShowUrgentModal(true);
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
        jobId: selectedJobId === 'OTHER' ? null : selectedJobId,
        customExamTitle: selectedJobId === 'OTHER' ? customExamTitle.trim() : undefined,
        bookingDate: selectedDate,
        date: selectedDate,
        notes: bookingNotes,
      });

      if (res.data?.success) {
        if (refreshUser) refreshUser();
        navigate('/applications', {
          state: { message: 'Assistance session confirmed! Your desk specialist will connect on the scheduled date.' }
        });
      } else {
        if (res.data?.code === 'CAPACITY_REACHED') {
          setShowUrgentModal(true);
        } else {
          setError(res.data?.message || 'Booking could not be confirmed');
        }
      }
    } catch (err) {
      if (err.response?.data?.code === 'CAPACITY_REACHED') {
        setShowUrgentModal(true);
      } else {
        setError(err.response?.data?.message || err.message || 'Booking failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUrgentSubmit = async (e) => {
    e.preventDefault();
    if (submittingUrgent) return;

    if (!urgencyReason.trim()) {
      setUrgentError('Please explain why your application assistance request is urgent (e.g. imminent deadline).');
      return;
    }

    setUrgentError('');
    setSubmittingUrgent(true);

    try {
      const res = await assistanceApi.submitUrgentRequest({
        jobId: selectedJobId === 'OTHER' ? null : selectedJobId,
        customExamTitle: selectedJobId === 'OTHER' ? customExamTitle.trim() : undefined,
        bookingDate: selectedDate,
        date: selectedDate,
        urgencyReason: urgencyReason.trim(),
        notes: bookingNotes,
      });

      if (res.data?.success) {
        if (refreshUser) refreshUser();
        setShowUrgentModal(false);
        navigate('/applications', {
          state: { message: 'Priority / Urgent request submitted successfully! An idle desk specialist will review and accept your session shortly.' }
        });
      } else {
        setUrgentError(res.data?.message || 'Failed to submit urgent request');
      }
    } catch (err) {
      setUrgentError(err.response?.data?.message || err.message || 'Failed to submit urgent request');
    } finally {
      setSubmittingUrgent(false);
    }
  };

  const govtFee = selectedJob?.fee || 0;
  const hasFreeCredit = isPro && (user?.assistanceCredits ? user.assistanceCredits.available : true);
  const standardFee = hasFreeCredit ? 0 : 69;

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
            Connect with a verified specialist over Google Meet. We navigate complex board forms, resize documents, and verify all details live before submission.
          </p>
        </div>

        {/* Security & Zero Storage Guarantee Banner */}
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
                  1. Choose Target Examination / Commission
                </h3>

                <div className="form-group">
                  <label className="form-label">Target Examination</label>
                  <select
                    className="form-control form-select"
                    value={selectedJobId}
                    onChange={(e) => {
                      setSelectedJobId(e.target.value);
                      if (e.target.value !== 'OTHER') {
                        setCustomExamTitle('');
                      }
                    }}
                    required
                  >
                    <option value="">-- Select an active recruitment --</option>
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.organization} - {j.title} {j.vacancies ? `(${j.vacancies.toLocaleString('en-IN')} Posts)` : '(Exam / Merit Based)'}
                      </option>
                    ))}
                    <option value="OTHER" style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>
                      Other (Not available on maxEvoG)
                    </option>
                  </select>
                </div>

                {/* Custom exam input if "OTHER" selected */}
                {selectedJobId === 'OTHER' && (
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Zap size={14} color="var(--color-secondary)" />
                      <span>Specify Government Exam / Commission Name *</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Bihar STET 2026, GATE 2026, JEE Advanced, Indian Navy MR, NDA, CDS..."
                      value={customExamTitle}
                      onChange={(e) => setCustomExamTitle(e.target.value)}
                      required
                      autoFocus
                    />
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                      We assist with any Central or State Government application even if not yet cataloged on maxEvoG.
                    </div>
                  </div>
                )}

                {selectedJob && (
                  <div style={{
                    padding: '0.85rem',
                    backgroundColor: 'var(--color-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    marginTop: '0.75rem'
                  }}>
                    <div><strong>Department:</strong> {selectedJob.department || 'Central/State Service'}</div>
                    <div><strong>Last Date:</strong> {selectedJob.lastDate ? new Date(selectedJob.lastDate).toLocaleDateString('en-IN') : 'TBA'}</div>
                    <div><strong>Official Board Fee:</strong> ₹{selectedJob.fee || 0}</div>
                  </div>
                )}
              </div>

              {/* Step 2: Choose 7-Day Date & Daily Capacity */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>
                    2. Select Assistance Session Date
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Daily Desk Capacity Limits Apply
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Select an upcoming date when you will be at your device with your certificates and photo ready.
                </p>

                {/* 7-Day Horizontal Grid with Live Capacity Badges */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))',
                  gap: '0.5rem',
                  marginBottom: '1.25rem'
                }}>
                  {availableDates.map((d) => {
                    const isSelected = selectedDate === d.full;
                    const avail = availabilityMap[d.full] || {
                      limit: 10,
                      bookedCount: 0,
                      remaining: 10,
                      isFull: false
                    };
                    const isFull = avail.isFull || avail.remaining <= 0;

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
                          border: isSelected 
                            ? '2px solid var(--color-primary)' 
                            : isFull 
                            ? '1px solid #FECACA' 
                            : '1px solid var(--color-border)',
                          backgroundColor: isSelected 
                            ? 'var(--color-primary-subtle)' 
                            : isFull 
                            ? '#FEF2F2' 
                            : '#FFFFFF',
                          color: isSelected ? 'var(--color-primary)' : 'var(--color-text-title)',
                          transition: 'all var(--transition-fast)',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
                          {d.dayName}
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.15rem 0' }}>
                          {d.dayNum}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                          {d.month}
                        </span>

                        {/* Capacity Badge */}
                        {isFull ? (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            color: '#DC2626',
                            backgroundColor: '#FEE2E2',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px'
                          }}>
                            Full
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.62rem',
                            fontWeight: 600,
                            color: '#16A34A',
                            backgroundColor: '#DCFCE7',
                            padding: '0.1rem 0.35rem',
                            borderRadius: '4px'
                          }}>
                            Available
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Date Status Alert */}
                {isSelectedDateFull ? (
                  <div style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    fontSize: '0.82rem',
                    color: '#991B1B',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                      <AlertTriangle size={16} color="#DC2626" />
                      <span>Daily Assistance Capacity Reached</span>
                    </div>
                    <div>
                      Standard bookings are full for {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}. You can choose another date, or submit an <strong>Urgent / Priority Assistance Request (₹99)</strong> if your deadline is imminent.
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUrgentModal(true)}
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        alignSelf: 'flex-start',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontWeight: 700,
                        padding: '0.4rem 0.85rem'
                      }}
                    >
                      <Zap size={14} /> Request Urgent Assistance (₹99)
                    </button>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.82rem',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span>
                      Desk capacity available for <strong>{new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>.
                    </span>
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
                  placeholder="Mention if you have category certificates (OBC-NCL, EWS, PwD), require photo/signature compression, or have exam-specific queries..."
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Right Column: Fee Ledger & Security Consent */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '1.5rem', border: '2px solid var(--color-primary-subtle)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  Transparent Booking Fee
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>maxEvoG Desk Assistance Fee:</span>
                    <div>
                      {hasFreeCredit ? (
                        <span>
                          <s style={{ color: 'var(--color-text-muted)', marginRight: '0.4rem' }}>₹69</s>
                          <strong style={{ color: 'var(--color-accent)' }}>FREE (1 Pro Credit)</strong>
                        </span>
                      ) : isPro ? (
                        <span>
                          <strong>₹69</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>(Pro credit used)</span>
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
                    <strong>Total Payable Today:</strong>
                    <strong style={{ color: 'var(--color-primary)' }}>₹{standardFee}</strong>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem 0.85rem',
                  fontSize: '0.76rem',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.45,
                  marginBottom: '1.25rem'
                }}>
                  <strong style={{ color: 'var(--color-text-title)' }}>Note on Official Board Fee:</strong> Official examination portal fees vary by category and commission (₹0 to ₹{govtFee}). You will pay the official fee directly on the government portal yourself during the live session. maxEvoG never collects or handles official exam fees.
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
                    <strong>maxEvoG Pro Club:</strong> Get 1 free 1-on-1 assistance session + Telegram & Email deadline protection for ₹249 / 3 months.{' '}
                    <Link to="/membership" style={{ textDecoration: 'underline', fontWeight: 700 }}>
                      Join Pro Club
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

                {isSelectedDateFull ? (
                  <button
                    type="button"
                    onClick={() => setShowUrgentModal(true)}
                    className="btn btn-lg"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700
                    }}
                  >
                    <Zap size={18} />
                    <span>Submit Urgent Request (₹99)</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting || !consentCreds || !consentAuthorization}
                    className="btn btn-secondary btn-lg"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Video size={18} />
                    <span>{submitting ? 'Confirming Desk Slot...' : `Confirm & Book (₹${standardFee})`}</span>
                  </button>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <ShieldCheck size={14} color="var(--color-accent)" />
                  <span>Google Meet invite dispatched directly upon confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL: URGENT / PRIORITY ASSISTANCE REQUEST */}
      <Modal
        isOpen={showUrgentModal}
        onClose={() => setShowUrgentModal(false)}
        title="⚡ Priority / Urgent Assistance Request"
        maxWidth="580px"
      >
        <form onSubmit={handleUrgentSubmit}>
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            fontSize: '0.82rem',
            color: '#991B1B',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong>Daily Capacity Full for {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</strong>
              <div style={{ marginTop: '0.2rem' }}>
                Standard bookings are currently full ({currentAvail.limit}/{currentAvail.limit} booked). Submit an urgent request if your exam deadline is approaching. Once submitted, an idle desk agent will review and accept your session on priority.
              </div>
            </div>
          </div>

          {urgentError && (
            <div style={{
              backgroundColor: 'var(--color-danger-subtle)',
              border: '1px solid var(--color-danger-border)',
              color: 'var(--color-danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              fontSize: '0.82rem'
            }}>
              {urgentError}
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Target Examination</label>
            <div style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              {selectedJobId === 'OTHER' 
                ? (customExamTitle || 'Custom Specified Examination')
                : (selectedJob?.title || 'Selected Examination')}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">
              Reason for Urgency / Imminent Deadline *
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g., Tomorrow is the last date to apply, server is experiencing high traffic, need immediate photo resizing and document review..."
              value={urgencyReason}
              onChange={(e) => setUrgencyReason(e.target.value)}
              required
            />
            <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', marginTop: '0.3rem' }}>
              Please describe your submission deadline so our desk agents can prioritize accordingly.
            </div>
          </div>

          {/* Fee Breakdown */}
          <div style={{
            backgroundColor: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Standard Assistance Fee:</span>
              <span>₹69</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Urgent Expedited Surcharge:</span>
              <span>+ ₹30</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.05rem',
              fontWeight: 700,
              borderTop: '1px dashed var(--color-border)',
              paddingTop: '0.6rem',
              color: 'var(--color-primary)'
            }}>
              <span>Total Priority Fee:</span>
              <span>₹99</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowUrgentModal(false)}
              className="btn btn-outline"
            >
              Cancel / Select Other Date
            </button>
            <button
              type="submit"
              disabled={submittingUrgent || !urgencyReason.trim()}
              className="btn btn-urgent"
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700
              }}
            >
              <Zap size={16} />
              <span>{submittingUrgent ? 'Submitting Urgent Request...' : 'Confirm Urgent Request (₹99)'}</span>
            </button>
          </div>
        </form>
      </Modal>

      <style>{`
        @media (max-width: 860px) {
          .booking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
