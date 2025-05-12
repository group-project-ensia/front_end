import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseDetail.css';

// --- TypeScript Interfaces ---
interface Lecture {
  _id:        string;
  title:      string;
  date:       string;
  duration?:  string;
  videoUrl?:  string;
  notes?:     string;
  thumbnailUrl: string;
  createdAt?: string;
}

interface Course {
  _id:      string;
  name:     string;
  teacher:  string;
  semester: string;
}

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate      = useNavigate();
  const userId        = '681e66a9a1f352628d8ee50a'; // replace with auth context

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data state
  const [course, setCourse]               = useState<Course | null>(null);
  const [lectures, setLectures]           = useState<Lecture[]>([]);
  const [lecturesState, setLecturesState] = useState<Lecture[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  // Modal & UI state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile]           = useState<File | null>(null);
  const [uploadLectureName, setUploadLectureName] = useState('');

  const [lectureMenuOpenId, setLectureMenuOpenId] = useState<string | null>(null);

  const [editLectureModalOpen, setEditLectureModalOpen] = useState(false);
  const [editLectureId, setEditLectureId]               = useState<string | null>(null);
  const [editLectureName, setEditLectureName]           = useState('');

  // ---- NEW: video-summary state ----
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);
  const [videoUrlInput, setVideoUrlInput]           = useState('');

  // Fetch course & lectures from backend
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token') || '';
    const headers: Record<string,string> = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const fetchCourse = async () => {
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}`,
        { headers }
      );
      if (!res.ok) throw new Error('Failed to load course');
      return res.json() as Promise<Course>;
    };

    const fetchLectures = async () => {
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}/lectures`,
        { headers }
      );
      if (!res.ok) throw new Error('Failed to load lectures');
      return res.json() as Promise<Lecture[]>;
    };

    Promise.all([fetchCourse(), fetchLectures()])
      .then(([courseData, lecData]) => {
        setCourse(courseData);
        setLectures(lecData);
        setLecturesState(lecData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  // DELETE lecture
  const handleDeleteLecture = async (id: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}/lectures/${id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Delete failed');
      setLecturesState(prev => prev.filter(l => l._id !== id));
      setLectureMenuOpenId(null);
    } catch (e) {
      console.error(e);
    }
  };

  // START edit
  const handleEditLecture = (id: string) => {
    const lec = lecturesState.find(l => l._id === id);
    if (!lec) return;
    setEditLectureId(id);
    setEditLectureName(lec.title);
    setEditLectureModalOpen(true);
  };

  // SUBMIT edit
  const handleEditLectureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLectureId) return;
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}/lectures/${editLectureId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: editLectureName }),
        }
      );
      if (!res.ok) throw new Error('Update failed');
      const updated: Lecture = await res.json();
      setLecturesState(prev =>
        prev.map(l => (l._id === updated._id ? updated : l))
      );
      setEditLectureModalOpen(false);
      setEditLectureId(null);
    } catch (e) {
      console.error(e);
    }
  };

  // UPLOAD lecture
  const handleUploadLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadLectureName) return;
    try {
      const token = localStorage.getItem('token') || '';
      const form = new FormData();
      form.append('pdf', uploadFile);
      form.append('title', uploadLectureName);
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}/lectures`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }
      );
      if (!res.ok) throw new Error('Upload failed');
      const newLec: Lecture = await res.json();
      setLecturesState(prev => [...prev, newLec]);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadLectureName('');
    } catch (e) {
      console.error(e);
    }
  };

  // ---- NEW: send link to VideoSummary page ----
  const handleSummarizeVideo = () => {
    if (!videoUrlInput.trim()) return;
    navigate('/video-summary', { state: { videoUrl: videoUrlInput.trim() } });
    setShowSummarizeModal(false);
    setVideoUrlInput('');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error)   return <div className="error">{error}</div>;
  if (!course) return <div className="no-course">Course not found</div>;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>        
        <div className="sidebar-header">
          <button
            className="menu-toggle"
            title="Toggle menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate('/classroom')}><i className="fas fa-graduation-cap"/><span>Classes</span></li>
            <li onClick={() => navigate('/calendar')}><i className="fas fa-calendar-alt"/><span>Calendar</span></li>
            <li onClick={() => navigate('/todo')}><i className="fas fa-tasks"/><span>To-do</span></li>
            <li onClick={() => navigate('/profile')}><i className="fas fa-user"/><span>Profile</span></li>
            <li style={{ marginTop: 'auto' }} onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}><i className="fas fa-sign-out-alt"/><span>Logout</span></li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Header */}
        <div className="course-visual-header small flex-header">
          <h1 className="course-detail-title small">{course.name}</h1>
          <div className="action-buttons-row">
            <button
              className="upload-lecture-btn consistent"
              onClick={() => setShowUploadModal(true)}
            >
              <i className="fas fa-upload"/> Upload&nbsp;Lecture
            </button>
            {/* NEW button to open summarise modal */}
            <button
              className="upload-lecture-btn consistent"
              onClick={() => setShowSummarizeModal(true)}
            >
              <i className="fas fa-video"/> Transcript&nbsp;Video
            </button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Upload Lecture</h2>
              <form onSubmit={handleUploadLecture}>
                <label className="modal-label">PDF&nbsp;File
                  <input
                    type="file"
                    accept="application/pdf"
                    required
                    onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  />
                </label>
                <label className="modal-label">Lecture&nbsp;Name
                  <input
                    type="text"
                    value={uploadLectureName}
                    onChange={e => setUploadLectureName(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowUploadModal(false)}
                  >
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

        {/* Summarize Modal */}
        {showSummarizeModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Summarize&nbsp;Video</h2>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSummarizeVideo();
                }}
              >
                <label className="modal-label">Video&nbsp;URL
                  <input
                    type="url"
                    value={videoUrlInput}
                    onChange={e => setVideoUrlInput(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowSummarizeModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-upload-btn consistent">
                    Summarize
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lectures Grid */}
        <main className="lectures-container improved">
          <h2 className="lectures-title improved">Lectures</h2>
          <div className="lectures-grid improved">
            {lecturesState.map(lec => (
              <div key={lec._id} className="lecture-card improved">
                <div className="lecture-card-menu-container top-right">
                  <button
                    className="lecture-card-menu-btn"
                    onClick={e => {
                      e.stopPropagation();
                      setLectureMenuOpenId(
                        lec._id === lectureMenuOpenId ? null : lec._id
                      );
                    }}
                  >
                    <i className="fas fa-ellipsis-v"/>
                  </button>
                  {lectureMenuOpenId === lec._id && (
                    <div className="lecture-card-menu-dropdown">
                      <button onClick={() => handleEditLecture(lec._id)}>
                        <i className="fas fa-edit"/> Edit
                      </button>
                      <button onClick={() => handleDeleteLecture(lec._id)}>
                        <i className="fas fa-trash"/> Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="lecture-info improved">
                  <h3
                    className="lecture-title improved"
                    onClick={() =>
                      navigate(`/courses/${courseId}/lectures/${lec._id}`)
                    }
                  >
                    {lec.title}
                  </h3>
                  <div className="lecture-meta-row">
                    {/* metadata placeholders */}
                  </div>

                  <div className="lecture-actions improved">
                    <button className="action-btn summarize-btn improved">
                      <i className="fas fa-book-reader"/> Summarize
                    </button>
                    <button
                      className="action-btn quiz-btn improved"
                      onClick={() => navigate('/quizzes')}
                    >
                      <i className="fas fa-question-circle"/> Quiz
                    </button>
                    <button
                      className="action-btn flashcard-btn improved"
                      onClick={() => navigate('/flashcards')}
                    >
                      <i className="fas fa-clone"/> Flashcards
                    </button>
                    <button
                      className="action-btn chat-btn improved"
                      onClick={() => navigate('/chatbot')}
                    >
                      <i className="fas fa-comments"/> Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Edit Modal */}
        {editLectureModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Lecture</h2>
              <form onSubmit={handleEditLectureSubmit}>
                <label className="modal-label">Lecture&nbsp;Name
                  <input
                    type="text"
                    value={editLectureName}
                    onChange={e => setEditLectureName(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setEditLectureModalOpen(false)}
                  >
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
    </div>
  );
};

export default CourseDetail;
