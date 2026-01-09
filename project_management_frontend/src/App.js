import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ClientsPage from './pages/ClientsPage';
import SettingsPage from './pages/SettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import './styles/theme.css';
import './App.css';

function AuthRedirect({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  // If bootstrapping, render page normally (avoid loops).
  if (isBootstrapping) return children;

  // Redirect authenticated users away from auth pages.
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}

// PUBLIC_INTERFACE
/**
 * Main App component with routing configuration.
 * @returns {JSX.Element} App component
 */
function App() {
  // Apply locally persisted theme ASAP.
  useEffect(() => {
    const t = localStorage.getItem('theme');
    if (t) {
      document.documentElement.setAttribute('data-theme', t);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <LoginPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRedirect>
                <SignupPage />
              </AuthRedirect>
            }
          />

          {/* Backward compatibility */}
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

          {/* Protected app */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route index element={<Navigate to="/app/dashboard" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
