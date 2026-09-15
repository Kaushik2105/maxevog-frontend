import React, { useState, useEffect } from 'react';
import { resultsApi } from '../api/results.api';
import { Award, Search, ExternalLink, Calendar, Building2, AlertCircle } from 'lucide-react';

export const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await resultsApi.getResults({ limit: 50 });
      if (res.data?.success) {
        setResults(res.data.data.results || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = results.filter((r) =>
    searchQuery === '' ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent)', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
            <Award size={16} /> OFFICIAL GAZETTE RESULTS & MERIT LISTS
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            Recruitment Exam Results
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Inspect qualified roll numbers, category-wise cut-off marks, and official state gazette scorecards.
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
            placeholder="Search by exam name, commission (e.g. UPSC, SSC CGL, Railway NTPC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
          />
        </div>

        {/* Results List */}
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
            {filtered.map((r) => (
              <div
                key={r.id}
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
                      <Building2 size={12} /> {r.organization}
                    </span>
                    <span className="badge badge-official">Declared</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-title)', marginBottom: '0.4rem' }}>
                    {r.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    {(r.declaredDate || r.resultDate) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} />
                        Date Declared: {new Date(r.declaredDate || r.resultDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                    {(r.cutoffMarks || r.cutoffInfo) && (
                      <div>Cutoff: <strong>{r.cutoffMarks || r.cutoffInfo}</strong></div>
                    )}
                  </div>
                </div>

                {(r.pdfUrl || r.officialResultUrl || r.attachmentUrl) ? (
                  <a
                    href={r.pdfUrl || r.officialResultUrl || r.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Award size={14} />
                    <span>View Merit List PDF</span>
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <button className="btn btn-outline btn-sm" disabled>
                    Merit List In Verification
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <AlertCircle size={36} color="var(--color-text-muted)" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No Results Match Your Search</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>Check back as commission boards publish merit lists periodically.</p>
          </div>
        )}
      </div>
    </div>
  );
};
