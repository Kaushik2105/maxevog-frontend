import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationsApi } from '../api/applications.api';
import { 
  CheckCircle2, 
  Clock, 
  Video, 
  FileCheck, 
  Upload, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  ExternalLink,
  Lock,
  Sparkles
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const ApplicationDetailPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorizing, setAuthorizing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authorizationRemarks, setAuthorizationRemarks] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [error, setError] = useState('');

  const stages = [
    { key: 'draft', label: 'Draft Created' },
    { key: 'assistance_scheduled', label: 'Session Booked' },
    { key: 'documents_verified', label: 'Docs Verified' },
    { key: 'form_filled', label: 'Form Prepared' },
    { key: 'candidate_authorization_pending', label: 'Candidate Consent' },
    { key: 'submitted', label: 'Official Submission' },
    { key: 'admit_card_ready', label: 'Admit Card Issued' },
    { key: 'result_declared', label: 'Result Published' }
  ];

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await applicationsApi.getApplicationById(id);
      if (res.data?.success) {
        setApplication(res.data.data.application || res.data.data);
      }
    } catch (err) {
      console.error('Failed to load application details:', err);
      setError('Unable to load application record');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async () => {
    setAuthorizing(true);
    setError('');
    try {
      const res = await applicationsApi.authorizeSubmission(id, {
        authorized: true,
        remarks: authorizationRemarks || 'Authorized by candidate after live preview'
      });
      if (res.data?.success) {
        setShowAuthModal(false);
        fetchDetails();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authorization failed');
    } finally {
      setAuthorizing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(true);
    setUploadSuccess('');
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', file.name);

    try {
      const res = await applicationsApi.uploadDocument(id, formData);
      if (res.data?.success) {
        setUploadSuccess('Document successfully uploaded & encrypted for session review.');
        fetchDetails();
      }
    } catch (err) {
      setError('Document upload failed. Ensure file is under 5MB.');
    } finally {
      setUploadingDoc(false);
    }
  };

  // Determine current stage index for stepper
  const getCurrentStageIndex = () => {
    if (!application?.status) return 0;
    const idx = stages.findIndex((s) => s.key === application.status);
    return idx >= 0 ? idx : 1;
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
        <p style={{ color: 'var(--color-text-muted)' }}>Retrieving application audit log...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Application Not Found</h2>
        <Link to="/applications" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Applications
        </Link>
      </div>
    );
  }

  const currentStageIndex = getCurrentStageIndex();
  const isConsentPending = application.status === 'candidate_authorization_pending';

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Navigation */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/applications" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} /> Back to My Applications
          </Link>
        </div>

        {/* Header card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-primary">{application.Job?.organization || 'Recruitment Board'}</span>
                <span className="badge badge-neutral">Ref: {application.applicationNumber || application.id.slice(0, 8)}</span>
              </div>
              <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                {application.Job?.title || 'Examination Application'}
              </h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Application registered on {new Date(application.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            <div>
              {isConsentPending ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn btn-secondary"
                  style={{ animation: 'pulse 2s infinite' }}
                >
                  <FileCheck size={16} /> Authorize Submission
                </button>
              ) : (
                <span className="badge badge-official" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                  {application.status?.replace(/_/g, ' ').toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Stepper */}
          <div style={{ margin: '2.5rem 0 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
              {/* Stepper Line Background */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '20px',
                right: '20px',
                height: '3px',
                backgroundColor: 'var(--color-border)',
                zIndex: 0
              }} />

              {/* Active Progress Line */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '20px',
                width: `${(currentStageIndex / (stages.length - 1)) * 95}%`,
                height: '3px',
                backgroundColor: 'var(--color-primary)',
                zIndex: 1,
                transition: 'width 0.4s ease'
              }} />

              {stages.map((stage, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={stage.key}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      width: '80px'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? 'var(--color-accent)' : isCurrent ? 'var(--color-primary)' : '#FFFFFF',
                      border: isCompleted ? '2px solid var(--color-accent)' : isCurrent ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                      color: isCompleted || isCurrent ? '#FFFFFF' : 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      marginBottom: '0.4rem',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(11, 37, 69, 0.15)' : 'none'
                    }}>
                      {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      lineHeight: 1.2
                    }}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CANDIDATE CONSENT ALERT IF PENDING */}
        {isConsentPending && (
          <div style={{
            backgroundColor: 'var(--color-secondary-subtle)',
            border: '2px solid var(--color-secondary-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                <Sparkles size={16} /> CANDIDATE CONSENT MANDATE REQUIRED
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                Your Assistant Prepared the Application Form
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-body)', margin: 0, maxWidth: '620px', lineHeight: 1.4 }}>
                Review the entered candidate details. Under maxEvoG's strict security policy, the official submission button cannot be triggered without your approval.
              </p>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              className="btn btn-secondary btn-lg"
            >
              Review & Authorize Submission
            </button>
          </div>
        )}

        {/* Two-Column Grid: Session Info & Documents */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }} className="detail-grid">
          {/* Left: Assisted Session Room */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Video size={18} /> Assisted Desk Session
            </h3>

            <div style={{
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              border: '1px solid var(--color-border)',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Specialist Desk Agent:</span>
                <strong>{application.assistanceSession?.agentName || 'Senior Desk Officer'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Assistance Status:</span>
                <span className="badge badge-primary">{application.assistanceSession?.status || 'Scheduled'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Scheduled Time:</span>
                <strong>
                  {application.assistanceSession?.scheduledAt ? 
                    new Date(application.assistanceSession.scheduledAt).toLocaleString('en-IN') : 
                    'Confirmed on booking'}
                </strong>
              </div>
            </div>

            {/* Google Meet Launch Button */}
            <a
              href={application.assistanceSession?.meetingUrl || 'https://meet.google.com/new'}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Video size={18} />
              <span>Launch Google Meet Session</span>
              <ExternalLink size={14} />
            </a>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginTop: '1rem',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              backgroundColor: 'var(--color-surface-hover)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <Lock size={15} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <span>
                <strong>Reminder:</strong> Keep your Aadhaar / Educational marksheets accessible. Never share OTPs or passwords aloud; enter them on screen yourself.
              </span>
            </div>
          </div>

          {/* Right: Uploaded Documents */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={18} /> Scanned Documents & Proofs
            </h3>

            {uploadSuccess && (
              <div style={{
                backgroundColor: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                marginBottom: '1rem'
              }}>
                {uploadSuccess}
              </div>
            )}

            <div style={{
              border: '2px dashed var(--color-border-hover)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-bg)',
              marginBottom: '1rem'
            }}>
              <Upload size={24} color="var(--color-text-muted)" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-title)', marginBottom: '0.25rem' }}>
                Upload Certificate / ID Proof
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                PDF, JPG, PNG up to 5MB
              </div>
              <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingDoc}
                />
                <span>{uploadingDoc ? 'Uploading...' : 'Choose File'}</span>
              </label>
            </div>

            {application.documents && application.documents.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {application.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <span>{doc.name || `Document_${idx + 1}`}</span>
                    <span className="badge badge-official">Attached</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                No documents uploaded yet.
              </div>
            )}
          </div>
        </div>

        {/* Modal: Candidate Authorization */}
        <Modal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          title="Candidate Consent & Authorization Mandate"
        >
          <div>
            <div style={{
              backgroundColor: 'var(--color-primary-subtle)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #BFDBFE',
              marginBottom: '1rem',
              fontSize: '0.82rem',
              color: 'var(--color-primary)'
            }}>
              <strong>Legal Notice:</strong> As per maxEvoG security guidelines, your assistant has completed data entry according to your instructions. Reviewing this confirmation digitally authorizes the official submission to the board.
            </div>

            <div style={{
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem',
              border: '1px solid var(--color-border)',
              marginBottom: '1rem',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
              <div><strong>Target Recruitment:</strong> {application.Job?.title}</div>
              <div><strong>Board Authority:</strong> {application.Job?.organization}</div>
              <div><strong>Board Fee:</strong> ₹{application.Job?.fee || 0}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Optional Aspirant Remarks / Special Notes</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="I confirm all particulars, dates, and caste certificates are accurate."
                value={authorizationRemarks}
                onChange={(e) => setAuthorizationRemarks(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Review Again
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                disabled={authorizing}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <FileCheck size={16} />
                <span>{authorizing ? 'Submitting...' : 'Confirm & Authorize Submission'}</span>
              </button>
            </div>
          </div>
        </Modal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
