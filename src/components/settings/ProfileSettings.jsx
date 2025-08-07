import { useContext } from 'react';
import { ProfileContext } from '../../context/ProfileContext';

const ProfileSettings = () => {
    const {
        backgroundImage,
        setBackgroundImage,
        accentColor,
        setAccentColor
    } = useContext(ProfileContext);

    const handleBackgroundChange = (e) => {
        setBackgroundImage(e.target.value);
    };

    const handleAccentColorChange = (e) => {
        setAccentColor(e.target.value);
    };

    return (
        <div className='profile-settings-container adrianna-regular'>
            <h2>Profile Settings</h2>
            <div className='profile-settings-input'>
                <label>
                    Background Image URL:
                    <input
                        type="text"
                        value={backgroundImage}
                        onChange={handleBackgroundChange}
                        placeholder="Enter image URL"
                        style={{ marginLeft: 8, width: 250 }}
                    />
                </label>
            </div>
            <div className='profile-settings-input'>
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
        </div>
    );
};

export default ProfileSettings;