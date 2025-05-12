import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './pages/Navbar';
import Hero from './pages/Hero';
import Features from './pages/Features';
import Classroom from './pages/Classroom';
import CourseDetail from './pages/CourseDetail';
import Flashcards from './pages/flashcards';
import Quizzes from './pages/Quizzes';
import Todo from './pages/ToDo';
import Calendar from './pages/Calendar';
import Chatbot from './pages/Chatbot'; 
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VideoSummary from './pages/VideoSummary';
 
import 'katex/dist/katex.min.css';


function HomePage() {
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
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/video-summary" element={<VideoSummary />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;