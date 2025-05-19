import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './flashcards.css';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const defaultFlashcards: Flashcard[] = [
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
  const [flashcards, setFlashcards] = useState<Flashcard[]>(defaultFlashcards);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Load flashcards from location state or localStorage
  useEffect(() => {
    const loadFlashcards = () => {
      try {
        // Check for passed flashcards in navigation state
        if (location.state?.flashcards) {
          setFlashcards(location.state.flashcards);
          localStorage.setItem('current-flashcards', JSON.stringify(location.state.flashcards));
          return;
        }

        // Check for saved flashcards in localStorage
        const savedFlashcards = localStorage.getItem('current-flashcards');
        if (savedFlashcards) {
          setFlashcards(JSON.parse(savedFlashcards));
          return;
        }

        // Fallback to default flashcards
        setFlashcards(defaultFlashcards);
      } catch (err) {
        console.error('Error loading flashcards:', err);
        setError('Failed to load flashcards');
        setFlashcards(defaultFlashcards);
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [location.state]);

  const currentCard = flashcards[currentIndex];

  const handleFlip = () => setFlipped((prev) => !prev);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleShuffle = () => {
    setFlipped(false);
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    localStorage.setItem('current-flashcards', JSON.stringify(shuffled));
  };

  const handleReset = () => {
    setFlipped(false);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-message">Loading flashcards...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="fas fa-bars"></i>
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
              <i className="fas fa-calendar-alt"></i>
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
                localStorage.removeItem('current-flashcards');
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
        <h2 className="flashcards-title">
          <i className="fas fa-clone"></i> Flashcards
        </h2>

        {flashcards.length === 0 ? (
          <div className="no-flashcards-message">
            <p>No flashcards available.</p>
            <button 
              className="btn-primary"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i> Go Back
            </button>
          </div>
        ) : (
          <>
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
              <button 
                className="nav-button vibrant" 
                onClick={handlePrev}
                disabled={flashcards.length <= 1}
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              
              <span className="flashcard-index">
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              
              <button 
                className="nav-button vibrant" 
                onClick={handleNext}
                disabled={flashcards.length <= 1}
              >
                Next <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <div className="flashcard-actions">
              <button 
                className="action-btn"
                onClick={handleReset}
                disabled={currentIndex === 0}
              >
                <i className="fas fa-redo"></i> Reset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Flashcards;