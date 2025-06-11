import DayTimeWidget from "../components/DayTimeWidget";
import FocusTimer from "../components/FocusTimer";
import TaskList from "../components/TaskList";
import { useEffect, useState } from "react";
import AppSettingsWidget from "../components/AppSettingsWidget";
import { TimerProvider } from "../context/TimerContext";
import { TaskProvider } from "../context/TaskContext";

function App() {
  const [user, setUser] = useState(null);
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);

  useEffect(() => {
    setUser(localStorage.getItem("user"));
  }, [user]);

  const onTaskListToggle = () => {
    setIsTaskListOpen(!isTaskListOpen);
  };

  return (
    <TimerProvider>
      <TaskProvider>
        <div className="app-container">
          <DayTimeWidget></DayTimeWidget>
          <TaskList onTaskListToggle={onTaskListToggle}></TaskList>
          <FocusTimer />
          <AppSettingsWidget isTaskListOpen={isTaskListOpen}>
            {" "}
          </AppSettingsWidget>
        </div>
      </TaskProvider>
    </TimerProvider>
  );
}

export default App;
