import { useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ProfileContext } from "../../context/ProfileContext";
import ImageCropDialog from "../ImageCropDialog";
import "../../styles/components/_edit_profile_popup.css";

const EditProfile = ({ isOpen, onClose }) => {
  const { user, updateProfile, authLoading, authError } =
    useContext(ProfileContext);
  const [name, setName] = useState(user ? user.name : "");
  const [profilePicture, setProfilePicture] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Image upload and crop states
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const fileInputRef = useRef(null);

  // Load current user data when popup opens
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || "");
      setProfilePicture(user.profilePicture || "");
      setPreviewImage(user.profilePicture || "");
    }
  }, [isOpen, user]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
    if (!validTypes.includes(file.type)) {
      setLocalError("Please select a valid image file (JPG, PNG, or HEIC)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLocalError("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setShowCropDialog(true);
      setLocalError("");
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImageData) => {
    setProfilePicture(croppedImageData);
    setPreviewImage(croppedImageData);
    setShowCropDialog(false);
    setSelectedImage(null);
  };

  const handleCancelCrop = () => {
    setShowCropDialog(false);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    // Validate name
    if (!name.trim()) {
      setLocalError("Name cannot be empty");
      return;
    }

    try {
      await updateProfile({ name: name.trim(), profilePicture });
      setSuccessMessage("Profile updated successfully!");

      // Close popup after short delay
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 1500);
    } catch (error) {
      setLocalError(error.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setLocalError("");
    setSuccessMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="popup-overlay" onClick={handleCancel}></div>
      <div className="edit-profile-popup">
        <div className="popup-content">
          <h2>Edit Profile</h2>

          <form onSubmit={handleSubmit}>
            {/* Profile Picture Preview */}
            <div className="profile-picture-preview">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  onError={() => setPreviewImage("")}
                />
              ) : (
                <div className="placeholder-avatar">
                  {name.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            {/* Upload Photo Button */}
            <div className="form-group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/jpg,image/png,image/heic"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-photo-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={authLoading}
              >
                Upload Photo
              </button>
            </div>

            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                disabled={authLoading}
              />
            </div>

            {/* Profile Picture URL */}
          
            {/* Error Messages */}
            {(authError || localError) && (
              <div className="auth-error">
                <span>{authError || localError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="success-message">
                <span>{successMessage}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="popup-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
                disabled={authLoading}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={authLoading}>
                {authLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Crop Dialog */}
      <ImageCropDialog
        isOpen={showCropDialog}
        imageData={selectedImage}
        onCropComplete={handleCropComplete}
        onCancel={handleCancelCrop}
      />
    </>
  );
};

EditProfile.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditProfile;
