import React from 'react';
import './Button.css';

// PUBLIC_INTERFACE
/**
 * Reusable Button component with variants and loading state
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'outline', 'ghost'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg'
 * @param {boolean} props.fullWidth - Whether button should take full width
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.type - Button type attribute
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element} Button component
 */
function Button({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  disabled = false,
  loading = false,
  children, 
  type = 'button',
  onClick,
  className = '',
  ...props 
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full-width' : '',
    loading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner" />
          <span className="btn-loading-text">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
