import React from 'react';
import './Features.css';

const Features: React.FC = () => {
  const features = [
    {
      title: 'Flashcards & Quizzes',
      description: 'Create and share interactive flashcards for effective learning',
      icon: '📚'
    },
    {
      title: 'AI-Powered Learning',
      description: 'Get smart study recommendations and chat with our AI assistant',
      icon: '🤖'
    },
    {
      title: 'Task Management',
      description: 'Plan and schedule your study sessions efficiently',
      icon: '📅'
    },
    {
      title: 'Collaborative Learning',
      description: 'Study with friends and share resources in real-time',
      icon: '👥'
    }
  ];

  return (
    <section className="features">
      <div className="features-container">
        <h2>Why Choose StudyMate?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
