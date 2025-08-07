import { useContext } from "react";
import { TimerContext } from "../../context/TimerContext";

const TimerSettings = () => {
  const {
    workDuration,
    setWorkDuration,
    shortBreakDuration,
    setShortBreakDuration,
    longBreakDuration,
    setLongBreakDuration,
    setTimeRemaining,
    mode,
  } = useContext(TimerContext);

  return (
    <div className="timer-settings-container adrianna-regular">
      <h2 className="app-settings-view-title">Timer Settings</h2>
      <div className="timer-settings-input">
        <label>
          Work Duration (minutes):
          <input
            type="number"
            value={workDuration / 60}
            step={1}
            min={1}
            onChange={(e) => {
              setWorkDuration(parseInt(e.target.value * 60, 10));
              if (mode === "work")
                setTimeRemaining(parseInt(e.target.value * 60, 10));
            }}
          />
        </label>
      </div>
      <div className="timer-settings-input">
        <label>
          Short Break Duration (minutes):
          <input
            type="number"
            value={shortBreakDuration / 60}
            step={1}
            onChange={(e) =>{
              setShortBreakDuration(parseInt(e.target.value * 60, 10));
              if (mode === "short")
                setTimeRemaining(parseInt(e.target.value * 60, 10));
              }
            }
          />
        </label>
      </div>
      <div className="timer-settings-input">
        <label>
          Long Break Duration (minutes):
          <input
            type="number"
            value={longBreakDuration / 60}
            step={1}
            onChange={(e) =>{
              setLongBreakDuration(parseInt(e.target.value * 60, 10));
              if (mode === "long")
                setTimeRemaining(parseInt(e.target.value * 60, 10));
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default TimerSettings;
