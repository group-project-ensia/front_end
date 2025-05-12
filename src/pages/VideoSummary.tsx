import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CourseDetail.css';

/* ---------- Optional: centralise API base ---------- */
const API_BASE = 'http://localhost:5001';

interface SummaryPayload {
  title:        string;
  transcript:   string;
  duration_sec: number;
}

const VideoSummary: React.FC = () => {
  const navigate     = useNavigate();
  const location     = useLocation();
  const videoUrl: string = location.state?.videoUrl || '';

  /* ------------ UI state ------------ */
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [summary,   setSummary]   = useState<SummaryPayload | null>(null);

  /* ------------ Fetch on mount ------------ */
  useEffect(() => {
    if (!videoUrl) {
      setError('No video URL provided');
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/transcribe`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ url: videoUrl }),
      signal:  controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error(`API error (${res.status})`);
        return res.json();
      })
      .then(data => setSummary(data))
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    /* clean-up if user leaves before it finishes */
    return () => controller.abort();
  }, [videoUrl]);

  /* ------------ Tiny spinner CSS ------------ */
  const spinner = (
    <div className="loader-container">
      <div className="spinner" />
      <p>Transcripting video… this can take a few minutes.</p>

      {/* quick inline styles to avoid editing global CSS */}
      <style>{`
        .loader-container { display:flex; flex-direction:column; align-items:center; margin-top:2rem; }
        .spinner {
          width:48px; height:48px; border:6px solid #d0d0d0; border-top-color:#3f51b5;
          border-radius:50%; animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );

  /* ------------ Render ------------ */
  return (
    <div className="app-container">

      {/* ========= Sidebar (unchanged) ========= */}
      <aside className="sidebar open">
        <div className="sidebar-header">
          <button className="menu-toggle" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
        {/* … existing nav menu … */}
      </aside>

      {/* ========= Main ========= */}
      <div className="main-content">
        <div className="course-visual-header small flex-header">
          <h1 className="course-detail-title small">Video Transcript</h1>
          {/* optional upload summary button */}
          <button className="upload-lecture-btn consistent">
            <i className="fas fa-upload"></i> Upload Summary&nbsp;PDF
          </button>
        </div>

        <main className="lectures-container improved">
          <h2 className="lectures-title improved">
            {summary ? `Summary – ${summary.title}` : 'Generating transcript…'}
          </h2>

          {/*  Loading / Error / Content  */}
          {loading && spinner}

          {error && (
            <div className="lecture-card improved" style={{ padding:'1rem', color:'crimson' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {summary && !loading && !error && (
            <div className="lecture-card improved" style={{ padding:'1rem' }}>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{summary.transcript}</pre>
              <p style={{ fontStyle:'italic', marginTop:'0.5rem' }}>
                ⏱ Duration: {(summary.duration_sec/60).toFixed(1)} min
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VideoSummary;
