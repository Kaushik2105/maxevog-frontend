import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '', ...props }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'official':
      case 'success':
        return 'badge-official';
      case 'urgent':
      case 'warning':
        return 'badge-urgent';
      case 'danger':
        return 'badge-danger';
      case 'primary':
        return 'badge-primary';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <span className={`badge ${getVariantClass()} ${className}`} {...props}>
      {children}
    </span>
  );
};
