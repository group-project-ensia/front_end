import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import './CourseDetail.css';

// --- TypeScript Interfaces ---
interface Lecture {
  _id:        string;
  title:      string;
  date:       string;
  duration?:  string;
  videoUrl?:  string;
  notes?:     string;
  thumbnailUrl: string;
  createdAt?: string;
}

interface Course {
  _id:      string;
  name:     string;
  teacher:  string;
  semester: string;
}

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate      = useNavigate();
  const userId        = '681e66a9a1f352628d8ee50a'; // replace with auth context

  const [chatLoadingId, setChatLoadingId] = useState<string | null>(null);

  //flashcards 
  const [flashcardLoadingId, setFlashcardLoadingId] = useState<string | null>(null);
  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data state
  const [course, setCourse]               = useState<Course | null>(null);
  const [lectures, setLectures]           = useState<Lecture[]>([]);
  const [lecturesState, setLecturesState] = useState<Lecture[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  // Modal & UI state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile]           = useState<File | null>(null);
  const [uploadLectureName, setUploadLectureName] = useState('');

  const [lectureMenuOpenId, setLectureMenuOpenId] = useState<string | null>(null);

  const [editLectureModalOpen, setEditLectureModalOpen] = useState(false);
  const [editLectureId, setEditLectureId]               = useState<string | null>(null);
  const [editLectureName, setEditLectureName]           = useState('');

  // ---- NEW: video-summary state ----
  const [showSummarizeModal, setShowSummarizeModal] = useState(false);
  const [videoUrlInput, setVideoUrlInput]           = useState('');

  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [currentSummary, setCurrentSummary] = useState('');

  // Fetch course & lectures from backend
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token') || '';
    const headers: Record<string,string> = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const fetchCourse = async () => {
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}`,
        { headers }
      );
      if (!res.ok) throw new Error('Failed to load course');
      return res.json() as Promise<Course>;
    };

    const fetchLectures = async () => {
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}/lectures`,
        { headers }
      );
      if (!res.ok) throw new Error('Failed to load lectures');
      return res.json() as Promise<Lecture[]>;
    };

    Promise.all([fetchCourse(), fetchLectures()])
      .then(([courseData, lecData]) => {
        setCourse(courseData);
        setLectures(lecData);
        setLecturesState(lecData);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [courseId]);

  // DELETE lecture
  const handleDeleteLecture = async (id: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}/lectures/${id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Delete failed');
      setLecturesState(prev => prev.filter(l => l._id !== id));
      setLectureMenuOpenId(null);
    } catch (e) {
      console.error(e);
    }
  };

  // START edit
  const handleEditLecture = (id: string) => {
    const lec = lecturesState.find(l => l._id === id);
    if (!lec) return;
    setEditLectureId(id);
    setEditLectureName(lec.title);
    setEditLectureModalOpen(true);
  };

  // SUBMIT edit
  const handleEditLectureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLectureId) return;
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}/lectures/${editLectureId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: editLectureName }),
        }
      );
      if (!res.ok) throw new Error('Update failed');
      const updated: Lecture = await res.json();
      setLecturesState(prev =>
        prev.map(l => (l._id === updated._id ? updated : l))
      );
      setEditLectureModalOpen(false);
      setEditLectureId(null);
    } catch (e) {
      console.error(e);
    }
  };

  // UPLOAD lecture
  const handleUploadLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadLectureName) return;
    try {
      const token = localStorage.getItem('token') || '';
      const form = new FormData();
      form.append('pdf', uploadFile);
      form.append('title', uploadLectureName);
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}/lectures`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form }
      );
      if (!res.ok) throw new Error('Upload failed');
      const newLec: Lecture = await res.json();
      setLecturesState(prev => [...prev, newLec]);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadLectureName('');
    } catch (e) {
      console.error(e);
    }
  };

  // ---- NEW: send link to VideoSummary page ----
  const handleSummarizeVideo = () => {
    if (!videoUrlInput.trim()) return;
    navigate('/video-summary', { state: { videoUrl: videoUrlInput.trim() } });
    setShowSummarizeModal(false);
    setVideoUrlInput('');
  };

  // Update summarize function
  const handleSummarize = async (lectureId: string) => {
    try {
      setSummarizingId(lectureId);
      setError(null);
      const token = localStorage.getItem('token') || '';
      
      console.log('Sending summarize request for lecture:', lectureId);
      
      // Use the correct endpoint based on the nested structure
      const res = await fetch(
        `/api/users/${userId}/courses/${courseId}/lectures/${lectureId}/summarize`,
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Summarization failed');
      }
      
      const data = await res.json();
      console.log('Received summary:', data);
      
      if (!data.summary) {
        throw new Error('No summary received from server');
      }
      
      setCurrentSummary(data.summary);
      setShowSummaryModal(true);
    } catch (err) {
      console.error('Error summarizing PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to summarize PDF');
      // Show error in modal
      setCurrentSummary('Error: ' + (err instanceof Error ? err.message : 'Failed to summarize PDF'));
      setShowSummaryModal(true);
    } finally {
      setSummarizingId(null);
    }
  };

  //flashcards
  const handleGenerateFlashcards = async (lectureId: string) => {
  try {
    setFlashcardLoadingId(lectureId); // <-- show loading
    const token = localStorage.getItem('token') || '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };


    console.log('Starting flashcard generation for lecture:', lectureId); // Debug log

    // Step 1: Get context
    const contextRes = await fetch(
      `/api/users/${userId}/courses/${courseId}/lectures/${lectureId}/context`,
      { headers }
    );
    
    if (!contextRes.ok) {
      const errorData = await contextRes.json();
      console.error('Context fetch error:', errorData); // Debug log
      throw new Error(errorData.message || 'Failed to fetch lecture context');
    }
    
    const { context } = await contextRes.json();
    console.log('Received context:', context); // Debug log

    const prompt = `Based on the following text, generate 10 flashcards. Each flashcard should contain a question and an answer. Return the result in a clean JSON array format like this: { "question": "...", "answer": "..." }, ...`;

    // Step 2: Send to bot
    const flashRes = await fetch('/api/chats/ask-bot', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: prompt,
        pdf: context,
      }),
    });

    if (!flashRes.ok) {
      const errorData = await flashRes.json();
      console.error('Flashcard generation error:', errorData); // Debug log
      throw new Error(errorData.message || 'Failed to generate flashcards');
    }
    
    let { text } = await flashRes.json();
    console.log('Raw response:', text); // Debug log

    // Clean response
    text = text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
    if (!text.endsWith(']') && !text.endsWith('}')) {
      text += ']';
    }

    console.log('Cleaned response:', text); // Debug log

    const flashcards = JSON.parse(text);
    console.log("Generated flashcards:", flashcards);
    
    // Store flashcards in state or local storage
    localStorage.setItem(`flashcards-${lectureId}`, JSON.stringify(flashcards));
    
    // Navigate to flashcards page with the generated data
    navigate('/flashcards', { state: { flashcards } });
    
  } catch (err) {
    console.error('Full error:', err); // Debug log
    alert(`Failed to generate flashcards: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    setFlashcardLoadingId(null); // <-- stop loading
  }
};

