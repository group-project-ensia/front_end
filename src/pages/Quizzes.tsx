import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quizzes.css';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const sampleQuestions: Question[] = [
  {
    question: 'What does HTML stand for?',
    options: [
      'Hyperlinks and Text Markup Language',
      'Home Tool Markup Language',
      'HyperText Markup Language',
      'Hyper Transfer Markup Language',
    ],
    correctAnswer: 'HyperText Markup Language',
  },
  {
    question: 'Which language is used for styling web pages?',
    options: ['HTML', 'JQuery', 'CSS', 'XML'],
    correctAnswer: 'CSS',
  },
  {
    question: 'Which is not a JavaScript Framework?',
    options: ['Python Script', 'JQuery', 'Django', 'NodeJS'],
    correctAnswer: 'Django',
  },
];

const Quizzes: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizSidebarOpen, setQuizSidebarOpen] = useState(true);
  const [answers, setAnswers] = useState<
    { question: string; selected: string; correct: string }[]
  >([]);
  const navigate = useNavigate();

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    const currentQuestion = sampleQuestions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        selected: selectedOption,
        correct: currentQuestion.correctAnswer,
      },
    ]);

    if (currentIndex < sampleQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption('');
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption('');
    setScore(0);
    setAnswers([]);
    setShowResult(false);
  };
 

  const progress = ((currentIndex + 1) / sampleQuestions.length) * 100;

  return (
    <div className="quiz-page-wrapper">
      {/* Quiz-specific sidebar with unique class names */}
      <aside className={`quiz-app-sidebar ${quizSidebarOpen ? 'open' : 'closed'}`}>
        <div className="quiz-sidebar-header">
          <button
            className="quiz-sidebar-toggle"
            onClick={() => setQuizSidebarOpen(!quizSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          
        </div>
        <nav className="quiz-sidebar-nav">
          <ul>
            <li onClick={() => navigate('/classroom')}>
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
              data-tooltip="Profile"
              onClick={() => navigate('/profile')}
              className={window.location.pathname.startsWith('/profile') ? 'active' : ''}
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
              <span className="nav-text">Logout</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="quiz-main-content">
        <div className="quiz-container">
          {/* Rest of your quiz content remains exactly the same */}
          <h2 className="quiz-title">Course Quiz</h2>

          <div className="quiz-bar-wrapper">
            <div className="quiz-progress-bar">
              <div className="quiz-progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {!showResult ? (
            <div className="quiz-card">
              <h3 className="quiz-question">
                {sampleQuestions[currentIndex].question}
              </h3>
              <div className="quiz-options">
                {sampleQuestions[currentIndex].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={`quiz-option ${
                      selectedOption === option ? 'selected' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                className="quiz-next vibrant"
                onClick={handleNext}
                disabled={!selectedOption}
              >
                {currentIndex === sampleQuestions.length - 1
                  ? 'Submit'
                  : 'Next'}
              </button>
            </div>
          ) : (
            <div className="quiz-result">
              <h3>
                Your Score: {score} / {sampleQuestions.length}
              </h3>

              <div className="quiz-feedback">
                {answers.map((ans, idx) => (
                  <div key={idx} className="feedback-card">
                    <p>
                      <strong>Q{idx + 1}:</strong> {ans.question}
                    </p>
                    <p
                      className={
                        ans.selected === ans.correct ? 'correct' : 'incorrect'
                      }
                    >
                      Your answer: {ans.selected}
                    </p>
                    {ans.selected !== ans.correct && (
                      <p className="correct-answer">
                        Correct answer: {ans.correct}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <button className="quiz-restart vibrant" onClick={restartQuiz}>
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;