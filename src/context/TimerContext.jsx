import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

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
          updateDatabase({ workDuration: value, shortBreakDuration, longBreakDuration });
        },
        shortBreakDuration,
        setShortBreakDuration: (value) => {
          setShortBreakDuration(value);
          updateDatabase({ workDuration, shortBreakDuration: value, longBreakDuration });
        },
        longBreakDuration,
        setLongBreakDuration: (value) => {
          setLongBreakDuration(value);
          updateDatabase({ workDuration, shortBreakDuration, longBreakDuration: value });
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