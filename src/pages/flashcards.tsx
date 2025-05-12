import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './flashcards.css';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const flashcardsData: Flashcard[] = [
  {
    id: '1',
    question: 'What is React?',
    answer: 'A JavaScript library for building user interfaces.',
  },
  {
    id: '2',
    question: 'What is TypeScript?',
    answer: 'A superset of JavaScript that adds static typing.',
  },
  {
    id: '3',
    question: 'What is a component?',
    answer: 'A reusable piece of UI in a React application.',
  },
];

const Flashcards: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const currentCard = flashcardsData[currentIndex];

  const handleFlip = () => setFlipped((prev) => !prev);
  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcardsData.length);
  };

  return (
    <div className="app-container">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
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
              onClick={() => navigate('/profile')}
              className={window.location.pathname.startsWith('/profile') ? 'active' : ''}
            >
              <i className="fas fa-user"></i>
              <span className="nav-text">Profile</span>
            </li>
            <li
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
       
      <div className="flashcards-container">
        <h2 className="flashcards-title">💡Flashcards</h2>

        <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <p>{currentCard.question}</p>
            </div>
            <div className="flashcard-back">
              <p>{currentCard.answer}</p>
            </div>
          </div>
        </div>

        <div className="flashcard-controls">
          <span className="flashcard-index">
            Card {currentIndex + 1} of {flashcardsData.length}
          </span>
          <button className="next-button vibrant" onClick={handleNext}>Next ➡️</button>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
