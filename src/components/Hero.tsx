import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import './Hero.css';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  useEffect(() => {
    const tl = gsap.timeline();
    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    }, '-=0.5')
    .from('.hero-buttons', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out',
    }, '-=0.5');
  }, []);

  return (
    <section className="hero">
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="hero-title gradient-text">
            Transform Your Learning
            <br />
            with AI-Powered Study Tools
          </h1>
          <p className="hero-subtitle">
            Create, share, and master your studies with our intelligent flashcards
            and personalized AI study assistant
          </p>
          <div className="hero-buttons">
            <motion.button
              className="primary-btn"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 25px var(--primary)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
            >
              Get Started
            </motion.button>
            <motion.button
              className="secondary-btn"
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 25px var(--secondary)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Study Sets
            </motion.button>
          </div>
        </motion.div>
        
      </div>
      <div className="hero-gradient" />
    </section>
  );
};

export default Hero;
