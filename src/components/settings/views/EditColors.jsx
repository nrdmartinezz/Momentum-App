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
    <div className="profile-settings-input" style={{ flexDirection: "column", alignItems: "flex-start" }}>
      <label style={{ marginBottom: 12 }}>Color Theme:</label>
      
      {/* Preset Color Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", 
        gap: "12px",
        width: "100%",
        maxWidth: "600px",
        marginBottom: "16px"
      }}>
        {presetColors.map((preset) => (
          <button
            key={preset.color}
            onClick={() => handlePresetColorSelect(preset)}
            style={{
              backgroundColor: preset.color,
              color: preset.textColor,
              border: accentColor === preset.color ? "3px solid white" : "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              padding: "12px 8px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
              transition: "all 0.2s",
              boxShadow: accentColor === preset.color ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
              outline: "none",
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Color Pickers */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "8px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Accent Color:</span>
          <input
            type="color"
            value={accentColor}
            onChange={handleAccentColorChange}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Text Color:</span>
          <input
            type="color"
            value={primaryColor}
            onChange={handlePrimaryColorChange}
          />
        </label>
      </div>
    </div>
  );
};

export default EditColors;
