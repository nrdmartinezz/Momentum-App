import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const ThemeSettings = () => {
  const {
    backgroundImage,
    setBackgroundImage,
    accentColor,
    setAccentColor,
    primaryColor,
    setPrimaryColor,
    sound,
    setSound,
  } = useContext(ThemeContext);

  const handleBackgroundChange = (e) => {
    setBackgroundImage(e.target.value);
  };

  const handleAccentColorChange = (e) => {
    setAccentColor(e.target.value);
  };

  const handlePrimaryColorChange = (e) => {
    setPrimaryColor(e.target.value);
  };

  const handleSoundChange = (e) => {
    setSound(e.target.value);
  };

  return (
    <div className="profile-settings-container adrianna-regular">
      <h2>Profile Settings</h2>
      <div className="profile-settings-input">
        <label>
          Background Image URL:
          <input
            type="text"
            value={backgroundImage}
            onChange={handleBackgroundChange}
            placeholder="Enter image URL"
            style={{ marginLeft: 8, width: 250 }}
          />
        </label>
      </div>
      <div className="profile-settings-input">
        <label>
          Accent Color:
          <input
            type="color"
            value={accentColor}
            onChange={handleAccentColorChange}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <div className="profile-settings-input">
        <label>
          Primary Color:
          <input
            type="color"
            value={primaryColor}
            onChange={handlePrimaryColorChange}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <div className="profile-settings-input">
        <label>
          Sound:
          <input
            type="text"
            value={sound}
            onChange={handleSoundChange}
            placeholder="Enter sound URL"
            style={{ marginLeft: 8, width: 250 }}
          />
        </label>
      </div>
     
    </div>
  );
};

export default ThemeSettings;
