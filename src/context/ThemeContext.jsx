import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPost, getToken } from "../utils/apiClient";
import { ProfileContext } from "./ProfileContext";

export const ThemeContext = createContext();

const rootStyle = document.documentElement.style;
const LOCAL_STORAGE_KEY = "theme";

// Default theme settings
const DEFAULT_THEME = {
  id: "default",
  accent_color: "#7E52B3",
  primary_color: "#ffffff",
  background_image:
    "https://res.cloudinary.com/ddsekdku7/image/upload/v1742144459/default-theme-login.jpg",
  sound: "default",
};

export const ThemeProvider = ({ children }) => {
  const { isAuthenticated, authLoading } = useContext(ProfileContext);

  // Initialize state from localStorage or defaults
  const getInitialTheme = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_THEME, ...JSON.parse(saved) };
      } catch (e) {
        console.error("Failed to parse saved theme:", e);
      }
    }
    return DEFAULT_THEME;
  };

  const [theme, setTheme] = useState(getInitialTheme());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to convert hex to RGBA with darkness and transparency
  const hexToTransparentDark = (hex, opacity = 0.8, darkenAmount = 0.3) => {
    // Remove # if present
    hex = hex.replace("#", "");
    
    // Parse hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Darken the color by reducing RGB values
    r = Math.floor(r * (1 - darkenAmount));
    g = Math.floor(g * (1 - darkenAmount));
    b = Math.floor(b * (1 - darkenAmount));
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Apply theme to CSS variables
  const applyTheme = (themeData) => {
    rootStyle.setProperty("--global-color-accent", themeData.accent_color);
    rootStyle.setProperty("--global-color-white", themeData.primary_color);
    rootStyle.setProperty(
      "--background-image",
      `url(${themeData.background_image})`
    );
    
    // Create a dark transparent version of the accent color
    const darkTransparentAccent = hexToTransparentDark(themeData.accent_color, 0.8, 0.7);
    rootStyle.setProperty("--global-color-transparent-black", darkTransparentAccent);
  };

  // Load theme from API on mount if authenticated
  useEffect(() => {
    // Don't load theme until auth check is complete
    if (authLoading) {
      return;
    }

    const loadTheme = async () => {
      const token = getToken();

      if (!token) {
        // Not authenticated - reset to default theme
        setTheme(DEFAULT_THEME);
        applyTheme(DEFAULT_THEME);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_THEME));
        
        // Minimum delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Start minimum delay timer
      const minDelay = new Promise(resolve => setTimeout(resolve, 1200));

      try {
        const data = await apiGet("/themes");

        const serverTheme = {
          id: "default",
          accent_color: data.accent_color || DEFAULT_THEME.accent_color,
          primary_color: data.primary_color || DEFAULT_THEME.primary_color,
          background_image:
            data.background_image || DEFAULT_THEME.background_image,
          sound: data.sound || DEFAULT_THEME.sound,
        };

        setTheme(serverTheme);
        applyTheme(serverTheme);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverTheme));
      } catch (err) {
        console.error("Failed to load theme from API:", err);
        setError(err?.message || "Failed to load theme");
        // Fallback to default theme
        setTheme(DEFAULT_THEME);
        applyTheme(DEFAULT_THEME);
      } finally {
        // Wait for minimum delay before hiding loading state
        await minDelay;
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [isAuthenticated, authLoading]); // Wait for auth check, then load theme

  // Apply theme whenever it changes (but only after initial load)
  useEffect(() => {
    if (!isLoading) {
      applyTheme(theme);
    }
  }, [theme, isLoading]);

  // Update theme (saves to API if authenticated, otherwise localStorage only)
  const updateTheme = async (updates) => {
    const newTheme = { ...theme, ...updates };

    console.log("Updating theme with:", updates);

    // Sync to API if authenticated (do this first to get the Cloudinary URL)
    const token = getToken();
    if (token) {
      try {
        const response = await apiPost("/themes/update", {
          accent_color: newTheme.accent_color,
          primary_color: newTheme.primary_color,
          background_image: newTheme.background_image,
          sound: newTheme.sound,
        });
        console.log("Theme synced to server successfully:", response);

        // If the server returned updated theme data (with Cloudinary URL), use it
        if (response?.theme) {
          const serverTheme = {
            ...newTheme,
            accent_color: response.theme.accent_color || newTheme.accent_color,
            primary_color: response.theme.primary_color || newTheme.primary_color,
            background_image: response.theme.background_image || newTheme.background_image,
            sound: response.theme.sound || newTheme.sound,
          };
          
          setTheme(serverTheme);
          applyTheme(serverTheme);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverTheme));
          return;
        }
      } catch (err) {
        console.error("Failed to sync theme to server:", err);
        setError(err?.message || "Failed to save theme");
        throw err; // Re-throw so the caller knows it failed
      }
    }

    // Fallback: Update state and localStorage if no server sync
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTheme));
  };

  // Update individual theme properties
  const setAccentColor = async (color) => await updateTheme({ accent_color: color });
  const setPrimaryColor = async (color) => await updateTheme({ primary_color: color });
  const setBackgroundImage = async (url) => {
    console.log("Setting background image:", url?.substring(0, 50));
    await updateTheme({ background_image: url });
  };
  const setSound = async (sound) => await updateTheme({ sound });

  // Reset to default theme
  const resetTheme = async () => {
    await updateTheme(DEFAULT_THEME);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLoading,
        error,
        // Individual properties for easy access
        accentColor: theme.accent_color,
        primaryColor: theme.primary_color,
        backgroundImage: theme.background_image,
        sound: theme.sound,
        // Setters
        setAccentColor,
        setPrimaryColor,
        setBackgroundImage,
        setSound,
        updateTheme,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
