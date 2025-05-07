import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Classroom.css';

// Mock user data (replace with real data from backend or context)
const mockUser = {
  email: 'user@example.com',
  password: '********',
  schoolLevel: 'High School',
  speciality: 'Mathematics',
  name: 'John Doe',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 38px 10px 38px',
  border: '1.5px solid #d1d5db',
  borderRadius: 10,
  fontSize: 16,
  marginTop: 4,
  background: '#f9fafb',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  outline: 'none',
};
const inputFocusStyle: React.CSSProperties = {
  borderColor: '#4f46e5',
  boxShadow: '0 0 0 2px rgba(26, 115, 232, 0.13)',
  background: '#fff',
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: 12,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#4f46e5',
  fontSize: 18,
  opacity: 0.85,
};

const Profile: React.FC = () => {
  const [user, setUser] = useState(mockUser);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [schoolLevel, setSchoolLevel] = useState(user.schoolLevel);
  const [speciality, setSpeciality] = useState(user.speciality);
  const [name, setName] = useState(user.name);
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [focusField, setFocusField] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const navigate = useNavigate();

  const handleEdit = () => {
    setEditMode(true);
    setEmail(user.email);
    setPassword('');
    setSchoolLevel(user.schoolLevel);
    setSpeciality(user.speciality);
    setName(user.name);
    setMessage('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API
    setUser({
      email,
      password: password ? '********' : user.password,
      schoolLevel,
      speciality,
      name,
    });
    setEditMode(false);
    setMessage('Profile updated (not really, this is a placeholder).');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Connect to backend API for account deletion
      setDeleteMessage('Account deleted (not really, this is a placeholder).');
    }
  };

  return (
    <div className="app-container classroom-bg">
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
            <li onClick={() => navigate('/classroom')} data-tooltip="Classes" style={{ cursor: 'pointer' }}>
              <i className="fas fa-graduation-cap"></i>
              <span className="nav-text">Classes</span>
            </li>
            <li onClick={() => navigate('/calendar')} data-tooltip="Calendar" style={{ cursor: 'pointer' }}>
              <i className="fas fa-calendar-alt"></i>
              <span className="nav-text">Calendar</span>
            </li>
            <li onClick={() => navigate('/todo')} data-tooltip="To-do" style={{ cursor: 'pointer' }}>
              <i className="fas fa-tasks"></i>
              <span className="nav-text">To-do</span>
            </li>
            <li data-tooltip="Profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer', background: '#e8f0fe', color: '#4f46e5', fontWeight: 600 }}>
              <i className="fas fa-user"></i>
              <span className="nav-text">Profile</span>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="main-content">
        <header className="classroom-header">
          <h1 style={{ margin: 0 }}>My Profile</h1>
        </header>
        <div style={{ maxWidth: 420, margin: '40px auto', borderRadius: 20, boxShadow: '0 2px 16px #0001', background: '#fff', padding: 0, overflow: 'hidden' }}>
          {/* Gradient header with avatar */}
          <div style={{
            background: 'linear-gradient(90deg, #4f46e5 60%, #06b6d4 100%)',
            padding: '2.2rem 1.5rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '0 0 2.5rem 2.5rem',
            color: '#fff',
            position: 'relative',
          }}>
            <div style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
              color: '#4f46e5',
              boxShadow: '0 2px 12px rgba(79,70,229,0.09)',
              marginBottom: 12,
              border: '4px solid #fff',
            }}>
              {getInitials(user.name)}
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-user" style={{ fontSize: 20, marginRight: 4 }}></i>
              {user.name}
            </div>
            <div style={{ fontSize: 15, opacity: 0.92, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fas fa-envelope" style={{ fontSize: 16, marginRight: 2 }}></i>
              {user.email}
            </div>
          </div>
          <div style={{ padding: 32, background: editMode ? '#f8f9fa' : '#fff', borderRadius: editMode ? '0 0 20px 20px' : undefined, transition: 'background 0.3s' }}>
            {!editMode ? (
              <>
                <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-graduation-cap" style={{ color: '#4f46e5', fontSize: 17 }}></i>
                    <span style={{ color: '#4f46e5', fontWeight: 600 }}>School Level:</span> {user.schoolLevel}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fas fa-book" style={{ color: '#4f46e5', fontSize: 17 }}></i>
                    <span style={{ color: '#4f46e5', fontWeight: 600 }}>Speciality:</span> {user.speciality}
                  </div>
                </div>
                <button className="create-class-btn vibrant" style={{ width: '100%', fontSize: 18 }} onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete} style={{ width: '100%', marginTop: 18, background: '#f43f5e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 12px rgba(244,63,94,0.09)', transition: 'background 0.18s, box-shadow 0.18s', cursor: 'pointer' }}>
                  <i className="fas fa-trash" style={{ marginRight: 8 }}></i> Delete Account
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: 'fadeIn 0.5s' }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#4f46e5', marginBottom: 8, textAlign: 'center' }}>Edit Profile</div>
                <div style={{ height: 1, background: '#e5e7eb', margin: '0 0 10px 0', borderRadius: 2 }} />
                {/* Name */}
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-user" style={iconStyle}></i>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Full Name"
                    style={{ ...inputStyle, ...(focusField === 'name' ? inputFocusStyle : {}) }}
                    onFocus={() => setFocusField('name')}
                    onBlur={() => setFocusField('')}
                  />
                </div>
                {/* Email */}
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-envelope" style={iconStyle}></i>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    style={{ ...inputStyle, ...(focusField === 'email' ? inputFocusStyle : {}) }}
                    onFocus={() => setFocusField('email')}
                    onBlur={() => setFocusField('')}
                  />
                </div>
                {/* Password */}
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-lock" style={iconStyle}></i>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    style={{ ...inputStyle, ...(focusField === 'password' ? inputFocusStyle : {}) }}
                    onFocus={() => setFocusField('password')}
                    onBlur={() => setFocusField('')}
                  />
                </div>
                {/* School Level */}
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-graduation-cap" style={iconStyle}></i>
                  <input
                    type="text"
                    value={schoolLevel}
                    onChange={e => setSchoolLevel(e.target.value)}
                    required
                    placeholder="School Level"
                    style={{ ...inputStyle, ...(focusField === 'schoolLevel' ? inputFocusStyle : {}) }}
                    onFocus={() => setFocusField('schoolLevel')}
                    onBlur={() => setFocusField('')}
                  />
                </div>
                {/* Speciality */}
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-book" style={iconStyle}></i>
                  <input
                    type="text"
                    value={speciality}
                    onChange={e => setSpeciality(e.target.value)}
                    required
                    placeholder="Speciality"
                    style={{ ...inputStyle, ...(focusField === 'speciality' ? inputFocusStyle : {}) }}
                    onFocus={() => setFocusField('speciality')}
                    onBlur={() => setFocusField('')}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button type="submit" className="create-class-btn vibrant" style={{ flex: 1, fontSize: 17 }}>Save</button>
                  <button type="button" className="join-class-btn vibrant" style={{ flex: 1, fontSize: 17 }} onClick={handleCancel}>Cancel</button>
                </div>
                <button onClick={handleDelete} style={{ width: '100%', marginTop: 18, background: '#f43f5e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 12px rgba(244,63,94,0.09)', transition: 'background 0.18s, box-shadow 0.18s', cursor: 'pointer' }}>
                  <i className="fas fa-trash" style={{ marginRight: 8 }}></i> Delete Account
                </button>
              </form>
            )}
            {message && <div style={{ marginTop: 16, color: '#4f46e5', textAlign: 'center' }}>{message}</div>}
            {deleteMessage && <div style={{ marginTop: 12, color: '#f43f5e', textAlign: 'center', fontWeight: 600 }}>{deleteMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 