//chatbot 
const handleStartChat = async (lectureId: string) => {
  try {
    setChatLoadingId(lectureId); // Show loading state
    const token = localStorage.getItem('token') || '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    console.log('Starting chat preparation for lecture:', lectureId);

    // Step 1: Get context
    const contextRes = await fetch(
      `/api/users/${userId}/courses/${courseId}/lectures/${lectureId}/context`,
      { headers }
    );
    
    if (!contextRes.ok) {
      const errorData = await contextRes.json();
      console.error('Context fetch error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch lecture context');
    }
    
    const { context } = await contextRes.json();
    console.log('Received context:', context);

    // Step 2: Initialize chat session
    const prompt = `You are a helpful assistant trained to answer questions based on the following content:\n\n${context}\n\nNow, feel free to ask me any questions related to the above text.`;

    const chatRes = await fetch('/api/chats', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        courseId,
        messages: [{ role: 'user', content: prompt }]
      }),
    });

    if (!chatRes.ok) {
      const errorData = await chatRes.json();
      console.error('Chat initialization error:', errorData);
      throw new Error(errorData.message || 'Failed to initialize chat');
    }
    
    const { _id: chatId } = await chatRes.json();
    console.log('Created new chat session:', chatId);

    // Store initial chat data
    const initialMessage = { 
      role: 'user' as const, 
      text: prompt, 
      timestamp: new Date().toLocaleTimeString() 
    };
    
    localStorage.setItem('chatId', chatId);
    localStorage.setItem('chatMessages', JSON.stringify([initialMessage]));
    
    // Navigate to chatbot with the prepared data
    navigate('/chatbot');
    
  } catch (err) {
    console.error('Full error:', err);
    alert(`Failed to prepare chat: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    setChatLoadingId(null); // Stop loading
  }
};

  if (loading) return <div className="loading">Loading...</div>;
  if (error)   return <div className="error">{error}</div>;
  if (!course) return <div className="no-course">Course not found</div>;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>        
        <div className="sidebar-header">
          <button
            className="menu-toggle"
            title="Toggle menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate('/classroom')}><i className="fas fa-graduation-cap"/><span>Classes</span></li>
            <li onClick={() => navigate('/calendar')}><i className="fas fa-calendar-alt"/><span>Calendar</span></li>
            <li onClick={() => navigate('/todo')}><i className="fas fa-tasks"/><span>To-do</span></li>
            <li onClick={() => navigate('/profile')}><i className="fas fa-user"/><span>Profile</span></li>
            <li style={{ marginTop: 'auto' }} onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}><i className="fas fa-sign-out-alt"/><span>Logout</span></li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Header */}
        <div className="course-visual-header small flex-header">
          <h1 className="course-detail-title small">{course.name}</h1>
          <div className="action-buttons-row">
            <button
              className="upload-lecture-btn consistent"
              onClick={() => setShowUploadModal(true)}
            >
              <i className="fas fa-upload"/> Upload&nbsp;Lecture
            </button>
            {/* NEW button to open summarise modal */}
            <button
              className="upload-lecture-btn consistent"
              onClick={() => setShowSummarizeModal(true)}
            >
              <i className="fas fa-video"/> Transcript&nbsp;Video
            </button>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Upload Lecture</h2>
              <form onSubmit={handleUploadLecture}>
                <label className="modal-label">PDF&nbsp;File
                  <input
                    type="file"
                    accept="application/pdf"
                    required
                    onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  />
                </label>
                <label className="modal-label">Lecture&nbsp;Name
                  <input
                    type="text"
                    value={uploadLectureName}
                    onChange={e => setUploadLectureName(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-upload-btn consistent">
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Summarize Modal */}
        {showSummarizeModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Summarize&nbsp;Video</h2>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSummarizeVideo();
                }}
              >
                <label className="modal-label">Video&nbsp;URL
                  <input
                    type="url"
                    value={videoUrlInput}
                    onChange={e => setVideoUrlInput(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setShowSummarizeModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-upload-btn consistent">
                    Summarize
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lectures Grid */}
        <main className="lectures-container improved">
          <h2 className="lectures-title improved">Lectures</h2>
          <div className="lectures-grid improved">
            {lecturesState.map(lec => (
              <div key={lec._id} className="lecture-card improved">
                <div className="lecture-card-menu-container top-right">
                  <button
                    className="lecture-card-menu-btn"
                    title="Lecture options menu"
                    onClick={e => {
                      e.stopPropagation();
                      setLectureMenuOpenId(
                        lec._id === lectureMenuOpenId ? null : lec._id
                      );
                    }}
                  >
                    <i className="fas fa-ellipsis-v"/>
                  </button>
                  {lectureMenuOpenId === lec._id && (
                    <div className="lecture-card-menu-dropdown">
                      <button 
                        onClick={() => handleEditLecture(lec._id)}
                        title="Edit lecture"
                      >
                        <i className="fas fa-edit"/> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteLecture(lec._id)}
                        title="Delete lecture"
                      >
                        <i className="fas fa-trash"/> Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="lecture-info improved">
                  <h3
                    className="lecture-title improved"
                    onClick={() =>
                      navigate(`/courses/${courseId}/lectures/${lec._id}`)
                    }
                  >
                    {lec.title}
                  </h3>
                  <div className="lecture-meta-row">
                    {/* metadata placeholders */}
                  </div>

                  <div className="lecture-actions improved">
                    <button 
                      className="action-btn summarize-btn improved"
                      onClick={() => handleSummarize(lec._id)}
                      disabled={summarizingId === lec._id}
                    >
                      {summarizingId === lec._id ? (
                        <span><i className="fas fa-spinner fa-spin" /> Summarizing...</span>
                      ) : (
                        <span><i className="fas fa-book-reader"/> Summarize</span>
                      )}
                    </button>
                    <button
                      className="action-btn quiz-btn improved"
                      onClick={() => navigate('/quizzes')}
                    >
                      <i className="fas fa-question-circle"/> Quiz
                    </button>
                    <button
  className="action-btn flashcard-btn improved"
  onClick={() => handleGenerateFlashcards(lec._id)}
  disabled={flashcardLoadingId === lec._id}
>
  {flashcardLoadingId === lec._id ? (
    <span><i className="fas fa-spinner fa-spin" /> Generating...</span>
  ) : (
    <span><i className="fas fa-clone" /> Flashcards</span>
  )}
</button>
                    <button 
  className="action-btn chat-btn improved"
  onClick={() => handleStartChat(lec._id)}
  disabled={chatLoadingId === lec._id}
>
  {chatLoadingId === lec._id ? (
    <i className="fas fa-spinner fa-spin" />
  ) : (
    <i className="fas fa-comments" />
  )}
  Chat
</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Summary Modal */}
        {showSummaryModal && (
          <div className="modal-overlay">
            <div className="modal-content summary-modal">
              <h2>PDF Summary</h2>
              <div className="summary-content latex-content">
                {renderLatexContent(currentSummary)}
              </div>
              <button
                title="Close summary modal"
                className="close-btn"
                onClick={() => setShowSummaryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editLectureModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Lecture</h2>
              <form onSubmit={handleEditLectureSubmit}>
                <label className="modal-label">Lecture&nbsp;Name
                  <input
                    type="text"
                    value={editLectureName}
                    onChange={e => setEditLectureName(e.target.value)}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="modal-cancel-btn"
                    onClick={() => setEditLectureModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="modal-upload-btn consistent improved">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const renderLatexContent = (content: string) => {
  // Check if content contains a full LaTeX document
  if (content.includes('\\documentclass') && content.includes('\\begin{document}')) {
    // Extract just the content between \begin{document} and \end{document}
    const documentMatch = content.match(/\\begin{document}([\s\S]*?)\\end{document}/);
    if (documentMatch && documentMatch[1]) {
      content = documentMatch[1].trim();
    }
  }

  // Split content into sections for better parsing
  const sections: JSX.Element[] = [];
  let currentSection: JSX.Element[] = [];
  let inItemize = false;
  let inEnumerate = false;
  let sectionKey = 0;

  // Process each line
  content.split('\n').forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines or LaTeX document commands
    if (!trimmedLine || 
        trimmedLine.startsWith('\\documentclass') || 
        trimmedLine.startsWith('\\usepackage') || 
        trimmedLine === '\\begin{document}' || 
        trimmedLine === '\\end{document}') {
      return;
    }

    // Handle LaTeX section headings
    if (trimmedLine.startsWith('\\section{')) {
      // Push current section if not empty
      if (currentSection.length > 0) {
        sections.push(<div key={`section-${sectionKey++}`}>{currentSection}</div>);
        currentSection = [];
      }
      
      const titleMatch = trimmedLine.match(/\\section{(.*?)}/);
      const title = titleMatch ? titleMatch[1] : '';
      currentSection.push(<h2 key={`title-${index}`} className="latex-section">{title}</h2>);
      return;
    }

    // Handle LaTeX subsection headings
    if (trimmedLine.startsWith('\\subsection{')) {
      const titleMatch = trimmedLine.match(/\\subsection{(.*?)}/);
      const title = titleMatch ? titleMatch[1] : '';
      currentSection.push(<h3 key={`subtitle-${index}`} className="latex-subsection">{title}</h3>);
      return;
    }

    // Handle Markdown-style section headings (like **Title**)
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      const title = trimmedLine.replace(/^\*\*|\*\*$/g, '');
      
      // If it looks like a main section (no number prefix)
      if (!title.match(/^\d+\./)) {
        if (currentSection.length > 0) {
          sections.push(<div key={`section-${sectionKey++}`}>{currentSection}</div>);
          currentSection = [];
        }
        currentSection.push(<h2 key={`title-${index}`} className="latex-section">{title}</h2>);
      } else {
        // This is likely a numbered list item with bold title
        currentSection.push(<h4 key={`numbered-title-${index}`} className="latex-item-title">{title}</h4>);
      }
      return;
    }

    // Handle Markdown-style numbered items (like "1. **Title**: content")
    const numberedItemMatch = trimmedLine.match(/^(\d+\.\s*)(.*)/);
    if (numberedItemMatch) {
      const [, number, content] = numberedItemMatch;
      // Handle bold title within item if present
      const titleMatch = content.match(/^\*\*(.+?)\*\*:\s*(.*)/);
      
      if (titleMatch) {
        const [, title, description] = titleMatch;
        currentSection.push(
          <div key={`numbered-item-${index}`} className="latex-numbered-item">
            <span className="latex-item-number">{number}</span>
            <strong>{title}: </strong>
            <span>{description}</span>
          </div>
        );
      } else {
        currentSection.push(
          <div key={`numbered-item-${index}`} className="latex-numbered-item">
            <span className="latex-item-number">{number}</span>
            <span>{content}</span>
          </div>
        );
      }
      return;
    }

    // Handle LaTeX itemize environment
    if (trimmedLine === '\\begin{itemize}') {
      inItemize = true;
      currentSection.push(<ul key={`list-${index}`} className="latex-itemize">{[]}</ul>);
      return;
    } else if (trimmedLine === '\\end{itemize}') {
      inItemize = false;
      return;
    }

    // Handle LaTeX enumerate environment
    if (trimmedLine === '\\begin{enumerate}') {
      inEnumerate = true;
      currentSection.push(<ol key={`enum-${index}`} className="latex-enumerate">{[]}</ol>);
      return;
    } else if (trimmedLine === '\\end{enumerate}') {
      inEnumerate = false;
      return;
    }

    // Handle list items
    if (trimmedLine.startsWith('\\item') && (inItemize || inEnumerate)) {
      const itemContent = trimmedLine.substring(5).trim();
      const listEl = currentSection[currentSection.length - 1] as JSX.Element;
      
      if (listEl && (listEl.type === 'ul' || listEl.type === 'ol')) {
        const newChildren = [...(listEl.props.children || []), 
          <li key={`item-${index}`}>{parseLatexInline(itemContent)}</li>];
        
        currentSection[currentSection.length - 1] = React.cloneElement(
          listEl, { children: newChildren }
        );
      }
      return;
    }

    // Handle math environments
    if (trimmedLine.startsWith('$$') || trimmedLine.startsWith('\\[')) {
      const mathContent = trimmedLine
        .replace(/^\$\$(.*)\$\$$/, '$1')
        .replace(/^\\\[(.*)\\\]$/, '$1')
        .trim();
      
      try {
        currentSection.push(<BlockMath key={`math-${index}`} math={mathContent} />);
      } catch (e) {
        console.error('Error rendering BlockMath:', e);
        currentSection.push(<pre key={`math-error-${index}`}>{mathContent}</pre>);
      }
      return;
    }

    // Handle regular paragraphs with potential inline math
    if (!inItemize && !inEnumerate) {
      currentSection.push(<p key={`p-${index}`}>{parseLatexInline(trimmedLine)}</p>);
    }
  });

  // Add the last section
  if (currentSection.length > 0) {
    sections.push(<div key={`section-${sectionKey}`}>{currentSection}</div>);
  }

  return sections;
}

// Helper function to parse inline LaTeX within text
const parseLatexInline = (text: string) => {
  // If no math delimiters, return as is
  if (!text.includes('$') && !text.includes('\\(')) {
    return text;
  }

  // Split by math delimiters and render each part
  const parts = [];
  let inMath = false;
  let mathContent = '';
  let textContent = '';
  let partKey = 0;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '$' || (text[i] === '\\' && text[i+1] === '(')) {
      // Found start/end of math
      if (inMath) {
        // End of math
        inMath = false;
        try {
          parts.push(<InlineMath key={`inline-${partKey++}`} math={mathContent} />);
        } catch (e) {
          console.error('Error rendering InlineMath:', e);
          parts.push(<code key={`inline-error-${partKey++}`}>{mathContent}</code>);
        }
        mathContent = '';
        
        // Skip the closing delimiter
        if (text[i] === '\\') i++; // Skip ) in \)
      } else {
        // Start of math
        inMath = true;
        if (textContent) {
          parts.push(<span key={`text-${partKey++}`}>{textContent}</span>);
          textContent = '';
        }
        
        // Skip the opening delimiter
        if (text[i] === '\\') i++; // Skip ( in \(
      }
    } else if (inMath) {
      mathContent += text[i];
    } else {
      textContent += text[i];
    }
  }

  // Add any remaining text
  if (textContent) {
    parts.push(<span key={`text-${partKey++}`}>{textContent}</span>);
  }

  return <>{parts}</>;
}

export default CourseDetail;
