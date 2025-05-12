// src/components/ToDo.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ToDo.css';
import {
  getTodosByUser,
  createTodo,
  updateTodo,
  deleteTodo
} from '../api/toDoAPI';
import UserAvatar from '../components/UserAvatar';

interface TodoItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

const ToDo: React.FC = () => {
  const navigate = useNavigate();
  const userId = '681e66a9a1f352628d8ee50a'; // single test user

  const [isSidebarOpen, setIsSidebarOpen]       = useState(true);
  const [searchQuery, setSearchQuery]           = useState('');
  const [tasks, setTasks]                       = useState<TodoItem[]>([]);

  // Add/Edit modal state
  const [showTaskModal,    setShowTaskModal]     = useState(false);
  const [modalTaskTitle,   setModalTaskTitle]    = useState('');
  const [modalTaskDueDate, setModalTaskDueDate]  = useState('');
  const [modalEditId,      setModalEditId]       = useState<string | null>(null);

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load todos on mount
  useEffect(() => {
    (async () => {
      try {
        const todos = await getTodosByUser(userId);
        setTasks(
          todos.map((t: any) => ({
            id:        t.id,
            title:     t.title,
            dueDate:   t.dueDate,
            completed: t.completed
          }))
        );
      } catch (err) {
        console.error('Failed to load todos', err);
      }
    })();
  }, [userId]);

  // Toggle completion status
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      await updateTodo(id, { isDone: !task.completed });
      setTasks(ts =>
        ts.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      console.error('Failed to update todo', err);
    }
  };

  // Open Add Modal
  const openAddTaskModal = () => {
    setModalEditId(null);
    setModalTaskTitle('');
    setModalTaskDueDate('');
    setShowTaskModal(true);
  };

  // Open Edit Modal
  const openEditTaskModal = (task: TodoItem) => {
    setModalEditId(task.id);
    setModalTaskTitle(task.title);
    setModalTaskDueDate(task.dueDate);
    setShowTaskModal(true);
  };

  // Handle Add/Edit form submit
  const handleTaskModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTaskTitle || !modalTaskDueDate) return;

    if (modalEditId) {
      // Edit existing
      try {
        await updateTodo(modalEditId, {
          title:   modalTaskTitle,
          dueDate: modalTaskDueDate
        });
        setTasks(ts =>
          ts.map(t =>
            t.id === modalEditId
              ? { ...t, title: modalTaskTitle, dueDate: modalTaskDueDate }
              : t
          )
        );
      } catch (err) {
        console.error('Edit failed', err);
      }
    } else {
      // Create new
      try {
        const newTodo = await createTodo({
          title:   modalTaskTitle,
          dueDate: modalTaskDueDate,
          userId
        });
        setTasks(ts => [
          ...ts,
          {
            id:        newTodo.id,
            title:     newTodo.title,
            dueDate:   newTodo.dueDate,
            completed: newTodo.completed
          }
        ]);
      } catch (err) {
        console.error('Create failed', err);
      }
    }

    setShowTaskModal(false);
    setModalEditId(null);
    setModalTaskTitle('');
    setModalTaskDueDate('');
  };

  // Confirm delete
  const handleDeleteTask = async () => {
    if (!deleteId) return;
    try {
      await deleteTodo(deleteId);
      setTasks(ts => ts.filter(t => t.id !== deleteId));
    } catch (err) {
      console.error('Delete failed', err);
    }
    setDeleteId(null);
  };

  // Filter by search
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >☰</button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li
              onClick={() => navigate('/classroom')}
              className={window.location.pathname.startsWith('/classroom') ? 'active' : ''}
            >
              <i className="fas fa-graduation-cap"></i>
              <span className="nav-text">Classes</span>
            </li>
            <li
              onClick={() => navigate('/calendar')}
              className={window.location.pathname.startsWith('/calendar') ? 'active' : ''}
            >
              <i className="fas fa-calendar"></i>
              <span className="nav-text">Calendar</span>
            </li>
            <li
              onClick={() => navigate('/todo')}
              className={window.location.pathname.startsWith('/todo') ? 'active' : ''}
            >
              <i className="fas fa-tasks"></i>
              <span className="nav-text">To-do</span>
            </li>
            <li
              data-tooltip="Profile"
              onClick={() => navigate('/profile')}
              className={window.location.pathname.startsWith('/profile') ? 'active' : ''}
            >
              <i className="fas fa-user"></i>
              <span className="nav-text">Profile</span>
            </li>
            <li 
              data-tooltip="Logout" 
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }} 
              style={{ cursor: 'pointer', marginTop: 'auto' }}
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="nav-text">Logout</span>
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
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="header-right">
            <button className="create-class-btn vibrant" onClick={openAddTaskModal}>
              <i className="fas fa-plus"></i> Add Task
            </button>
            <div className="user-profile">
              <UserAvatar name="John Doe" size={40} />
            </div>
          </div>
        </header>

        <main className="classroom-content">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks found</h3>
              <p>You're all caught up! Add a new task to get started.</p>
            </div>
          ) : (
            <div className="class-cards-container">
              {filteredTasks.map(task => {
                const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
                const isToday   = !task.completed && new Date(task.dueDate).toDateString() === new Date().toDateString();

                return (
                  <div
                    key={task.id}
                    className={`class-card${task.completed ? ' completed' : ''}${isOverdue ? ' overdue' : ''}${isToday ? ' due-today' : ''}`}
                  >
                    <div className="card-content">
                      <div className="task-header-row">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                        />
                        <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                          {task.title}
                        </h3>
                      </div>
                      <p>
                        <i className="fas fa-calendar-alt"></i> Due: <span className="due-date">{task.dueDate}</span>
                      </p>
                      <p>
                        <i className={`fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>{' '}
                        {task.completed
                          ? 'Completed'
                          : isOverdue
                            ? 'Overdue'
                            : isToday
                              ? 'Due Today'
                              : 'Pending'}
                      </p>
                    </div>
                    <div className="card-footer">
                      <button className="edit-task-btn" onClick={() => openEditTaskModal(task)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="delete-task-btn" onClick={() => setDeleteId(task.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                <input
                  type="text"
                  value={modalTaskTitle}
                  onChange={e => setModalTaskTitle(e.target.value)}
                  required
                />
              </label>
              <label className="modal-label">
                Due Date
                <input
                  type="date"
                  value={modalTaskDueDate}
                  onChange={e => setModalTaskDueDate(e.target.value)}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowTaskModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-upload-btn consistent vibrant">
                  {modalEditId ? 'Save' : 'Add'}
                </button>
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
              <button type="button" className="modal-cancel-btn" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button type="button" className="modal-upload-btn consistent vibrant" onClick={handleDeleteTask}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDo;
