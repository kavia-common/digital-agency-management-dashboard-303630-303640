import React from 'react';
import { AlertCircle } from 'lucide-react';
import './FormError.css';

// PUBLIC_INTERFACE
/**
 * FormError component for displaying form-level error messages
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @returns {JSX.Element|null} FormError component
 */
function FormError({ message }) {
  if (!message) return null;

  return (
    <div className="form-error" role="alert" aria-live="polite">
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
  );
}

export default FormError;
