import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const SignUp = ({ onSubmit, onSwitchToLogin, authLoading, authError, isAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    await onSubmit({ email, password });
    
    // Clear password fields on submission
    setPassword("");
    setConfirmPassword("");
  };

  // Clear all fields when successfully authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setLocalError("");
    }
  }, [isAuthenticated]);

  return (
    <div className="no-auth-menu adrianna-regular">
      {authLoading ? (
        <div className="auth-loading">
          <span>Creating account...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="signup-confirm-password">Confirm Password</label>
            <input
              type="password"
              id="signup-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="white-btn">
            Sign Up
          </button>
        </form>
      )}
      {(authError || localError) && (
        <div className="auth-error">
          <span>Error: {authError || localError}</span>
        </div>
      )}
      <div className="signup-alternative">
        <span>Already have an account?</span>
        <button className="link-btn" onClick={onSwitchToLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

SignUp.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onSwitchToLogin: PropTypes.func.isRequired,
  authLoading: PropTypes.bool.isRequired,
  authError: PropTypes.string,
  isAuthenticated: PropTypes.bool,
};

export default SignUp;
