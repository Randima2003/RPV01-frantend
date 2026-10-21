import { useState } from 'react';
import { login } from '../api/auth';
import '../styles/Login.css';
import VLogo from '../assets/VLogo.png';

const Login = ({ onRoleSelect, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await login({ email, password });
      await onLoginSuccess(response.user);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-card">
      <div className="login-header">
        <img src={VLogo} alt="VentureVista Logo" className="main-logo" />
        <h2>Log in to view this page</h2>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          className="input-field"
          placeholder="Email address"
          autoComplete="email"
          aria-label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          autoComplete="current-password"
          aria-label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="login-error" role="alert">{error}</p>}

        <button type="submit" className="btn-login" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Log in'}
        </button>
      </form>

      <div className="role-selection-section">
        <p className="signup-label">New to VentureVista? Choose your account type:</p>
        <div className="role-buttons">
          <button
            type="button"
            className="btn-role btn-traveler"
            onClick={() => onRoleSelect('traveler')}
          >
            Sign Up as Traveler
          </button>
          <button
            type="button"
            className="btn-role btn-guide"
            onClick={() => onRoleSelect('guide')}
          >
            Sign Up as Local Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;