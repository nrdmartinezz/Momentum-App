import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

const EditSounds = () => {
  const { sound, setSound } = useContext(ThemeContext);

  const handleSoundChange = (e) => {
    setSound(e.target.value);
  };

  return (
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
  );
};

export default EditSounds;
