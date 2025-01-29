import PropTypes from "prop-types";
import TaskListController from "../controllers/TaskListController";

let TaskCard = ({ task, isSelected, onSelect }) => {
    
  const controller = new TaskListController(task);

  let selectedClass = isSelected ? "task-selected" : "";

  return (
    <div
      onClick={onSelect}
      className={"task-card " + selectedClass + " adrianna-regular"}
    >
      <h4>{task.title}</h4>
      {task.description && <p>{task.description}</p>}
      {task.dueDate && <p>Due Date: {controller.formatDate(task.dueDate)}</p>}
      {task.subTasks && task.subTasks.length > 0 && (
        <ul>
          {task.subTasks.map((subTask, subIndex) => (
            <li key={subIndex + "_sub_" + task.title}>{subTask}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
TaskCard.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dueDate: PropTypes.string,
    subTasks: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default TaskCard;
