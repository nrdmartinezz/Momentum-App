import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiGet, apiPost, getToken } from "../utils/apiClient";

const WDLS = localStorage.getItem("workDuration");
const SBLS = localStorage.getItem("shortBreakDuration");
const LBLS = localStorage.getItem("longBreakDuration");

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [workDuration, setWorkDuration] = useState(WDLS ? WDLS * 60 : 25 * 60);
  const [shortBreakDuration, setShortBreakDuration] = useState(
    SBLS ? SBLS * 60 : 5 * 60
  );
  const [longBreakDuration, setLongBreakDuration] = useState(
    LBLS ? LBLS * 60 : 15 * 60
  );
  const [timeRemaining, setTimeRemaining] = useState(workDuration);
  const [mode, setMode] = useState("WORK");

  // Fetch user settings from API on mount
  useEffect(() => {
    const loadUserSettings = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      try {
        const data = await apiGet("/users/get_user_settings");
        
        if (data) {
          // API returns: pomodoro_duration, short_break_duration, long_break_duration (in minutes)
          const pomoDuration = data.pomodoro_duration ?? data.workDuration;
          const shortDuration = data.short_break_duration ?? data.shortBreakDuration;
          const longDuration = data.long_break_duration ?? data.longBreakDuration;

          if (pomoDuration !== undefined) {
            const seconds = pomoDuration * 60;
            setWorkDuration(seconds);
            localStorage.setItem("workDuration", pomoDuration);
          }
          if (shortDuration !== undefined) {
            const seconds = shortDuration * 60;
            setShortBreakDuration(seconds);
            localStorage.setItem("shortBreakDuration", shortDuration);
          }
          if (longDuration !== undefined) {
            const seconds = longDuration * 60;
            setLongBreakDuration(seconds);
            localStorage.setItem("longBreakDuration", longDuration);
          }
        }
      } catch (error) {
        console.error("Failed to load user settings:", error);
      }
    };

    loadUserSettings();
  }, []);

  const updateDatabase = async (newDurations) => {
    const token = getToken();
    if (!token) {
      console.warn("No auth token, skipping database update");
      return;
    }

    try {
      // Convert seconds back to minutes for API
      const body = {
        bodyUserId: localStorage.getItem("user"),
        pomodoro_duration: Math.round(newDurations.workDuration / 60),
        short_break_duration: Math.round(newDurations.shortBreakDuration / 60),
        long_break_duration: Math.round(newDurations.longBreakDuration / 60),
      };
      
      await apiPost("/users/update_user_settings", body);
      console.log("Database updated successfully with:", body);
    } catch (error) {
      console.error("Failed to update database:", error);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        workDuration,
        setWorkDuration: (value) => {
          setWorkDuration(value);
          localStorage.setItem("workDuration", value / 60);
          updateDatabase({
            workDuration: value,
            shortBreakDuration,
            longBreakDuration,
          });
        },
        shortBreakDuration,
        setShortBreakDuration: (value) => {
          setShortBreakDuration(value);
          localStorage.setItem("shortBreakDuration", value / 60);
          updateDatabase({
            workDuration,
            shortBreakDuration: value,
            longBreakDuration,
          });
        },
        longBreakDuration,
        setLongBreakDuration: (value) => {
          setLongBreakDuration(value);
          localStorage.setItem("longBreakDuration", value / 60);
          updateDatabase({
            workDuration,
            shortBreakDuration,
            longBreakDuration: value,
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
