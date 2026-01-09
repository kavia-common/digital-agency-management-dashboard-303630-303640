import React from 'react';
import './Tabs.css';

// PUBLIC_INTERFACE
/**
 * Tabs component for navigation between different auth modes
 * @param {Object} props - Component props
 * @param {Array} props.tabs - Array of tab objects with {id, label}
 * @param {string} props.activeTab - Currently active tab id
 * @param {Function} props.onTabChange - Tab change handler
 * @returns {JSX.Element} Tabs component
 */
function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
      <div 
        className="tab-indicator" 
        style={{
          transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 100}%)`
        }}
      />
    </div>
  );
}

export default Tabs;
