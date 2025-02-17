

class TaskListController {
    constructor(tasks) {
      this.tasks = tasks;
    }

    
  createTask(task) {
    this.tasks.push(task);
  }

  readTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  updateTask(taskId, updatedTask) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
    }
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

 
    groupTasksByDate() {
     
      const groupedTasks = this.tasks.reduce((groups, task) => {
        const date = new Date(task.dueDate).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(task);
        return groups;
      }, {});
  
      return Object.keys(groupedTasks)
        .sort((a, b) => new Date(a) - new Date(b))
        .map((date) => ({
          date,
          tasks: groupedTasks[date],
        }));
    }
  
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { month: "short", day: "numeric", weekday: "short" };
      return date.toLocaleDateString("en-US", options);
    }
  }
  
  export default TaskListController;