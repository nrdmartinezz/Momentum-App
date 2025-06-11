import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { TaskContext } from "../../context/TaskContext";

const CreateTask = ({ isPopupVisible, setVisible }) => {
  const { addTask } = useContext(TaskContext);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleAddTask = () => {
    if (taskName.trim() && dueDate.trim()) {
      addTask({
        name: taskName,
        description,
        dueDate,
        id: Math.random().toString(16).slice(2),
      });
      setVisible(false);
      setTaskName("");
      setDescription("");
      setDueDate("");
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div
      className={
        "create-task-popup " + (isPopupVisible ? "popup-shown" : "popup-hidden")
      }
    >
      <div className="popup-content">
        <h2 className="adrianna-regular">Create Task</h2>
        <div className="form-group">
          <label htmlFor="taskName">Task Name</label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="popup-actions ">
          <button
            onClick={() => {
              handleAddTask();
            }}
            className="add-task-btn adrianna-regular"
          >
            Add Task
          </button>
          <button
            onClick={() => {
              setVisible(false);
              setTaskName("");
              setDescription("");
              setDueDate("");
            }}
            className="cancel-btn adrianna-regular"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

CreateTask.propTypes = {
  isPopupVisible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

export default CreateTask;
