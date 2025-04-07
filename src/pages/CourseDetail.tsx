import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // ✅ import useNavigate
import './CourseDetail.css';


interface Lecture {
  id: string;
  title: string;
  date: string;
  duration: string;
  videoUrl?: string;
  notes?: string;
  thumbnailUrl: string;
}

const CourseDetail: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { courseId } = useParams();
  const navigate = useNavigate(); // ✅ init navigation

  const lectures: Lecture[] = [
    {
      id: '1',
      title: 'Introduction to Course',
      date: '2024-03-01',
      duration: '1:15:00',
      thumbnailUrl: 'https://source.unsplash.com/random/400x225/?lecture',
      notes: 'Course overview and syllabus discussion',
    },
    // Add more sample lectures
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="menu-toggle" title="Toggle menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <i className="fas fa-bars"></i>
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
            <li className="nav-item" data-tooltip="Calendar">
              <i className="fas fa-calendar"></i>
              <span className="nav-label">Calendar</span>
            </li>
            <li data-tooltip="To-do" onClick={() => navigate('/todo')} style={{ cursor: 'pointer' }}>
  <i className="fas fa-tasks"></i>
  <span className="nav-text">To-do</span>
</li>

            <li className="nav-item" data-tooltip="Archived classes">
              <i className="fas fa-archive"></i>
              <span className="nav-label">Archived classes</span>
            </li>
            <li className="nav-item" data-tooltip="Settings">
              <i className="fas fa-cog"></i>
              <span className="nav-label">Settings</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="course-header">
          <div className="header-left">
            <button className="back-button" title="Go back">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="course-title">
              <h1>Mathematics 101</h1>
              <span className="course-subtitle">Spring 2024</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="upload-lecture-btn">
              <i className="fas fa-upload"></i>
              <span>Upload Lecture</span>
            </button>
          </div>
        </header>

        <main className="lectures-container">
          <div className="lectures-grid">
            {lectures.map((lecture) => (
              <div key={lecture.id} className="lecture-card">
                <div className="lecture-thumbnail">
                  <div className="thumbnail-placeholder">
                    <i className="fas fa-play-circle"></i>
                  </div>
                  <span className="duration">
                    <i className="far fa-clock"></i>
                    {lecture.duration}
                  </span>
                </div>
                <div className="lecture-info">
                  <h3 className="lecture-title">{lecture.title}</h3>
                  <p className="lecture-date">
                    <i className="far fa-calendar-alt"></i>
                    {new Date(lecture.date).toLocaleDateString()}
                  </p>
                  {lecture.notes && (
                    <p className="lecture-notes">{lecture.notes}</p>
                  )}
                  <div className="lecture-actions">
                    <button className="action-btn summarize-btn">
                      <i className="fas fa-book-reader"></i>
                      <span>Summarize</span>
                    </button>
                    <button
                      className="action-btn quiz-btn"
                      onClick={() => navigate('/quizzes')} // ✅ navigate to quizzes
                    >
                      <i className="fas fa-question-circle"></i>
                      <span>Quiz</span>
                    </button>
                    <button
                      className="action-btn flashcard-btn"
                      onClick={() => navigate('/flashcards')} // ✅ navigate to flashcards
                    >
                      <i className="fas fa-clone"></i>
                      <span>Flashcards</span>
                    </button>
                    <button className="action-btn more-btn" title="More options">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;
