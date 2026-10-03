"use client";

import { useContext, useState } from "react";
import DayTimeWidget from "./DayTimeWidget";
import FocusTimer from "./FocusTimer";
import TaskList from "./TaskList";
import AppSettingsWidget from "./AppSettingsWidget";
import { ThemeContext } from "../context/ThemeContext";
import ProfileWidget from "./ProfileWidget";
import BackgroundLoader from "./loadingskeletons/BackgroundLoader";

export default function HomeScreen() {
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const { isLoading: themeLoading } = useContext(ThemeContext);

  const onTaskListToggle = () => {
    setIsTaskListOpen(!isTaskListOpen);
  };

  return (
    <>
      <BackgroundLoader isLoading={themeLoading} />
      <div className="app-container">
        <DayTimeWidget />
        <TaskList onTaskListToggle={onTaskListToggle} />
        <FocusTimer />
        <AppSettingsWidget isTaskListOpen={isTaskListOpen} />
        <ProfileWidget isTaskListOpen={isTaskListOpen} isProfileOpen={false} />
      </div>
    </>
  );
}
