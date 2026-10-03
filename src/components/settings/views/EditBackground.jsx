import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { getToken } from "../../../utils/apiClient";

const VALID_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

const EditBackground = () => {
  const { backgroundImage, setBackgroundImage, uploadBackground } = useContext(ThemeContext);
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [urlDraft, setUrlDraft] = useState(backgroundImage);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  useEffect(() => {
    setUrlDraft(backgroundImage);
  }, [backgroundImage]);

  const commitUrl = async () => {
    const next = urlDraft.trim();
    if (next === backgroundImage) return;
    if (next.includes("res.cloudinary.com")) {
      setUploadError("That image host is no longer available.");
      return;
    }
    if (!next.startsWith("https://") && !next.startsWith("/assets/")) {
      setUploadError("Paste an https image URL.");
      return;
    }
    setUploadError(null);
    try {
      await setBackgroundImage(next);
    } catch (error) {
      setUploadError(error?.message || "Failed to save image URL.");
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processFile = (file) => {
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      clearFileInput();
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      clearFileInput();
      return;
    }

    setFileName(file.name);
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!uploading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (uploading) return;
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select an image first");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      if (getToken()) {
        await uploadBackground(selectedFile);
      } else {
        await setBackgroundImage(previewImage);
      }
      setPreviewImage(null);
      setSelectedFile(null);
      setFileName(null);
      clearFileInput();
      setUploadSuccess("Background image updated successfully!");

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
    setSelectedFile(null);
    setFileName(null);
    setUploadError(null);
    setUploadSuccess(null);
    clearFileInput();
  };

  const dropzoneClassName = [
    "background-dropzone",
    isDragging ? "is-dragging" : "",
    uploading ? "is-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className="profile-settings-input background-upload">
        <span className="settings-field-label">Background image</span>
        <label
          className={dropzoneClassName}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="background-file-input"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {previewImage ? (
            <img
              src={previewImage}
              alt=""
              className="background-dropzone-preview"
            />
          ) : (
            <FontAwesomeIcon icon={faCloudArrowUp} className="background-dropzone-icon" />
          )}
          <span className="background-dropzone-title">
            {previewImage ? "Replace background image" : "Upload a background image"}
          </span>
          {fileName ? (
            <span className="background-dropzone-filename">{fileName}</span>
          ) : (
            <span className="background-dropzone-hint">
              Drop an image here, or click to choose a file
            </span>
          )}
        </label>

        {previewImage && (
          <div className="background-upload-actions">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="active-btn"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={handleCancelPreview}
              disabled={uploading}
              className="clear-btn"
            >
              Cancel
            </button>
          </div>
        )}

        <label className="settings-field-label is-alternative" htmlFor="background-image-url">
          or paste an image URL
        </label>
        <input
          id="background-image-url"
          type="text"
          className="settings-text-input"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onBlur={commitUrl}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {uploadError && (
        <div className="auth-error">
          <span>Error: {uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="auth-success">
          <span>{uploadSuccess}</span>
        </div>
      )}
    </>
  );
};

export default EditBackground;
