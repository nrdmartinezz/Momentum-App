import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useState, lazy, Suspense } from "react";

// Lazy load settings components since they're only shown when settings is open
const TimerSettings = lazy(() => import("./settings/timerSettings"));
const ThemeSettings = lazy(() => import("./settings/ThemeSettings"));

const AppSettingsWidget = ({ isTaskListOpen }) => {
  const [appSettingsVisible, setAppSettingsVisible] = useState(false);
  const [appSettingsView, setAppSettingsView] = useState("timer");
 
  const handleToggle = () => {
    setAppSettingsVisible(!appSettingsVisible);
  };

  const handleViewChange = (view) => {
    setAppSettingsView(view);
  };

  // Menu components
  const menuComponents = () => {
    return (
      <>
        <div
          className={
            appSettingsView === "timer"
              ? "active-settings-menu-item"
              : "settings-menu-item"
          }
          onClick={() => {
            handleViewChange("timer");
          }}
        >
          Timer
        </div>
        <div
          className={
            appSettingsView === "theme"
              ? "active-settings-menu-item"
              : "settings-menu-item"
          }
          onClick={() => {
            handleViewChange("theme");
          }}
        >
          Theme
        </div>
      </>
    );
  };

  // Menu views
  const SettingsViews = (curView) => {
    switch (curView) {
      case "timer":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <TimerSettings />
          </Suspense>
        );
      case "theme":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <ThemeSettings />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <TimerSettings />
          </Suspense>
        );
    }
  };

  return (
    <>
      <div className={"app-settings-widget " + (isTaskListOpen ? " push" : "")}>
        <div className="app-settings-button">
          <button onClick={handleToggle} className="round-btn simple-controls">
            <FontAwesomeIcon icon={faGear} />
          </button>
        </div>
      </div>
      <div
        className={
          "app-settings-container " +
          (appSettingsVisible ? "settings-visible" : "")
        }
      >
        <div className="app-settings-close" onClick={handleToggle}>
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <div className="app-settings-options-container">
          <div className="app-settings-menu dm-sans-regular">
            {menuComponents()}
          </div>
          <div className="app-settings-view adrianna-regular">
            {SettingsViews(appSettingsView)}
          </div>
        </div>
      </div>
    </>
  );
};

AppSettingsWidget.propTypes = {
  isTaskListOpen: PropTypes.bool.isRequired,
};

export default AppSettingsWidget;
