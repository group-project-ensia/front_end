import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Classroom from './components/Classroom';
import CourseDetail from './components/CourseDetail';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/classroom');
  };

  return (
    <>
      <div className="gradient-bg" />
      <Navbar />
      <main>
        <Hero onGetStarted={handleGetStarted} />
        <Features />
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
