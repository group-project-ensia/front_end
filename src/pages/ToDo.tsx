import React, { useState } from 'react';
import './ToDo.css'; // Reuse the same CSS for consistent styling
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate

interface TodoItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const navigate = useNavigate(); // Declare navigate here

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<TodoItem[]>([
    {
      id: uuidv4(),
      title: 'Submit math assignment',
      dueDate: '2025-04-10',
      completed: false,
    },
    {
      id: uuidv4(),
      title: 'Read English novel',
      dueDate: '2025-04-12',
      completed: true,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li
              data-tooltip="Classes"
              onClick={() => navigate('/classroom')} // Use navigate here
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-graduation-cap"></i>
              <span className="nav-text">Classes</span>
            </li>
            <li data-tooltip="Calendar">
              <i className="fas fa-calendar"></i>
              <span className="nav-text">Calendar</span>
            </li>
            <li className="active" data-tooltip="To-do">
              <i className="fas fa-tasks"></i>
              <span className="nav-text">To-do</span>
            </li>
            <li data-tooltip="Archived classes">
              <i className="fas fa-archive"></i>
              <span className="nav-text">Archived classes</span>
            </li>
            <li data-tooltip="Settings">
              <i className="fas fa-cog"></i>
              <span className="nav-text">Settings</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <header className="classroom-header">
          <div className="header-left">
            <h1>To-do List</h1>
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="header-right">
            <button className="create-class-btn">
              <i className="fas fa-plus"></i>
              Add Task
            </button>
            <div className="user-profile">
              <img
                src="https://via.placeholder.com/32"
                alt="User profile"
                className="profile-image"
              />
            </div>
          </div>
        </header>

        <main className="classroom-content">
          <div className="class-cards-container">
            {filteredTasks.length === 0 ? (
              <p>No tasks found.</p>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="class-card">
                  <div className="card-content">
                    <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </h3>
                    <p>
                      <i className="fas fa-calendar-alt"></i> Due: {task.dueDate}
                    </p>
                    <p>
                      <i className={`fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>{' '}
                      {task.completed ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                  <div className="card-footer">
                    <button
                      className="view-details-btn"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Todo;
