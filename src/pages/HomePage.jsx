import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsApi } from '../api/jobs.api';
import { admitCardsApi } from '../api/admitCards.api';
import { resultsApi } from '../api/results.api';
import { JobCard } from '../components/JobCard';
import { TrustBanner } from '../components/TrustBanner';
import { 
  Search, 
  Filter, 
  Calendar, 
  Award, 
  FileText, 
  Briefcase, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle
} from 'lucide-react';

export const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [admitCards, setAdmitCards] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedQualification, setSelectedQualification] = useState('ALL');
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'admit-cards' | 'results'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, admitRes, resultsRes] = await Promise.all([
        jobsApi.getJobs({ limit: 12 }),
        admitCardsApi.getAdmitCards({ limit: 5 }),
        resultsApi.getResults({ limit: 5 })
      ]);

      if (jobsRes.data?.success) {
        setJobs(jobsRes.data.data.jobs || jobsRes.data.data || []);
      }
      if (admitRes.data?.success) {
        setAdmitCards(admitRes.data.data.admitCards || admitRes.data.data || []);
      }
      if (resultsRes.data?.success) {
        setResults(resultsRes.data.data.results || resultsRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { label: 'All Sectors', value: 'ALL' },
    { label: 'Central Govt', value: 'Central' },
    { label: 'State Govt', value: 'State' },
    { label: 'Banking & Financial', value: 'Banking' },
    { label: 'Railways (RRB)', value: 'Railways' },
    { label: 'Defence & Police', value: 'Defence' },
    { label: 'Teaching & Edu', value: 'Teaching' }
  ];

  const qualifications = [
    { label: 'All Qualifications', value: 'ALL' },
    { label: '10th / Matric', value: '10th' },
    { label: '12th / Inter', value: '12th' },
    { label: 'Graduate / Degree', value: 'Graduate' },
    { label: 'Post Graduate', value: 'Post Graduate' },
    { label: 'Engineering / Diploma', value: 'Engineering' }
  ];

  const checkCategoryMatch = (job, catValue) => {
    if (catValue === 'ALL') return true;
    const target = catValue.toLowerCase();

    // 1. Direct match on category or recruitmentType
    if (job.category && job.category.toLowerCase().includes(target)) return true;
    if (job.recruitmentType && job.recruitmentType.toLowerCase().includes(target)) return true;

    // 2. Keyword check across organization, department, title and descriptions
    const combined = `${job.organization || ''} ${job.department || ''} ${job.title || ''} ${job.shortDescription || ''}`.toLowerCase();

    switch (catValue) {
      case 'Central':
        return /central|upsc|ssc|cgl|chsl|ibps|delhi|ministry|union|drdo|isro|csir|staff selection/i.test(combined);
      case 'State':
        return /state|psc|bpsc|uppsc|mpsc|wbpsc|kpsc|tnpsc|vyapam|commission/i.test(combined);
      case 'Banking':
        return /bank|sbi|ibps|rbi|nabard|insurance|lic|sidbi|financial|sebi/i.test(combined);
      case 'Railways':
        return /railway|rrb|rrc|irctc|loco|ntpc|asm|alp/i.test(combined);
      case 'Defence':
        return /defence|defense|army|navy|air force|afcat|nda|cds|police|constable|sub inspector|si |capf|crpf|cisf|bsf|ssb|itbp/i.test(combined);
      case 'Teaching':
        return /teach|tet|ctet|stet|ugc|net|kvs|nvs|professor|lecturer|prt|tgt|pgt|school|college|faculty/i.test(combined);
      default:
        return combined.includes(target);
    }
  };

  // Filter jobs locally or prepare query
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.department && job.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = checkCategoryMatch(job, selectedCategory);

    const matchesQual = selectedQualification === 'ALL' || 
      (job.qualification && job.qualification.toLowerCase().includes(selectedQualification.toLowerCase()));

    return matchesSearch && matchesCategory && matchesQual;
  });

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderBottom: '1px solid var(--color-border)',
        padding: '3.5rem 0 3rem'
      }}>
        <div className="container">
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-primary-subtle)',
              color: 'var(--color-primary)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              border: '1px solid #BFDBFE'
            }}>
              <TrendingUp size={15} />
              <span>Independent Public Career Guidance & Verification Engine</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '1rem',
              color: 'var(--color-primary)'
            }}>
              Never Miss a Recruitment Deadline.<br />
              Apply with Guided Precision.
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}>
              Explore real-time government job notifications with zero clutter. Book 1-on-1 cyber assistance sessions at flat ₹69 without sharing passwords or sensitive credentials.
            </p>

            {/* Main Interactive Search Input */}
            <div className="hero-search-box">
              <div className="hero-search-input-wrap">
                <Search size={20} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search recruitments by post, commission (e.g. UPSC, SSC, IBPS)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-primary hero-search-btn"
                onClick={() => {
                  setActiveTab('jobs');
                  const el = document.getElementById('recruitments-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Find Openings
              </button>
            </div>

            {/* Quick Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    setActiveTab('jobs');
                  }}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: selectedCategory === cat.value ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: selectedCategory === cat.value ? 'var(--color-primary)' : '#FFFFFF',
                    color: selectedCategory === cat.value ? '#FFFFFF' : 'var(--color-text-body)',
                    transition: 'all var(--transition-fast)',
                    cursor: 'pointer'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section id="recruitments-section" style={{ padding: '2.5rem 0 4rem' }}>
        <div className="container">
          {/* Trust Banner Prominence */}
          <TrustBanner />

          {/* Tab Navigation (Jobs vs Admit Cards vs Results) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid var(--color-border)',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setActiveTab('jobs')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0.5rem',
                  borderBottom: activeTab === 'jobs' ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: activeTab === 'jobs' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: activeTab === 'jobs' ? 700 : 500,
                  fontSize: '1rem',
                  marginBottom: '-2px'
                }}
              >
                <Briefcase size={18} />
                <span>Active Recruitments ({filteredJobs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('admit-cards')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0.5rem',
                  borderBottom: activeTab === 'admit-cards' ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: activeTab === 'admit-cards' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: activeTab === 'admit-cards' ? 700 : 500,
                  fontSize: '1rem',
                  marginBottom: '-2px'
                }}
              >
                <FileText size={18} />
                <span>Admit Cards ({admitCards.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('results')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 0.5rem',
                  borderBottom: activeTab === 'results' ? '3px solid var(--color-primary)' : '3px solid transparent',
                  color: activeTab === 'results' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontWeight: activeTab === 'results' ? 700 : 500,
                  fontSize: '1rem',
                  marginBottom: '-2px'
                }}
              >
                <Award size={18} />
                <span>Exam Results ({results.length})</span>
              </button>
            </div>

            {/* Filter controls on the right */}
            {activeTab === 'jobs' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <select
                  value={selectedQualification}
                  onChange={(e) => setSelectedQualification(e.target.value)}
                  className="form-control form-select"
                  style={{ width: 'auto', padding: '0.45rem 2rem 0.45rem 0.75rem', fontSize: '0.82rem' }}
                >
                  {qualifications.map((q) => (
                    <option key={q.value} value={q.value}>{q.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* TAB 1: JOBS GRID */}
          {activeTab === 'jobs' && (
            <div>
              {loading ? (
                <div className="grid-cards">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="card" style={{ height: '240px', padding: '1.5rem' }}>
                      <div className="skeleton" style={{ height: '1.5rem', width: '40%', marginBottom: '1rem' }} />
                      <div className="skeleton" style={{ height: '2rem', width: '80%', marginBottom: '1.5rem' }} />
                      <div className="skeleton" style={{ height: '4rem', width: '100%' }} />
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="grid-cards">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                  <AlertCircle size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Active Recruitments Found</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Try clearing your search query or relaxing the qualification and sector filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('ALL');
                      setSelectedQualification('ALL');
                    }}
                    className="btn btn-outline"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADMIT CARDS */}
          {activeTab === 'admit-cards' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Recently Issued Hall Tickets & Admit Cards</h3>
                <Link to="/admit-cards" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              {admitCards.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>
                  No admit cards active at this moment. Check back soon.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {admitCards.map((card) => (
                    <div
                      key={card.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        backgroundColor: 'var(--color-bg)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          {card.organization || 'Commission'}
                        </div>
                        <h4 style={{ fontSize: '1rem', color: 'var(--color-text-title)', marginTop: '0.2rem' }}>
                          {card.title}
                        </h4>
                        {card.examDate && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--color-secondary)', fontWeight: 600, marginTop: '0.3rem' }}>
                            Exam Date: {new Date(card.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </div>

                      {(card.downloadUrl || card.officialAdmitCardUrl || card.attachmentUrl) ? (
                        <a
                          href={card.downloadUrl || card.officialAdmitCardUrl || card.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          <FileText size={14} />
                          Download Card
                        </a>
                      ) : (
                        <Link to={`/admit-cards`} className="btn btn-outline btn-sm">
                          View Instructions
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RESULTS */}
          {activeTab === 'results' && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Official Gazette Results & Cut-off Marks</h3>
                <Link to="/results" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              {results.length === 0 ? (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '2rem' }}>
                  No published results currently available.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {results.map((result) => (
                    <div
                      key={result.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        backgroundColor: 'var(--color-bg)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                          {result.organization || 'Authority'}
                        </div>
                        <h4 style={{ fontSize: '1rem', color: 'var(--color-text-title)', marginTop: '0.2rem' }}>
                          {result.title}
                        </h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.3rem' }}>
                          Declared: {(result.declaredDate || result.resultDate) ? new Date(result.declaredDate || result.resultDate).toLocaleDateString('en-IN') : 'Recent'}
                        </div>
                      </div>

                      {(result.pdfUrl || result.officialResultUrl || result.attachmentUrl) ? (
                        <a
                          href={result.pdfUrl || result.officialResultUrl || result.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-sm"
                        >
                          <Award size={14} />
                          Check Merit List
                        </a>
                      ) : (
                        <Link to={`/results`} className="btn btn-outline btn-sm">
                          View Details
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .hero-search-box {
          display: flex;
          align-items: center;
          background-color: #FFFFFF;
          border: 2px solid var(--color-primary);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 0.4rem 0.6rem 0.4rem 1.25rem;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .hero-search-input-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
        }
        .hero-search-box input {
          flex: 1;
          min-width: 0;
          width: 100%;
          border: none;
          outline: none;
          font-size: 1rem;
          color: var(--color-text-title);
          background: transparent;
        }
        .hero-search-btn {
          padding: 0.65rem 1.5rem;
          white-space: nowrap;
          flex-shrink: 0;
          border-radius: var(--radius-md);
        }
        @media (max-width: 640px) {
          .hero-search-box {
            flex-direction: column;
            align-items: stretch;
            padding: 0.85rem;
            gap: 0.75rem;
            border-radius: var(--radius-md);
          }
          .hero-search-input-wrap {
            width: 100%;
          }
          .hero-search-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
