import "../../styles/components/_timer_skeleton.css";

const TimerSkeleton = () => {
  return (
    <div className="timer-container timer-skeleton">
      <div className="timer-interval-container">
        <h2 className="timer-text timer-skeleton-time">
          <span className="timer-skeleton-digit" style={{ animationDelay: '0s' }}>0</span>
          <span className="timer-skeleton-digit" style={{ animationDelay: '0.1s' }}>0</span>
          <span className="timer-skeleton-colon" style={{ animationDelay: '0.2s' }}>:</span>
          <span className="timer-skeleton-digit" style={{ animationDelay: '0.3s' }}>0</span>
          <span className="timer-skeleton-digit" style={{ animationDelay: '0.4s' }}>0</span>
        </h2>
        <div className="interval-counter-container">
          <div className="timer-skeleton-dot"></div>
          <div className="timer-skeleton-dot"></div>
          <div className="timer-skeleton-dot"></div>
          <div className="timer-skeleton-dot"></div>
        </div>
      </div>
      <div className="timer-controls timer-skeleton-controls">
        <div className="timer-skeleton-mode-btn"></div>
        <div className="timer-skeleton-mode-btn"></div>
        <div className="timer-skeleton-mode-btn"></div>
        <div className="timer-skeleton-button"></div>
        <div className="timer-skeleton-button"></div>
      </div>
    </div>
  );
};

export default TimerSkeleton;
