import "../../styles/components/_task_list_skeleton.css";

const TaskListSkeleton = () => {
  return (
    <div className="task-list-skeleton">
      <div className="task-list-skeleton-header">
        <div className="task-list-skeleton-title"></div>
        <div className="task-list-skeleton-button"></div>
      </div>
      <div className="task-list-skeleton-items">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="task-skeleton-item">
            <div className="task-skeleton-checkbox"></div>
            <div className="task-skeleton-content">
              <div className="task-skeleton-title"></div>
              <div className="task-skeleton-description"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListSkeleton;
