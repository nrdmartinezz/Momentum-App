import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { apiDelete, apiGet, apiPost, apiPut, apiUpload, getToken } from "../utils/apiClient";
import { loadSessionData, clearSessionData } from "../utils/sessionData";
import { getUserFromToken } from "../utils/jwtUtils";
import { ProfileContext } from "./ProfileContext";

export const ThemeContext = createContext();

const DEFAULT_BACKGROUND = "/assets/images/background-image.jpeg";

function resolveBackground(url) {
  if (!url || url.includes("res.cloudinary.com")) return DEFAULT_BACKGROUND;
  return url;
}

function storageKey(userId) {
  return userId ? `theme:${userId}` : "theme:guest";
}

function hexToTransparentDark(hex, opacity = 0.8, darkenAmount = 0.3) {
  const normalized = hex.replace("#", "");
  let r = parseInt(normalized.substring(0, 2), 16);
  let g = parseInt(normalized.substring(2, 4), 16);
  let b = parseInt(normalized.substring(4, 6), 16);
  r = Math.floor(r * (1 - darkenAmount));
  g = Math.floor(g * (1 - darkenAmount));
  b = Math.floor(b * (1 - darkenAmount));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function currentUserId() {
  if (typeof window === "undefined") return null;
  const token = getToken();
  return token ? getUserFromToken(token)?.userId || null : null;
}

// Default theme settings
const DEFAULT_THEME = {
  id: "default",
  accent_color: "#7E52B3",
  primary_color: "#ffffff",
  background_image: DEFAULT_BACKGROUND,
  sound: "default",
  applied_theme_id: null,
};

function applyCssTheme(themeData) {
  if (typeof document === "undefined") return;
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty("--global-color-accent", themeData.accent_color);
  rootStyle.setProperty("--global-color-white", themeData.primary_color);
  rootStyle.setProperty(
    "--background-image",
    `url("${themeData.background_image}")`
  );
  rootStyle.setProperty(
    "--global-color-transparent-black",
    hexToTransparentDark(themeData.accent_color, 0.8, 0.7)
  );
}

function writeStoredTheme(nextTheme, ownerId) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(ownerId), JSON.stringify(nextTheme));
  localStorage.removeItem("theme");
}

function themeFromServer(themeData, base = DEFAULT_THEME) {
  return {
    ...base,
    accent_color: themeData?.accent_color || base.accent_color,
    primary_color: themeData?.primary_color || base.primary_color,
    background_image: resolveBackground(themeData?.background_image || base.background_image),
    sound: themeData?.sound || base.sound,
    applied_theme_id: themeData?.applied_theme_id ?? base.applied_theme_id ?? null,
  };
}

function readStoredTheme(userId) {
  if (typeof window === "undefined") return DEFAULT_THEME;
  const saved = localStorage.getItem(storageKey(userId));
  if (!saved) return DEFAULT_THEME;
  try {
    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_THEME,
      ...parsed,
      background_image: resolveBackground(parsed.background_image),
    };
  } catch (e) {
    console.error("Failed to parse saved theme:", e);
    return DEFAULT_THEME;
  }
}

