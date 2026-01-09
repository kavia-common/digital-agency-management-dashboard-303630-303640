import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import FormError from '../components/FormError';
import PasswordToggle from '../components/PasswordToggle';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, validateLogin } from './authFormUtils';
import { requestMagicLink, requestPasswordReset } from '../services/api/auth';
import './AuthForms.css';

// PUBLIC_INTERFACE
/**
 * Login form UI.
 * @returns {JSX.Element}
 */
function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [data, setData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canMagicLink = useMemo(() => isValidEmail(data.email), [data.email]);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (formError) setFormError('');
    if (successMessage) setSuccessMessage('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    const nextErrors = validateLogin(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setFormError('Please fix the errors above');
      return;
    }

    setLoading(true);
    try {
      await login(data.email, data.password);
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 900);
    } catch (err) {
      setFormError(err?.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onMagicLink = async () => {
    setFormError('');
    setSuccessMessage('');

    if (!data.email) {
      setErrors({ email: 'Email is required for magic link' });
      return;
    }
    if (!isValidEmail(data.email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }

    setLoading(true);
    try {
      const res = await requestMagicLink(data.email);
      setSuccessMessage(res?.message || 'Magic link sent to your email');
    } catch (err) {
      setFormError(err?.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async () => {
    setFormError('');
    setSuccessMessage('');

    if (!data.email) {
      setErrors({ email: 'Enter your email to reset your password' });
      return;
    }
    if (!isValidEmail(data.email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordReset(data.email);
      setSuccessMessage(res?.message || 'Password reset email sent');
    } catch (err) {
      setFormError(err?.message || 'Failed to request password reset');
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
          label="Email"
          type="email"
          name="email"
          id="login-email"
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
          id="login-password"
          placeholder="Enter your password"
          value={data.password}
          onChange={onChange}
          error={errors.password}
          icon={<Icon icon={Lock} size={18} />}
          rightIcon={<PasswordToggle visible={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
          autoComplete="current-password"
          required
        />

        <div className="authForm-row">
          <label className="authForm-check">
            <input type="checkbox" name="rememberMe" checked={data.rememberMe} onChange={onChange} />
            <span>Remember me</span>
          </label>

          <button type="button" className="authForm-link" onClick={onForgotPassword} disabled={loading}>
            Forgot password?
          </button>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
          Log in
        </Button>

        <div className="authForm-divider" role="separator" aria-label="or">
          <span>or</span>
        </div>

        <Button type="button" variant="outline" size="lg" fullWidth disabled={loading || !canMagicLink} onClick={onMagicLink}>
          <Icon icon={Mail} size={18} />
          Continue with Magic Link
        </Button>

        <p className="authForm-alt">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="authForm-linkInline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
