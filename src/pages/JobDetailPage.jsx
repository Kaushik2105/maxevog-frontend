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
  FileCheck,
  Table,
  FileText,
  XCircle,
  CheckSquare
} from 'lucide-react';
import { evaluateCandidateEligibility, ELIGIBILITY_STATUS } from '../utils/eligibility';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isAgent, user } = useAuth();

  const [job, setJob] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [isTracked, setIsTracked] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const handleBookAssisted = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: `/assistance/book?jobId=${job?.id || id}` } });
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const checkTrackedStatus = async (jobId) => {
    try {
      const res = await proApi.getTrackedJobs({ limit: 100 });
      if (res.data?.success) {
        const found = res.data.data.trackedJobs?.some((t) => t.jobId === jobId);
        setIsTracked(Boolean(found));
      }
    } catch (e) {}
  };

  const handleToggleTrack = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    setTrackingLoading(true);
    try {
      if (isTracked) {
        await proApi.untrackJob(id);
        setIsTracked(false);
      } else {
        await proApi.trackJob(id);
        setIsTracked(true);
      }
    } catch (e) {
      console.error('Failed to toggle tracking:', e);
    } finally {
      setTrackingLoading(false);
    }
  };

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const res = await jobsApi.getJobById(id);
      if (res.data?.success) {
        const jobData = res.data.data.job || res.data.data;
        setJob(jobData);

        if (isAuthenticated) {
          checkCandidateEligibility(id);
          checkTrackedStatus(id);
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

  // Dynamic candidate eligibility evaluation
  const activeEligibility = eligibility
    ? evaluateCandidateEligibility(user, { ...job, eligibility })
    : (isAuthenticated ? evaluateCandidateEligibility(user, job) : null);

  const getSpecificationTables = () => {
    if (!job) return [];
    let parsedTables = [];
    if (Array.isArray(job.tables) && job.tables.length > 0) {
      parsedTables = job.tables;
    } else if (typeof job.tables === 'string') {
      try {
        const p = JSON.parse(job.tables);
        if (Array.isArray(p) && p.length > 0) parsedTables = p;
      } catch (e) {}
    }

    if (parsedTables.length > 0) {
      return parsedTables;
    }

    // Default synthesis if no custom tables exist
    return [
      {
        title: 'Recruitment Overview',
        rows: [
          { key: 'Recruitment Authority / Commission', value: job.organization || 'Official Commission' },
          { key: 'Official Examination Name', value: job.title },
          { key: 'Department / Ministry', value: job.department || 'Central / State Govt Ministries & Departments' },
          { key: 'Total Advertised Vacancies', value: job.vacancies ? `${job.vacancies.toLocaleString('en-IN')} Posts` : 'Exam / Merit Based' },
          { key: 'Application Last Date', value: job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'To Be Announced' },
          { key: 'Minimum Age Limit', value: job.ageMin ? `${job.ageMin} Years` : '18 Years' },
          { key: 'Maximum Age Limit', value: job.ageMax ? `${job.ageMax} Years` : '27 to 32 Years (Relaxation as per rules)' },
        ],
      },
      {
        title: 'Application Fees Structure',
        rows: [
          { key: 'General / OBC / EWS Male Candidates', value: job.fee !== undefined ? (job.fee === 0 ? 'Exempted (₹0)' : `₹${job.fee}`) : '₹100' },
          { key: 'SC / ST Candidates', value: 'Exempted (₹0)' },
          { key: 'Female Candidates (All Categories)', value: 'Exempted (₹0)' },
          { key: 'PwD / Divyangjan Candidates', value: 'Exempted (₹0)' },
          { key: 'Application Correction / Revision Charge', value: '₹200 (1st Revision) / ₹500 (2nd Revision)' },
        ],
      },
      {
        title: 'Vacancy Details & Post-Wise Eligibility',
        rows: [
          { key: 'Cadre / Post Title', value: job.title },
          { key: 'Essential Educational Qualification', value: job.qualification || 'Higher Secondary (10+2) / Bachelor Degree' },
          { key: 'Eligible Degree Qualifications', value: Array.isArray(job.eligibleDegrees) && job.eligibleDegrees.length > 0 ? job.eligibleDegrees.join(', ') : 'All recognized Bachelor Degrees / Diplomas' },
          { key: 'Eligible Branches / Disciplines', value: Array.isArray(job.eligibleBranches) && job.eligibleBranches.length > 0 ? job.eligibleBranches.join(', ') : 'All streams / disciplines' },
        ],
      },
    ];
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
                  {job.vacancies ? (
                    <><strong>{job.vacancies.toLocaleString('en-IN')}</strong> Total Vacancies</>
                  ) : (
                    <strong>Exam / Merit Based</strong>
                  )}
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

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                <button
                  type="button"
                  onClick={handleToggleTrack}
                  disabled={trackingLoading}
                  className="btn btn-outline"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: isTracked ? '#ECFDF5' : 'transparent',
                    borderColor: isTracked ? '#A7F3D0' : 'var(--color-border)',
                    color: isTracked ? '#047857' : 'inherit',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} color={isTracked ? "#10B981" : "var(--color-text-muted)"} />
                  <span>{isTracked ? 'Tracking Deadline' : 'Track Deadline'}</span>
                </button>
              )}

              {!isAdmin && !isAgent && (
                <Link
                  to={`/assistance/book?jobId=${job.id}`}
                  onClick={handleBookAssisted}
                  className="btn btn-secondary"
                >
                  <Sparkles size={16} />
                  <span>
                    {user?.isProMember && user?.assistanceCredits?.available !== false
                      ? 'Book Assisted Application (1 Free Credit)'
                      : 'Book Assisted Application (₹69)'}
                  </span>
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
            {/* Dynamic Specification Tables (Overview, Fees, Vacancies, etc.) */}
            {getSpecificationTables().map((tbl, tblIdx) => (
              <div key={tblIdx} className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
                <h3 style={{
                  fontSize: '1.15rem',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Table size={18} /> {tbl.title || `Specification Table ${tblIdx + 1}`}
                </h3>

                <div style={{
                  overflowX: 'auto',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <tbody>
                      {tbl.rows?.map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          style={{
                            borderBottom: rIdx === tbl.rows.length - 1 ? 'none' : '1px solid var(--color-border)',
                            backgroundColor: rIdx % 2 === 0 ? 'var(--color-bg)' : '#FFFFFF'
                          }}
                        >
                          <td style={{
                            padding: '0.85rem 1.25rem',
                            fontWeight: 700,
                            color: 'var(--color-text-title)',
                            width: '38%',
                            verticalAlign: 'middle',
                            borderRight: '1px solid var(--color-border)',
                            fontSize: '0.88rem'
                          }}>
                            {row.key}
                          </td>
                          <td style={{
                            padding: '0.85rem 1.25rem',
                            color: 'var(--color-text-body)',
                            lineHeight: 1.5,
                            fontSize: '0.88rem'
                          }}>
                            {row.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Official Notification Description */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
              <h3 style={{
                fontSize: '1.15rem',
                color: 'var(--color-primary)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FileText size={18} /> Official Notification Overview & Gazette Details
              </h3>
              <div style={{
                fontSize: '0.95rem',
                lineHeight: 1.75,
                color: 'var(--color-text-body)',
                whiteSpace: 'pre-line',
                backgroundColor: 'var(--color-bg)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
              }}>
                {job.description || 'Candidates are invited to apply for the advertised post in accordance with the official recruitment circular. Please examine all educational credentials, domicile certificates, and reservation category norms prior to online submission.'}
              </div>
            </div>

            {/* Candidate Matcher Criteria (Eligible Degrees & Disciplines) */}
            {((Array.isArray(job.eligibleDegrees) && job.eligibleDegrees.length > 0) ||
              (Array.isArray(job.eligibleBranches) && job.eligibleBranches.length > 0)) && (
              <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
                <h3 style={{
                  fontSize: '1.15rem',
                  color: 'var(--color-primary)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <CheckSquare size={18} /> Advertised Eligible Degrees & Disciplines
                </h3>

                {Array.isArray(job.eligibleDegrees) && job.eligibleDegrees.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Eligible Degree Qualifications
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {job.eligibleDegrees.map((deg, i) => (
                        <span key={i} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--color-primary-subtle)',
                          color: 'var(--color-primary)',
                          border: '1px solid var(--color-border)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          <GraduationCap size={13} /> {deg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(job.eligibleBranches) && job.eligibleBranches.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Eligible Branches / Specializations
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {job.eligibleBranches.map((br, i) => (
                        <span key={i} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--color-accent-subtle)',
                          color: 'var(--color-accent)',
                          border: '1px solid var(--color-accent-border)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)'
                        }}>
                          {br}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  ) : activeEligibility ? (
                    <div>
                      <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '0.85rem',
                        backgroundColor: activeEligibility.bgColor,
                        border: `1px solid ${activeEligibility.borderColor}`,
                        color: activeEligibility.color,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {activeEligibility.status === ELIGIBILITY_STATUS.LIKELY_ELIGIBLE && <CheckCircle2 size={18} />}
                        {activeEligibility.status === ELIGIBILITY_STATUS.MAY_BE_ELIGIBLE && <AlertCircle size={18} />}
                        {activeEligibility.status === ELIGIBILITY_STATUS.LIKELY_NOT_ELIGIBLE && <XCircle size={18} />}
                        <span>{activeEligibility.label}</span>
                      </div>

                      {activeEligibility.reasons?.length > 0 && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {activeEligibility.reasons.map((r, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                              <span style={{ color: activeEligibility.color, fontWeight: 700 }}>•</span>
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
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
                    <span>maxEvoG Desk Charge:</span>
                    <strong style={{ color: '#FED7AA' }}>₹69</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94A3B8' }}>
                    <span>Official Portal Fee:</span>
                    <span>{job.fee === 0 ? '₹0 (Exempted)' : `Up to ₹${job.fee}`} (Paid by you on portal)</span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '0.35rem', display: 'flex', justifyContent: 'space-between', color: '#FED7AA' }}>
                    <strong>Pay Today to Book:</strong>
                    <strong>₹69</strong>
                  </div>
                </div>

                <Link
                  to={`/assistance/book?jobId=${job.id}`}
                  onClick={handleBookAssisted}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Sparkles size={16} /> Book Session (₹69)
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
