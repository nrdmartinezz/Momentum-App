import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPost, getToken } from "../utils/apiClient";
import { ProfileContext } from "./ProfileContext";

const WDLS = localStorage.getItem("workDuration");
const SBLS = localStorage.getItem("shortBreakDuration");
const LBLS = localStorage.getItem("longBreakDuration");

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const { isAuthenticated } = useContext(ProfileContext);

  const [workDuration, setWorkDuration] = useState(WDLS ? WDLS * 60 : 25 * 60);
  const [shortBreakDuration, setShortBreakDuration] = useState(
    SBLS ? SBLS * 60 : 5 * 60
  );
  const [longBreakDuration, setLongBreakDuration] = useState(
    LBLS ? LBLS * 60 : 15 * 60
  );
  const [timeRemaining, setTimeRemaining] = useState(workDuration);
  const [mode, setMode] = useState("WORK");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user settings from API on mount
  useEffect(() => {
    const loadUserSettings = async () => {
      const token = getToken();
      if (!token) {
        // Reset to defaults when logged out
        const defaultWork = 25 * 60;
        const defaultShort = 5 * 60;
        const defaultLong = 15 * 60;
        
        setWorkDuration(defaultWork);
        setShortBreakDuration(defaultShort);
        setLongBreakDuration(defaultLong);
        
        localStorage.setItem("workDuration", "25");
        localStorage.setItem("shortBreakDuration", "5");
        localStorage.setItem("longBreakDuration", "15");
        
        // Minimum delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // Start minimum delay timer
      const minDelay = new Promise(resolve => setTimeout(resolve, 1000));

      try {
        const data = await apiGet("/users/get_user_settings");
        
        if (data) {
          // API returns: pomodoro_duration, short_break_duration, long_break_duration (in seconds)
          const pomoSeconds = data.pomodoro_duration ?? data.workDuration;
          const shortSeconds = data.short_break_duration ?? data.shortBreakDuration;
          const longSeconds = data.long_break_duration ?? data.longBreakDuration;

          if (pomoSeconds !== undefined) {
            const seconds = parseInt(pomoSeconds, 10);
            setWorkDuration(seconds);
            localStorage.setItem("workDuration", Math.round(seconds / 60));
          }
          if (shortSeconds !== undefined) {
            const seconds = parseInt(shortSeconds, 10);
            setShortBreakDuration(seconds);
            localStorage.setItem("shortBreakDuration", Math.round(seconds / 60));
          }
          if (longSeconds !== undefined) {
            const seconds = parseInt(longSeconds, 10);
            setLongBreakDuration(seconds);
            localStorage.setItem("longBreakDuration", Math.round(seconds / 60));
          }
        }
      } catch (error) {
        console.error("Failed to load user settings:", error);
      } finally {
        // Wait for minimum delay before hiding loading state
        await minDelay;
        setIsLoading(false);
      }
    };

    loadUserSettings();
  }, [isAuthenticated]); // Re-run when auth status changes

  const updateDatabase = async (newDurations) => {
    const token = getToken();
    if (!token) {
      console.warn("No auth token, skipping database update");
      return;
    }

    try {
      // Send durations in seconds for exact precision
      // User ID is extracted from JWT token on backend
      const body = {
        pomodoro_duration: newDurations.workDuration,
        short_break_duration: newDurations.shortBreakDuration,
        long_break_duration: newDurations.longBreakDuration,
      };
      
      await apiPost("/users/update_user_settings", body);
      console.log("Database updated successfully with (seconds):", body);
    } catch (error) {
      console.error("Failed to update database:", error);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        isLoading,
        workDuration,
        setWorkDuration: (value) => {
          const totalSeconds = Math.round(value);
          setWorkDuration(totalSeconds);
          localStorage.setItem("workDuration", Math.round(totalSeconds / 60));
          updateDatabase({
            workDuration: totalSeconds,
            shortBreakDuration,
            longBreakDuration,
          });
        },
        shortBreakDuration,
        setShortBreakDuration: (value) => {
          const totalSeconds = Math.round(value);
          setShortBreakDuration(totalSeconds);
          localStorage.setItem("shortBreakDuration", Math.round(totalSeconds / 60));
          updateDatabase({
            workDuration,
            shortBreakDuration: totalSeconds,
            longBreakDuration,
          });
        },
        longBreakDuration,
        setLongBreakDuration: (value) => {
          const totalSeconds = Math.round(value);
          setLongBreakDuration(totalSeconds);
          localStorage.setItem("longBreakDuration", Math.round(totalSeconds / 60));
          updateDatabase({
            workDuration,
            shortBreakDuration,
            longBreakDuration: totalSeconds,
          });
        },
        timeRemaining,
        setTimeRemaining: (value) => {
          setTimeRemaining(value);
        },
        mode,
        setMode: (value) => {
          setMode(value);
        },
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

TimerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
