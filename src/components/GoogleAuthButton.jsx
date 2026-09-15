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

  // Process tokens or credential and complete candidate authentication
  const processOAuthPayload = async ({ accessToken, idToken, credential }) => {
    setLoading(true);
    setError('');
    try {
      let email = '';
      let fullName = '';
      let avatarUrl = '';
      let googleId = '';
      const jwtToken = idToken || credential;

      if (jwtToken) {
        try {
          const base64Url = jwtToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const parsed = JSON.parse(jsonPayload);
          email = parsed.email || '';
          fullName = parsed.name || '';
          avatarUrl = parsed.picture || '';
          googleId = parsed.sub || '';
        } catch (e) {
          console.warn('Could not decode credential payload client-side', e);
        }
      }

      if (accessToken && (!email || !googleId)) {
        try {
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (userInfoRes.ok) {
            const userInfo = await userInfoRes.json();
            email = userInfo.email || email;
            fullName = userInfo.name || fullName;
            avatarUrl = userInfo.picture || avatarUrl;
            googleId = userInfo.sub || googleId;
          }
        } catch (fetchErr) {
          console.warn('Failed to retrieve userinfo from Google API:', fetchErr);
        }
      }

      await loginWithGoogle({
        credential: jwtToken,
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

  const handleCredentialResponse = async (response) => {
    if (response?.credential) {
      await processOAuthPayload({ credential: response.credential });
    }
  };

  // Direct OAuth 2.0 Popup Flow (100% resilient when ad blockers block Google GSI scripts)
  const handleDirectGoogleOAuth = () => {
    if (!clientId) {
      handleSimulatedGoogleLogin();
      return;
    }

    setLoading(true);
    setError('');

    const redirectUri = `${window.location.origin}/`;
    const nonce = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const state = Math.random().toString(36).substring(2);

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'token id_token');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('prompt', 'select_account');
    googleAuthUrl.searchParams.set('nonce', nonce);
    googleAuthUrl.searchParams.set('state', state);

    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      googleAuthUrl.toString(),
      'GoogleOAuthWindow',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no`
    );

    if (!popup) {
      // If browser blocks popup, navigate current window
      window.location.href = googleAuthUrl.toString();
      return;
    }

    let pollInterval = null;
    let timeoutTimer = null;

    const cleanup = () => {
      if (pollInterval) clearInterval(pollInterval);
      if (timeoutTimer) clearTimeout(timeoutTimer);
      window.removeEventListener('message', messageListener);
    };

    const messageListener = async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'MAXEVOG_GOOGLE_AUTH_TOKEN' && event.data?.payload) {
        cleanup();
        await processOAuthPayload(event.data.payload);
      }
    };

    window.addEventListener('message', messageListener);

    // Cross-origin safe hash polling when popup redirects back to origin
    pollInterval = setInterval(async () => {
      try {
        if (!popup || popup.closed) {
          cleanup();
          setLoading(false);
          return;
        }

        if (popup.location && popup.location.href.includes(window.location.origin)) {
          const rawHash = popup.location.hash || popup.location.search || '';
          popup.close();
          cleanup();

          if (rawHash) {
            const params = new URLSearchParams(rawHash.startsWith('#') ? rawHash.slice(1) : rawHash);
            const accessToken = params.get('access_token');
            const idToken = params.get('id_token');
            const errorParam = params.get('error');

            if (errorParam) {
              setError(`Google Sign-In error: ${errorParam}`);
              setLoading(false);
              return;
            }

            if (accessToken || idToken) {
              await processOAuthPayload({ accessToken, idToken });
              return;
            }
          }
          setLoading(false);
        }
      } catch (e) {
        // Expected cross-origin error while on accounts.google.com
      }
    }, 400);

    // 2-minute safety timeout
    timeoutTimer = setTimeout(() => {
      cleanup();
      setLoading(false);
    }, 120000);
  };

  // Primary OAuth Trigger: attempts GIS tokenClient first, gracefully falls back to Direct OAuth popup
  const handleOAuthLoginClick = async () => {
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } else if (window.google?.accounts?.oauth2) {
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
            await processOAuthPayload({ accessToken: tokenResponse.access_token });
          },
        });
        setTokenClient(client);
        client.requestAccessToken({ prompt: 'select_account' });
      } catch (err) {
        handleDirectGoogleOAuth();
      }
    } else {
      // Ad-blocker active or script blocked: trigger direct Google OAuth popup
      handleDirectGoogleOAuth();
    }
  };

  // Demo Google Login fallback if Google Client ID is not provided
  const handleSimulatedGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const mockEmail = `google.aspirant.${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
      await loginWithGoogle({
        email: mockEmail,
        fullName: 'Gov Aspirant (Google Demo)',
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
              await processOAuthPayload({ accessToken: tokenResponse.access_token });
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
        // Ad blocker blocked gsi/client - gracefully stay ready with Direct OAuth popup
        setGisLoaded(false);
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
      <div>
        {clientId && (
          <div ref={btnContainerRef} style={{ width: '100%', minHeight: gisLoaded ? '44px' : '0' }} />
        )}
        {(!gisLoaded || !btnContainerRef.current?.hasChildNodes()) && (
          <button
            type="button"
            onClick={handleOAuthLoginClick}
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
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              marginTop: btnContainerRef.current?.hasChildNodes() ? '0.5rem' : '0',
              opacity: loading ? 0.7 : 1,
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
            <span>{loading ? 'Opening Google Sign-In...' : text}</span>
          </button>
        )}
      </div>

      {error && (
        <div style={{ color: 'var(--color-danger)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </div>
  );
};
