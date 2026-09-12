import React, { useState, useEffect } from 'react';
import { agentApi } from '../../api/agent.api';
import { useAuth } from '../../context/AuthContext';
import { 
  Headphones, 
  Video, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldAlert, 
  ExternalLink, 
  UserCheck, 
  Upload, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Search,
  Save
} from 'lucide-react';
import { Modal } from '../../components/Modal';

export const AgentDashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'applications' | 'history'

  // Workbench active session
  const [activeSession, setActiveSession] = useState(null);
  const [meetingUrlInput, setMeetingUrlInput] = useState('');
  const [agentNotes, setAgentNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Document receipt modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashRes, sessionsRes, appsRes] = await Promise.all([
        agentApi.getDashboard(),
        agentApi.getSessions({ limit: 50 }),
        agentApi.getApplications({ limit: 50 }),
      ]);

      if (dashRes.data?.success) {
        setDashboardData(dashRes.data.data);
      }
      if (sessionsRes.data?.success) {
        const list = sessionsRes.data.data.sessions || [];
        setSessions(list);
        if (list.length > 0 && !activeSession) {
          setActiveSession(list[0]);
          setMeetingUrlInput(list[0].meetingUrl || 'https://meet.google.com/new');
          setAgentNotes(list[0].notes || '');
        }
      }
      if (appsRes.data?.success) {
        setApplications(appsRes.data.data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load agent dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = (session) => {
    setActiveSession(session);
    setMeetingUrlInput(session.meetingUrl || 'https://meet.google.com/new');
    setAgentNotes(session.notes || '');
  };

  const handleUpdateMeetingUrl = async () => {
    if (!activeSession) return;
    try {
      await agentApi.updateSession(activeSession.id, { meetingUrl: meetingUrlInput });
      setNotification('Meeting URL updated and saved!');
      loadData();
    } catch (err) {
      alert('Failed to update meeting link');
    }
  };

  const handleSaveNotes = async () => {
    if (!activeSession) return;
    setSavingNotes(true);
    try {
      await agentApi.updateSession(activeSession.id, { notes: agentNotes });
      setNotification('Specialist verification notes saved.');
      loadData();
    } catch (err) {
      alert('Failed to save notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleUpdateSessionStatus = async (status) => {
    if (!activeSession) return;
    try {
      await agentApi.updateSession(activeSession.id, { status });
      setNotification(`Session marked as ${status}`);
      loadData();
    } catch (err) {
      alert('Could not update session status');
    }
  };

  const handleAdvanceStage = async (appId, newStatus) => {
    try {
      await agentApi.updateApplicationStage(appId, {
        status: newStatus,
        remarks: `Advanced to ${newStatus} by Desk Specialist ${user?.name || user?.email}`,
      });
      setNotification(`Candidate application stage advanced to: ${newStatus.replace(/_/g, ' ')}`);
      loadData();
    } catch (err) {
      alert('Could not advance application stage');
    }
  };

  const handleUploadReceipt = async (e) => {
    e.preventDefault();
    if (!activeSession?.applicationId && !activeSession?.id) return;
    const targetId = activeSession.applicationId || activeSession.id;

    setUploadingReceipt(true);
    const formData = new FormData();
    if (receiptFile) formData.append('receipt', receiptFile);
    if (applicationNumber) formData.append('applicationNumber', applicationNumber);

    try {
      await agentApi.completeSubmission(targetId, formData);
      setNotification('Official board submission receipt successfully uploaded and finalized!');
      setShowReceiptModal(false);
      loadData();
    } catch (err) {
      alert('Failed to upload submission receipt');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const name = s.User?.profile?.fullName || s.User?.email || '';
    const jobTitle = s.Job?.title || '';
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || jobTitle.toLowerCase().includes(query);
  });

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-secondary)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.4rem' }}>
              <Headphones size={16} /> APPLICATION ASSISTANCE SPECIALIST WORKBENCH
            </div>
            <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: 0 }}>
              Desk Agent Live Console
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
              Officer: <strong>{user?.name || user?.email}</strong> • Assigned Sector: Central & State Public Commissions
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={loadData}
              className="btn btn-outline btn-sm"
            >
              Sync Live Queue
            </button>
            {activeSession?.meetingUrl && (
              <a
                href={activeSession.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary btn-sm"
              >
                <Video size={16} /> Open Candidate Meet
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {notification && (
          <div style={{
            backgroundColor: 'var(--color-accent-subtle)',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification('')} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-accent)' }}>
              Dismiss
            </button>
          </div>
        )}

        {/* Live Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>ASSIGNED APPLICANTS</span>
              <UserCheck size={18} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }} className="tabular-nums">
              {dashboardData?.totalAssignedSessions || sessions.length || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Total scheduled sessions in your roster
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>ACTIVE SESSIONS</span>
              <Video size={18} color="var(--color-secondary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-secondary)' }} className="tabular-nums">
              {dashboardData?.inProgressSessions || sessions.filter(s => s.status === 'IN_PROGRESS').length || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '0.2rem' }}>
              Desk calls currently live
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>COMPLETED SUBMISSIONS</span>
              <CheckCircle2 size={18} color="var(--color-accent)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent)' }} className="tabular-nums">
              {dashboardData?.completedSessions || sessions.filter(s => s.status === 'COMPLETED').length || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.2rem' }}>
              Successfully verified & submitted
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              <span>QUEUED FOR TODAY</span>
              <Clock size={18} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-title)' }} className="tabular-nums">
              {sessions.filter(s => s.status === 'SCHEDULED').length || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Upcoming desk slots awaiting connection
            </div>
          </div>
        </div>

        {/* WORKBENCH SECTION */}
        {activeSession && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary">ACTIVE WORKBENCH APPLICANT</span>
                  <span className="badge badge-neutral">Ref ID: {activeSession.id.slice(0, 8)}</span>
                  <span className={`badge ${activeSession.status === 'IN_PROGRESS' ? 'badge-urgent' : 'badge-official'}`}>
                    {activeSession.status || 'SCHEDULED'}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', margin: 0 }}>
                  Candidate: {activeSession.User?.profile?.fullName || activeSession.User?.email || 'Registered Aspirant'}
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  Target Exam: <strong>{activeSession.Job?.title || 'Public Recruitment Examination'}</strong> ({activeSession.Job?.organization})
                </div>
              </div>

              {/* Status Controls */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {activeSession.status !== 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleUpdateSessionStatus('IN_PROGRESS')}
                    className="btn btn-secondary btn-sm"
                  >
                    <Video size={15} /> Start Desk Session
                  </button>
                )}
                {activeSession.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => handleUpdateSessionStatus('COMPLETED')}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle2 size={15} /> Mark Session Finished
                  </button>
                )}
                <button
                  onClick={() => setShowReceiptModal(true)}
                  className="btn btn-outline btn-sm"
                >
                  <Upload size={14} /> Upload Submission Slip
                </button>
              </div>
            </div>

            {/* MANDATORY ETHICAL REMINDER PROMPTER */}
            <div style={{
              backgroundColor: 'var(--color-primary-subtle)',
              border: '1px solid #BFDBFE',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}>
              <ShieldAlert size={20} color="var(--color-secondary)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', lineHeight: 1.45 }}>
                <strong>CRITICAL ETHICAL DIRECTIVE:</strong> Never request the applicant to share passwords, SMS OTPs, or payment card details. Instruct them to enter credentials directly on their screen while you guide data verification and certificate resizing.
              </div>
            </div>

            {/* Two-Column Workbench Data */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '1.5rem',
              alignItems: 'flex-start'
            }} className="workbench-grid">
              {/* Left Column: Stage Controller & Conference */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Meeting Link Manager */}
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                    Candidate Google Meet Link
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="url"
                      className="form-control"
                      value={meetingUrlInput}
                      onChange={(e) => setMeetingUrlInput(e.target.value)}
                      placeholder="https://meet.google.com/xyz-abc-def"
                    />
                    <button
                      type="button"
                      onClick={handleUpdateMeetingUrl}
                      className="btn btn-outline btn-sm"
                    >
                      <Save size={14} /> Save
                    </button>
                    {meetingUrlInput && (
                      <a
                        href={meetingUrlInput}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        Join
                      </a>
                    )}
                  </div>
                </div>

                {/* Live Stage Advancement Stepper */}
                <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                    Application Workflow Controller
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleAdvanceStage(activeSession.id, 'documents_verified')}
                      className="btn btn-outline btn-sm"
                      style={{ justifyContent: 'flex-start', padding: '0.6rem 0.85rem' }}
                    >
                      <CheckCircle2 size={15} color="var(--color-accent)" />
                      <span>1. Mark Scanned Documents Verified & Ready</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdvanceStage(activeSession.id, 'form_filled')}
                      className="btn btn-outline btn-sm"
                      style={{ justifyContent: 'flex-start', padding: '0.6rem 0.85rem' }}
                    >
                      <FileText size={15} color="var(--color-primary)" />
                      <span>2. Mark Official Board Form Filled & Previewed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdvanceStage(activeSession.id, 'candidate_authorization_pending')}
                      className="btn btn-secondary btn-sm"
                      style={{ justifyContent: 'flex-start', padding: '0.6rem 0.85rem' }}
                    >
                      <Sparkles size={15} />
                      <span>3. Request Candidate Consent & Authorization</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAdvanceStage(activeSession.id, 'submitted')}
                      className="btn btn-primary btn-sm"
                      style={{ justifyContent: 'flex-start', padding: '0.6rem 0.85rem' }}
                    >
                      <CheckCircle2 size={15} />
                      <span>4. Mark Officially Submitted to Government Board</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Candidate Dossier & Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Candidate Info Card */}
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary)', marginBottom: '0.6rem' }}>
                    Candidate Profile Particulars
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div><strong>Mobile:</strong> {activeSession.User?.profile?.mobileNumber || activeSession.User?.phone || 'Not provided'}</div>
                    <div><strong>Email:</strong> {activeSession.User?.email}</div>
                    <div><strong>Reservation Category:</strong> {activeSession.User?.profile?.category || 'General (UR)'}</div>
                    <div><strong>State Domicile:</strong> {activeSession.User?.profile?.state || 'All India'}</div>
                    <div><strong>Qualification:</strong> {activeSession.User?.profile?.highestQualification || 'Graduate'}</div>
                    {activeSession.notes && (
                      <div style={{ marginTop: '0.35rem', color: 'var(--color-secondary)' }}>
                        <strong>Applicant Note:</strong> "{activeSession.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Desk Verification Notes */}
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
                    Internal Specialist Notes
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter notes on category certificate status, fee clearance, or photo adjustments..."
                    value={agentNotes}
                    onChange={(e) => setAgentNotes(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTROLS */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('queue')}
              style={{
                padding: '0.75rem 1rem',
                borderBottom: activeTab === 'queue' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'queue' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: activeTab === 'queue' ? 700 : 500,
                fontSize: '0.95rem',
                marginBottom: '-2px'
              }}
            >
              Assigned Queue ({sessions.length})
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              style={{
                padding: '0.75rem 1rem',
                borderBottom: activeTab === 'applications' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'applications' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: activeTab === 'applications' ? 700 : 500,
                fontSize: '0.95rem',
                marginBottom: '-2px'
              }}
            >
              Candidate Applications ({applications.length})
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.35rem 0.75rem',
            gap: '0.5rem',
            width: '280px'
          }}>
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search candidate or job..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* TAB 1: ASSIGNED QUEUE */}
        {activeTab === 'queue' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            {filteredSessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                No assigned applicants in your queue right now.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {filteredSessions.map((item) => {
                  const isSelected = activeSession?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                          <span className={`badge ${item.status === 'IN_PROGRESS' ? 'badge-urgent' : item.status === 'COMPLETED' ? 'badge-official' : 'badge-primary'}`}>
                            {item.status || 'SCHEDULED'}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            Slot: {item.timeSlot?.startTime || 'Morning Desk'}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', color: 'var(--color-text-title)', margin: '0 0 0.25rem 0' }}>
                          {item.User?.profile?.fullName || item.User?.email || 'Candidate'}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          Exam: <strong>{item.Job?.title || 'Recruitment Exam'}</strong> ({item.Job?.organization})
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                          onClick={() => handleSelectSession(item)}
                          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                        >
                          {isSelected ? 'Currently Loaded' : 'Load into Workbench'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CANDIDATE APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Candidate</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Recruitment Exam</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Board Fee</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Registered Date</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>
                        {app.user?.profile?.fullName || app.user?.email || 'Candidate'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        {app.job?.title || 'Civil Recruitment'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className="badge badge-primary">{app.status?.replace(/_/g, ' ')}</span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        ₹{app.job?.fee || 0}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-text-muted)' }}>
                        {new Date(app.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleAdvanceStage(app.id, 'submitted')}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem' }}
                        >
                          Mark Submitted
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL: UPLOAD SUBMISSION RECEIPT */}
        <Modal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          title="Upload Official Board Confirmation Slip"
        >
          <form onSubmit={handleUploadReceipt}>
            <div className="form-group">
              <label className="form-label">Official Board Application / Roll Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. SSC-2026-987654321"
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Acknowledgment PDF / Screenshot</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setReceiptFile(e.target.files[0])}
                required
              />
              <div className="form-helper">PDF, PNG, JPG up to 5MB</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowReceiptModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={uploadingReceipt} className="btn btn-primary">
                {uploadingReceipt ? 'Uploading...' : 'Confirm Submission'}
              </button>
            </div>
          </form>
        </Modal>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .workbench-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
