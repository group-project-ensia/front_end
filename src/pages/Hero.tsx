import React, { useEffect, useRef } from 'react';
import './Hero.css';

const NUM_STARS = 80;
const STAR_SPEED = 0.3;

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    function randomStar() {
      // 3D starfield effect
      return {
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
        o: 0.7 + Math.random() * 0.3,
        r: 0.8 + Math.random() * 1.6
      };
    }
    let stars = Array.from({ length: NUM_STARS }, randomStar);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let star of stars) {
        // Perspective
        let k = 128.0 / star.z;
        let sx = star.x * k + width / 2;
        let sy = star.y * k + height / 2;
        let r = star.r * k;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${star.o})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function animate() {
      for (let star of stars) {
        star.z -= STAR_SPEED;
        if (star.z < 1) {
          Object.assign(star, randomStar());
          star.z = width;
        }
      }
      draw();
      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="hero dark-hero-bg">
      <canvas ref={canvasRef} className="hero-stars-canvas"/>
      <div className="hero-content dark-hero-content">
        <h1 className="hero-title dark-hero-title">
          Unlock Your Study Potential with AI
        </h1>
        <p className="hero-subtitle dark-hero-subtitle">
          Our platform uses advanced AI to help students maximize their study efficiency, making learning smarter and more fun.
        </p>
        <button className="primary-btn dark-hero-btn" onClick={onGetStarted}>Get Started</button>
      </div>
    </section>
  );
};

export default Hero;
