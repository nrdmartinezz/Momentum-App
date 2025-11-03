import { useState, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/components/_image_crop_dialog.css";

const ImageCropDialog = ({ isOpen, imageData, onCropComplete, onCancel }) => {
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleCropMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropArea.x,
      y: e.clientY - cropArea.y,
    });
  };

  const handleCropMouseMove = (e) => {
    if (!isDragging || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    let newX = e.clientX - dragStart.x;
    let newY = e.clientY - dragStart.y;

    // Constrain to canvas bounds
    newX = Math.max(0, Math.min(newX, rect.width - cropArea.width));
    newY = Math.max(0, Math.min(newY, rect.height - cropArea.height));

    setCropArea({ ...cropArea, x: newX, y: newY });
  };

  const handleCropMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropImage = async () => {
    if (!canvasRef.current || !imageRef.current) return;

    setUploading(true);
    setError("");

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set output size (e.g., 300x300 for profile picture)
      const outputSize = 300;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // Calculate the crop area relative to the actual image
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const scaleX = imageRef.current.naturalWidth / canvasRect.width;
      const scaleY = imageRef.current.naturalHeight / canvasRect.height;

      const sourceX = cropArea.x * scaleX;
      const sourceY = cropArea.y * scaleY;
      const sourceWidth = cropArea.width * scaleX;
      const sourceHeight = cropArea.height * scaleY;

      // Draw cropped image
      ctx.drawImage(
        imageRef.current,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        outputSize,
        outputSize
      );

      // Convert to base64
      const croppedImageData = canvas.toDataURL("image/jpeg", 0.9);

      // Call the onCropComplete callback with the cropped image
      onCropComplete(croppedImageData);
    } catch (err) {
      console.error("Crop error:", err);
      setError("Failed to crop image");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setError("");
    setCropArea({ x: 0, y: 0, width: 200, height: 200 });
    onCancel();
  };

  const handleImageLoad = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const img = e.target;
      const maxWidth = 500;
      const maxHeight = 500;
      const scale = Math.min(
        maxWidth / img.naturalWidth,
        maxHeight / img.naturalHeight,
        1
      );

      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;

      // Center the crop area
      const cropSize = Math.min(canvas.width, canvas.height) * 0.6;
      setCropArea({
        x: (canvas.width - cropSize) / 2,
        y: (canvas.height - cropSize) / 2,
        width: cropSize,
        height: cropSize,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="crop-dialog-overlay" onClick={handleCancel}></div>
      <div className="crop-dialog">
        <div className="crop-dialog-content">
          <h3>Crop Your Photo</h3>

          <div
            className="crop-container"
            onMouseMove={handleCropMouseMove}
            onMouseUp={handleCropMouseUp}
            onMouseLeave={handleCropMouseUp}
          >
            <canvas
              ref={canvasRef}
              className="crop-canvas"
              style={{
                backgroundImage: `url(${imageData})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <img
              ref={imageRef}
              src={imageData}
              alt="Selected"
              style={{ display: "none" }}
              onLoad={handleImageLoad}
            />

            {/* Crop area overlay */}
            <div
              className="crop-area"
              style={{
                left: `${cropArea.x}px`,
                top: `${cropArea.y}px`,
                width: `${cropArea.width}px`,
                height: `${cropArea.height}px`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleCropMouseDown}
            >
              <div className="crop-corner top-left"></div>
              <div className="crop-corner top-right"></div>
              <div className="crop-corner bottom-left"></div>
              <div className="crop-corner bottom-right"></div>
            </div>
          </div>

          <p className="crop-instructions">
            Drag the square to adjust your photo
          </p>

          {error && (
            <div className="crop-error">
              <span>{error}</span>
            </div>
          )}

          <div className="crop-dialog-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="save-btn"
              onClick={handleCropImage}
              disabled={uploading}
            >
              {uploading ? "Processing..." : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ImageCropDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  imageData: PropTypes.string,
  onCropComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ImageCropDialog;
