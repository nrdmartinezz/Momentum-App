import DayTimeWidget from "../components/DayTimeWidget";
import FocusTimer from "../components/FocusTimer";
import TaskList from "../components/TaskList";
import { useEffect, useState, useContext } from "react";
import AppSettingsWidget from "../components/AppSettingsWidget";
import { TimerProvider } from "../context/TimerContext";
import { TaskProvider } from "../context/TaskContext";
import { ProfileProvider } from "../context/ProfileContext";
import { ThemeProvider, ThemeContext } from "../context/ThemeContext";
import ProfileWidget from "../components/ProfileWidget";
import BackgroundLoader from "../components/loadingskeletons/BackgroundLoader";

function AppContent() {
  const [user, setUser] = useState(null);
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);
  const { isLoading: themeLoading } = useContext(ThemeContext);

  useEffect(() => {
    setUser(localStorage.getItem("user"));
  }, [user]);

  const onTaskListToggle = () => {
    setIsTaskListOpen(!isTaskListOpen);
  };

  return (
    <>
      <BackgroundLoader isLoading={themeLoading} />
      <div className="app-container">
        <DayTimeWidget></DayTimeWidget>
        <TaskList onTaskListToggle={onTaskListToggle}></TaskList>
        <FocusTimer />
        <AppSettingsWidget
          isTaskListOpen={isTaskListOpen}
        ></AppSettingsWidget>
        <ProfileWidget
          isTaskListOpen={isTaskListOpen}
          isProfileOpen={false}
        />
      </div>
    </>
  );
}

function App() {
  return (
    <ProfileProvider>
      <ThemeProvider>
        <TimerProvider>
          <TaskProvider>
            <AppContent />
          </TaskProvider>
        </TimerProvider>
      </ThemeProvider>
    </ProfileProvider>
  );
}

export default App;
