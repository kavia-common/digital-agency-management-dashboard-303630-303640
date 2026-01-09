import React from 'react';
import AuthLayout from './AuthLayout';
import LoginForm from './LoginForm';

// PUBLIC_INTERFACE
/**
 * /login page.
 * @returns {JSX.Element}
 */
function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue to your dashboard.">
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
