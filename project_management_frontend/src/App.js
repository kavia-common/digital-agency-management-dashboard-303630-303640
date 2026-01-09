import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import './styles/theme.css';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component with routing configuration
 * @returns {JSX.Element} App component
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        {/* TODO: Add dashboard and other protected routes */}
        <Route path="/dashboard" element={<div style={{padding: '2rem', textAlign: 'center'}}>Dashboard coming soon...</div>} />
      </Routes>
    </Router>
  );
}

export default App;
