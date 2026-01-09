import React from 'react';
import AuthLayout from './AuthLayout';
import SignupForm from './SignupForm';

// PUBLIC_INTERFACE
/**
 * /signup page.
 * @returns {JSX.Element}
 */
function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Start organizing projects and clients in minutes.">
      <SignupForm />
    </AuthLayout>
  );
}

export default SignupPage;
