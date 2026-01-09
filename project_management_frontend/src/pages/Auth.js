import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';
import FormError from '../components/FormError';
import Tabs from '../components/Tabs';
import AuthCard from '../components/AuthCard';
import AnimatedPanel from '../components/AnimatedPanel';
import PasswordToggle from '../components/PasswordToggle';
import { login, signup, requestMagicLink } from '../services/api/auth';
import './Auth.css';

// PUBLIC_INTERFACE
/**
 * Auth page component with Login and Sign Up functionality
 * Features two-panel layout with animations and validations
 * @returns {JSX.Element} Auth page
 */
function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const tabs = [
    { id: 'login', label: 'Login' },
    { id: 'signup', label: 'Sign Up' },
  ];

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      rememberMe: false,
    });
    setErrors({});
    setFormError('');
    setSuccessMessage('');
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (formError) {
      setFormError('');
    }
  };

  // Validate email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (activeTab === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!validateForm()) {
      setFormError('Please fix the errors above');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'login') {
        const response = await login(formData.email, formData.password);
        console.log('Login successful:', response);
        
        // Store token
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        
        setSuccessMessage('Login successful! Redirecting...');
        
        // TODO: Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        const response = await signup(formData.email, formData.password, formData.name);
        console.log('Signup successful:', response);
        
        // Store token
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        
        setSuccessMessage('Account created successfully! Redirecting...');
        
        // TODO: Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (error) {
      setFormError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle magic link
  const handleMagicLink = async () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required for magic link' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      const response = await requestMagicLink(formData.email);
      setSuccessMessage(response.message);
    } catch (error) {
      setFormError(error.message || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background animations */}
      <div className="auth-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="auth-container">
        {/* Left Panel - Brand/Benefits */}
        <div className="auth-panel auth-panel-left">
          <div className="auth-brand">
            <h1 className="auth-brand-title">Welcome to KAVIA</h1>
            <p className="auth-brand-subtitle">
              Your complete project management solution
            </p>
          </div>

          <div className="auth-benefits">
            <div className="benefit-item">
              <CheckCircle className="benefit-icon" size={24} />
              <div>
                <h3 className="benefit-title">Team Collaboration</h3>
                <p className="benefit-description">
                  Work together seamlessly with your team
                </p>
              </div>
            </div>
            <div className="benefit-item">
              <CheckCircle className="benefit-icon" size={24} />
              <div>
                <h3 className="benefit-title">Project Tracking</h3>
                <p className="benefit-description">
                  Keep all your projects organized and on track
                </p>
              </div>
            </div>
            <div className="benefit-item">
              <CheckCircle className="benefit-icon" size={24} />
              <div>
                <h3 className="benefit-title">Analytics & Insights</h3>
                <p className="benefit-description">
                  Make data-driven decisions with powerful analytics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="auth-panel auth-panel-right">
          <AuthCard>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

            <AnimatedPanel panelKey={activeTab}>
              {successMessage && (
                <div className="success-message" role="alert" aria-live="polite">
                  <CheckCircle size={18} />
                  <span>{successMessage}</span>
                </div>
              )}

              <FormError message={formError} />

              <form onSubmit={handleSubmit} noValidate>
                {activeTab === 'signup' && (
                  <InputField
                    label="Full Name"
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    icon={<User size={18} />}
                    required
                  />
                )}

                <InputField
                  label="Email Address"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  icon={<Mail size={18} />}
                  required
                />

                <InputField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  icon={<Lock size={18} />}
                  rightIcon={
                    <PasswordToggle
                      visible={showPassword}
                      onToggle={() => setShowPassword(!showPassword)}
                    />
                  }
                  required
                />

                {activeTab === 'signup' && (
                  <InputField
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={errors.confirmPassword}
                    icon={<Lock size={18} />}
                    rightIcon={
                      <PasswordToggle
                        visible={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                    required
                  />
                )}

                {activeTab === 'login' && (
                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => alert('Password reset functionality coming soon')}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                >
                  {activeTab === 'login' ? 'Log In' : 'Sign Up'}
                </Button>

                <div className="divider">
                  <span>or</span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  fullWidth
                  onClick={handleMagicLink}
                  disabled={loading}
                >
                  <Mail size={18} />
                  Continue with Magic Link
                </Button>
              </form>
            </AnimatedPanel>
          </AuthCard>
        </div>
      </div>
    </div>
  );
}

export default Auth;
