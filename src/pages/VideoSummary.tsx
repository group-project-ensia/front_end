import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CourseDetail.css';

const VideoSummary: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoUrl = location.state?.videoUrl || '';

 
  const generatedSummary = `
    This is a sample summary generated from the video:
    ${videoUrl}

    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
    Sed cursus ante dapibus diam. Sed nisi.
  `;

  return (
    <div className="app-container">
      <aside className="sidebar open">
        <div className="sidebar-header">
          <button className="menu-toggle" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
          </button>
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
        <div className="course-visual-header small flex-header">
          <h1 className="course-detail-title small">Video Summary</h1>
          <button className="upload-lecture-btn consistent">
            <i className="fas fa-upload"></i> Upload Summary PDF
          </button>
        </div>

        <main className="lectures-container improved">
          <h2 className="lectures-title improved">Generated Summary</h2>
          <div className="lecture-card improved" style={{ padding: '1rem' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{generatedSummary}</pre>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VideoSummary;
