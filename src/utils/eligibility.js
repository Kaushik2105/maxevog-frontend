/**
 * Candidate Eligibility Evaluation Utility
 * Evaluates candidate eligibility against job requirements.
 * Provides consistent 3-tier status tags:
 * 1. 'likely eligible'
 * 2. 'may be eligible / needs review'
 * 3. 'likely not eligible'
 */

export const ELIGIBILITY_STATUS = {
  LIKELY_ELIGIBLE: 'likely eligible',
  MAY_BE_ELIGIBLE: 'may be eligible / needs review',
  LIKELY_NOT_ELIGIBLE: 'likely not eligible',
};

/**
 * Calculates candidate age from DOB
 */
export function calculateAge(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Evaluates candidate eligibility against a job posting
 * @param {object} user - Current user object from AuthContext
 * @param {object} job - Job data
 * @returns {{ status: string, label: string, color: string, bgColor: string, borderColor: string, reasons: string[] } | null}
 */
export function evaluateCandidateEligibility(user, job) {
  if (!user || !job) return null;
  if (user.role === 'ADMIN' || user.role === 'AGENT') return null;

  // 1. If backend already attached eligibility assessment, normalize and use it
  if (job.eligibility) {
    const rawStatus = (job.eligibility.status || '').toLowerCase();
    const reasons = job.eligibility.reasons || (job.eligibility.reason ? [job.eligibility.reason] : []);

    if (rawStatus.includes('likely eligible') || rawStatus === 'likely_eligible') {
      return {
        status: ELIGIBILITY_STATUS.LIKELY_ELIGIBLE,
        label: 'Likely Eligible',
        color: '#059669', // Emerald
        bgColor: '#ECFDF5',
        borderColor: '#A7F3D0',
        reasons,
      };
    }
    if (rawStatus.includes('likely not') || rawStatus === 'likely_not_eligible') {
      return {
        status: ELIGIBILITY_STATUS.LIKELY_NOT_ELIGIBLE,
        label: 'Likely Not Eligible',
        color: '#6B7280', // Neutral Slate
        bgColor: '#F3F4F6',
        borderColor: '#E5E7EB',
        reasons,
      };
    }
    return {
      status: ELIGIBILITY_STATUS.MAY_BE_ELIGIBLE,
      label: 'May Be Eligible / Needs Review',
      color: '#D97706', // Amber
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      reasons,
    };
  }

  // 2. Client-side evaluation
  const profile = user.profile || user;
  const candidateDegree = (profile.degree || profile.qualification || '').trim();
  const candidateBranch = (profile.branch || '').trim();
  const candidateEduLevel = (profile.educationLevel || '').trim();
  const candidateDob = profile.dob;
  const candidateCategory = (profile.category || 'GENERAL').toUpperCase();
  const isPwd = !!profile.disabilityStatus;

  if (!candidateDegree && !candidateEduLevel) {
    return {
      status: ELIGIBILITY_STATUS.MAY_BE_ELIGIBLE,
      label: 'May Be Eligible / Needs Review',
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      reasons: ['Complete degree and qualification in your profile for a precise assessment.'],
    };
  }

  const reasons = [];
  let isDisqualified = false;
  let clearMatches = 0;
  let uncertainMatches = 0;

  // Age Check
  const age = calculateAge(candidateDob);
  if (age !== null) {
    const minAge = job.ageMin !== undefined && job.ageMin !== null ? Number(job.ageMin) : 18;
    const maxAge = job.ageMax !== undefined && job.ageMax !== null ? Number(job.ageMax) : 45;

    let relaxation = 0;
    if (candidateCategory === 'SC' || candidateCategory === 'ST') relaxation = 5;
    else if (candidateCategory === 'OBC') relaxation = 3;
    if (isPwd) relaxation += 10;

    const effectiveMax = maxAge + relaxation;
    if (age < minAge) {
      isDisqualified = true;
      reasons.push(`Under minimum age requirement (Age: ${age}, Min: ${minAge}).`);
    } else if (age > effectiveMax) {
      isDisqualified = true;
      reasons.push(`Exceeds maximum age limit of ${effectiveMax} years (with category relaxation).`);
    } else {
      clearMatches++;
      reasons.push(`Age ${age} falls within allowable bounds (${minAge} - ${effectiveMax}).`);
    }
  } else {
    uncertainMatches++;
  }

  // Eligible Degrees Check
  let eligibleDegrees = [];
  if (Array.isArray(job.eligibleDegrees)) {
    eligibleDegrees = job.eligibleDegrees;
  } else if (typeof job.eligibleDegrees === 'string') {
    try { eligibleDegrees = JSON.parse(job.eligibleDegrees); } catch (e) { eligibleDegrees = []; }
  }

  let eligibleBranches = [];
  if (Array.isArray(job.eligibleBranches)) {
    eligibleBranches = job.eligibleBranches;
  } else if (typeof job.eligibleBranches === 'string') {
    try { eligibleBranches = JSON.parse(job.eligibleBranches); } catch (e) { eligibleBranches = []; }
  }

  if (eligibleDegrees.length > 0) {
    const anyDegreeAllowed = eligibleDegrees.some((d) => {
      const lower = d.toLowerCase();
      return lower.includes('any graduate') || lower.includes('any degree') || lower.includes('all');
    });

    let degreeMatched = anyDegreeAllowed;
    if (!degreeMatched && candidateDegree) {
      const candLower = candidateDegree.toLowerCase();
      degreeMatched = eligibleDegrees.some((d) => {
        const dLower = d.toLowerCase();
        return dLower.includes(candLower) || candLower.includes(dLower);
      });
    }

    if (degreeMatched) {
      clearMatches++;
      reasons.push(`Degree "${candidateDegree || 'Graduation'}" matches recruitment requirements.`);

      // Branch Check
      let branchMatched = false;
      if (
        eligibleBranches.length === 0 ||
        eligibleBranches.some((b) => {
          const bLower = b.toLowerCase();
          return bLower.includes('any') || bLower.includes('all') || bLower.includes('general');
        })
      ) {
        branchMatched = true;
      } else if (candidateBranch) {
        const candBranchLower = candidateBranch.toLowerCase();
        branchMatched = eligibleBranches.some((b) => {
          const bLower = b.toLowerCase();
          return bLower.includes(candBranchLower) || candBranchLower.includes(bLower);
        });
      }

      if (branchMatched) {
        clearMatches++;
        reasons.push(`Specialization "${candidateBranch || 'General'}" satisfies board criteria.`);
      } else if (!candidateBranch || candidateBranch === 'Others') {
        uncertainMatches++;
        reasons.push('Branch specialization may require equivalency verification.');
      } else {
        uncertainMatches++;
        reasons.push(`Specific branch "${candidateBranch}" requires gazette equivalency review.`);
      }
    } else {
      isDisqualified = true;
      reasons.push(`Degree "${candidateDegree}" is not among advertised qualifications.`);
    }
  } else {
    // Fallback: Check job.qualification string
    const jobQual = (job.qualification || '').toLowerCase();
    const candDeg = candidateDegree.toLowerCase();
    const candLvl = candidateEduLevel.toLowerCase();

    const isGradRequired = jobQual.includes('graduate') || jobQual.includes('degree');
    const isCandidateGrad = candLvl.includes('graduate') || candDeg.includes('bachelor') || candDeg.includes('b.') || candDeg.includes('master');

    if (isGradRequired && isCandidateGrad) {
      clearMatches++;
      reasons.push('Graduate qualification satisfies general graduation criterion.');
    } else if (isGradRequired && (candLvl.includes('10th') || candLvl.includes('12th'))) {
      isDisqualified = true;
      reasons.push('Position requires minimum graduation degree.');
    } else if (jobQual.includes('12th') || jobQual.includes('10+2')) {
      if (candLvl.includes('10th') && !candLvl.includes('12th')) {
        isDisqualified = true;
        reasons.push('Position requires minimum 10+2 qualification.');
      } else {
        clearMatches++;
        reasons.push('Candidate meets intermediate / 10+2 qualification.');
      }
    } else {
      uncertainMatches++;
      reasons.push('Compare detailed gazette qualification criteria with your degree.');
    }
  }

  if (isDisqualified) {
    return {
      status: ELIGIBILITY_STATUS.LIKELY_NOT_ELIGIBLE,
      label: 'Likely Not Eligible',
      color: '#6B7280',
      bgColor: '#F3F4F6',
      borderColor: '#E5E7EB',
      reasons,
    };
  }

  if (clearMatches >= 1 && uncertainMatches === 0) {
    return {
      status: ELIGIBILITY_STATUS.LIKELY_ELIGIBLE,
      label: 'Likely Eligible',
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#A7F3D0',
      reasons,
    };
  }

  return {
    status: ELIGIBILITY_STATUS.MAY_BE_ELIGIBLE,
    label: 'May Be Eligible / Needs Review',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    reasons,
  };
}
