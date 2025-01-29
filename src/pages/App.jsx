import DayTimeWidget from "../components/DayTimeWidget";
import FocusTimer from "../components/FocusTimer";
import Tasks from "../assets/data/tasks.json";
import TaskList from "../components/TaskList";
import TaskCard from "../components/TaskCard";
import {useState} from "react"

function App() {

  const [currentTask, setCurrentTask] = useState(null);

  return (
    <div className="app-container">

      <DayTimeWidget></DayTimeWidget>
      {currentTask ? <TaskCard isSelected task={currentTask}></TaskCard>: null}
      <TaskList currentTask={currentTask} setCurrentTask={setCurrentTask} tasks={Tasks.tasks}></TaskList>
      <FocusTimer
        workDuration={35}
        shortbreakDuration={5}
        longBreakDuration={15}
      />
    </div>
  );
}

export default App;
