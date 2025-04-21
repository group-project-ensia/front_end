import React, { useState } from 'react';
import './ToDo.css'; 
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom'; 

interface TodoItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const navigate = useNavigate(); 

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

  // Modal state for adding/editing tasks
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalTaskTitle, setModalTaskTitle] = useState('');
  const [modalTaskDueDate, setModalTaskDueDate] = useState('');
  const [modalEditId, setModalEditId] = useState<string | null>(null);

  // Modal state for deleting
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  // Add/Edit Task
  const openAddTaskModal = () => {
    setShowTaskModal(true);
    setModalTaskTitle('');
    setModalTaskDueDate('');
    setModalEditId(null);
  };
  const openEditTaskModal = (task: TodoItem) => {
    setShowTaskModal(true);
    setModalTaskTitle(task.title);
    setModalTaskDueDate(task.dueDate);
    setModalEditId(task.id);
  };
  const handleTaskModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTaskTitle || !modalTaskDueDate) return;
    if (modalEditId) {
      setTasks((list) =>
        list.map((t) =>
          t.id === modalEditId
            ? { ...t, title: modalTaskTitle, dueDate: modalTaskDueDate }
            : t
        )
      );
    } else {
      setTasks((list) => [
        ...list,
        {
          id: uuidv4(),
          title: modalTaskTitle,
          dueDate: modalTaskDueDate,
          completed: false,
        },
      ]);
    }
    setShowTaskModal(false);
    setModalTaskTitle('');
    setModalTaskDueDate('');
    setModalEditId(null);
  };
  const handleDeleteTask = () => {
    if (deleteId) setTasks((list) => list.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };

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
              className={window.location.pathname.startsWith('/classroom') ? 'active' : ''}
              onClick={() => navigate('/classroom')}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate('/classroom')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-graduation-cap"></i>
              <span className="nav-text">Classes</span>
            </li>
            <li
              data-tooltip="Calendar"
              className={window.location.pathname.startsWith('/calendar') ? 'active' : ''}
              onClick={() => navigate('/calendar')}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate('/calendar')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-calendar"></i>
              <span className="nav-text">Calendar</span>
            </li>
            <li
              data-tooltip="To-do"
              className={window.location.pathname.startsWith('/todo') ? 'active' : ''}
              onClick={() => navigate('/todo')}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate('/todo')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-tasks"></i>
              <span className="nav-text">To-do</span>
            </li>
            <li
              data-tooltip="Archived classes"
              className={window.location.pathname.startsWith('/archived') ? 'active' : ''}
              onClick={() => navigate('/archived')}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate('/archived')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-archive"></i>
              <span className="nav-text">Archived classes</span>
            </li>
            <li
              data-tooltip="Settings"
              className={window.location.pathname.startsWith('/settings') ? 'active' : ''}
              onClick={() => navigate('/settings')}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate('/settings')}
              style={{ cursor: 'pointer' }}
            >
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
            <button className="create-class-btn vibrant" onClick={openAddTaskModal}>
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
              <div className="empty-state">
                <img src="https://assets10.lottiefiles.com/packages/lf20_jtbfg2nb.json" alt="No tasks" height="180" style={{marginBottom: 16}} />
                <h3>No tasks found</h3>
                <p>You're all caught up! Add a new task to get started.</p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
                const isToday = !task.completed && new Date(task.dueDate).toDateString() === new Date().toDateString();
                return (
                  <div key={task.id} className={`class-card${task.completed ? ' completed' : ''}${isOverdue ? ' overdue' : ''}${isToday ? ' due-today' : ''}`}>
                    <div className="card-content">
                      <div className="task-header-row">
                        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
                        <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
                      </div>
                      <p>
                        <i className="fas fa-calendar-alt"></i> Due: <span className="due-date">{task.dueDate}</span>
                      </p>
                      <p>
                        <i className={`fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>{' '}
                        {task.completed ? 'Completed' : isOverdue ? 'Overdue' : isToday ? 'Due Today' : 'Pending'}
                      </p>
                    </div>
                    <div className="card-footer">
                      <button className="edit-task-btn" onClick={() => openEditTaskModal(task)}><i className="fas fa-edit"></i></button>
                      <button className="delete-task-btn" onClick={() => setDeleteId(task.id)}><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
      {/* Add/Edit Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalEditId ? 'Edit Task' : 'Add Task'}</h2>
            <form onSubmit={handleTaskModalSubmit}>
              <label className="modal-label">
                Task Name
                <input type="text" value={modalTaskTitle} onChange={e => setModalTaskTitle(e.target.value)} required />
              </label>
              <label className="modal-label">
                Due Date
                <input type="date" value={modalTaskDueDate} onChange={e => setModalTaskDueDate(e.target.value)} required />
              </label>
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="modal-upload-btn consistent vibrant">{modalEditId ? 'Save' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Task Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete Task</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-actions">
              <button type="button" className="modal-cancel-btn " onClick={() => setDeleteId(null)}>Cancel</button>
              <button type="button" className="modal-upload-btn consistent vibrant" onClick={handleDeleteTask}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
