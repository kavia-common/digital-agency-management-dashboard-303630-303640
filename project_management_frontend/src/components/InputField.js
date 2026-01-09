import React, { forwardRef } from 'react';
import './InputField.css';

// PUBLIC_INTERFACE
/**
 * Reusable Input Field component with icon support and error states
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.error - Error message to display
 * @param {React.ReactNode} props.icon - Icon component to display (left side)
 * @param {React.ReactNode} props.rightIcon - Icon component to display (right side)
 * @param {boolean} props.required - Whether input is required
 * @param {string} props.id - Input id
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @returns {JSX.Element} InputField component
 */
const InputField = forwardRef(({ 
  label, 
  type = 'text', 
  placeholder, 
  error, 
  icon, 
  rightIcon,
  required = false,
  id,
  name,
  value,
  onChange,
  className = '',
  ...props 
}, ref) => {
  const inputId = id || `input-${name}`;
  
  return (
    <div className={`input-field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className={`input-wrapper ${error ? 'input-wrapper-error' : ''}`}>
        {icon && <div className="input-icon-left">{icon}</div>}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`input ${icon ? 'input-with-left-icon' : ''} ${rightIcon ? 'input-with-right-icon' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {rightIcon && <div className="input-icon-right">{rightIcon}</div>}
      </div>
      {error && (
        <div id={`${inputId}-error`} className="input-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
