import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { apiPost, getToken } from "../utils/apiClient";
import { loadSessionData } from "../utils/sessionData";
import { ProfileContext } from "./ProfileContext";

function secondsFromStoredMinutes(key, fallbackMinutes) {
  if (typeof window === "undefined") return fallbackMinutes * 60;
  const saved = localStorage.getItem(key);
  return saved ? saved * 60 : fallbackMinutes * 60;
}

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const { isAuthenticated } = useContext(ProfileContext);

  const [workDuration, setWorkDuration] = useState(() =>
    secondsFromStoredMinutes("workDuration", 25)
  );
  const [shortBreakDuration, setShortBreakDuration] = useState(() =>
    secondsFromStoredMinutes("shortBreakDuration", 5)
  );
  const [longBreakDuration, setLongBreakDuration] = useState(() =>
    secondsFromStoredMinutes("longBreakDuration", 15)
  );
  const [timeRemaining, setTimeRemaining] = useState(workDuration);
  const [mode, setMode] = useState("WORK");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user settings from API on mount
  useEffect(() => {
    const loadUserSettings = async () => {
      const token = getToken();
      if (!token) {
        const defaultWork = 25 * 60;
        const defaultShort = 5 * 60;
        const defaultLong = 15 * 60;

        setWorkDuration(defaultWork);
        setShortBreakDuration(defaultShort);
        setLongBreakDuration(defaultLong);

        localStorage.setItem("workDuration", "25");
        localStorage.setItem("shortBreakDuration", "5");
        localStorage.setItem("longBreakDuration", "15");

        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const session = await loadSessionData();
        const data = session?.settings;

        if (data) {
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
