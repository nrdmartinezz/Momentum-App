import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiPost, apiPut, getToken, clearToken } from "../utils/apiClient";
import { getUserFromToken, isTokenValid } from "../utils/jwtUtils";

const ProfileContext = createContext();

const ProfileProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      
      // Minimum delay to show loading state
      const minDelay = new Promise(resolve => setTimeout(resolve, 600));
      
      if (token && isTokenValid(token)) {
        // Decode token to get user data
        const userData = getUserFromToken(token);
        if (userData) {
          setUser(userData);
        }
      } else {
        // Token is expired or invalid, clear it
        clearToken();
        localStorage.removeItem("user");
      }
      
      // Wait for minimum delay before hiding loading state
      await minDelay;
      setAuthLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (body) => {
    setAuthLoading(true);
    setAuthError(null); 
    try {
      const data = await apiPost("/users/login", body);
      
      // Store token
      localStorage.setItem("authToken", data.token);
      
      // Decode token to get user data
      const userData = getUserFromToken(data.token);
      if (userData) {
        setUser(userData);
      } else {
        throw new Error("Invalid token received");
      }
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
      
      // Store token
      localStorage.setItem("authToken", data.token);
      
      // Decode token to get user data
      const userData = getUserFromToken(data.token);
      if (userData) {
        setUser(userData);
      } else {
        throw new Error("Invalid token received");
      }
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
    if (token && isTokenValid(token)) {
      const userData = getUserFromToken(token);
      if (userData) {
        setUser(userData);
      }
    } else {
      clearToken();
      setUser(null);
    }
    setAuthLoading(false);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const updateProfile = async (body) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const data = await apiPut("/users/update_profile", body);
      console.log("Profile updated:", data);
      
      // Backend returns a new token with updated user data
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        
        // Decode new token to get updated user data
        const userData = getUserFromToken(data.token);
        if (userData) {
          setUser(userData);
        }
      }
      
      return data;
    } catch (error) {
      const errorMessage = error.message || error.data?.error || "Profile update failed";
      setAuthError(errorMessage);
      console.log("Profile update error:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
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
        updateProfile,
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
