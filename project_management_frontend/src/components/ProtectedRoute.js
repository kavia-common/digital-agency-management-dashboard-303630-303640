import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
/**
 * Protects routes that require an authenticated session.
 * Redirects unauthenticated users to /login.
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading your session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
