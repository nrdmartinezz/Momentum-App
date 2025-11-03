import { useContext, useState } from "react";
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

  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleBackgroundChange = (e) => {
    setBackgroundImage(e.target.value);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!previewImage) {
      alert("Please select an image first");
      return;
    }

    setUploading(true);
    try {
      console.log("Starting upload...");
      // Upload via ThemeContext which will send to backend
      await setBackgroundImage(previewImage);
      alert("Background image updated successfully!");
      setPreviewImage(null);
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
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
      <h2>Theme Settings</h2>

      <div className="profile-settings-input flex">
        <label>Background Image:</label>
        <div style={{ marginTop: 8, flexDirection: "column" }}>
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              style={{ marginBottom: 8 }}
            />
            {previewImage && (
              <div style={{ marginTop: 12, columnGap: 12, flexDirection: "column" }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    maxWidth: 300,
                    maxHeight: 200,
                    borderRadius: 8,
                    display: "block",
                    marginBottom: 8,
                  }}
                />
                <div style={{flexDirection:"row", columnGap:12}}>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="active-btn"
                    style={{ marginRight: 8 }}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                  <button
                    onClick={handleCancelPreview}
                    disabled={uploading}
                    className="clear-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>

          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Or enter URL directly:
          </div>
          <input
            type="text"
            value={backgroundImage}
            onChange={handleBackgroundChange}
            placeholder="Enter image URL"
            style={{ marginTop: 4, width: "100%", maxWidth: 300 }}
          />
        </div>
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
