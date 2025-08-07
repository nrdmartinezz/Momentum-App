import { faGear, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { useState } from "react";
import TimerSettings from "./settings/timerSettings";
import ProfileSettings from "./settings/ProfileSettings";

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
            appSettingsView === "profile"
              ? "active-settings-menu-item"
              : "settings-menu-item"
          }
          onClick={() => {
            handleViewChange("profile");
          }}
        >
          Profile
        </div>
        <div
          className={
            appSettingsView === "about"
              ? "active-settings-menu-item"
              : "settings-menu-item"
          }
          onClick={() => {
            handleViewChange("about");
          }}
        >
          About
        </div>
      </>
    );
  };

  // Menu views
  const SettingsViews = (curView) => {
    switch (curView) {
      case "timer":
        return <TimerSettings />;
      case "profile":
        return <ProfileSettings />;
      case "about":
        return <div>About</div>;
      default:
        return <TimerSettings />;
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
