import EditBackground from "./views/EditBackground";
import EditColors from "./views/EditColors";
import EditSounds from "./views/EditSounds";
import ThemeGallery from "./views/ThemeGallery";

const ThemeSettings = () => {

  return (
    <div className="profile-settings-container adrianna-regular">
      <h2>Theme Settings</h2>

      <EditBackground />
      <EditColors />
      <EditSounds />
      <ThemeGallery />
    </div>
  );
};

export default ThemeSettings;
