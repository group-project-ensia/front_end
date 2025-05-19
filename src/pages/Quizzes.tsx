import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Quizzes.css';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const Quizzes: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizSidebarOpen, setQuizSidebarOpen] = useState(true);
  const [answers, setAnswers] = useState<
    { question: string; selected: string; correct: string }[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const userID = '681e66a9a1f352628d8ee50a';
        const courseID = '68231fefd0483d35afc6c3e2';
        const lectureID = '6823468bdaa7d6ba96d7b110';
        const difficulty = 'hard';

        const contextResponse = await axios.get(
          `http://localhost:5000/api/users/${userID}/courses/${courseID}/lectures/${lectureID}/context`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const extractedText = contextResponse.data.context;

        const prompt = `Based on the following text, generate 5 multiple-choice quiz questions with a ${difficulty}. Each question should have 4 choices. Put the correct answer as the first choice. Return the result in a clean JSON array format like this: { "question": "What is ...?", "choices": ["Correct answer", "Wrong 1", "Wrong 2", "Wrong 3"] }, ...]`;

        const quizRes = await axios.post(
          'http://localhost:5000/api/chats/ask-bot',
          {
            text: prompt,
            pdf: extractedText,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        let json = quizRes.data.text.trim().replace(/^```json\n/, '').replace(/\n```$/, '');
        const parsed = JSON.parse(json);

        const formattedQuestions: Question[] = parsed.map((item: any) => ({
          question: item.question,
          options: shuffleArray(item.choices),
          correctAnswer: item.choices[0], // correct answer is always the first
        }));

        setQuestions(formattedQuestions);
      } catch (err) {
        console.error('Failed to load quiz:', err);
      }
    };

    fetchQuiz();
  }, []);

  const shuffleArray = (array: string[]): string[] => {
    return array
      .map((val) => ({ val, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ val }) => val);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
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

    if (currentIndex < questions.length - 1) {
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

  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="quiz-page-wrapper">
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
          <h2 className="quiz-title">Course Quiz</h2>

          <div className="quiz-bar-wrapper">
            <div className="quiz-progress-bar">
              <div className="quiz-progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {!showResult && questions.length > 0 ? (
            <div className="quiz-card">
              <h3 className="quiz-question">{questions[currentIndex].question}</h3>
              <div className="quiz-options">
                {questions[currentIndex].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={`quiz-option ${selectedOption === option ? 'selected' : ''}`}
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
                {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          ) : showResult ? (
            <div className="quiz-result">
              <h3>
                Your Score: {score} / {questions.length}
              </h3>

              <div className="quiz-feedback">
                {answers.map((ans, idx) => (
                  <div key={idx} className="feedback-card">
                    <p>
                      <strong>Q{idx + 1}:</strong> {ans.question}
                    </p>
                    <p className={ans.selected === ans.correct ? 'correct' : 'incorrect'}>
                      Your answer: {ans.selected}
                    </p>
                    {ans.selected !== ans.correct && (
                      <p className="correct-answer">Correct answer: {ans.correct}</p>
                    )}
                  </div>
                ))}
              </div>

              <button className="quiz-restart vibrant" onClick={restartQuiz}>
                Retake Quiz
              </button>
            </div>
          ) : (
            <p>Loading quiz...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
