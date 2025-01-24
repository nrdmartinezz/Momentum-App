import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import FocusTimerController from "../controllers/FocusTimerController";

const FocusTimer = ({
  workDuration,
  shortbreakDuration,
  longBreakDuration,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(workDuration * 60);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  
  const [isShortBreak, setIsShortBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);

  const timerController = useMemo(
    () =>
      new FocusTimerController(
        workDuration,
        shortbreakDuration,
        longBreakDuration
      ),
    [workDuration, shortbreakDuration, longBreakDuration]
  );

  useEffect(() => {
    if (isRunning) {
      timerController.startTimer((time, isWork) => {
        setTimeRemaining(time);
        setIsWorkTime(isWork);
      });
    } else {
      timerController.pauseTimer();
    }

    return () => timerController.pauseTimer();
  }, [isRunning, timerController]);
 
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    timerController.resetTimer((time, isWork) => {
      setTimeRemaining(time);
      setIsWorkTime(isWork);
    });
    setTimeRemaining(workDuration * 60);
    setIsWorkTime(true);
    setIsLongBreak(false);
    setIsShortBreak(false);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStartShortBreak = () => {
    
    setIsRunning(true);
    setIsWorkTime(false);
    timerController.startShortBreak((time, isWork) => {
      setTimeRemaining(time);
      setIsWorkTime(isWork);
    });
    setTimeRemaining(shortbreakDuration * 60);
    
  };

  const handleStartLongBreak = () => {
    timerController.startLongBreak((time, isWork) => {
      setTimeRemaining(time);
      setIsWorkTime(isWork);
    });
    setTimeRemaining(longBreakDuration * 60);
    setIsRunning(true);
    setIsWorkTime(false);
  };

  return (
    <div className="timer-container">
      <h2 className="timer-text">{formatTime(timeRemaining)}</h2>
      <div className="timer-controls">
        <button
          className={isWorkTime ? "active-btn" : "clear-btn"}
          onClick={handleStartPause}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          className={isWorkTime ? "active-btn" : "clear-btn"}
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className={isShortBreak ? "active-btn" : "clear-btn"}
          onClick={handleStartShortBreak}
        >
          Short Break
        </button>
        <button
          className={isLongBreak ? "active-btn" : "clear-btn"}
          onClick={handleStartLongBreak}
        >
          Long Break
        </button>
      </div>
    </div>
  );
};

FocusTimer.propTypes = {
  workDuration: PropTypes.number.isRequired,
  shortbreakDuration: PropTypes.number.isRequired,
  longBreakDuration: PropTypes.number.isRequired,
};

export default FocusTimer;
