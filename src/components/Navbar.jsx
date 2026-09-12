import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  FileText, 
  Award, 
  CalendarCheck, 
  Sparkles, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  MessageSquare,
  Headphones
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isAgent, isPro, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Recruitments', path: '/', icon: Briefcase },
    { name: 'Admit Cards', path: '/admit-cards', icon: FileText },
    { name: 'Results', path: '/results', icon: Award },
    { name: 'Apply Assisted', path: '/assistance/book', icon: CalendarCheck, badge: '₹50' },
  ];

  return (
    <header style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-xs)'
    }}>
      {/* Top micro-announcement bar highlighting startup trust promises */}
      <div style={{
        backgroundColor: 'var(--color-primary)',
        color: '#E2E8F0',
        fontSize: '0.78rem',
        padding: '0.4rem 1.5rem',
        textAlign: 'center',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} color="#38BDF8" />
          <strong>Zero Credential Storage Guarantee:</strong> We never store passwords, OTPs, or captchas during assisted sessions.
        </span>
        <span style={{ opacity: 0.5, display: 'inline' }}>|</span>
        <span>Never miss an application deadline again.</span>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.25rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            backgroundColor: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '1.2rem',
            letterSpacing: '-0.03em',
            boxShadow: 'var(--shadow-sm)'
          }}>
            mE
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
                maxEvoG
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                BETA
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Recruitment & Application Assistance
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'var(--color-primary)' : 'var(--color-text-body)',
                  backgroundColor: active ? 'var(--color-primary-subtle)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={16} color={active ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                <span>{link.name}</span>
                {link.badge && (
                  <span style={{
                    backgroundColor: 'var(--color-secondary-subtle)',
                    color: 'var(--color-secondary)',
                    border: '1px solid var(--color-secondary-border)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.08rem 0.35rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {isAuthenticated && (
            <Link
              to="/applications"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: isActive('/applications') ? 700 : 500,
                color: isActive('/applications') ? 'var(--color-primary)' : 'var(--color-text-body)',
                backgroundColor: isActive('/applications') ? 'var(--color-primary-subtle)' : 'transparent',
              }}
            >
              <FileText size={16} color={isActive('/applications') ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
              <span>My Applications</span>
            </Link>
          )}

          <Link
            to="/membership"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              fontWeight: isActive('/membership') ? 700 : 500,
              color: isActive('/membership') ? 'var(--color-secondary)' : 'var(--color-text-body)',
              backgroundColor: isActive('/membership') ? 'var(--color-secondary-subtle)' : 'transparent',
            }}
          >
            <Sparkles size={16} color={isActive('/membership') ? 'var(--color-secondary)' : '#F59E0B'} />
            <span>Pro Club</span>
          </Link>

          {(isAgent || isAdmin) && (
            <Link
              to="/agent"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--color-secondary)',
                backgroundColor: 'var(--color-secondary-subtle)',
                border: '1px solid var(--color-secondary-border)'
              }}
            >
              <Headphones size={16} />
              <span>Desk Specialist</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#9333EA',
                backgroundColor: '#FAF5FF',
                border: '1px solid #E9D5FF'
              }}
            >
              <ShieldCheck size={16} />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* User Auth Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link 
                to="/profile" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  textDecoration: 'none'
                }}
              >
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-primary-subtle)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  overflow: 'hidden'
                }}>
                  {user?.profile?.avatarUrl ? (
                    <img
                      src={user.profile.avatarUrl}
                      alt="Avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (user?.profile?.fullName || user?.name) ? (
                    (user?.profile?.fullName || user?.name).charAt(0).toUpperCase()
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-title)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.profile?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Candidate'}
                  </span>
                  {isPro ? (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
                      PRO MEMBER
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-accent)' }}>
                      {user?.profile?.profileCompletionPercentage ?? 0}% Complete
                    </span>
                  )}
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log out"
                style={{ padding: '0.45rem' }}
              >
                <LogOut size={16} color="var(--color-text-muted)" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Free
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              padding: '0.5rem',
              display: 'none',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Responsive Style Overrides */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-text-title)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <link.icon size={18} color="var(--color-primary)" />
              <span>{link.name}</span>
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/applications"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-text-title)'
              }}
            >
              <FileText size={18} color="var(--color-primary)" />
              <span>My Applications</span>
            </Link>
          )}
          <Link
            to="/membership"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.75rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-secondary)'
            }}
          >
            <Sparkles size={18} color="var(--color-secondary)" />
            <span>Pro Club (₹99 / 3 Mo)</span>
          </Link>
          {(isAgent || isAdmin) && (
            <Link
              to="/agent"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.75rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--color-secondary)'
              }}
            >
              <Headphones size={18} color="var(--color-secondary)" />
              <span>Desk Specialist Workbench</span>
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.75rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#9333EA'
              }}
            >
              <ShieldCheck size={18} color="#9333EA" />
              <span>Master Admin Panel</span>
            </Link>
          )}
          <Link
            to="/feedback"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.75rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-text-title)'
            }}
          >
            <MessageSquare size={18} color="var(--color-text-muted)" />
            <span>Support & Grievances</span>
          </Link>
        </div>
      )}
    </header>
  );
};
