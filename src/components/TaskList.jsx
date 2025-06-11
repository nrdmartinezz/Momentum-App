import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import TaskCard from "./TaskCard";
import CreateTask from "./popups/CreateTask";
// import TaskListController from "../controllers/TaskListController";
import { TaskContext } from "../context/TaskContext";

const TaskList = ({ onTaskListToggle }) => {
  const { tasklist, setCurrentTask, currentTask, organizeTasks, removeTask } =
    useContext(TaskContext);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(currentTask);
  const [createTaskPopupVisible, setCreateTaskPopupVisible] = useState(false);

  const groupedTasks = organizeTasks(tasklist);

  console.log("Grouped Tasks:", groupedTasks);

  const ToggleTaskList = () => {
    setIsVisible(!isVisible);
    onTaskListToggle();
  };

  return (
    <>
      <div className={"task-list " + (isVisible ? "" : "hidden-task-list")}>
        <div
          onClick={ToggleTaskList}
          className={"toggle-task-list " + (isVisible ? "rotate-icon" : "")}
        >
          <FontAwesomeIcon icon={faCaretLeft} />
        </div>
        <div className={"task-list-container adrianna-regular"}>
          <div className="task-list-header">
            <h2>Task List</h2>
            <div className="task-list-controls">
              <button
                onClick={() => {
                  setCreateTaskPopupVisible(true);
                  console.log("Create Task button clicked");
                }}
                className="active-btn simple-controls"
              >
                <FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon>
              </button>
            </div>
          </div>
          {groupedTasks.map((task, index) => (
            
            <div className="task-card-group" key={index}>
              {/* <h3>{controller.formatDate(group.date)}</h3> */}
              {
                <TaskCard
                  key={index + "_" + task.title}
                  task={task}
                  isSelected={selectedTask === task}
                  removeTask={removeTask}
                  onSelect={() => {
                    const newSelectedTask = selectedTask === task ? null : task;
                    setCurrentTask(newSelectedTask);
                    setSelectedTask(newSelectedTask);
                  }}
                />
              }
            </div>
          ))}
        </div>
      </div>

      {currentTask ? (
        <div className="focus-task">
          <TaskCard task={currentTask}>isSelected={true}</TaskCard>
          </div>
      ) : null}

      <CreateTask
      setVisible={setCreateTaskPopupVisible}
        isPopupVisible={createTaskPopupVisible}
      ></CreateTask>
    </>
  );
};

TaskList.propTypes = {
  onTaskListToggle: PropTypes.func.isRequired,
};

export default TaskList;
