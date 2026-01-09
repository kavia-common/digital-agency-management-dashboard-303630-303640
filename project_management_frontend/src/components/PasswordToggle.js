import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './PasswordToggle.css';

// PUBLIC_INTERFACE
/**
 * PasswordToggle component for toggling password visibility
 * @param {Object} props - Component props
 * @param {boolean} props.visible - Whether password is visible
 * @param {Function} props.onToggle - Toggle handler
 * @returns {JSX.Element} PasswordToggle component
 */
function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      className="password-toggle"
      onClick={onToggle}
      aria-label={visible ? 'Hide password' : 'Show password'}
      tabIndex={-1}
    >
      {visible ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

export default PasswordToggle;
