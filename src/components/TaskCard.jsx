import PropTypes from "prop-types";
import TaskListController from "../controllers/TaskListController";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTrashCan } from "@fortawesome/free-solid-svg-icons";

let TaskCard = ({ task, isSelected, onSelect, removeTask }) => {
  const controller = new TaskListController(task);

  let selectedClass = isSelected ? "task-selected" : "";

  return (
    <div
      // onClick={onSelect}
      className={"task-card " + selectedClass + " adrianna-regular"}
    >
      <div className="task-card-header">
        <h4>{task.name}</h4>
        {/* Display remove button on list cards only */}
        {removeTask ? (
          <button
            className="simple-controls active-btn"
            onClick={() => {
              removeTask(task.id);
              if (isSelected) onSelect();
            }}
          >
            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
          </button>
        ) : null}
      </div>
      <div className="task-card-content" onClick={onSelect}>
        {task.description && <p>{task.description}</p>}
        {task.dueDate && (
          <p>
            <strong>Due Date: {controller.formatDate(task.dueDate)}</strong>
          </p>
        )}
        {task.subTasks && task.subTasks.length > 0 && (
          <ul>
            {task.subTasks.map((subTask, subIndex) => (
              <li key={subIndex + "_sub_" + task.name}>{subTask}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    subTasks: PropTypes.arrayOf(PropTypes.string),
    isCompleted: PropTypes.bool,
  }).isRequired,
  isSelected: PropTypes.bool,
  completeTask: PropTypes.func,
  removeTask: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
};

export default TaskCard;
