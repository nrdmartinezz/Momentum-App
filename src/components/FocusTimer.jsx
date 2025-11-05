import { useState, useEffect, useMemo, useContext } from "react";
import FocusTimerController from "../controllers/FocusTimerController";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { TimerContext } from "../context/TimerContext";
import TimerSkeleton from "./loadingskeletons/TimerSkeleton";

const FocusTimer = () => {
  const {
    isLoading,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    timeRemaining,
    mode,
    setTimeRemaining,
    setMode,
  } = useContext(TimerContext);

  const [isRunning, setIsRunning] = useState(false);

  // Create controller once - durations are updated via setDurations
  const timerController = useMemo(
    () =>
      new FocusTimerController(
        workDuration,
        shortBreakDuration,
        longBreakDuration
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Update controller durations when they change
  useEffect(() => {
    const wasRunning = isRunning;
    timerController.setDurations(
      workDuration,
      shortBreakDuration,
      longBreakDuration
    );
    
    // Only update time remaining if timer is not running
    // This prevents resetting the time when pausing
    if (!wasRunning) {
      setTimeRemaining(timerController.getTimeRemaining());
    }
    // setTimeRemaining is stable from context, doesn't need to be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workDuration, shortBreakDuration, longBreakDuration, timerController]);

  useEffect(() => {
    if (isRunning) {
      timerController.startTimer((time, mode) => {
        setTimeRemaining(time);
        setMode(mode);
      });
    } else {
      timerController.pauseTimer();
    }
    return () => timerController.pauseTimer();
  }, [isRunning, timerController, setTimeRemaining, setMode]);

  if (isLoading) {
    return <TimerSkeleton />;
  }

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleModeChange = (newMode) => {
    setIsRunning(false);
    timerController.changeMode(newMode);
    setMode(newMode);
    setTimeRemaining(timerController.getTimeRemaining());
  };

  const handleReset = () => {
    setIsRunning(false);
    timerController.resetTimer();
    setTimeRemaining(timerController.getTimeRemaining());
    setMode(timerController.getMode());
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleInterval = () => {
    let intervalDots = [];

    for (let index = 0; index < 4; index++) {
      let interval = timerController.getShortCount();
      if (index <= interval) {
        intervalDots.push(
          <div
            key={`${index}_interval_dot`}
            className="interval-counter-dot interval-active"
          ></div>
        );
      } else {
        intervalDots.push(
          <div
            key={`${index}_interval_dot`}
            className="interval-counter-dot"
          ></div>
        );
      }
    }
    return intervalDots;
  };

  document.title = `${formatTime(timeRemaining)} - ${
    mode === "WORK" ? "Work" : "Break"
  }`;

  return (
    <div className="timer-container">
      <div className="timer-interval-container">
        <h2 className="timer-text">{formatTime(timeRemaining)}</h2>
        <div className="interval-counter-container adrianna-regular">
          {handleInterval()}
        </div>
      </div>
      <div className="timer-controls">
        <button
          className={mode === "WORK" ? "active-btn" : "clear-btn"}
          onClick={() => handleModeChange("WORK")}
        >
          Pomodoro
        </button>

        <button
          className={mode === "SHORT" ? "active-btn" : "clear-btn"}
          onClick={() => handleModeChange("SHORT")}
        >
          Short Break
        </button>
        <button
          className={mode === "LONG" ? "active-btn" : "clear-btn"}
          onClick={() => handleModeChange("LONG")}
        >
          Long Break
        </button>

        <button className={"active-btn simple-controls"} onClick={handleReset}>
          <FontAwesomeIcon icon={faRotateRight} />
        </button>

        <button
          className={"active-btn simple-controls"}
          onClick={handleStartPause}
        >
          {isRunning ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </button>
      </div>
    </div>
  );
};

export default FocusTimer;
