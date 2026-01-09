import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import FormError from '../components/FormError';
import PasswordToggle from '../components/PasswordToggle';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { validateSignup } from './authFormUtils';
import './AuthForms.css';

// PUBLIC_INTERFACE
/**
 * Signup form UI.
 * @returns {JSX.Element}
 */
function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [data, setData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (formError) setFormError('');
    if (successMessage) setSuccessMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const nextErrors = validateSignup(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setFormError('Please fix the errors above');
      return;
    }

    setLoading(true);
    try {
      await signup(data.email, data.password, data.name);
      setSuccessMessage('Account created! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 900);
    } catch (err) {
      setFormError(err?.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authForm">
      {successMessage ? (
        <div className="authForm-success" role="status" aria-live="polite">
          {successMessage}
        </div>
      ) : null}

      <FormError message={formError} />

      <form onSubmit={onSubmit} className="authForm-form" noValidate>
        <InputField
          label="Full name"
          type="text"
          name="name"
          id="signup-name"
          placeholder="Jane Doe"
          value={data.name}
          onChange={onChange}
          error={errors.name}
          icon={<Icon icon={User} size={18} />}
          autoComplete="name"
          required
        />

        <InputField
          label="Email"
          type="email"
          name="email"
          id="signup-email"
          placeholder="you@company.com"
          value={data.email}
          onChange={onChange}
          error={errors.email}
          icon={<Icon icon={Mail} size={18} />}
          autoComplete="email"
          required
        />

        <InputField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="signup-password"
          placeholder="Create a password"
          value={data.password}
          onChange={onChange}
          error={errors.password}
          icon={<Icon icon={Lock} size={18} />}
          rightIcon={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
          autoComplete="new-password"
          required
        />

        <InputField
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          id="signup-confirmPassword"
          placeholder="Repeat your password"
          value={data.confirmPassword}
          onChange={onChange}
          error={errors.confirmPassword}
          icon={<Icon icon={Lock} size={18} />}
          rightIcon={
            <PasswordToggle visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((s) => !s)} />
          }
          autoComplete="new-password"
          required
        />

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Create account
        </Button>

        <p className="authForm-alt">
          Already have an account?{' '}
          <Link to="/login" className="authForm-linkInline">
            Log in
          </Link>
        </p>

        <p className="authForm-legal">
          By continuing, you agree to our <span className="authForm-muted">Terms</span> and{' '}
          <span className="authForm-muted">Privacy Policy</span>.
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
