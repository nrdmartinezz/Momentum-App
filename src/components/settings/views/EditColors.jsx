import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

const EditColors = () => {
  const {
    accentColor,
    setAccentColor,
    primaryColor,
    setPrimaryColor,
    updateTheme,
  } = useContext(ThemeContext);

  const handleAccentColorChange = (e) => {
    setAccentColor(e.target.value);
  };

  const handlePrimaryColorChange = (e) => {
    setPrimaryColor(e.target.value);
  };

  // Preset colors with their optimal contrast color (white or black text)
  const presetColors = [
    // Colors that work well with white text
    { color: "#7E52B3", label: "Purple", textColor: "#ffffff" },
    { color: "#2C3E50", label: "Dark Blue", textColor: "#ffffff" },
    { color: "#E74C3C", label: "Red", textColor: "#ffffff" },
    { color: "#16A085", label: "Teal", textColor: "#ffffff" },
    { color: "#D35400", label: "Orange", textColor: "#ffffff" },
    { color: "#8E44AD", label: "Violet", textColor: "#ffffff" },
    // Colors that work well with black text
    { color: "#F39C12", label: "Yellow", textColor: "#000000" },
    { color: "#3498DB", label: "Light Blue", textColor: "#000000" },
    { color: "#1ABC9C", label: "Turquoise", textColor: "#000000" },
    { color: "#E67E22", label: "Carrot", textColor: "#000000" },
    { color: "#ECF0F1", label: "Light Gray", textColor: "#000000" },
    { color: "#95A5A6", label: "Gray", textColor: "#000000" },
  ];

  const handlePresetColorSelect = async (preset) => {
    // Update both colors in a single theme update to avoid race conditions
    await updateTheme({
      accent_color: preset.color,
      primary_color: preset.textColor,
    });
  };

  return (
    <div className="profile-settings-input">
      <span className="settings-field-label">Color theme</span>

      <div className="theme-preset-grid">
        {presetColors.map((preset) => (
          <button
            key={preset.color}
            type="button"
            className={
              accentColor === preset.color
                ? "theme-preset-btn is-selected"
                : "theme-preset-btn"
            }
            onClick={() => handlePresetColorSelect(preset)}
            style={{
              backgroundColor: preset.color,
              color: preset.textColor,
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="theme-color-row">
        <label className="theme-color-field">
          <span>Accent color</span>
          <input
            type="color"
            value={accentColor}
            onChange={handleAccentColorChange}
            aria-label="Accent color"
          />
        </label>
        <label className="theme-color-field">
          <span>Text color</span>
          <input
            type="color"
            value={primaryColor}
            onChange={handlePrimaryColorChange}
            aria-label="Text color"
          />
        </label>
      </div>
    </div>
  );
};

export default EditColors;
