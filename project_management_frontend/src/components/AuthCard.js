import React from 'react';
import './AuthCard.css';

// PUBLIC_INTERFACE
/**
 * AuthCard component - Container for authentication forms
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} AuthCard component
 */
function AuthCard({ children, className = '' }) {
  return (
    <div className={`auth-card ${className}`}>
      {children}
    </div>
  );
}

export default AuthCard;
