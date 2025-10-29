import { useContext } from "react";
import { ProfileContext } from "../../context/ProfileContext";

const ProfileSettings = () => {
  const {
    login,
  } = useContext(ProfileContext);


  return (
    <div className="profile-settings-container adrianna-regular">
      <h2>Profile Settings</h2>
      
      <div className="profile-settings-input">
        <div
          className="active-btn"
          onClick={(e) => {
            e.preventDefault();
            console.log("Fetching user settings...");
            login({
              email: "askewpoet53@gmail.com",
              password: "testing123",
            });
          }}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
