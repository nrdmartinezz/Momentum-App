import { useContext } from "react";
import { TimerContext } from "../../context/TimerContext";
import { ClockContext } from "../../context/ClockContext";

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
  const { hour12, dateFormat, setHour12, setDateFormat } = useContext(ClockContext);

  const handleDurationChange = (totalSeconds, setter, modeCheck) => {
    setter(totalSeconds);
    if (mode === modeCheck) {
      setTimeRemaining(totalSeconds);
    }
  };

  return (
    <div className="timer-settings-container adrianna-regular">
      <h2 className="app-settings-view-title">Time and Clock</h2>

      <div className="timer-settings-input">
        <label className="settings-field-label">Clock</label>
        <div className="settings-option-row" role="group" aria-label="Clock">
          <button
            type="button"
            className={hour12 ? "settings-option is-selected" : "settings-option"}
            onClick={() => setHour12(true)}
          >
            12-hour
          </button>
          <button
            type="button"
            className={!hour12 ? "settings-option is-selected" : "settings-option"}
            onClick={() => setHour12(false)}
          >
            24-hour
          </button>
        </div>
      </div>

      <div className="timer-settings-input">
        <label className="settings-field-label">Format</label>
        <div className="settings-option-row" role="group" aria-label="Format">
          <button
            type="button"
            className={dateFormat === "weekday" ? "settings-option is-selected" : "settings-option"}
            onClick={() => setDateFormat("weekday")}
          >
            Weekday
          </button>
          <button
            type="button"
            className={dateFormat === "monthDay" ? "settings-option is-selected" : "settings-option"}
            onClick={() => setDateFormat("monthDay")}
          >
            Month and day
          </button>
          <button
            type="button"
            className={dateFormat === "numeric" ? "settings-option is-selected" : "settings-option"}
            onClick={() => setDateFormat("numeric")}
          >
            Numeric
          </button>
        </div>
      </div>

      <h3 className="settings-subsection-title">Focus timer</h3>

      <div className="timer-settings-input">
        <label>Work Duration:</label>
        <div className="duration-inputs">
          <div className="duration-input-group">
             <span>min</span>
            <input
              className="settings-number-input"
              type="number"
              value={Math.floor(workDuration / 60)}
              min={0}
              max={99}
              onChange={(e) => {
                const minutes = parseInt(e.target.value, 10) || 0;
                const seconds = workDuration % 60;
                handleDurationChange(minutes * 60 + seconds, setWorkDuration, "WORK");
              }}
            />
           
          </div>
          <div className="duration-input-group">
            <span>sec</span>
            <input
              className="settings-number-input"
              type="number"
              value={workDuration % 60}
              min={0}
              max={59}
              onChange={(e) => {
                const minutes = Math.floor(workDuration / 60);
                const seconds = parseInt(e.target.value, 10) || 0;
                handleDurationChange(minutes * 60 + seconds, setWorkDuration, "WORK");
              }}
            />
            
          </div>
        </div>
      </div>

      <div className="timer-settings-input">
        <label>Short Break Duration:</label>
        <div className="duration-inputs">
          <div className="duration-input-group">
            <span>min</span>
            <input
              className="settings-number-input"
              type="number"
              value={Math.floor(shortBreakDuration / 60)}
              min={0}
              max={99}
              onChange={(e) => {
                const minutes = parseInt(e.target.value, 10) || 0;
                const seconds = shortBreakDuration % 60;
                handleDurationChange(minutes * 60 + seconds, setShortBreakDuration, "SHORT");
              }}
            />
            
          </div>
          <div className="duration-input-group">
             <span>sec</span>
            <input
              className="settings-number-input"
              type="number"
              value={shortBreakDuration % 60}
              min={0}
              max={59}
              onChange={(e) => {
                const minutes = Math.floor(shortBreakDuration / 60);
                const seconds = parseInt(e.target.value, 10) || 0;
                handleDurationChange(minutes * 60 + seconds, setShortBreakDuration, "SHORT");
              }}
            />
           
          </div>
        </div>
      </div>

      <div className="timer-settings-input">
        <label>Long Break Duration:</label>
        <div className="duration-inputs">
          <div className="duration-input-group">
            <span>min</span>
            <input
              className="settings-number-input"
              type="number"
              value={Math.floor(longBreakDuration / 60)}
              min={0}
              max={99}
              onChange={(e) => {
                const minutes = parseInt(e.target.value, 10) || 0;
                const seconds = longBreakDuration % 60;
                handleDurationChange(minutes * 60 + seconds, setLongBreakDuration, "LONG");
              }}
            />
            
          </div>
          <div className="duration-input-group">
            <span>sec</span>
            <input
              className="settings-number-input"
              type="number"
              value={longBreakDuration % 60}
              min={0}
              max={59}
              onChange={(e) => {
                const minutes = Math.floor(longBreakDuration / 60);
                const seconds = parseInt(e.target.value, 10) || 0;
                handleDurationChange(minutes * 60 + seconds, setLongBreakDuration, "LONG");
              }}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerSettings;
