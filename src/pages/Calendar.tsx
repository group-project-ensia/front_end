// src/components/Calendar.tsx

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';
import { useNavigate } from 'react-router-dom';
import { getTodosForCalendar } from '../api/toDoAPI';
import UserAvatar from '../components/UserAvatar';

interface TodoEvent {
  id: string;
  title: string;
  date: string;
}

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const userId = '681e66a9a1f352628d8ee50a'; // single test user

  const [todos, setTodos] = useState<TodoEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch events from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const data: any[] = await getTodosForCalendar(userId);
        setTodos(
          data.map(t => ({
            id:    t.id,
            title: t.title,
            date:  t.dueDate
          }))
        );
      } catch (err) {
        console.error('Failed to load calendar todos', err);
      }
    })();
  }, [userId]);

  const handleDateClick = (arg: any) => {
    setNewDate(arg.dateStr);
    setShowAddModal(true);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    setTodos(prev => [
      ...prev,
      { id: Date.now().toString(), title: newTitle, date: newDate }
    ]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDate('');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar${isSidebarOpen ? '' : ' closed'}`}>
        <div className="sidebar-header">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li
              data-tooltip="Classes"
              onClick={() => navigate('/classroom')}
              className={window.location.pathname.startsWith('/classroom') ? 'active' : ''}
            >
              <i className="fas fa-graduation-cap"></i>
              <span className="nav-text">Classes</span>
            </li>
            <li
              data-tooltip="Calendar"
              onClick={() => navigate('/calendar')}
              className={window.location.pathname.startsWith('/calendar') ? 'active' : ''}
            >
              <i className="fas fa-calendar-alt"></i>
              <span className="nav-text">Calendar</span>
            </li>
            <li
              data-tooltip="To-do"
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

      {/* Main Content */}
      <div className="main-content">
        <header className="classroom-header">
          <div className="header-left">
            <h1 className="calendar-title">Calendar</h1>
          </div>
          <div className="header-right">
            <div className="user-profile">
              <UserAvatar name="John Doe" size={40} />
            </div>
          </div>
        </header>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={todos.map(todo => ({
            id:    todo.id,
            title: todo.title,
            date:  todo.date
          }))}
          dateClick={handleDateClick}
          height="auto"
        />

        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Add To-Do</h2>
              <form onSubmit={handleAddTodo}>
                <label className="modal-label">
                  Task Title
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required
                  />
                </label>
                <label className="modal-label">
                  Date
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-upload-btn consistent">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
