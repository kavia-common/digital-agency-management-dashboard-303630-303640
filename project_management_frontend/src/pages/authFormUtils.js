// PUBLIC_INTERFACE
/**
 * Validates email with a simple RFC-like regex.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email || '').trim());
}

// PUBLIC_INTERFACE
/**
 * Returns field-level errors for login form data.
 * @param {{email: string, password: string}} data
 * @returns {Record<string,string>}
 */
export function validateLogin(data) {
  const errors = {};
  if (!data.email) errors.email = 'Email is required';
  else if (!isValidEmail(data.email)) errors.email = 'Please enter a valid email';

  if (!data.password) errors.password = 'Password is required';
  else if (String(data.password).length < 6) errors.password = 'Password must be at least 6 characters';

  return errors;
}

// PUBLIC_INTERFACE
/**
 * Returns field-level errors for signup form data.
 * @param {{name: string, email: string, password: string, confirmPassword: string}} data
 * @returns {Record<string,string>}
 */
export function validateSignup(data) {
  const errors = {};

  if (!data.name) errors.name = 'Name is required';

  if (!data.email) errors.email = 'Email is required';
  else if (!isValidEmail(data.email)) errors.email = 'Please enter a valid email';

  if (!data.password) errors.password = 'Password is required';
  else if (String(data.password).length < 6) errors.password = 'Password must be at least 6 characters';

  if (!data.confirmPassword) errors.confirmPassword = 'Please confirm your password';
  else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';

  return errors;
}
