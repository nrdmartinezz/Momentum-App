import { useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ProfileContext } from "../context/ProfileContext";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Login from "../forms/Login";
import SignUp from "../forms/SignUp";
import EditProfile from "./popups/EditProfile";

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
  const [showSignUp, setShowSignUp] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [shakePopup, setShakePopup] = useState(false);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const handleToggle = () => {
    setShowProfile(!showProfile);
  };

  const handleLogin = async (credentials) => {
    await login(credentials);
  };

  const handleSignUp = async (credentials) => {
    await signUp(credentials);
  };

  const switchToSignUp = () => {
    setShowSignUp(true);
  };

  const switchToLogin = () => {
    setShowSignUp(false);
  };

  const openEditProfile = () => {
    setShowEditProfile(true);
    setShowProfile(false); // Close the dropdown when opening edit
  };

  const closeEditProfile = () => {
    setShowEditProfile(false);
  };

  // Reset to login view when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowSignUp(false);
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
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
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
          <div className="user-info white-text adrianna-regular flex-col">
            <span>Welcome, {user ? user.name : "User"}!</span>
            <div className="user-actions">
              <button className="clear-btn" onClick={openEditProfile}>
                Edit Profile
              </button>
              <button className="clear-btn" onClick={logout}>
                Logout
              </button>
            </div>
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
    if (showSignUp) {
      return (
        <SignUp
          onSubmit={handleSignUp}
          onSwitchToLogin={switchToLogin}
          authLoading={authLoading}
          authError={authError}
          isAuthenticated={isAuthenticated}
        />
      );
    }

    return (
      <>
        <Login
          onSubmit={handleLogin}
          authLoading={authLoading}
          authError={authError}
          isAuthenticated={isAuthenticated}
          onSwitchToSignUp={switchToSignUp}
        />
        
      </>
    );
  };

  return (
    <>
      <div
        ref={buttonRef}
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
        ref={popupRef}
        className={
          "profile-popup-container " + 
          (showProfile ? "profile-visible " : "") + 
          (shakePopup ? "shake " : "") +
          (isTaskListOpen ? "push" : "")
        }
      >
        {isAuthenticated ? authMenu() : noAuthMenu()}
      </div>
      <EditProfile isOpen={showEditProfile} onClose={closeEditProfile} />
    </>
  );
};

ProfileWidget.propTypes = {
  isProfileOpen: PropTypes.bool.isRequired,
  isTaskListOpen: PropTypes.bool.isRequired,
};

export default ProfileWidget;
