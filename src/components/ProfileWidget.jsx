import { useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ProfileContext } from "../context/ProfileContext";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProfileWidget = ({ isProfileOpen, isTaskListOpen }) => {
  const {
    login,
    signUp,
    logout,
    isAuthenticated,
    user,
    authLoading,
    authError,
  } = useContext(ProfileContext);
  const [showProfile, setShowProfile] = useState(isProfileOpen);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shakePopup, setShakePopup] = useState(false);
  const widgetRef = useRef(null);

  const handleToggle = () => {
    setShowProfile(!showProfile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
    // Always clear password for security
    setPassword("");
  };

  // Clear both fields when successfully authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setEmail("");
      setPassword("");
    }
  }, [isAuthenticated]);

  // Trigger shake animation when error occurs
  useEffect(() => {
    if (authError) {
      setShakePopup(true);
      const timer = setTimeout(() => setShakePopup(false), 500);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  const authMenu = () => {
    return (
      <div className="auth-menu adrianna-regular">
        {authLoading ? (
          <div className="auth-loading">
            <span>Loading...</span>
          </div>
        ) : (
          <div className="user-info adrianna-regular flex-col">
            <span>Welcome, {user ? user.name : "User"}!</span>
            <button className="clear-btn" onClick={logout}>Logout</button>
          </div>
        )}
        {authError && (
          <div className="auth-error adrianna-regular">
            <span>ERROR: {authError}</span>
          </div>
        )}
      </div>
    );
  };

  const noAuthMenu = () => {
    return (
      <div className="no-auth-menu adrianna-regular">
        {authLoading ? (
          <div className="auth-loading">
            <span>Authenticating...</span>
          </div>
        ) : (
          <>
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
            <div className="signup-alternative">
              <span>Don&apos;t have an account?</span>
              <button className="link-btn" onClick={signUp}>
                Sign Up
              </button>
            </div>
          </>
        )}
        {authError && (
          <div className="auth-error">
            <span>Error: {authError}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        ref={widgetRef}
        className={
          "app-settings-widget profile-widget" + (isTaskListOpen ? " push" : "")
        }
      >
        <div className="app-settings-button profile-widget">
          <button onClick={handleToggle} className="round-btn simple-controls">
            <FontAwesomeIcon icon={faUser} />
          </button>
        </div>
      </div>
      <div
        ref={widgetRef}
        className={
          "profile-popup-container " + 
          (showProfile ? "profile-visible " : "") + 
          (shakePopup ? "shake" : "")
        }
      >
        {isAuthenticated ? authMenu() : noAuthMenu()}
      </div>
    </>
  );
};

ProfileWidget.propTypes = {
  isProfileOpen: PropTypes.bool.isRequired,
  isTaskListOpen: PropTypes.bool.isRequired,
};

export default ProfileWidget;
