import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './context/AuthContext';
import './styles/theme.css';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component with routing configuration
 * @returns {JSX.Element} App component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* New explicit routes per requirements */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Backward compatibility: existing /auth now redirects to /login */}
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* TODO: Add dashboard and other protected routes */}
          <Route
            path="/dashboard"
            element={<div style={{ padding: '2rem', textAlign: 'center' }}>Dashboard coming soon...</div>}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
