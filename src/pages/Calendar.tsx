import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';
import { useNavigate } from 'react-router-dom';

interface TodoEvent {
  id: string;
  title: string;
  date: string;
}

const initialTodos: TodoEvent[] = [
  { id: '1', title: 'Finish Math Homework', date: '2025-04-17' },
  { id: '2', title: 'Prepare for Chemistry Quiz', date: '2025-04-19' },
  { id: '3', title: 'Group Project Meeting', date: '2025-04-21' },
];

const Calendar: React.FC = () => {
  const [todos, setTodos] = useState<TodoEvent[]>(initialTodos);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleDateClick = (arg: any) => {
    setNewDate(arg.dateStr);
    setShowAddModal(true);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    setTodos([...todos, { id: Date.now().toString(), title: newTitle, date: newDate }]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDate('');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar${isSidebarOpen ? '' : ' closed'}`}>
        <div className="sidebar-header">
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li data-tooltip="Classes" onClick={() => navigate('/classroom')} style={{ cursor: 'pointer' }}>
              <i className="fas fa-graduation-cap"></i>
              <span className="nav-text">Classes</span>
            </li>
            <li data-tooltip="Calendar" onClick={() => navigate('/calendar')} style={{ cursor: 'pointer' }}>
              <i className="fas fa-calendar-alt"></i>
              <span className="nav-text">Calendar</span>
            </li>
            <li data-tooltip="To-do" onClick={() => navigate('/todo')} style={{ cursor: 'pointer' }}>
              <i className="fas fa-tasks"></i>
              <span className="nav-text">To-do</span>
            </li>
            <li className="archived" data-tooltip="Archived classes">
              <i className="fas fa-archive"></i>
              <span className="nav-text">Archived classes</span>
            </li>
            <li className="settings" data-tooltip="Settings">
              <i className="fas fa-cog"></i>
              <span className="nav-text">Settings</span>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="main-content">
        <h1 className="calendar-title">Calendar</h1>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={todos.map(todo => ({ id: todo.id, title: todo.title, date: todo.date }))}
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
                  <button type="button" className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>
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
