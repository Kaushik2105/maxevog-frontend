import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';
import { useToast } from '../context/ToastContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Upload, 
  Camera, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (NCT)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
  'Others',
];

const STANDARD_DEGREES = [
  'B.Tech / B.E. (Bachelor of Technology / Engineering)',
  'B.Sc (Bachelor of Science)',
  'B.Com (Bachelor of Commerce)',
  'B.A. (Bachelor of Arts)',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'M.Tech / M.E. (Master of Technology / Engineering)',
  'MBA (Master of Business Administration)',
  'M.Sc (Master of Science)',
  'M.Com (Master of Commerce)',
  'M.A. (Master of Arts)',
  'MBBS (Bachelor of Medicine & Surgery)',
  'BDS (Dental Surgery)',
  'B.Pharm (Bachelor of Pharmacy)',
  'B.Ed (Bachelor of Education)',
  'LLB (Bachelor of Legislative Law)',
  'Diploma (Polytechnic / Technical)',
  '12th / Intermediate (Higher Secondary)',
  '10th (Matriculation)',
  'Any Graduate',
  'Others',
];

const STANDARD_BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics & Communication (ECE)',
  'Data Science & Artificial Intelligence',
  'Chemical Engineering',
  'Commerce / Accounting / Finance',
  'Economics',
  'Arts / Humanities / Social Sciences',
  'Physics / Chemistry / Mathematics (PCM)',
  'Biology / Life Sciences / Biotechnology',
  'General Medicine / Clinical Practice',
  'Nursing & Paramedical Sciences',
  'Pharmacy / Pharmacology',
  'Law & Jurisprudence',
  'General / Non-Technical Stream',
  'Others',
];

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const avatarInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    gender: 'MALE',
    dob: '',
    category: 'GENERAL',
    disabilityStatus: false,
    state: '',
    district: '',
    address: '',
    educationLevel: 'Graduate',
    degree: '',
    branch: '',
    passingYear: '',
    avatarUrl: '',
  });

  const [initialData, setInitialData] = useState(null);

  // Dropdown 'Others' toggle state
  const [isOtherState, setIsOtherState] = useState(false);
  const [customState, setCustomState] = useState('');

  const [isOtherDegree, setIsOtherDegree] = useState(false);
  const [customDegree, setCustomDegree] = useState('');

  const [isOtherBranch, setIsOtherBranch] = useState(false);
  const [customBranch, setCustomBranch] = useState('');

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      const p = user.profile || {};
      const currentState = p.state || '';
      const currentDegree = p.degree || '';
      const currentBranch = p.branch || '';

      const stateInList = INDIAN_STATES_AND_UTS.includes(currentState);
      const degreeInList = STANDARD_DEGREES.includes(currentDegree);
      const branchInList = STANDARD_BRANCHES.includes(currentBranch);

      setIsOtherState(!stateInList && currentState !== '');
      if (!stateInList && currentState !== '') setCustomState(currentState);

      setIsOtherDegree(!degreeInList && currentDegree !== '');
      if (!degreeInList && currentDegree !== '') setCustomDegree(currentDegree);

      setIsOtherBranch(!branchInList && currentBranch !== '');
      if (!branchInList && currentBranch !== '') setCustomBranch(currentBranch);

      const data = {
        fullName: p.fullName || user.name || '',
        email: user.email || p.email || '',
        mobileNumber: p.mobileNumber || user.phone || '',
        gender: p.gender || 'MALE',
        dob: p.dob ? String(p.dob).split('T')[0] : '',
        category: p.category || 'GENERAL',
        disabilityStatus: Boolean(p.disabilityStatus),
        state: currentState,
        district: p.district || '',
        address: p.address || '',
        educationLevel: p.educationLevel || 'Graduate',
        degree: currentDegree,
        branch: currentBranch,
        passingYear: p.passingYear ? String(p.passingYear) : '',
        avatarUrl: p.avatarUrl || '',
      };

      setFormData(data);
      setInitialData(data);
    }
  }, [user]);

  // Real-time completion calculation
  const completionScore = useMemo(() => {
    const fieldsToCheck = [
      formData.fullName,
      formData.dob,
      formData.gender,
      formData.mobileNumber,
      formData.state,
      formData.district,
      formData.address,
      formData.category,
      formData.educationLevel,
      formData.degree,
      formData.branch,
      formData.passingYear,
      formData.avatarUrl,
    ];

    let filled = 0;
    for (const f of fieldsToCheck) {
      if (f !== null && f !== undefined && String(f).trim() !== '') {
        filled++;
      }
    }
    return Math.round((filled / fieldsToCheck.length) * 100);
  }, [formData]);

  // Dirty State Check (Point 6)
  const isDirty = useMemo(() => {
    if (!initialData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  // State Dropdown Handler
  const handleStateSelect = (val) => {
    if (val === 'Others') {
      setIsOtherState(true);
      setFormData((prev) => ({ ...prev, state: customState || '' }));
    } else {
      setIsOtherState(false);
      setFormData((prev) => ({ ...prev, state: val }));
    }
  };

  const handleCustomStateChange = (val) => {
    setCustomState(val);
    setFormData((prev) => ({ ...prev, state: val }));
  };

  // Degree Dropdown Handler
  const handleDegreeSelect = (val) => {
    if (val === 'Others') {
      setIsOtherDegree(true);
      setFormData((prev) => ({ ...prev, degree: customDegree || '' }));
    } else {
      setIsOtherDegree(false);
      setFormData((prev) => ({ ...prev, degree: val }));
    }
  };

  const handleCustomDegreeChange = (val) => {
    setCustomDegree(val);
    setFormData((prev) => ({ ...prev, degree: val }));
  };

  // Branch Dropdown Handler
  const handleBranchSelect = (val) => {
    if (val === 'Others') {
      setIsOtherBranch(true);
      setFormData((prev) => ({ ...prev, branch: customBranch || '' }));
    } else {
      setIsOtherBranch(false);
      setFormData((prev) => ({ ...prev, branch: val }));
    }
  };

  const handleCustomBranchChange = (val) => {
    setCustomBranch(val);
    setFormData((prev) => ({ ...prev, branch: val }));
  };

  // Submit Profile Form
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isDirty || saving) return;
    setSaving(true);

    try {
      const payload = {
        ...formData,
        passingYear: formData.passingYear ? parseInt(formData.passingYear, 10) : null,
      };

      const res = await authApi.updateProfile(payload);
      if (res.data?.success) {
        toast.success('Profile details successfully saved & synchronized!');
        await refreshUser();
      } else {
        toast.error(res.data?.message || 'Update failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Could not update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // Avatar Upload via Cloudinary
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar file size must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    const data = new FormData();
    data.append('avatar', file);

    try {
      const res = await authApi.uploadAvatar(data);
      if (res.data?.success) {
        const updatedProfile = res.data.data.profile;
        if (updatedProfile?.avatarUrl) {
          setFormData((prev) => ({ ...prev, avatarUrl: updatedProfile.avatarUrl }));
        }
        toast.success('Profile photo uploaded and synchronized via Cloudinary!');
        await refreshUser();
      } else {
        toast.error(res.data?.message || 'Failed to upload photo');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload avatar image';
      toast.error(msg);
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
            Candidate Profile & Eligibility Master
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: 0 }}>
            Complete your profile to unlock automated eligibility filtering for civil services, defense, banking, engineering, and medical vacancies.
          </p>
        </div>

        {/* Completion Progress Bar */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>
                  Real-Time Profile Completeness
                </strong>
                {completionScore === 100 ? (
                  <span className="badge badge-official" style={{ fontSize: '0.72rem' }}>
                    <CheckCircle2 size={12} /> 100% Fully Completed
                  </span>
                ) : (
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    {100 - completionScore}% Pending
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                All central and state recruitment algorithms match qualifications from this verified dataset.
              </div>
            </div>
            <div
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: completionScore === 100 ? 'var(--color-accent)' : 'var(--color-primary)',
              }}
              className="tabular-nums"
            >
              {completionScore}%
            </div>
          </div>

          <div style={{ height: '8px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${completionScore}%`,
                backgroundColor: completionScore === 100 ? 'var(--color-accent)' : 'var(--color-primary)',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>

        {/* Profile Avatar Card */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '5rem',
              height: '5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary-subtle)',
              border: '2px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {formData.avatarUrl ? (
              <img
                src={formData.avatarUrl}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
            ) : (
              (formData.fullName || user?.name || 'C').charAt(0).toUpperCase()
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem', color: 'var(--color-text-title)' }}>
              Candidate Photo & Avatar
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '0 0 0.85rem' }}>
              Upload a clear passport-size photograph (JPG, PNG, WebP up to 5MB). Stored securely on Cloudinary.
            </p>
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              {uploadingAvatar ? (
                <>
                  <Upload size={14} className="spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <Camera size={14} />
                  <span>{formData.avatarUrl ? 'Change Profile Photo' : 'Upload Passport Photo'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          {/* Section 1: Personal Particulars */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', backgroundColor: '#FFFFFF' }}>
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
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Registered)</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  disabled
                  title="Registered email address cannot be changed"
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
                  placeholder="10-digit mobile number"
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
                <label className="form-label">Persons with Benchmark Disabilities (PwD)</label>
                <select
                  className="form-control form-select"
                  value={formData.disabilityStatus ? 'YES' : 'NO'}
                  onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.value === 'YES' })}
                >
                  <option value="NO">No - Not Applicable</option>
                  <option value="YES">Yes - PwD / Divyangjan Category</option>
                </select>
              </div>

              {/* State / UT Dropdown with Others Option */}
              <div className="form-group">
                <label className="form-label">State / UT of Domicile</label>
                <select
                  className="form-control form-select"
                  value={isOtherState ? 'Others' : (INDIAN_STATES_AND_UTS.includes(formData.state) ? formData.state : (formData.state ? 'Others' : ''))}
                  onChange={(e) => handleStateSelect(e.target.value)}
                >
                  <option value="">Select State / UT</option>
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>

                {isOtherState && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Specify your State / UT"
                      value={customState}
                      onChange={(e) => handleCustomStateChange(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">District / City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Pune, Patna, Lucknow, Kolkata"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Communication / Permanent Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Door No, Street, Landmark, Village / Town, Pin Code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Educational Credentials */}
          <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', backgroundColor: '#FFFFFF' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={18} /> Educational Qualifications & Degree
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="form-grid">
              <div className="form-group">
                <label className="form-label">Highest Completed Level</label>
                <select
                  className="form-control form-select"
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                >
                  <option value="10th">10th / Matriculation</option>
                  <option value="12th">12th / Intermediate / Higher Secondary</option>
                  <option value="Diploma">Polytechnic Diploma</option>
                  <option value="Graduate">Bachelor's Degree (Graduate)</option>
                  <option value="Post Graduate">Master's Degree (Post Graduate)</option>
                  <option value="Doctorate">Ph.D / Doctorate</option>
                </select>
              </div>

              {/* Degree Dropdown with Others Option */}
              <div className="form-group">
                <label className="form-label">Degree / Certificate Title</label>
                <select
                  className="form-control form-select"
                  value={isOtherDegree ? 'Others' : (STANDARD_DEGREES.includes(formData.degree) ? formData.degree : (formData.degree ? 'Others' : ''))}
                  onChange={(e) => handleDegreeSelect(e.target.value)}
                >
                  <option value="">Select Degree Qualification</option>
                  {STANDARD_DEGREES.map((deg) => (
                    <option key={deg} value={deg}>{deg}</option>
                  ))}
                </select>

                {isOtherDegree && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Specify your Degree (e.g. B.Tech Mining, BAMS)"
                      value={customDegree}
                      onChange={(e) => handleCustomDegreeChange(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Branch Dropdown with Others Option */}
              <div className="form-group">
                <label className="form-label">Major Branch / Specialization</label>
                <select
                  className="form-control form-select"
                  value={isOtherBranch ? 'Others' : (STANDARD_BRANCHES.includes(formData.branch) ? formData.branch : (formData.branch ? 'Others' : ''))}
                  onChange={(e) => handleBranchSelect(e.target.value)}
                >
                  <option value="">Select Branch / Discipline</option>
                  {STANDARD_BRANCHES.map((br) => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>

                {isOtherBranch && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Specify your Branch (e.g. Aerospace, Automobile)"
                      value={customBranch}
                      onChange={(e) => handleCustomBranchChange(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Passing Year</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 2024"
                  min="1970"
                  max="2035"
                  value={formData.passingYear}
                  onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Submit Action Bar with Dirty State Logic (Point 6) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              padding: '1.25rem 1.5rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {isDirty ? (
                <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
                  ● Unsaved changes detected. Click to synchronize with central recruitment engine.
                </span>
              ) : (
                <span>All profile data is current & synchronized.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={!isDirty || saving}
              className="btn btn-primary btn-lg"
              style={{
                opacity: !isDirty ? 0.45 : 1,
                cursor: !isDirty ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={!isDirty ? 'No changes detected to save' : 'Click to save changes'}
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
