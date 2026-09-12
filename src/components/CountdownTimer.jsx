import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const CountdownTimer = ({ targetDate, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    if (!targetDate) return null;
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0 };
    }
    return {
      expired: false,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  if (timeLeft.expired) {
    return (
      <span className="badge badge-neutral" style={{ color: 'var(--color-danger)' }}>
        Closed
      </span>
    );
  }

  const isUrgent = timeLeft.days <= 3;

  if (compact) {
    return (
      <span
        className={`countdown-pill tabular-nums ${isUrgent ? 'badge-urgent' : ''}`}
        title={`Closes on ${new Date(targetDate).toLocaleDateString('en-IN')}`}
      >
        <Clock size={12} />
        {timeLeft.days > 0 ? `${timeLeft.days}d left` : `${timeLeft.hours}h left`}
      </span>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.35rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: isUrgent ? 'var(--color-secondary-subtle)' : 'var(--color-primary-subtle)',
        border: `1px solid ${isUrgent ? 'var(--color-secondary-border)' : '#BFDBFE'}`,
        color: isUrgent ? 'var(--color-secondary)' : 'var(--color-primary)',
        fontSize: '0.82rem',
        fontWeight: 700
      }}
      className="tabular-nums"
    >
      {isUrgent ? <AlertTriangle size={14} /> : <Clock size={14} />}
      <span>
        {timeLeft.days > 0 && `${timeLeft.days} days `}
        {timeLeft.hours} hrs {timeLeft.minutes} mins remaining
      </span>
    </div>
  );
};
