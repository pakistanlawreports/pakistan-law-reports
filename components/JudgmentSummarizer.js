'use client';

import { useState } from 'react';

export default function JudgmentSummarizer() {
  const [mode, setMode] = useState('file');
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBrief(null);
    setLoading(true);

    const formData = new FormData();
    if (mode === 'file' && file) {
      formData.append('file', file);
    } else if (mode === 'paste' && pastedText) {
      formData.append('text', pastedText);
    } else {
      setError('Please upload a PDF or paste judgment text first.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/summarize-judgment', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setBrief(data.brief);
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          background: '#fff8e1', border: '1px solid #e4c869', borderRadius: 3,
          padding: 16, marginBottom: 24, fontSize: '0.88rem',
        }}
      >
        This tool summarizes an uploaded judgment based strictly on its actual text — it does
        not add outside information or give advice on your situation. Your document is
        processed to generate the summary and is not stored afterward. Best with text-based
        PDFs (not scanned images).
      </div>

      <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: 640 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => setMode('file')}
            className={mode === 'file' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px' }}
          >
            Upload PDF
          </button>
          <button
            type="button"
            onClick={() => setMode('paste')}
            className={mode === 'paste' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px' }}
          >
            Paste Text
          </button>
        </div>

        {mode === 'file' ? (
          <div className="form-row">
            <label>Upload a judgment (PDF, max 10MB)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="form-row">
            <label>Paste the judgment text</label>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste the full judgment text here..."
              style={{ minHeight: 200 }}
            />
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: 'auto', padding: '10px 28px' }}>
          {loading ? 'Summarizing…' : 'Generate Brief'}
        </button>
      </form>

      {error && <p style={{ marginTop: 16, color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>}

      {brief && (
        <div
          style={{
            marginTop: 24, padding: 24, background: 'var(--paper-raised)',
            border: '1px solid var(--line)', borderRadius: 3, maxWidth: 640,
          }}
        >
          <h2 style={{ fontSize: '1.2rem', marginBottom: 4 }}>{brief.case_name}</h2>
          {brief.citation && (
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
              {brief.citation}
            </p>
          )}

          <h3 style={{ fontSize: '0.95rem', marginTop: 16, marginBottom: 4 }}>Facts</h3>
          <p>{brief.facts}</p>

          <h3 style={{ fontSize: '0.95rem', marginTop: 16, marginBottom: 4 }}>Issue(s)</h3>
          <p>{brief.issues}</p>

          <h3 style={{ fontSize: '0.95rem', marginTop: 16, marginBottom: 4 }}>Holding</h3>
          <p>{brief.holding}</p>

          {brief.precedents_cited?.length > 0 && (
            <>
              <h3 style={{ fontSize: '0.95rem', marginTop: 16, marginBottom: 4 }}>Precedents Cited</h3>
              <ul style={{ marginBottom: 0 }}>
                {brief.precedents_cited.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </>
          )}

          <h3 style={{ fontSize: '0.95rem', marginTop: 16, marginBottom: 4 }}>Practical Takeaways</h3>
          <p style={{ marginBottom: 0 }}>{brief.practical_takeaways}</p>
        </div>
      )}
    </div>
  );
}
