import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthButton } from '../components/GoogleAuthButton';
import { ShieldCheck, Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';

import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      toast.success('Successfully signed in! Welcome back.');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="https://res.cloudinary.com/dtyodrnjg/image/upload/v1789240920/cad0234d-7753-4e53-b919-421875a6387b_ttzjvc.png"
            alt="maxEvoG Logo"
            style={{
              height: '3.5rem',
              width: 'auto',
              margin: '0 auto 1rem',
              objectFit: 'contain',
              display: 'block',
            }}
          />
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
            Sign In to maxEvoG
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Access your applications, track deadlines, and launch assisted sessions.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
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
          {/* Google OAuth 2.0 Sign In */}
          <GoogleAuthButton
            text="Sign in with Google"
            onSuccess={() => navigate(from, { replace: true })}
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
            <span style={{ padding: '0 0.75rem', textTransform: 'uppercase' }}>Or sign in with email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Account Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            >
              <LogIn size={18} />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            Register Free
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
          <span>Encrypted Session • Zero Credential Sharing</span>
        </div>
      </div>
    </div>
  );
};
