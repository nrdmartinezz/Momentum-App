import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { apiPost, apiGet, getToken } from "../utils/apiClient";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasklist, setTasklist] = useState(JSON.parse(localStorage.getItem("tasklist")) || ([]));

  const [currentTask, setCurrentTask] = useState(null);

  const organizeTasks = (tasks) => {
    return tasks.sort((a, b) => {
      return a.dueDate - b.dueDate;
    });
  };

  const addTask = async (task) => {
    const token = getToken();
    
    // Add to local state immediately for fast UI
    const updatedTasklist = [...tasklist, task];
    setTasklist(organizeTasks(updatedTasklist));
    localStorage.setItem("tasklist", JSON.stringify(updatedTasklist));
    console.log("Added task locally:", task);
    // Send to API
    if (token) {
      try { 
        const body = {
          user_id: localStorage.getItem("user"),
          title: task.name,
          description: task.description,
          due_date: task.dueDate,
        };
        const data = await apiPost("/tasks", body);
        // Update task with ID from server
        const taskWithId = { ...task, id: data.id };
        const finalTasklist = updatedTasklist.map(t => t === task ? taskWithId : t);
        setTasklist(organizeTasks(finalTasklist));
        localStorage.setItem("tasklist", JSON.stringify(finalTasklist));
      } catch (error) {                               
        console.error("Failed to add task to API:", error);
      }
    }

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

  // Load tasks from API on mount
  useEffect(() => {
    const loadTasks = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      try {
        const data = await apiGet("/tasks");
        if (data?.tasks || Array.isArray(data)) {
          const serverTasks = (data.tasks || data).map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || "",
            status: task.status || "pending",
            dueDate: task.due_date || task.dueDate,
          }));
          
          setTasklist(organizeTasks(serverTasks));
          localStorage.setItem("tasklist", JSON.stringify(serverTasks));
        }
      } catch (error) {
        console.error("Failed to load tasks from API:", error);
      }
    };

    loadTasks();
  }, []);

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
