import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
/**
 * Backward-compatibility Auth page.
 * The project now uses explicit /login and /signup routes.
 * @returns {JSX.Element}
 */
function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);

  return null;
}

export default Auth;
