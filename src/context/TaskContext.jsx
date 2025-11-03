import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { apiPost, apiGet, getToken, apiDelete } from "../utils/apiClient";
import { ProfileContext } from "./ProfileContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useContext(ProfileContext);

  const [tasklist, setTasklist] = useState(JSON.parse(localStorage.getItem("tasklist")) || ([]));
  const [isLoading, setIsLoading] = useState(true);
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
        console.log("Added task to API:", data);
        const taskWithId = { ...task, id: data.taskId };
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

    // Optionally, send delete to API
    const token = getToken();
    if (token) {
      apiDelete(`/tasks/${taskId}`).catch((error) => {
        console.error("Failed to delete task from API:", error);
      });
    } 
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
      setIsLoading(true);
      const minDelay = new Promise(resolve => setTimeout(resolve, 800));
      
      const token = getToken();
      if (!token) {
        // Clear tasks when logged out
        setTasklist([]);
        localStorage.setItem("tasklist", JSON.stringify([]));
        await minDelay;
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiGet("/tasks");
        if (data?.tasks || Array.isArray(data)) {
          const serverTasks = (data.tasks || data).map(task => ({
            id: task.id,
            name: task.title,
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
      
      await minDelay;
      setIsLoading(false);
    };

    loadTasks();
  }, [isAuthenticated]); // Re-run when auth status changes

  return (
    <TaskContext.Provider
      value={{
        isLoading,
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