export const ThemeProvider = ({ children }) => {
  const { isAuthenticated, authLoading, user } = useContext(ProfileContext);
  const userId = user?.userId || null;

  const [theme, setTheme] = useState(() => readStoredTheme(currentUserId()));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistTheme = (nextTheme, ownerId = userId) => {
    setTheme(nextTheme);
    applyCssTheme(nextTheme);
    writeStoredTheme(nextTheme, ownerId);
  };

  useEffect(() => {
    if (authLoading) return;

    const loadTheme = async () => {
      const token = getToken();
      const ownerId = token ? getUserFromToken(token)?.userId || null : null;

      if (!token || !ownerId) {
        const guestTheme = readStoredTheme(null);
        setTheme(guestTheme);
        applyCssTheme(guestTheme);
        writeStoredTheme(guestTheme, null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await loadSessionData();
        const serverTheme = themeFromServer(data?.theme, readStoredTheme(ownerId));
        setTheme(serverTheme);
        applyCssTheme(serverTheme);
        writeStoredTheme(serverTheme, ownerId);
      } catch (err) {
        console.error("Failed to load theme from API:", err);
        setError(err?.message || "Failed to load theme");
        const fallback = readStoredTheme(ownerId);
        setTheme(fallback);
        applyCssTheme(fallback);
        writeStoredTheme(fallback, ownerId);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (!isLoading) applyCssTheme(theme);
  }, [theme, isLoading]);

  const updateTheme = async (updates) => {
    const token = getToken();
    if (token && updates.background_image?.startsWith("data:")) {
      throw new Error("Upload the image file instead of a data URL.");
    }

    const changesLook =
      updates.accent_color !== undefined ||
      updates.primary_color !== undefined ||
      updates.sound !== undefined;
    const newTheme = {
      ...theme,
      ...updates,
      ...(changesLook ? { applied_theme_id: null } : {}),
    };
    if (token) {
      const payload = {};
      if (updates.accent_color !== undefined) payload.accent_color = updates.accent_color;
      if (updates.primary_color !== undefined) payload.primary_color = updates.primary_color;
      if (updates.sound !== undefined) payload.sound = updates.sound;
      if (updates.background_image !== undefined) {
        payload.background_image = updates.background_image;
      }
      if (changesLook) payload.applied_theme_id = null;

      try {
        const response = await apiPost("/themes/update", payload);
        clearSessionData();
        if (response?.theme) {
          persistTheme(themeFromServer(response.theme, newTheme));
          return;
        }
      } catch (err) {
        console.error("Failed to sync theme to server:", err);
        setError(err?.message || "Failed to save theme");
        throw err;
      }
    }

    persistTheme(newTheme, token ? userId : null);
  };

  const uploadBackground = async (file) => {
    const token = getToken();
    if (!token) {
      throw new Error("Sign in to save a background image.");
    }
    const body = new FormData();
    body.append("image", file);
    const response = await apiUpload("/themes/background", body);
    clearSessionData();
    if (response?.theme) {
      persistTheme(themeFromServer(response.theme, theme));
    }
    return response?.theme;
  };

  const saveTheme = async ({ name, visibility, include_image }) => {
    const response = await apiPost("/themes/save", {
      name,
      visibility,
      include_image,
    });
    return response?.theme;
  };

  const fetchThemeLibrary = async () => {
    const [mineResult, libraryResult] = await Promise.all([
      apiGet("/themes/mine"),
      apiGet("/themes/library"),
    ]);
    return {
      mine: mineResult?.themes || [],
      library: libraryResult?.themes || [],
    };
  };

  const applySavedTheme = async (id, useThemeImage = false) => {
    const response = await apiPost(`/themes/${id}/apply`, {
      use_theme_image: useThemeImage,
    });
    clearSessionData();
    if (response?.theme) persistTheme(themeFromServer(response.theme, theme));
    return response?.theme;
  };

  const updateSavedTheme = async (id, updates) => {
    const response = await apiPut(`/themes/${id}`, updates);
    return response?.theme;
  };

  const deleteSavedTheme = async (id) => {
    await apiDelete(`/themes/${id}`);
    if (theme.applied_theme_id === id) {
      persistTheme({ ...theme, applied_theme_id: null });
    }
  };

  const setAccentColor = async (color) => await updateTheme({ accent_color: color });
  const setPrimaryColor = async (color) => await updateTheme({ primary_color: color });
  const setBackgroundImage = async (url) => {
    await updateTheme({ background_image: url });
  };
  const setSound = async (sound) => await updateTheme({ sound });

  const resetTheme = async () => {
    await updateTheme({
      accent_color: DEFAULT_THEME.accent_color,
      primary_color: DEFAULT_THEME.primary_color,
      background_image: DEFAULT_THEME.background_image,
      sound: DEFAULT_THEME.sound,
      applied_theme_id: null,
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isLoading,
        error,
        accentColor: theme.accent_color,
        primaryColor: theme.primary_color,
        backgroundImage: theme.background_image,
        sound: theme.sound,
        appliedThemeId: theme.applied_theme_id,
        setAccentColor,
        setPrimaryColor,
        setBackgroundImage,
        setSound,
        updateTheme,
        uploadBackground,
        resetTheme,
        saveTheme,
        fetchThemeLibrary,
        applySavedTheme,
        updateSavedTheme,
        deleteSavedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
