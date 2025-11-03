import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const Login = ({ onSubmit, authLoading, authError, isAuthenticated, onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ email, password });
    // Always clear password for security
    setPassword("");
  };

  // Clear all fields when successfully authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setEmail("");
      setPassword("");
    }
  }, [isAuthenticated]);

  return (
    <div className="no-auth-menu adrianna-regular">
      {authLoading ? (
        <div className="auth-loading">
          <span>Authenticating...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="white-btn">
            Login
          </button>
        </form>
      )}
      {authError && (
        <div className="auth-error">
          <span>Error: {authError}</span>
        </div>
      )}
      <div className="signup-alternative adrianna-regular">
          <span>Don&apos;t have an account?</span>
          <button className="link-btn" onClick={onSwitchToSignUp}>
            Sign Up
          </button>
        </div>
    </div>
  );
};

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  authLoading: PropTypes.bool.isRequired,
  authError: PropTypes.string,
  isAuthenticated: PropTypes.bool,
    onSwitchToSignUp: PropTypes.func,
};

// Export clearForm method for parent component
export { Login as default };
