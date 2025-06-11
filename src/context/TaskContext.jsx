import { createContext, useState } from "react";
import PropTypes from "prop-types";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasklist, setTasklist] = useState(JSON.parse(localStorage.getItem("tasklist")) || ([]));

  const [currentTask, setCurrentTask] = useState(null);

  const organizeTasks = (tasks) => {
    return tasks.sort((a, b) => {
      return a.dueDate - b.dueDate;
    });
  };

  const addTask = (task) => {
    const updatedTasklist = [...tasklist, task];
    setTasklist(organizeTasks(updatedTasklist));
    localStorage.setItem("tasklist", JSON.stringify(updatedTasklist));
  };

const removeTask = (taskId) => {
    const updatedTasklist = tasklist.filter((task) => task.id !== taskId);
    setTasklist(organizeTasks(updatedTasklist));
    localStorage.setItem("tasklist", JSON.stringify(updatedTasklist));
};

  const updateTask = (updatedTask) => {
    const updatedTasklist = tasklist.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasklist(organizeTasks(updatedTasklist));
    localStorage.setItem("tasklist", JSON.stringify(updatedTasklist));
  };

  // const updateDatabase = (newTasklist) => {
  // Add your database update logic here
  // console.log("Updating database with new tasklist:", newTasklist);
  // }

  return (
    <TaskContext.Provider
      value={{
        tasklist,
        setTasklist,
        currentTask,
        setCurrentTask,
        addTask,
        removeTask,
        updateTask,
        organizeTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

TaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
