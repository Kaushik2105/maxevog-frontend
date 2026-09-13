import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requireAdmin = false, requireAgent = false }) => {
  const { isAuthenticated, isAdmin, isAgent, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Authenticating secure session...
        </span>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location.pathname.startsWith('/assistance')) {
      return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
    }
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireAgent && !isAgent && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

