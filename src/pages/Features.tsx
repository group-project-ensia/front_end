import React, { useEffect, useState } from 'react';
import './Features.css';

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

const Features: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    setTimeout(() => setVisible(true), 200);
  }, []);

  return (
    <section className="features dark-features-bg">
      <div className="features-container">
        <h2 className="dark-features-title">Why Choose StudyMate?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card dark-feature-card${visible ? ' fade-up' : ''}${visible && index % 2 === 1 ? ' slide-right' : ''}`}
              style={{ transitionDelay: visible ? `${index * 120 + 150}ms` : '0ms' }}
            >
              <div className="feature-icon dark-feature-icon">{feature.icon}</div>
              <h3 className="dark-feature-card-title">{feature.title}</h3>
              <p className="dark-feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
