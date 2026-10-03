"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import ProfileWidget from "../../src/components/ProfileWidget";
import EditProfile from "../../src/components/popups/EditProfile";
import TimerSettings from "../../src/components/settings/timerSettings";
import ThemeSettings from "../../src/components/settings/ThemeSettings";
import { ProfileContext } from "../../src/context/ProfileContext";

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useContext(ProfileContext);
  const [editing, setEditing] = useState(false);

  return (
    <div className="app-container">
      <main className="account-page">
        <Link href="/" className="account-back link-btn">
          Back to timer
        </Link>
        <section className="account-panel">
          <h1>Account</h1>
          {isAuthenticated ? (
            <>
              <p className="account-identity">
                {user?.name || "User"}
                {user?.email ? <span>{user.email}</span> : null}
              </p>
              <div className="account-actions">
                <button className="clear-btn" type="button" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
                <button className="clear-btn" type="button" onClick={logout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <p>Sign in with the profile button to save your timer, tasks, and theme.</p>
          )}
        </section>
        <section className="account-panel">
          <TimerSettings />
        </section>
        <section className="account-panel">
          <ThemeSettings />
        </section>
      </main>
      <ProfileWidget isTaskListOpen={false} isProfileOpen={!isAuthenticated} />
      <EditProfile isOpen={editing} onClose={() => setEditing(false)} />
    </div>
  );
}
