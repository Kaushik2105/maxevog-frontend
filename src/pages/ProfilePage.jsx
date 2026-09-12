import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Upload, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    gender: 'MALE',
    dob: '',
    category: 'GENERAL',
    state: '',
    district: '',
    educationLevel: 'Graduate',
    degree: '',
    passingYear: '',
    percentage: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      const p = user.profile || {};
      setFormData({
        fullName: p.fullName || user.name || '',
        email: user.email || p.email || '',
        mobileNumber: p.mobileNumber || user.phone || '',
        gender: p.gender || 'MALE',
        dob: p.dob ? String(p.dob).split('T')[0] : '',
        category: p.category || 'GENERAL',
        state: p.state || '',
        district: p.district || '',
        educationLevel: p.educationLevel || 'Graduate',
        degree: p.degree || '',
        passingYear: p.passingYear ? String(p.passingYear) : '',
        percentage: p.percentage || '',
      });
    }
  }, [user]);

  // Calculate profile completion score based on 10 canonical profile fields
  const calculateCompletion = () => {
    const fields = [
      formData.fullName,
      formData.dob,
      formData.gender,
      formData.mobileNumber,
      formData.state,
      formData.district,
      formData.category,
      formData.educationLevel,
      formData.degree,
      formData.passingYear,
    ];
    const filled = fields.filter((f) => f !== null && f !== undefined && String(f).trim() !== '');
    return Math.round((filled.length / fields.length) * 100);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        // Aliases for compatibility
        name: formData.fullName,
        phone: formData.mobileNumber,
        dateOfBirth: formData.dob,
        highestQualification: formData.educationLevel,
        qualificationDetails: formData.degree,
      };
      const res = await authApi.updateProfile(payload);
      if (res.data?.success) {
        setSuccessMsg('Profile information successfully saved & synchronized!');
        await refreshUser();
      } else {
        setErrorMsg(res.data?.message || 'Update failed');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    const data = new FormData();
    data.append('avatar', file);

    try {
      const res = await authApi.uploadAvatar(data);
      if (res.data?.success) {
        setSuccessMsg('Avatar updated!');
        refreshUser();
      }
    } catch (err) {
      setErrorMsg('Failed to upload avatar image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const completionScore = calculateCompletion();

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
            Candidate Profile & Eligibility Profile
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Keep your educational credentials and category reservation current for accurate automatic eligibility scoring.
          </p>
        </div>

        {/* Completion Progress Bar */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>
                Profile Completeness Score
              </strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Higher score enables accurate automated eligibility matching across all recruitments.
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: completionScore === 100 ? 'var(--color-accent)' : 'var(--color-primary)' }} className="tabular-nums">
              {completionScore}%
            </div>
          </div>

          <div style={{ height: '8px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${completionScore}%`,
                backgroundColor: completionScore === 100 ? 'var(--color-accent)' : 'var(--color-primary)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {successMsg && (
          <div style={{
            backgroundColor: 'var(--color-accent-subtle)',
            border: '1px solid var(--color-accent-border)',
            color: 'var(--color-accent)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{
            backgroundColor: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger-border)',
            color: 'var(--color-danger)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          {/* Section 1: Basic Identity */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Personal Particulars
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name (As in Matriculation Certificate)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  disabled
                  title="Email cannot be changed"
                  style={{ backgroundColor: 'var(--color-bg)', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  placeholder="10-digit phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-control form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reservation Category</label>
                <select
                  className="form-control form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="GENERAL">General / Unreserved (UR)</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                  <option value="OBC">Other Backward Classes (OBC-NCL)</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">State / UT of Domicile</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. West Bengal, Maharashtra, Delhi"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">District / City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kolkata, Pune, Central Delhi"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Educational Credentials */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} /> Educational Qualifications
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="form-grid">
              <div className="form-group">
                <label className="form-label">Highest Completed Qualification</label>
                <select
                  className="form-control form-select"
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                >
                  <option value="10th">10th / Matriculation</option>
                  <option value="12th">12th / Intermediate / Higher Secondary</option>
                  <option value="Diploma">Polytechnic Diploma</option>
                  <option value="Graduate">Bachelor's Degree (BA, BSc, BCom, BTech)</option>
                  <option value="Post Graduate">Master's Degree (MA, MSc, MTech, MBA)</option>
                  <option value="Doctorate">Ph.D / Doctorate</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Degree / Stream Specialization</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. B.Tech Computer Science, B.Sc Mathematics"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passing Year</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 2024"
                  value={formData.passingYear}
                  onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Aggregate Percentage / CGPA</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 78.5% or 8.2 CGPA"
                  value={formData.percentage}
                  onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary btn-lg"
            >
              <Save size={18} />
              <span>{saving ? 'Saving Particulars...' : 'Save & Synchronize Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
