import React from 'react';

// PUBLIC_INTERFACE
/**
 * Icon wrapper for consistent sizing and accessibility.
 * @param {Object} props
 * @param {React.ComponentType<any>} props.icon - Icon component (e.g., from lucide-react)
 * @param {number} props.size - Icon size in px
 * @param {string} props.label - Accessible label. If omitted, icon is aria-hidden.
 * @param {string} props.className - Extra class names
 * @returns {JSX.Element}
 */
function Icon({ icon: IconComponent, size = 18, label, className = '', ...rest }) {
  if (!IconComponent) return null;

  if (label) {
    return <IconComponent size={size} aria-label={label} role="img" className={className} {...rest} />;
  }

  return <IconComponent size={size} aria-hidden="true" focusable="false" className={className} {...rest} />;
}

export default Icon;
