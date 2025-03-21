import { useContext } from 'react';
import PropTypes from 'prop-types';
import { TimerContext } from '../../context/TimerContext';

const TimerSettings = () => {
  const {
    workDuration,
    setWorkDuration,
    shortBreakDuration,
    setShortBreakDuration,
    longBreakDuration,
    setLongBreakDuration,
  } = useContext(TimerContext);

  return (
    <div className='timer-settings-container adrianna-regular'>
      <h2 className='app-settings-view-title'>Timer Settings</h2>
      <div className='timer-settings-input'>
        <label>
          Work Duration (minutes):
          <input
            type="number"
            value={workDuration}
            step={1}
            min={1}
            onChange={(e) => setWorkDuration(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <div className='timer-settings-input'>
        <label>
          Short Break Duration (minutes):
          <input
            type="number"
            value={shortBreakDuration}
            step={1}
            onChange={(e) => setShortBreakDuration(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
      <div className='timer-settings-input'>
        <label>
          Long Break Duration (minutes):
          <input
            type="number"
            value={longBreakDuration}
            step={1}
            onChange={(e) => setLongBreakDuration(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
    </div>
  );
};

TimerSettings.propTypes = {
  workDuration: PropTypes.number.isRequired,
  setWorkDuration: PropTypes.func.isRequired,
  shortBreakDuration: PropTypes.number.isRequired,
  setShortBreakDuration: PropTypes.func.isRequired,
  longBreakDuration: PropTypes.number.isRequired,
  setLongBreakDuration: PropTypes.func.isRequired,
};

export default TimerSettings;