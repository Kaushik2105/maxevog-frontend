import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const GoogleAuthButton = ({ text = 'Continue with Google', onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const btnContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [gisLoaded, setGisLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    import.meta.env.GOOGLE_CLIENT_ID ||
    '';

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    setError('');
    try {
      let email = '';
      let fullName = '';
      let avatarUrl = '';
      let googleId = '';

      if (response.credential) {
        try {
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const parsed = JSON.parse(jsonPayload);
          email = parsed.email;
          fullName = parsed.name;
          avatarUrl = parsed.picture;
          googleId = parsed.sub;
        } catch (e) {
          console.warn('Could not decode credential payload client-side', e);
        }
      }

      await loginWithGoogle({
        credential: response.credential,
        email,
        fullName,
        avatarUrl,
        googleId,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Google OAuth failed:', err);
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Popup OAuth2 Token Client flow (works even if One-Tap or third-party cookies are blocked)
  const handleOAuthPopupLogin = async () => {
    if (!tokenClient && window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              setError(`Google Sign-In error: ${tokenResponse.error}`);
              setLoading(false);
              return;
            }
            try {
              setLoading(true);
              const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const userInfo = await userInfoRes.json();
              await loginWithGoogle({
                email: userInfo.email,
                fullName: userInfo.name,
                avatarUrl: userInfo.picture,
                googleId: userInfo.sub,
              });
              if (onSuccess) onSuccess();
              else navigate('/');
            } catch (fetchErr) {
              setError(fetchErr.message || 'Failed to retrieve profile from Google');
            } finally {
              setLoading(false);
            }
          },
        });
        setTokenClient(client);
        client.requestAccessToken({ prompt: 'select_account' });
      } catch (err) {
        setError(err.message || 'Failed to initialize Google OAuth popup');
      }
    } else if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } else {
      setError('Google Sign-In service is initializing or blocked by an extension. Please refresh or disable ad-blocker.');
    }
  };

  // Demo Google Login fallback if Google Client ID is not yet provided
  const handleSimulatedGoogleLogin = async () => {
    if (import.meta.env.PROD) {
      setError('Google Sign-In is not configured. Please configure VITE_GOOGLE_CLIENT_ID in environment variables.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const mockEmail = `google.aspirant.${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
      await loginWithGoogle({
        email: mockEmail,
        fullName: 'Gov Aspirant (Google)',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        googleId: `mock-google-${Date.now()}`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!clientId) return;

    const scriptId = 'google-gis-script';
    let script = document.getElementById(scriptId);

    const initializeGis = () => {
      setGisLoaded(true);
      if (window.google?.accounts?.id && btnContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          window.google.accounts.id.renderButton(btnContainerRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: text.includes('Sign in') ? 'signin_with' : 'signup_with',
            shape: 'rectangular',
          });
        } catch (e) {
          console.warn('Google Identity Services renderButton warning:', e);
        }
      }

      if (window.google?.accounts?.oauth2) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'email profile openid',
            callback: async (tokenResponse) => {
              if (tokenResponse.error) {
                setError(`Google error: ${tokenResponse.error}`);
                setLoading(false);
                return;
              }
              try {
                setLoading(true);
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoRes.json();
                await loginWithGoogle({
                  email: userInfo.email,
                  fullName: userInfo.name,
                  avatarUrl: userInfo.picture,
                  googleId: userInfo.sub,
                });
                if (onSuccess) onSuccess();
                else navigate('/');
              } catch (fetchErr) {
                setError(fetchErr.message || 'Failed to retrieve profile from Google');
              } finally {
                setLoading(false);
              }
            },
          });
          setTokenClient(client);
        } catch (e) {
          console.warn('Google oauth2 initTokenClient warning:', e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGis;
      script.onerror = () => {
        setError('Google authentication script was blocked by browser extension or network filter. Disable ad-blocker for this site.');
      };
      document.body.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initializeGis();
    } else {
      script.addEventListener('load', initializeGis);
    }
  }, [clientId, text]);

  return (
    <div style={{ width: '100%', marginBottom: '1.25rem' }}>
      {clientId ? (
        <div>
          <div ref={btnContainerRef} style={{ width: '100%', minHeight: '44px' }} />
          {(!gisLoaded || !btnContainerRef.current?.hasChildNodes()) && (
            <button
              type="button"
              onClick={handleOAuthPopupLogin}
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '0.7rem 1rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-title)',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                marginTop: btnContainerRef.current?.hasChildNodes() ? '0.5rem' : '0',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
                />
              </svg>
              <span>{loading ? 'Authenticating with Google...' : text}</span>
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleSimulatedGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '0.7rem 1rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-title)',
            fontWeight: 600,
            fontSize: '0.92rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
            />
          </svg>
          <span>{loading ? 'Authenticating with Google...' : text}</span>
        </button>
      )}

      {error && (
        <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
};
