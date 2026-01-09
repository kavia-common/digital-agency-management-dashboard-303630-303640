# Authentication UI Documentation

## Overview

This authentication UI provides a professional, modern two-panel experience for user login and signup with smooth animations, clean typography, and accessibility features.

## Components

### Reusable Components

#### Button (`src/components/Button.js`)
A versatile button component with multiple variants and states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `loading`: boolean
- `disabled`: boolean
- `type`: 'button' | 'submit' | 'reset'
- `onClick`: function

**Usage:**
```jsx
<Button variant="primary" size="lg" fullWidth loading={isLoading}>
  Submit
</Button>
```

#### InputField (`src/components/InputField.js`)
Input field with label, icon support, and error states.

**Props:**
- `label`: string
- `type`: string
- `placeholder`: string
- `error`: string (error message)
- `icon`: ReactNode (left icon)
- `rightIcon`: ReactNode (right icon, e.g., password toggle)
- `required`: boolean
- `name`: string
- `value`: string
- `onChange`: function

**Usage:**
```jsx
<InputField
  label="Email Address"
  type="email"
  name="email"
  icon={<Mail size={18} />}
  error={errors.email}
  required
/>
```

#### PasswordToggle (`src/components/PasswordToggle.js`)
Icon button for toggling password visibility.

**Props:**
- `visible`: boolean
- `onToggle`: function

**Usage:**
```jsx
<InputField
  type={showPassword ? 'text' : 'password'}
  rightIcon={
    <PasswordToggle
      visible={showPassword}
      onToggle={() => setShowPassword(!showPassword)}
    />
  }
/>
```

#### Tabs (`src/components/Tabs.js`)
Tab navigation with animated indicator.

**Props:**
- `tabs`: Array of {id, label}
- `activeTab`: string (current tab id)
- `onTabChange`: function

**Usage:**
```jsx
<Tabs
  tabs={[
    { id: 'login', label: 'Login' },
    { id: 'signup', label: 'Sign Up' }
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

#### FormError (`src/components/FormError.js`)
Displays form-level error messages with icon.

**Props:**
- `message`: string

#### AuthCard (`src/components/AuthCard.js`)
Container card for authentication forms with shadow and rounded corners.

#### AnimatedPanel (`src/components/AnimatedPanel.js`)
Wrapper for animated content transitions.

**Props:**
- `panelKey`: string (triggers animation on change)

## Pages

### Auth (`src/pages/Auth.js`)
Main authentication page with two-panel layout.

**Features:**
- Two-panel responsive layout (brand/benefits left, form right)
- Tab navigation between Login and Sign Up
- Form validation with error states
- Password visibility toggle
- Remember me checkbox (login)
- Magic link authentication placeholder
- Smooth animations and transitions
- Accessibility features (ARIA labels, focus management, keyboard navigation)

## Services

### API Client (`src/services/api/client.js`)
Base HTTP client for API requests.

**Functions:**
- `get(endpoint, options)` - GET request
- `post(endpoint, data, options)` - POST request
- `put(endpoint, data, options)` - PUT request
- `del(endpoint, options)` - DELETE request

**Configuration:**
- Reads API base URL from `REACT_APP_API_BASE_URL` environment variable
- Automatically includes auth token from localStorage in requests
- Handles JSON serialization/deserialization

### Auth Service (`src/services/api/auth.js`)
Authentication-specific API methods (currently stubs).

**Functions:**
- `login(email, password)` - User login
- `signup(email, password, name)` - User registration
- `requestPasswordReset(email)` - Password reset request
- `requestMagicLink(email)` - Magic link request (Supabase placeholder)

## Styling

### Theme System (`src/styles/theme.css`)
CSS variables for consistent theming:

**Colors:**
- `--primary`: #3b82f6 (blue)
- `--secondary`: #64748b (gray)
- `--success`: #06b6d4 (cyan)
- `--error`: #EF4444 (red)

**Typography:**
- Font family: Inter
- Font sizes: xs to 3xl
- Line heights: tight, normal, relaxed
- Letter spacing: tight, normal, wide

**Spacing:**
- xs (0.25rem) to 2xl (3rem)

**Transitions:**
- fast (150ms), base (250ms), slow (350ms)
- Cubic-bezier easing for smooth animations

## Backend Integration

### Current State
The authentication UI currently uses **stub methods** in `src/services/api/auth.js`. These methods simulate API delays and return mock responses.

### Integration Steps

1. **Update Environment Variables**
   Add to `.env` file:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-url.com
   ```

2. **Wire Auth Service to Backend**
   In `src/services/api/auth.js`, replace mock implementations:

   ```javascript
   // Before (stub):
   export async function login(email, password) {
     console.log('Auth service: login called');
     await new Promise(resolve => setTimeout(resolve, 1000));
     return { user: {...}, token: 'mock-jwt-token' };
   }

   // After (real API):
   export async function login(email, password) {
     return post('/auth/login', { email, password });
   }
   ```

3. **Handle Backend Response Format**
   Ensure your backend returns data in this format:
   ```json
   {
     "user": {
       "id": "string",
       "email": "string",
       "name": "string"
     },
     "token": "string"
   }
   ```

4. **Implement Protected Routes**
   Create an authentication context and route guards:
   ```javascript
   // Example AuthContext
   const AuthContext = createContext();
   
   function PrivateRoute({ children }) {
     const token = localStorage.getItem('auth_token');
     return token ? children : <Navigate to="/auth" />;
   }
   ```

5. **Supabase Magic Link Integration**
   Wire `requestMagicLink` to Supabase:
   ```javascript
   import { supabase } from '../supabase';
   
   export async function requestMagicLink(email) {
     const { error } = await supabase.auth.signInWithOtp({
       email,
       options: {
         emailRedirectTo: process.env.REACT_APP_SITE_URL || window.location.origin
       }
     });
     
     if (error) throw error;
     return { message: 'Magic link sent to your email' };
   }
   ```

## Accessibility Features

- Semantic HTML with proper ARIA attributes
- Keyboard navigation support
- Focus management after tab switching
- `aria-live` regions for dynamic error messages
- `aria-invalid` on form fields with errors
- Proper label associations
- Focus-visible styles for keyboard users

## Animation Details

- Tab indicator: 350ms cubic-bezier transition
- Panel transitions: slide + fade effect
- Button hover: translateY + shadow
- Floating shapes: 20s infinite float animation
- Form errors: slide-in animation
- Loading spinner: rotate animation

## Performance Considerations

- Lightweight icon library (Lucide React)
- CSS-only animations (no JS animation libraries)
- Minimal dependencies
- No heavy UI frameworks
- Proper code splitting with React Router

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design: mobile-first approach
- Breakpoints: 768px (mobile), 968px (tablet)

## Future Enhancements

- [ ] Social authentication (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] Password strength indicator
- [ ] Email verification flow
- [ ] Session management
- [ ] Refresh token handling
- [ ] Remember me functionality (persistent sessions)
- [ ] Rate limiting feedback
- [ ] CAPTCHA integration

## Testing

Components are modular and ready for unit/integration tests:

```javascript
// Example test structure
describe('Button', () => {
  it('renders with correct variant', () => {
    // test implementation
  });
  
  it('shows loading state', () => {
    // test implementation
  });
});
```

## Notes

- All public interfaces are marked with `// PUBLIC_INTERFACE` comment
- Components follow React best practices and hooks
- Form validation is client-side; implement server-side validation in backend
- Token storage uses localStorage; consider more secure options for production
- Magic link functionality is a placeholder for Supabase integration
