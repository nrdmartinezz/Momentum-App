import PropTypes from "prop-types";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";

const TaskList = ({ tasks }) => {
  const [isVisible, setIsVisible] = useState(false);

  const ToggleTaskList = () => {
    console.log("toggle: ", isVisible);
    setIsVisible(!isVisible);
  };

  return (
    <div className={"task-list " + (isVisible ? "" : "hidden-task-list")}>
      <div
        onClick={ToggleTaskList}
        className={"toggle-task-list " + (isVisible ? "rotate-icon" : "")}
      >
        <FontAwesomeIcon icon={faCaretLeft} />
      </div>
      <div className={"task-list-container adrianna-regular"}>
        {tasks.map((task, index) => (
          <div key={index} className="task-card">
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            {task.dueDate && <p>Due Date: {task.dueDate}</p>}
            {task.subTasks && task.subTasks.length > 0 && (
              <ul>
                {task.subTasks.map((subTask, subIndex) => (
                  <li key={subIndex}>{subTask}</li>
                ))}
              </ul>
            )}
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
      dueDate: PropTypes.string,
      subTasks: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default TaskList;
