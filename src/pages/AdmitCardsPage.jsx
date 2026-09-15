import React, { useState, useEffect } from 'react';
import { admitCardsApi } from '../api/admitCards.api';
import { FileText, Search, ExternalLink, Calendar, Building2, AlertCircle } from 'lucide-react';

export const AdmitCardsPage = () => {
  const [admitCards, setAdmitCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await admitCardsApi.getAdmitCards({ limit: 50 });
      if (res.data?.success) {
        setAdmitCards(res.data.data.admitCards || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load admit cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = admitCards.filter((c) =>
    searchQuery === '' ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <FileText size={16} /> OFFICIAL EXAMINATION HALL TICKETS
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            Admit Cards & Exam Schedules
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Download verified hall tickets and entrance letters directly from authorized commission servers.
          </p>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem 1rem',
          maxWidth: '540px',
          gap: '0.75rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <Search size={18} color="var(--color-text-muted)" />
          <input
            type="text"
            placeholder="Search by exam name, commission (e.g. UPSC, SSC, IBPS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="card" style={{ height: '90px', padding: '1rem' }}>
                <div className="skeleton" style={{ height: '1.2rem', width: '40%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: '1.5rem', width: '70%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((card) => (
              <div
                key={card.id}
                className="card card-interactive"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-primary">
                      <Building2 size={12} /> {card.organization}
                    </span>
                    <span className="badge badge-official">Official Link</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-title)', marginBottom: '0.4rem' }}>
                    {card.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    {card.examDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                        <Calendar size={14} />
                        Exam Date: {new Date(card.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                    {(card.releaseDate || card.availabilityDate) && (
                      <div>Released: {new Date(card.releaseDate || card.availabilityDate).toLocaleDateString('en-IN')}</div>
                    )}
                  </div>
                </div>

                {(card.downloadUrl || card.officialAdmitCardUrl || card.attachmentUrl) ? (
                  <a
                    href={card.downloadUrl || card.officialAdmitCardUrl || card.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <span>Download Hall Ticket</span>
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <button className="btn btn-outline btn-sm" disabled>
                    Release Pending
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <AlertCircle size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Admit Cards Match Your Search</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Check back frequently as examination commissions publish admit cards 7-14 days before test dates.</p>
          </div>
        )}
      </div>
    </div>
  );
};
