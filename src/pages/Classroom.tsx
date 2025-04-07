import React, { useState } from 'react';
import './Classroom.css';
import { useNavigate } from 'react-router-dom';

interface ClassCard {
  id: string;
  name: string;
  teacher: string;
  subject: string;
  imageUrl: string;
}

const Classroom: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const sampleClasses: ClassCard[] = [
    {
      id: '1',
      name: 'Mathematics 101',
      teacher: 'Dr. Smith',
      subject: 'Mathematics',
      imageUrl: 'https://source.unsplash.com/random/800x600/?mathematics',
    },
    {
      id: '2',
      name: 'Introduction to Physics',
      teacher: 'Prof. Johnson',
      subject: 'Physics',
      imageUrl: 'https://source.unsplash.com/random/800x600/?physics',
    },
    {
      id: '3',
      name: 'English Literature',
      teacher: 'Ms. Davis',
      subject: 'English',
      imageUrl: 'https://source.unsplash.com/random/800x600/?books',
    },
  ];

  const filteredClasses = sampleClasses.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (classId: string) => {
    setIsLoading(true);
    navigate(`/course/${classId}`);
  };

  return (
    <div className="app-container">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button 
            className="menu-toggle" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active" data-tooltip="Classes">
              <i className="fas fa-graduation-cap"></i>
              <span className="nav-text">Classes</span>
            </li>
            <li data-tooltip="Calendar">
              <i className="fas fa-calendar"></i>
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

      <div className="main-content">
        <header className="classroom-header">
          <div className="header-left">
            <h1>My Classroom</h1>
            <div className="search-container">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="header-right">
            <button className="create-class-btn">
              <i className="fas fa-plus"></i>
              Create Class
            </button>
            <button className="join-class-btn">
              <i className="fas fa-sign-in-alt"></i>
              Join Class
            </button>
            <div className="user-profile">
              <img src="https://via.placeholder.com/32" alt="User profile" className="profile-image" />
            </div>
          </div>
        </header>

        <main className="classroom-content">
          <div className="class-cards-container">
            {filteredClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="class-card animate-in"
                onClick={() => handleCardClick(classItem.id)}
              >
                <div className="card-image">
                  <img src={classItem.imageUrl} alt={classItem.name} />
                </div>
                <div className="card-content">
                  <h3>{classItem.name}</h3>
                  <p className="teacher">
                    <i className="fas fa-user-tie"></i> {classItem.teacher}
                  </p>
                  <p className="subject">
                    <i className="fas fa-book"></i> {classItem.subject}
                  </p>
                </div>
                <div className="card-footer">
                  <button className="view-details-btn">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
