import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

const EditSounds = () => {
  const { sound, setSound } = useContext(ThemeContext);

  const handleSoundChange = (e) => {
    setSound(e.target.value);
  };

  return (
    <div className="profile-settings-input">
      <label className="settings-field-label" htmlFor="theme-sound-url">
        Sound
      </label>
      <input
        id="theme-sound-url"
        type="text"
        className="settings-text-input"
        value={sound}
        onChange={handleSoundChange}
        placeholder="Enter sound URL"
      />
    </div>
  );
};

export default EditSounds;
