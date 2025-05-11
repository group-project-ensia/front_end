import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
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

interface Course {
  id: string;
  name: string;
  teacher: string;
  semester: string;
  lectures: Lecture[];
}

const CourseDetail: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { courseId } = useParams();
  const navigate = useNavigate();

  const courses: Course[] = [
    {
      id: '1',
      name: 'Mathematics 101',
      teacher: 'Dr. Smith',
      semester: 'Spring 2024',
      lectures: [
        {
          id: '1',
          title: 'Introduction to Course',
          date: '2024-03-01',
          duration: '1:15:00',
          thumbnailUrl: 'https://source.unsplash.com/random/400x225/?lecture',
          notes: 'Course overview and syllabus discussion',
        },
      ],
    },
    {
      id: '2',
      name: 'Introduction to Physics',
      teacher: 'Prof. Johnson',
      semester: 'Spring 2024',
      lectures: [
        {
          id: '1',
          title: 'Physics Basics',
          date: '2024-03-02',
          duration: '1:10:00',
          thumbnailUrl: 'https://source.unsplash.com/random/400x225/?physics',
          notes: 'First lecture: basic concepts.',
        },
      ],
    },
  ];

  const course = courses.find(c => c.id === courseId) || courses[0];
  const lectures = course.lectures;

  const [lecturesState, setLecturesState] = useState(lectures);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLectureName, setUploadLectureName] = useState("");

  // For lecture menu
  const [lectureMenuOpenId, setLectureMenuOpenId] = useState<string | null>(null);
  // For editing lectures
  const [editLectureModalOpen, setEditLectureModalOpen] = useState(false);
  const [editLectureId, setEditLectureId] = useState<string | null>(null);
  const [editLectureName, setEditLectureName] = useState("");
  //for video summary
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState("");


  // For deleting lectures
  const handleDeleteLecture = (lectureId: string) => {
    setLecturesState(list => list.filter(l => l.id !== lectureId));
    setLectureMenuOpenId(null);
  };
  const handleEditLecture = (lectureId: string) => {
    const lecture = lecturesState.find(l => l.id === lectureId);
    if (!lecture) return;
    setEditLectureId(lectureId);
    setEditLectureName(lecture.title);
    setEditLectureModalOpen(true);
  };
  const handleEditLectureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLectureId) return;
    setLecturesState(list =>
      list.map(l => (l.id === editLectureId ? { ...l, title: editLectureName } : l))
    );
    setEditLectureModalOpen(false);
    setEditLectureId(null);
    setEditLectureName("");
  };

  const handleUploadLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadLectureName) return;
    // Add the new lecture to the UI (temporary, frontend only)
    setLecturesState([
      ...lecturesState,
      {
        id: (lecturesState.length + 1).toString(),
        title: uploadLectureName,
        date: new Date().toISOString(),
        duration: '',
        thumbnailUrl: '',
        notes: '',
      },
    ]);
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadLectureName("");
  };

  const handleSummarizeVideo = () => {
    if (!videoUrlInput.trim()) return;
    navigate('/video-summary', { state: { videoUrl: videoUrlInput.trim() } });
    setShowSummarizeModal(false);
    setVideoUrlInput('');
  };

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
              onClick={() => navigate('/classroom')} 
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-graduation-cap"></i>
              <span className="nav-text">Classes</span>
            </li>
            <li
              data-tooltip="Calendar"
              onClick={() => navigate('/calendar')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-calendar-alt"></i>
              <span className="nav-label">Calendar</span>
            </li>
            <li data-tooltip="To-do" onClick={() => navigate('/todo')} style={{ cursor: 'pointer' }}>
              <i className="fas fa-tasks"></i>
              <span className="nav-text">To-do</span>
            </li>
            <li
              data-tooltip="Profile"
              onClick={() => navigate('/profile')}
              style={{ cursor: 'pointer' }}
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
              <span className="nav-label">Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <div className="course-visual-header small flex-header">
          <h1 className="course-detail-title small">{course.name}</h1>
          <div className="action-buttons-row">
            <button className="upload-lecture-btn consistent" onClick={() => setShowUploadModal(true)}>
              <i className="fas fa-upload"></i> Upload Lecture
            </button>
            <button className="upload-lecture-btn consistent" onClick={() => setShowSummarizeModal(true)}>
              <i className="fas fa-video"></i> Summarize Video
            </button>
          </div>
        </div>

        {showUploadModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Upload Lecture</h2>
              <form onSubmit={handleUploadLecture}>
                <label className="modal-label">
                  PDF File
                  <input
                    type="file"
                    accept="application/pdf"
                    required
                    onChange={e => setUploadFile(e.target.files ? e.target.files[0] : null)}
                  />
                </label>
                <label className="modal-label">
                  Lecture Name
                  <input
                    type="text"
                    value={uploadLectureName}
                    onChange={e => setUploadLectureName(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button type="button" className="modal-cancel-btn" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="modal-upload-btn consistent">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {showSummarizeModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Summarize Video</h2>
              <form onSubmit={e => { e.preventDefault(); handleSummarizeVideo(); }}>
                <label className="modal-label">
                  Video URL
                  <input type="url" value={videoUrlInput} onChange={e => setVideoUrlInput(e.target.value)} required />
                </label>
                <div className="modal-actions">
                  <button type="button" className="modal-cancel-btn" onClick={() => setShowSummarizeModal(false)}>Cancel</button>
                  <button type="submit" className="modal-upload-btn consistent">Summarize</button>
                </div>
              </form>
            </div>
          </div>
        )}
        <main className="lectures-container improved">
          <h2 className="lectures-title improved">Lectures</h2>
          <div className="lectures-grid improved">
            {lecturesState.map((lecture) => (
              <div key={lecture.id} className="lecture-card improved">
                <div className="lecture-card-menu-container top-right">
                  <button
                    className="lecture-card-menu-btn"
                    onClick={e => {
                      e.stopPropagation();
                      setLectureMenuOpenId(lecture.id === lectureMenuOpenId ? null : lecture.id);
                    }}
                  >
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                  {lectureMenuOpenId === lecture.id && (
                    <div className="lecture-card-menu-dropdown">
                      <button onClick={() => handleEditLecture(lecture.id)}><i className="fas fa-edit"></i> Edit</button>
                      <button onClick={() => handleDeleteLecture(lecture.id)}><i className="fas fa-trash"></i> Delete</button>
                    </div>
                  )}
                </div>
                <div className="lecture-info improved">
                  <h3 className="lecture-title improved">{lecture.title}</h3>
                  <div className="lecture-meta-row">
                    <span className="lecture-date improved">
                      <i className="far fa-calendar-alt"></i> {new Date(lecture.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="lecture-actions improved">
                    <button className="action-btn summarize-btn improved">
                      <i className="fas fa-book-reader"></i>
                      Summarize
                    </button>
                    <button
                      className="action-btn quiz-btn improved"
                      onClick={() => navigate('/quizzes')}
                    >
                      <i className="fas fa-question-circle"></i>
                      Quiz
                    </button>
                    <button
                      className="action-btn flashcard-btn improved"
                      onClick={() => navigate('/flashcards')}
                    >
                      <i className="fas fa-clone"></i>
                      Flashcards
                    </button>
                    <button
                      className="action-btn chat-btn improved"
                      onClick={() => navigate('/chatbot')}
                    >
                      <i className="fas fa-comments"></i>
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      {editLectureModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Lecture</h2>
            <form onSubmit={handleEditLectureSubmit}>
              <label className="modal-label">
                Lecture Name
                <input
                  type="text"
                  value={editLectureName}
                  onChange={e => setEditLectureName(e.target.value)}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setEditLectureModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-upload-btn consistent improved">
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

export default CourseDetail;
