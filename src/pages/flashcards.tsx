import React, { useState } from 'react';
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

  const currentCard = flashcardsData[currentIndex];

  const handleFlip = () => setFlipped((prev) => !prev);
  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcardsData.length);
  };

  return (
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
  );
};

export default Flashcards;
