import { useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ProfileContext } from "../../../context/ProfileContext";
import { ThemeContext } from "../../../context/ThemeContext";
import { apiGet } from "../../../utils/apiClient";

const ThemeGallery = () => {
  const { isAuthenticated, user } = useContext(ProfileContext);
  const {
    appliedThemeId,
    saveTheme,
    applySavedTheme,
    updateSavedTheme,
    deleteSavedTheme,
  } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("private");
  const [includeImage, setIncludeImage] = useState(false);
  const [mine, setMine] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const loadThemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [mineResult, libraryResult] = await Promise.all([
        apiGet("/themes/mine"),
        apiGet("/themes/library"),
      ]);
      setMine(mineResult?.themes || []);
      setLibrary(libraryResult?.themes || []);
    } catch (err) {
      setError(err?.message || "Failed to load themes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadThemes();
  }, [isAuthenticated, loadThemes]);

  const handleSave = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      await saveTheme({
        name,
        visibility,
        include_image: includeImage,
      });
      setName("");
      setIncludeImage(false);
      setMessage("Theme saved.");
      await loadThemes();
    } catch (err) {
      setError(err?.message || "Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  const runCardAction = async (id, action) => {
    setBusyId(id);
    setError(null);
    setMessage(null);
    try {
      await action();
      await loadThemes();
    } catch (err) {
      setError(err?.message || "Theme action failed");
    } finally {
      setBusyId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-settings-input">
        <span className="settings-field-label">Saved themes</span>
        <p className="theme-gallery-note">
          Sign in to save a theme and use backgrounds from your account.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-settings-input theme-gallery">
      <span className="settings-field-label">Save this look</span>
      <form className="theme-save-form" onSubmit={handleSave}>
        <input
          type="text"
          className="settings-text-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Theme name"
          maxLength={40}
          required
        />
        <label className="theme-save-option">
          <span>Who can use it</span>
          <select
            value={visibility}
            onChange={(event) => setVisibility(event.target.value)}
          >
            <option value="private">Only me</option>
            <option value="public">Anyone signed in</option>
          </select>
        </label>
        <label className="theme-save-check">
          <input
            type="checkbox"
            checked={includeImage}
            onChange={(event) => setIncludeImage(event.target.checked)}
          />
          Include my current background
        </label>
        <button type="submit" className="active-btn" disabled={saving}>
          {saving ? "Saving..." : "Save theme"}
        </button>
      </form>

      {error && (
        <div className="auth-error">
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="auth-success">
          <span>{message}</span>
        </div>
      )}

      <ThemeList
        title="Your themes"
        themes={mine}
        empty="You have not saved a theme yet."
        loading={loading}
        busyId={busyId}
        appliedThemeId={appliedThemeId}
        userId={user?.userId}
        onApply={(theme, useImage) =>
          runCardAction(theme.id, () => applySavedTheme(theme.id, useImage))
        }
        onToggle={(theme) =>
          runCardAction(theme.id, () =>
            updateSavedTheme(theme.id, {
              visibility: theme.visibility === "public" ? "private" : "public",
            })
          )
        }
        onDelete={(theme) => runCardAction(theme.id, () => deleteSavedTheme(theme.id))}
      />

      <ThemeList
        title="Public themes"
        themes={library}
        empty="No public themes yet."
        loading={loading}
        busyId={busyId}
        appliedThemeId={appliedThemeId}
        userId={user?.userId}
        onApply={(theme, useImage) =>
          runCardAction(theme.id, () => applySavedTheme(theme.id, useImage))
        }
      />
    </div>
  );
};

const ThemeList = ({
  title,
  themes,
  empty,
  loading,
  busyId,
  appliedThemeId,
  userId,
  onApply,
  onToggle,
  onDelete,
}) => {
  return (
    <section className="theme-list">
      <span className="settings-field-label">{title}</span>
      {loading && themes.length === 0 ? (
        <p className="theme-gallery-note">Loading themes...</p>
      ) : null}
      {!loading && themes.length === 0 ? (
        <p className="theme-gallery-note">{empty}</p>
      ) : null}
      <div className="theme-card-grid">
        {themes.map((theme) => {
          const isMine = theme.owner_id === userId;
          const busy = busyId === theme.id;
          return (
            <article
              key={theme.id}
              className={
                appliedThemeId === theme.id ? "theme-card is-applied" : "theme-card"
              }
            >
              <div
                className="theme-card-preview"
                style={{ backgroundColor: theme.accent_color, color: theme.primary_color }}
              >
                {theme.background_image ? (
                  <img src={theme.background_image} alt="" />
                ) : null}
                <span>{theme.name}</span>
              </div>
              <p className="theme-card-owner">{theme.owner_name}</p>
              <div className="theme-card-actions">
                <button
                  type="button"
                  className="active-btn"
                  disabled={busy}
                  onClick={() => onApply(theme, false)}
                >
                  Apply
                </button>
                {theme.background_image ? (
                  <button
                    type="button"
                    className="clear-btn"
                    disabled={busy}
                    onClick={() => onApply(theme, true)}
                  >
                    Use image
                  </button>
                ) : null}
                {isMine && onToggle ? (
                  <button
                    type="button"
                    className="clear-btn"
                    disabled={busy}
                    onClick={() => onToggle(theme)}
                  >
                    {theme.visibility === "public" ? "Make private" : "Publish"}
                  </button>
                ) : null}
                {isMine && onDelete ? (
                  <button
                    type="button"
                    className="clear-btn"
                    disabled={busy}
                    onClick={() => onDelete(theme)}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

ThemeList.propTypes = {
  title: PropTypes.string.isRequired,
  themes: PropTypes.arrayOf(PropTypes.object).isRequired,
  empty: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  busyId: PropTypes.string,
  appliedThemeId: PropTypes.string,
  userId: PropTypes.string,
  onApply: PropTypes.func.isRequired,
  onToggle: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ThemeGallery;
