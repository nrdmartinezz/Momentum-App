import DayTimeWidget from "../components/DayTimeWidget";
import FocusTimer from "../components/FocusTimer";
import Tasks from "../assets/data/tasks.json";
import TaskList from "../components/TaskList";


function App() {
  return (
    <div className="app-container">
      <DayTimeWidget></DayTimeWidget>
      <TaskList tasks={Tasks.tasks}></TaskList>
      <FocusTimer
        workDuration={35}
        shortbreakDuration={5}
        longBreakDuration={15}
      />
    </div>
  );
}

export default App;
