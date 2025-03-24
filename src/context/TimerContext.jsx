import { createContext, useState } from "react";
import PropTypes from "prop-types";

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

  const updateDatabase = (newDurations) => {
    // Add your database update logic here
    console.log("Updating database with new durations:", newDurations);
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
