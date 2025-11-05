import EditBackground from "./views/EditBackground";
import EditColors from "./views/EditColors";
import EditSounds from "./views/EditSounds";

const ThemeSettings = () => {

  return (
    <div className="profile-settings-container adrianna-regular">
      <h2>Theme Settings</h2>

      <EditBackground />
      <EditColors />
      <EditSounds />
    </div>
  );
};

export default ThemeSettings;
