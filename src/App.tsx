import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './pages/Navbar';
import Hero from './pages/Hero';
import Features from './pages/Features';
import Classroom from './pages/Classroom';
import CourseDetail from './pages/CourseDetail';
import Flashcards from './pages/flashcards'; // adjust path if needed
import Quizzes from './pages/Quizzes';
import Todo from './pages/ToDo';

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
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/todo" element={<Todo />} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
