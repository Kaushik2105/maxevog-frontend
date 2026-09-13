import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsApi } from '../api/jobs.api';
import { useAuth } from '../context/AuthContext';
import { CountdownTimer } from '../components/CountdownTimer';
import { 
  Building2, 
  MapPin, 
  GraduationCap, 
  Users, 
  Calendar, 
  IndianRupee, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowLeft,
  FileCheck
} from 'lucide-react';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isAgent } = useAuth();

  const [job, setJob] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const handleBookAssisted = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: `/assistance/book?jobId=${job?.id || id}` } });
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getJobById(id);
      if (res.data?.success) {
        const jobData = res.data.data.job || res.data.data;
        setJob(jobData);

        if (isAuthenticated) {
          checkCandidateEligibility(id);
        }
      }
    } catch (err) {
      console.error('Failed to load job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkCandidateEligibility = async (jobId) => {
    if (checkingEligibility) return;
    setCheckingEligibility(true);
    try {
      const res = await jobsApi.checkEligibility(jobId);
      if (res.data?.success) {
        setEligibility(res.data.data);
      }
    } catch (err) {
      console.error('Eligibility check error:', err);
    } finally {
      setCheckingEligibility(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem'
        }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Retrieving official gazetted specifications...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Recruitment Notification Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          This notification may have been archived or is no longer accessible.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Explorer
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} /> Back to all recruitments
          </Link>
        </div>

        {/* Hero Specification Header */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">
                  <Building2 size={13} /> {job.organization || 'Official Commission'}
                </span>
                {job.category && (
                  <span className="badge badge-neutral">{job.category}</span>
                )}
                {job.state && (
                  <span className="badge badge-neutral"><MapPin size={12} /> {job.state}</span>
                )}
              </div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                {job.title}
              </h1>
              {job.department && (
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Department: <strong>{job.department}</strong>
                </p>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>
                Application Deadline
              </div>
              <CountdownTimer targetDate={job.lastDate} />
              {job.lastDate && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                  Closes: {new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} color="var(--color-primary)" />
                <span style={{ fontSize: '0.95rem' }}>
                  <strong>{job.vacancies ? job.vacancies.toLocaleString('en-IN') : 'N/A'}</strong> Total Vacancies
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={18} color="var(--color-primary)" />
                <span style={{ fontSize: '0.95rem' }}>
                  {job.qualification || 'Graduation Required'}
                </span>
              </div>
              {job.fee !== undefined && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IndianRupee size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.95rem' }}>
                    Board Fee: <strong>{job.fee === 0 ? 'Free (₹0)' : `₹${job.fee}`}</strong>
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {job.officialUrl && (
                <a
                  href={job.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  <span>Official Gazette / Portal</span>
                  <ExternalLink size={15} />
                </a>
              )}
              {!isAdmin && !isAgent && (
                <Link
                  to={`/assistance/book?jobId=${job.id}`}
                  onClick={handleBookAssisted}
                  className="btn btn-secondary"
                >
                  <Sparkles size={16} />
                  <span>Book Assisted Application (₹50)</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          alignItems: 'flex-start'
        }} className="job-detail-grid">
          {/* Main Specifications Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Vacancy Breakdown & Pay Scale */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} /> Position Details & Pay Scale
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                backgroundColor: 'var(--color-bg)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Advertised Vacancies
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-title)' }} className="tabular-nums">
                    {job.vacancies || 'As per notification'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Pay Matrix / Scale
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {job.payScale || 'Level 4 to Level 7 (As per 7th CPC)'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Age Criteria
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-title)' }}>
                    {job.ageLimit || '18 to 30 Years (Category relaxations apply)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Gazette Criteria */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                Notification Overview & Duties
              </h3>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-text-body)', whiteSpace: 'pre-line' }}>
                {job.description || 'Candidates are invited to apply for the above post in accordance with the official recruitment notice. Please verify all educational credentials, domicile certificates, and category criteria prior to registration.'}
              </div>
            </div>

            {/* Application Stages & Selection Procedure */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={18} /> Selection Stages & Examination Scheme
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.1rem'
                  }}>1</div>
                  <div>
                    <strong style={{ color: 'var(--color-text-title)' }}>Tier 1: Preliminary Computer Based Examination (CBT)</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>General Intelligence, Quantitative Aptitude, English Comprehension, General Awareness.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.1rem'
                  }}>2</div>
                  <div>
                    <strong style={{ color: 'var(--color-text-title)' }}>Tier 2: Mains Examination / Skill Assessment</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Advanced domain subject test and computer proficiency verification.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.1rem'
                  }}>3</div>
                  <div>
                    <strong style={{ color: 'var(--color-text-title)' }}>Document Verification & Medical Fitness</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Original certificate scrutiny by the appointing commission.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Non-Binary Eligibility & Assisted CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Eligibility Scoring Card */}
            <div className="card" style={{ padding: '1.5rem', border: '2px solid var(--color-primary-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Sparkles size={18} color="var(--color-secondary)" />
                <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)', margin: 0 }}>
                  Eligibility Assessment
                </h4>
              </div>

              {isAuthenticated ? (
                <div>
                  {checkingEligibility ? (
                    <div style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      Comparing your profile against gazette criteria...
                    </div>
                  ) : eligibility ? (
                    <div>
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '0.85rem',
                        backgroundColor: 
                          eligibility.status === 'LIKELY_ELIGIBLE' ? 'var(--color-accent-subtle)' :
                          eligibility.status === 'MAY_BE_ELIGIBLE' ? 'var(--color-secondary-subtle)' :
                          'var(--color-danger-subtle)',
                        border: 
                          eligibility.status === 'LIKELY_ELIGIBLE' ? '1px solid var(--color-accent-border)' :
                          eligibility.status === 'MAY_BE_ELIGIBLE' ? '1px solid var(--color-secondary-border)' :
                          '1px solid var(--color-danger-border)',
                        color: 
                          eligibility.status === 'LIKELY_ELIGIBLE' ? 'var(--color-accent)' :
                          eligibility.status === 'MAY_BE_ELIGIBLE' ? 'var(--color-secondary)' :
                          'var(--color-danger)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {eligibility.status === 'LIKELY_ELIGIBLE' && <CheckCircle2 size={18} />}
                        {eligibility.status === 'MAY_BE_ELIGIBLE' && <AlertCircle size={18} />}
                        {eligibility.status === 'LIKELY_NOT_ELIGIBLE' && <AlertCircle size={18} />}
                        <span>
                          {eligibility.status === 'LIKELY_ELIGIBLE' ? 'Likely Eligible' :
                           eligibility.status === 'MAY_BE_ELIGIBLE' ? 'May Be Eligible' :
                           'Likely Not Eligible'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                        {eligibility.reason || 'Criteria evaluated based on your profile age, category relaxation, and educational background.'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                        Ensure your education and category details are complete in your profile.
                      </p>
                      <button
                        onClick={() => checkCandidateEligibility(job.id)}
                        disabled={checkingEligibility}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%' }}
                      >
                        {checkingEligibility ? 'Evaluating Eligibility...' : 'Check My Eligibility'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                    Sign in to see your personalized 3-tier eligibility score (Likely Eligible / May Be Eligible / Not Eligible).
                  </p>
                  <Link to="/login" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                    Sign In to Check
                  </Link>
                </div>
              )}
            </div>

            {/* Assistance Booking Promotion Card - candidates only */}
            {!isAdmin && !isAgent && (
              <div style={{
                background: 'linear-gradient(135deg, #0B2545 0%, #163A66 100%)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{
                  backgroundColor: '#D95D0F',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-block',
                  marginBottom: '0.75rem'
                }}>
                  Application Assistance
                </div>
                <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                  Need Help Applying?
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Book a 1-on-1 Google Meet session with an application specialist. We guide you live while you retain full control of your passwords and OTPs.
                </p>

                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem',
                  color: '#E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Board Exam Fee:</span>
                    <strong>{job.fee === 0 ? '₹0 (Free)' : `₹${job.fee}`}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>maxEvoG Desk Charge:</span>
                    <strong>₹50</strong>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '0.35rem', display: 'flex', justifyContent: 'space-between', color: '#FED7AA' }}>
                    <strong>Total Transparent:</strong>
                    <strong>₹{(job.fee || 0) + 50}</strong>
                  </div>
                </div>

                <Link
                  to={`/assistance/book?jobId=${job.id}`}
                  onClick={handleBookAssisted}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Sparkles size={16} /> Book Session (₹50)
                </Link>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '0.85rem',
                  fontSize: '0.72rem',
                  color: '#94A3B8',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={14} color="#38BDF8" />
                  <span>Zero OTP / password retention policy</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .job-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
