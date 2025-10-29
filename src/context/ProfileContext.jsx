import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiPost, getToken, clearToken } from "../utils/apiClient";

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const token = getToken();
    const userId = localStorage.getItem("user");
    
    if (token && userId) {
      // User has a token, set user data from localStorage
      setUser({ userId, token });
    }
    
    // Always set loading to false after checking
    setAuthLoading(false);
  }, []);

  const login = async (body) => {
    setAuthLoading(true);
    setAuthError(null); 
    try {
      const data = await apiPost("/users/login", body);
      
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      // Extract error message from ApiError
      const errorMessage = error.message || error.data?.error || "Login failed";
      setAuthError(errorMessage);
      console.log("Login error:", error);
      setUser(null);
    } finally {         
      setAuthLoading(false);
    }
  };

  const signUp = async (body) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const data = await apiPost("/users/signup", body);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", data.userId);
      
      setUser(data);
    } catch (error) {
      // Extract error message from ApiError
      const errorMessage = error.message || error.data?.error || "Sign up failed";
      setAuthError(errorMessage);
      console.log("Sign up error:", error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshAuth = () => {
    const token = getToken();
    if (token) {
      login({ token });
    } else {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <ProfileContext.Provider
      value={{
        // Auth
        user,
        isAuthenticated: !!user,
        authLoading,
        authError,
        refreshAuth,
        logout,
        login,
        signUp,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export { ProfileContext, ProfileProvider };
