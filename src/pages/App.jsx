import DayTimeWidget from "../components/DayTimeWidget";
import FocusTimer from "../components/FocusTimer";
import Tasks from "../assets/data/tasks.json";
import TaskList from "../components/TaskList";
import TaskCard from "../components/TaskCard";
import { useEffect, useState } from "react";
import AppSettingsWidget from "../components/AppSettingsWidget";
import {TimerProvider} from "../context/TimerContext";

function App() {
  const [currentTask, setCurrentTask] = useState(null);
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
      <div className="app-container">
        <DayTimeWidget></DayTimeWidget>
        {currentTask ? (
          <TaskCard isSelected task={currentTask}></TaskCard>
        ) : null}
        <TaskList
          currentTask={currentTask}
          setCurrentTask={setCurrentTask}
          tasks={Tasks.tasks}
          onTaskListToggle={onTaskListToggle}
        ></TaskList>
        <FocusTimer
        />
        <AppSettingsWidget isTaskListOpen={isTaskListOpen}> </AppSettingsWidget>
      </div>
    </TimerProvider>
  );
}

export default App;
