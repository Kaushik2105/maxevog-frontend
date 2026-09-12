import React, { useState, useEffect } from 'react';
import { feedbackApi } from '../api/feedback.api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, CheckCircle2, AlertCircle, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeedbackPage = () => {
  const { isAuthenticated } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Assistance Session');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadMyFeedbacks();
    }
  }, [isAuthenticated]);

  const loadMyFeedbacks = async () => {
    try {
      const res = await feedbackApi.getMyFeedbacks();
      if (res.data?.success) {
        setFeedbacks(res.data.data.feedbacks || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load previous tickets:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please sign in to submit feedback or file a grievance.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await feedbackApi.submitFeedback({
        subject,
        category,
        message,
        rating
      });

      if (res.data?.success) {
        setSuccess('Thank you! Your grievance / feedback has been received.');
        setSubject('');
        setMessage('');
        loadMyFeedbacks();
      } else {
        setError(res.data?.message || 'Submission failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
            Candidate Grievance & Feedback Portal
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Report an issue with your assisted application session, request a review, or share suggestions.
          </p>
        </div>

        {success && (
          <div style={{
            backgroundColor: 'var(--color-accent-subtle)',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Feedback Form */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="form-grid">
              <div className="form-group">
                <label className="form-label">Subject / Issue Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Assistance session Google Meet link issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Assistance Session">Assistance Session</option>
                  <option value="Payment & Fee Ledger">Payment & Fee Ledger</option>
                  <option value="Notification Alerts">Notification Alerts</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="General Grievance">General Grievance</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Rate Your Experience</label>
              <div style={{ display: 'flex', gap: '0.5rem', margin: '0.25rem 0' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    style={{ padding: '0.25rem' }}
                  >
                    <Star
                      size={24}
                      color={star <= rating ? '#F59E0B' : 'var(--color-border)'}
                      fill={star <= rating ? '#F59E0B' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Explain the circumstance or how we can improve our assistance service..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              <Send size={18} />
              <span>{submitting ? 'Submitting Grievance...' : 'Submit Grievance / Feedback'}</span>
            </button>
          </form>
        </div>

        {/* Previous Tickets */}
        {isAuthenticated && feedbacks.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              My Previous Tickets
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {feedbacks.map((item) => (
                <div
                  key={item.id}
                  className="card"
                  style={{ padding: '1.25rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="badge badge-neutral">{item.category}</span>
                    <span className="badge badge-official">{item.status || 'Received'}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--color-text-title)', marginBottom: '0.35rem' }}>
                    {item.subject}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-body)', margin: 0 }}>
                    {item.message}
                  </p>
                  {item.adminResponse && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: 'var(--color-primary-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--color-primary)'
                    }}>
                      <strong>Admin Resolution:</strong> {item.adminResponse}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
