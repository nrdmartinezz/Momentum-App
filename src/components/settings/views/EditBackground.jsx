import { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

const EditBackground = () => {
  const { backgroundImage, setBackgroundImage } = useContext(ThemeContext);

  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const handleBackgroundChange = (e) => {
    setBackgroundImage(e.target.value);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous messages
    setUploadError(null);
    setUploadSuccess(null);

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
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
      setUploadError("Please select an image first");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      // Upload via ThemeContext which will send to backend
      await setBackgroundImage(previewImage);
      setPreviewImage(null);
      setUploadSuccess("Background image updated successfully!");
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
    setUploadError(null);
    setUploadSuccess(null);
  };

  return (
    <>
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

      {uploadError && (
        <div className="auth-error" style={{ marginTop: 16 }}>
          <span>Error: {uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="auth-success" style={{ marginTop: 16 }}>
          <span>{uploadSuccess}</span>
        </div>
      )}
    </>
  );
};

export default EditBackground;
