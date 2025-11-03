import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/components/_background_loader.css";

const BackgroundLoader = ({ isLoading }) => {
  const [shouldRender, setShouldRender] = useState(isLoading);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setFadeOut(false);
    } else if (shouldRender) {
      // Start fade out
      setFadeOut(true);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Match the fadeOut animation duration
      return () => clearTimeout(timer);
    }
  }, [isLoading, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className={`background-loader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="background-loader-content">
        
      </div>
    </div>
  );
};

BackgroundLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default BackgroundLoader;
