import React, { useState, useEffect } from 'react';
import { proApi } from '../api/pro.api';
import { useToast } from '../context/ToastContext';
import {
  Bell,
  Mail,
  Send,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Smartphone,
  Check,
  AlertCircle
} from 'lucide-react';

export const NotificationPreferencesModal = ({ isOpen, onClose, onUpdated }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [connectingTelegram, setConnectingTelegram] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState('');

  const [prefs, setPrefs] = useState({
    emailEnabled: true,
    telegramEnabled: false,
    inAppAlerts: true,
    newMatchingJobAlerts: true,
    deadlineAlerts: true,
  });

  const [telegramData, setTelegramData] = useState({
    connected: false,
    chatId: null,
    connectCode: '',
    botLink: null,
  });

  useEffect(() => {
    if (isOpen) {
      loadPreferences();
    }
  }, [isOpen]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const res = await proApi.getPreferences();
      if (res.data?.success) {
        const p = res.data.data.preferences;
        setPrefs({
          emailEnabled: p.emailEnabled ?? true,
          telegramEnabled: p.telegramEnabled ?? false,
          inAppAlerts: p.inAppAlerts ?? true,
          newMatchingJobAlerts: p.newMatchingJobAlerts ?? true,
          deadlineAlerts: p.deadlineAlerts ?? true,
        });
        setTelegramData(res.data.data.telegram || {});
        if (res.data.data.telegram?.chatId) {
          setTelegramChatId(res.data.data.telegram.chatId);
        }
      }
    } catch (err) {
      console.error('Failed to load notification preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const res = await proApi.updatePreferences(prefs);
      if (res.data?.success) {
        showToast('success', 'Notification preferences saved successfully!');
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err) {
      showToast('error', 'Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleConnectTelegram = async () => {
    if (!telegramChatId.trim()) {
      showToast('error', 'Please enter your Telegram Chat ID');
      return;
    }

    setConnectingTelegram(true);
    try {
      const res = await proApi.connectTelegram(telegramChatId.trim());
      if (res.data?.success) {
        showToast('success', 'Telegram channel connected successfully!');
        setPrefs((prev) => ({ ...prev, telegramEnabled: true }));
        setTelegramData((prev) => ({ ...prev, connected: true, chatId: telegramChatId.trim() }));
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to connect Telegram');
    } finally {
      setConnectingTelegram(false);
    }
  };

  const handleDisconnectTelegram = async () => {
    try {
      const res = await proApi.disconnectTelegram();
      if (res.data?.success) {
        showToast('info', 'Telegram alerts disconnected');
        setPrefs((prev) => ({ ...prev, telegramEnabled: false }));
        setTelegramData((prev) => ({ ...prev, connected: false, chatId: null }));
        setTelegramChatId('');
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      showToast('error', 'Failed to disconnect Telegram');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-secondary-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-secondary)',
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                Notification Preferences
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Multi-channel opportunity protection & deadline reminders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ padding: '0.4rem', borderRadius: 'var(--radius-full)' }}
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading notification channels...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Delivery Channels */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-title)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Delivery Channels
              </h4>

              {/* Email Channel */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-title)' }}>
                      Email Notifications (Guaranteed)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Primary channel for verified opportunity & deadline alerts
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.emailEnabled}
                  onChange={(e) => setPrefs({ ...prefs, emailEnabled: e.target.checked })}
                  style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                />
              </div>

              {/* In-App / Portal Channel */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.9rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Smartphone size={18} color="var(--color-accent)" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-title)' }}>
                      In-App Dashboard Alerts
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Real-time badges and notifications in your maxEvoG portal
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.inAppAlerts}
                  onChange={(e) => setPrefs({ ...prefs, inAppAlerts: e.target.checked })}
                  style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                />
              </div>

              {/* Telegram Channel */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: telegramData.connected
                    ? '1px solid #0088CC'
                    : '1px solid var(--color-border)',
                  backgroundColor: telegramData.connected ? '#F0F9FF' : 'var(--color-bg)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Send size={18} color="#0088CC" />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-title)' }}>
                        Telegram Bot (Free Official API)
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        High-speed instant alerts sent directly to your Telegram
                      </div>
                    </div>
                  </div>
                  {telegramData.connected ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#DCFCE7',
                        color: '#16A34A',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      <CheckCircle2 size={13} /> Connected
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        backgroundColor: '#F1F5F9',
                        color: '#64748B',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      Optional
                    </span>
                  )}
                </div>

                {/* Telegram Connection Form */}
                {telegramData.connected ? (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0, 136, 204, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.8rem', color: '#0369A1' }}>
                      Linked to Chat ID: <strong>{telegramData.chatId}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={handleDisconnectTelegram}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-body)', marginBottom: '0.6rem' }}>
                      To connect, open Telegram and send <code>/start</code> or find your Chat ID from{' '}
                      <strong>@userinfobot</strong>:
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Enter your Telegram Chat ID (e.g. 123456789)"
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.45rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-border)',
                          fontSize: '0.85rem',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleConnectTelegram}
                        disabled={connectingTelegram}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: '#0088CC', borderColor: '#0088CC' }}
                      >
                        {connectingTelegram ? 'Connecting...' : 'Connect'}
                      </button>
                    </div>

                    {telegramData.botLink && (
                      <div style={{ marginTop: '0.6rem' }}>
                        <a
                          href={telegramData.botLink}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.78rem',
                            color: '#0088CC',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          <ExternalLink size={13} /> Open Official Telegram Bot
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notification Topics */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-title)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Alert Categories
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-title)' }}>
                      New Matching Recruitment Alerts
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                      Instant alert when a job matches your degree, age, and profile
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.newMatchingJobAlerts}
                    onChange={(e) => setPrefs({ ...prefs, newMatchingJobAlerts: e.target.checked })}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-title)' }}>
                      Tracked Deadlines & Extensions (D-7, D-3, D-1)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                      Automated urgency countdowns for jobs you are monitoring
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.deadlineAlerts}
                    onChange={(e) => setPrefs({ ...prefs, deadlineAlerts: e.target.checked })}
                    style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                  />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <button onClick={onClose} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button
                onClick={handleSavePreferences}
                disabled={saving}
                className="btn btn-primary btn-sm"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
