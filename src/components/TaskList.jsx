import PropTypes from "prop-types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import TaskCard from "./TaskCard";
import TaskListController from "../controllers/TaskListController";

const TaskList = ({ tasks, setCurrentTask, currentTask }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(currentTask);

  const controller = new TaskListController(tasks);

  const ToggleTaskList = () => {
    setIsVisible(!isVisible);
  };

  const groupedTasks = controller.groupTasksByDate();

  return (
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
          <div className="task-list-controls"></div>
        </div>
        {groupedTasks.map((group, index) => (
          <div className="task-card-group" key={index}>
            <h3>{controller.formatDate(group.date)}</h3>
            {group.tasks.map((task, taskIndex) => (
              <TaskCard
                key={taskIndex + "_" + task.title}
                task={task}
                isSelected={selectedTask === task}
                onSelect={() => {
                  const newSelectedTask = selectedTask === task ? null : task;
                  setCurrentTask(newSelectedTask);
                  setSelectedTask(newSelectedTask);
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      dueDate: PropTypes.string.isRequired,
      subTasks: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  setCurrentTask: PropTypes.func.isRequired,
  currentTask: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string.isRequired,
    subTasks: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default TaskList;