import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProfileContext = createContext();
const rootStyle = document.documentElement.style;
const LOCAL_STORAGE_KEY = "profileSettings";

const ProfileProvider = ({ children }) => {
  const getInitialAccentColor = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const { accentColor } = JSON.parse(saved);
      if (accentColor) return accentColor;
    }
    return rootStyle.getPropertyValue("--global-color-accent") || "#7E52B3";
  };

  const getInitialBackgroundImage = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const { backgroundImage } = JSON.parse(saved);
      if (backgroundImage) return backgroundImage;
    }
    return rootStyle.getPropertyValue("--background-image") ||
      "https://res.cloudinary.com/ddsekdku7/image/upload/v1742144459/default-theme-login.jpg";
  };

  const [accentColor, setAccentColor] = useState(getInitialAccentColor());
  const [backgroundImage, setBackgroundImage] = useState(getInitialBackgroundImage());

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const { accentColor, backgroundImage } = JSON.parse(saved);
      if (accentColor) setAccentColor(accentColor);
      if (backgroundImage) setBackgroundImage(backgroundImage);
    }
  }, []);

  useEffect(() => {
    rootStyle.setProperty("--global-color-accent", accentColor);
    rootStyle.setProperty("--background-image", `url(${backgroundImage})`);
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ accentColor, backgroundImage })
    );
  }, [accentColor, backgroundImage]);

  return (
    <ProfileContext.Provider
      value={{
        accentColor,
        setAccentColor,
        backgroundImage,
        setBackgroundImage,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export { ProfileContext, ProfileProvider };
