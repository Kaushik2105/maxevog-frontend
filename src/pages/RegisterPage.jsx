import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthButton } from '../components/GoogleAuthButton';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { sendRegistrationOtp, registerWithOtp } = useAuth();

  // Step: 'FORM' | 'OTP'
  const [step, setStep] = useState('FORM');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await sendRegistrationOtp({
        email: formData.email,
        fullName: formData.name,
      });

      if (res?.data?.devOtp) {
        setDevOtpHint(res.data.devOtp);
      }

      setStep('OTP');
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await sendRegistrationOtp({
        email: formData.email,
        fullName: formData.name,
      });
      if (res?.data?.devOtp) {
        setDevOtpHint(res.data.devOtp);
      }
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!otp.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerWithOtp({
        fullName: formData.name,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: otp.trim(),
      });
      navigate('/applications');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1.4rem',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            mE
          </div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
            {step === 'FORM' ? 'Create Candidate Account' : 'Verify Email Address'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            {step === 'FORM'
              ? 'Join maxEvoG to receive automated deadline alerts and 1-on-1 application assistance.'
              : `We sent a 6-digit verification code to ${formData.email}`}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="card" style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}>
          {step === 'FORM' ? (
            <>
              {/* Google OAuth 2.0 Sign Up */}
              <GoogleAuthButton
                text="Sign up with Google"
                onSuccess={() => navigate('/applications')}
              />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '1.25rem 0',
                color: 'var(--color-text-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
                <span style={{ padding: '0 0.75rem', textTransform: 'uppercase' }}>Or register with email</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
              </div>

              {/* Manual 3-Field Registration */}
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label">Full Candidate Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <User size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="rahul.sharma@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Create Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      className="form-control"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={6}
                    />
                    <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }}
                >
                  <span>{loading ? 'Sending Code...' : 'Continue & Verify Email'}</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </>
          ) : (
            /* Step 2: EmailJS OTP Verification */
            <form onSubmit={handleVerifyOtp}>
              <div style={{
                textAlign: 'center',
                padding: '0.75rem',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
              }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Verification Code sent to:
                </div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.98rem' }}>
                  {formData.email}
                </div>
              </div>

              {devOtpHint && (
                <div style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1e40af',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.8rem',
                  textAlign: 'center'
                }}>
                  Dev Simulation OTP: <strong>{devOtpHint}</strong>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>
                  Enter 6-Digit Code
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    maxLength={6}
                    className="form-control"
                    style={{
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      letterSpacing: '0.4rem',
                      fontWeight: 700,
                      padding: '0.75rem',
                    }}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                    required
                  />
                  <KeyRound size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              >
                <span>{loading ? 'Verifying...' : 'Verify & Complete Registration'}</span>
                <CheckCircle2 size={18} />
              </button>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--color-border)',
                fontSize: '0.85rem'
              }}>
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <ArrowLeft size={14} />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  disabled={!canResend || loading}
                  onClick={handleResendOtp}
                  className="btn btn-ghost btn-sm"
                  style={{ color: canResend ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: 600 }}
                >
                  <RotateCcw size={14} />
                  <span>{canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: '1.5rem',
          fontSize: '0.78rem',
          color: 'var(--color-text-muted)'
        }}>
          <ShieldCheck size={14} color="var(--color-accent)" />
          <span>Zero Credential Retention Policy • Independent Aspirant Portal</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
