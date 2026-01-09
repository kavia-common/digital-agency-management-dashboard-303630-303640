import React from 'react';
import './AnimatedPanel.css';

// PUBLIC_INTERFACE
/**
 * AnimatedPanel component for smooth transitions between content
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Panel content
 * @param {string} props.panelKey - Unique key for panel (triggers animation on change)
 * @returns {JSX.Element} AnimatedPanel component
 */
function AnimatedPanel({ children, panelKey }) {
  return (
    <div key={panelKey} className="animated-panel">
      {children}
    </div>
  );
}

export default AnimatedPanel;
