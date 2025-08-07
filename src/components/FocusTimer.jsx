import { useState, useEffect, useMemo, useContext } from "react";
import FocusTimerController from "../controllers/FocusTimerController";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { TimerContext } from "../context/TimerContext";

const FocusTimer = () => {
  const {
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    timeRemaining,
    mode,
    setTimeRemaining,
    setMode
  } = useContext(TimerContext);

  const [isRunning, setIsRunning] = useState(false);

  const timerController = useMemo(
    () =>
      new FocusTimerController(
        workDuration,
        shortBreakDuration,
        longBreakDuration
      ),
    [workDuration, shortBreakDuration, longBreakDuration]
  );

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
  }, [isRunning, timerController]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    timerController.startMode((time, mode) => {
      setTimeRemaining(time);
      setMode(mode);
    }, newMode);
    timerController.pauseTimer();
  };

  const handleReset = () => {
    let curDuration = 0;

    switch (mode) {
      case "SHORT":
        curDuration = shortBreakDuration;
        break;
      case "LONG":
        curDuration = longBreakDuration;
        break;
      case "WORK":
        curDuration = workDuration;
        break;
    }

    setTimeRemaining(curDuration);
    setIsRunning(false);
    timerController.resetTimer((time, mode) => {
      setTimeRemaining(time);
      setMode(mode);
    });
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
          onClick={() => {
            setTimeRemaining(workDuration);
            handleModeChange("WORK");
          }}
        >
          Pomodoro
        </button>

        <button
          className={mode === "SHORT" ? "active-btn" : "clear-btn"}
          onClick={() => {
            setTimeRemaining(shortBreakDuration);
            handleModeChange("SHORT");
          }}
        >
          Short Break
        </button>
        <button
          className={mode === "LONG" ? "active-btn" : "clear-btn"}
          onClick={() => {
            setTimeRemaining(longBreakDuration);
            handleModeChange("LONG");
          }}
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
