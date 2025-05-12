import React, { useEffect, useState } from 'react';
import './Classroom.css';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';

/* ─────────────────────────────────────────────── */
// Temporary hard-coded user ID; replace with auth context when available
const USER_ID = '681e66a9a1f352628d8ee50a';
const API_BASE = `/api/users/${USER_ID}/courses`;

const RANDOM_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 60%, #06b6d4 100%)',
  'linear-gradient(135deg, #f59e42 40%, #f43f5e 100%)',
  'linear-gradient(135deg, #06d6a0 60%, #ffd166 100%)',
  'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)',
  'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
  'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
];

// --- Data Interfaces ---
interface ChatMessage {
  _id: string;
  sender: 'user' | 'bot';
  message: string;
  createdAt: string;
}

interface Flashcard {
  _id: string;
  question: string;
  answer: string;
}

interface Lecture {
  _id: string;
  title: string;
  pdf: string;
  summary: string;
  chats: ChatMessage[];
  flashcards: Flashcard[];
  createdAt: string;
  updatedAt: string;
}

interface Course {
  _id: string;
  title: string;
  lecturer: string;
  lectures: Lecture[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;    // UI only
  gradient?: string;    // UI only
}

const Classroom: React.FC = () => {
  const navigate = useNavigate();

  // ── State ─────────────────────────────────
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLecturer, setNewLecturer] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Edit modal state
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLecturer, setEditLecturer] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  // ── Helpers ───────────────────────────────
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(await res.text());
      const data: Course[] = await res.json();

      const decorated = data.map((c, idx) => ({
        ...c,
        imageUrl: '',
        gradient: RANDOM_GRADIENTS[idx % RANDOM_GRADIENTS.length],
      }));
      setCourses(decorated);
    } catch (err) {
      alert(`Failed to load courses: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, lecturer: newLecturer }),
      });
      if (!res.ok) throw new Error(await res.text());
      const created: Course = await res.json();

      setCourses(list => [
        ...list,
        {
          ...created,
          imageUrl: newImageUrl || undefined,
          gradient: newImageUrl
            ? undefined
            : RANDOM_GRADIENTS[list.length % RANDOM_GRADIENTS.length],
        },
      ]);
    } catch (err) {
      alert(`Create failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async () => {
    if (!editId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, lecturer: editLecturer }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: Course = await res.json();

      setCourses(list =>
        list.map(c =>
          c._id === editId
            ? { ...updated, imageUrl: editImageUrl || c.imageUrl, gradient: c.gradient }
            : c
        )
      );
    } catch (err) {
      alert(`Update failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setCourses(list => list.filter(c => c._id !== id));
    } catch (err) {
      alert(`Delete failed: ${err}`);
    } finally {
      setLoading(false);
      setMenuOpenId(null);
    }
  };

  // ── Effects ───────────────────────────────
  useEffect(() => {
    fetchCourses();
  }, []);

  // ── Derived ───────────────────────────────
  const filtered = courses.filter(c =>
    `${c.title} ${c.lecturer}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Handlers ─────────────────────────────
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLecturer) return;
    createCourse().then(() => {
      setShowCreateModal(false);
      setNewTitle('');
      setNewLecturer('');
      setNewImageUrl('');
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCourse().then(() => {
      setEditModalOpen(false);
      setEditId(null);
      setEditTitle('');
      setEditLecturer('');
      setEditImageUrl('');
    });
  };

  // ── Render ───────────────────────────────
  return (
    <div className="app-container classroom-bg">
      {/* SIDEBAR */}
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
            <li className="active">
              <i className="fas fa-graduation-cap" />
              <span>Classes</span>
            </li>
            <li onClick={() => navigate('/calendar')}>
              <i className="fas fa-calendar-alt" />
              <span>Calendar</span>
            </li>
            <li onClick={() => navigate('/todo')}>
              <i className="fas fa-tasks" />
              <span>To-do</span>
            </li>
            <li onClick={() => navigate('/profile')}>
              <i className="fas fa-user" />
              <span>Profile</span>
            </li>
            <li
              style={{ marginTop: 'auto' }}
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
            >
              <i className="fas fa-sign-out-alt" />
              <span>Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <header className="classroom-header">
          <div className="header-left">
            <h1>My Classroom</h1>
            <div className="search-container">
              <button className="search-btn" aria-label="Search">
                <i className="fas fa-search" />
              </button>
              <input
                type="text"
                placeholder="Search classes…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          <div className="header-right">
            <button
              className="create-class-btn vibrant"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus" /> Create Class
            </button>
            <UserAvatar name="John Doe" size={40} />
          </div>
        </header>

        <main className="classroom-content">
          <div className="class-cards-container">
            {filtered.map((c, idx) => {
              const initials = c.title
                .split(' ')
                .map(w => w[0]?.toUpperCase() || '')
                .slice(0, 2)
                .join('');
              const circleColor = RANDOM_GRADIENTS[idx % RANDOM_GRADIENTS.length];

              return (
                <div
                  key={c._id}
                  className="class-card modern-card animate-in"
                  style={{ animationDelay: `${0.1 * idx}s` }}
                  onClick={e => {
                    if (
                      (e.target as HTMLElement).closest('.course-card-menu-btn') ||
                      (e.target as HTMLElement).closest('.course-card-menu-dropdown')
                    ) return;
                    navigate(`/course/${c._id}`);
                  }}
                >
                  <div className="course-card-menu-container top-right">
                    <button
                      className="course-card-menu-btn"
                      onClick={e => {
                        e.stopPropagation();
                        setMenuOpenId(c._id === menuOpenId ? null : c._id);
                      }}
                      aria-label="Open course menu"
                    >
                      <i className="fas fa-ellipsis-v" />
                    </button>
                    {menuOpenId === c._id && (
                      <div className="course-card-menu-dropdown" onClick={e => e.stopPropagation()}>                        
                        <button
                          onClick={() => {
                            setEditId(c._id);
                            setEditTitle(c.title);
                            setEditLecturer(c.lecturer);
                            setEditImageUrl(c.imageUrl || '');
                            setEditModalOpen(true);
                          }}
                        >
                          <i className="fas fa-edit" /> Edit
                        </button>
                        <button onClick={() => deleteCourse(c._id)}>
                          <i className="fas fa-trash" /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-top-center">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.title} className="class-avatar-img" />
                    ) : (
                      <div
                        className="class-avatar-circle"
                        style={{ background: circleColor }}
                      >
                        {initials}
                      </div>
                    )}
                  </div>

                  <div className="card-info">
                    <h3 className="class-title">{c.title}</h3>
                    <div className="teacher-avatar-row">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          c.lecturer
                        )}&background=4f46e5&color=fff&size=32`}
                        alt={c.lecturer}
                        className="teacher-img"
                      />
                      <span className="teacher-name">{c.lecturer}</span>
                    </div>
                  </div>

                  <button
                    className="view-details-btn modern-btn"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/course/${c._id}`);
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

      {loading && (
        <div className="loading-overlay">
          <div className="loader" />
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">            
            <button
              className="modal-close"
              onClick={() => setShowCreateModal(false)}
            >
              &times;
            </button>
            <h2>Create a New Class</h2>
            <form onSubmit={handleCreateSubmit} className="create-class-form">
              <label>Course Title*</label>
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
              <label>Lecturer*</label>
              <input
                value={newLecturer}
                onChange={e => setNewLecturer(e.target.value)}
                required
              />
              <label>Image URL (optional)</label>
              <input
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
              />
              <button className="create-class-btn vibrant" type="submit">
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Course</h2>
            <form onSubmit={handleEditSubmit} className="edit-class-form">
              <label>Course Title*</label>
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                required
              />
              <label>Lecturer*</label>
              <input
                value={editLecturer}
                onChange={e => setEditLecturer(e.target.value)}
                required
              />
              <label>Image URL (optional)</label>
 <input value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} />
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="modal-upload-btn consistent">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
