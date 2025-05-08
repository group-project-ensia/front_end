import React, { useState } from 'react';
import './Classroom.css';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';

const RANDOM_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 60%, #06b6d4 100%)',
  'linear-gradient(135deg, #f59e42 40%, #f43f5e 100%)',
  'linear-gradient(135deg, #06d6a0 60%, #ffd166 100%)',
  'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)',
  'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
  'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
];

interface ClassCard {
  id: string;
  name: string;
  teacher: string;
  imageUrl?: string;
  gradient?: string;
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
      imageUrl: 'https://source.unsplash.com/random/800x600/?mathematics',
    },
    {
      id: '2',
      name: 'Introduction to Physics',
      teacher: 'Prof. Johnson',
      imageUrl: 'https://source.unsplash.com/random/800x600/?physics',
    },
    {
      id: '3',
      name: 'English Literature',
      teacher: 'Ms. Davis',
      imageUrl: 'https://source.unsplash.com/random/800x600/?books',
    },
  ];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newTeacher, setNewTeacher] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [classList, setClassList] = useState<ClassCard[]>(sampleClasses);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editClassId, setEditClassId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTeacher, setEditTeacher] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  function handleCreateClass() {
    setShowCreateModal(true);
  }
  function handleModalClose() {
    setShowCreateModal(false);
    setNewClassName('');
    setNewTeacher('');
    setNewImageUrl('');
  }
  function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newClassName || !newTeacher) return;
    const gradient = RANDOM_GRADIENTS[Math.floor(Math.random() * RANDOM_GRADIENTS.length)];
    setClassList([
      ...classList,
      {
        id: (classList.length + 1).toString(),
        name: newClassName,
        teacher: newTeacher,
        imageUrl: newImageUrl || undefined,
        gradient: newImageUrl ? undefined : gradient,
      }
    ]);
    handleModalClose();
  }

  const filteredClasses = classList.filter(
    (classItem) =>
      classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (classId: string) => {
    setIsLoading(true);
    navigate(`/course/${classId}`);
  };

  const handleEditCourse = (classId: string) => {
    const course = classList.find(c => c.id === classId);
    if (!course) return;
    setEditClassId(classId);
    setEditName(course.name);
    setEditTeacher(course.teacher);
    setEditImageUrl(course.imageUrl || "");
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClassId) return;
    setClassList(list => list.map(c => c.id === editClassId ? { ...c, name: editName, teacher: editTeacher, imageUrl: editImageUrl } : c));
    setEditModalOpen(false);
    setEditClassId(null);
    setEditName("");
    setEditTeacher("");
    setEditImageUrl("");
  };

  const handleDeleteCourse = (classId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setClassList(list => list.filter(c => c.id !== classId));
      setMenuOpenId(null);
    }
  };

  return (
    <div className="app-container classroom-bg">
      {/* Remove animated background shapes */}
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
            <li
              data-tooltip="Calendar"
              onClick={() => navigate('/calendar')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-calendar-alt"></i>
              <span className="nav-text">Calendar</span>
            </li>
            <li data-tooltip="To-do" onClick={() => navigate('/todo')} style={{ cursor: 'pointer' }}>
              <i className="fas fa-tasks"></i>
              <span className="nav-text">To-do</span>
            </li>
            <li data-tooltip="Profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <i className="fas fa-user"></i>
              <span className="nav-text">Profile</span>
            </li>
            <li 
              data-tooltip="Logout" 
              onClick={() => {
                // Add your logout logic here
                localStorage.removeItem('token'); // Remove auth token
                navigate('/login'); // Redirect to login page
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
            <h1>My Classroom</h1>
            <div className="search-container">
              <button className="search-btn" aria-label="Search" onClick={() => { /* Optionally trigger search/filter here */ }}>
                <i className="fas fa-search"></i>
              </button>
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
            <button className="create-class-btn vibrant" onClick={handleCreateClass}>
              <i className="fas fa-plus"></i>
              Create Class
            </button>
            <div className="user-profile">
              <UserAvatar name="John Doe" size={40} />
            </div>
          </div>
        </header>
        <main className="classroom-content">
          <div className="class-cards-container">
            {filteredClasses.map((classItem, idx) => {
              // For cards without image, show a colored circle with initials
              const initials = classItem.name
                .split(' ')
                .map(w => w[0]?.toUpperCase() || '')
                .join('').slice(0,2);
              const circleColors = ['#4f46e5', '#06b6d4', '#f59e42', '#f43f5e', '#06d6a0', '#ffd166'];
              const circleColor = circleColors[idx % circleColors.length];
              return (
                <div
                  key={classItem.id}
                  className="class-card modern-card animate-in"
                  style={{ animationDelay: `${0.1 * idx}s` }}
                  onClick={e => {
                    // Only navigate if not clicking the menu button or menu dropdown
                    const target = e.target as HTMLElement;
                    if (
                      target.closest('.course-card-menu-btn') ||
                      target.closest('.course-card-menu-dropdown')
                    ) {
                      return;
                    }
                    handleCardClick(classItem.id);
                  }}
                >
                  <div className="course-card-menu-container top-right">
                    <button
                      className="course-card-menu-btn"
                      onClick={e => {
                        e.stopPropagation();
                        setMenuOpenId(classItem.id === menuOpenId ? null : classItem.id);
                      }}
                      aria-label="Open course menu"
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {menuOpenId === classItem.id && (
                      <div className="course-card-menu-dropdown">
                        <button onClick={() => handleEditCourse(classItem.id)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button onClick={() => handleDeleteCourse(classItem.id)}>
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-top-center">
                    {classItem.imageUrl ? (
                      <img src={classItem.imageUrl} alt={classItem.name} className="class-avatar-img" />
                    ) : (
                      <div className="class-avatar-circle" style={{ background: circleColor }}>
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="card-info">
                    <h3 className="class-title">{classItem.name}</h3>
                    <div className="teacher-avatar-row">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(classItem.teacher)}&background=4f46e5&color=fff&size=32`} alt={classItem.teacher} className="teacher-img" />
                      <span className="teacher-name">{classItem.teacher}</span>
                    </div>
                  </div>
                  <button
                    className="view-details-btn modern-btn"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/course/${classItem.id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="modal-close" onClick={handleModalClose}>&times;</button>
            <h2>Create a New Class</h2>
            <form onSubmit={handleModalSubmit} className="create-class-form">
              <label>Course Name*</label>
              <input value={newClassName} onChange={e => setNewClassName(e.target.value)} required placeholder="Enter course name" />
              <label>Teacher*</label>
              <input value={newTeacher} onChange={e => setNewTeacher(e.target.value)} required placeholder="Enter teacher name" />
              <label>Picture (optional)</label>
              <input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="Paste image URL (optional)" />
              <button className="create-class-btn vibrant" type="submit">Create</button>
            </form>
          </div>
        </div>
      )}
      {/* Edit Class Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Course</h2>
            <form onSubmit={handleEditSubmit}>
              <label className="modal-label">
                Course Name
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </label>
              <label className="modal-label">
                Instructor
                <input
                  type="text"
                  value={editTeacher}
                  onChange={e => setEditTeacher(e.target.value)}
                  required
                />
              </label>
              <label className="modal-label">
                Image URL (optional)
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={e => setEditImageUrl(e.target.value)}
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-upload-btn consistent">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
