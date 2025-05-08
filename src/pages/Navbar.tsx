import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <h1>StudyMate</h1>
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search study sets..." />
        </div>
        <div className="nav-menu">
          <a href="/" className="nav-link">Home</a>
          <a href="/explore" className="nav-link">Explore</a>
          <a href="/my-sets" className="nav-link">My Study Sets</a>
          <a href="/ai-assistant" className="nav-link">AI Study Assistant</a>
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
