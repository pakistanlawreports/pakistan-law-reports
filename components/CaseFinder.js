'use client';

import { useState } from 'react';

function slugifyTopic(topic) {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CaseFinder() {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/find-cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setResult(data.topic);
      setMatches(data.matches || []);

      // Track the matched topic plus keywords - never the person's actual
      // description text, keeping analytics useful without storing
      // anyone's personal situation.
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'case_finder_search', {
          matched_topic: data.topic || 'no_match',
          matched_keywords: (data.keywords || []).join(', ') || 'none',
        });
      }
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
        <p style={{ margin: '0 0 8px' }}>
          <strong>This is not legal advice.</strong> This tool searches our database for
          judgments that may relate to the general topic of what you describe — it does not
          analyze your specific situation or tell you what your legal rights are. For advice on
          your actual case, please consult a licensed advocate. Do not include personal details,
          names, or anything identifying in your description.
        </p>
        <p dir="rtl" lang="ur" style={{ margin: 0, fontFamily: 'var(--font-body), "Noto Nastaliq Urdu", sans-serif' }}>
          <strong>یہ قانونی مشورہ نہیں ہے۔</strong> یہ ٹول آپ کے بیان کردہ عمومی موضوع سے متعلق
          فیصلے تلاش کرتا ہے — یہ آپ کی مخصوص صورتحال کا تجزیہ نہیں کرتا۔ اپنے کیس کے بارے میں
          مشورے کے لیے کسی وکیل سے رجوع کریں۔ اپنی تفصیل میں ذاتی معلومات یا نام شامل نہ کریں۔
        </p>
      </div>

      <form onSubmit={handleSearch} className="form-card" style={{ maxWidth: 600 }}>
        <div className="form-row">
          <label>
            Briefly describe the general situation (no personal details)
            <br />
            <span dir="rtl" lang="ur" style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
              اپنا مسئلہ مختصراً بیان کریں (ذاتی تفصیلات شامل نہ کریں) — اردو، رومن اردو، یا انگریزی میں لکھ سکتے ہیں
            </span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. landlord won't return my security deposit / makan malik security deposit wapis nahi kar raha"
            required
            minLength={10}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 28px' }} disabled={loading}>
          {loading ? 'Searching…' : (
            <>Find Related Judgments <span dir="rtl" lang="ur">/ متعلقہ فیصلے تلاش کریں</span></>
          )}
        </button>
      </form>

      {error && (
        <p style={{ marginTop: 16, color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>
      )}

      {result !== null && !error && (
        <div style={{ marginTop: 24 }}>
          {result ? (
            <>
              <p style={{ fontSize: '0.92rem' }}>
                This looks related to <strong>{result}</strong>. Here are some judgments in that
                area:
              </p>
              {matches.map((j) => (
                <a key={j.slug} href={`/judgments/${j.slug}`} className="judgment-card">
                  <span>
                    <h3 className="judgment-title" style={{ fontSize: '0.95rem' }}>{j.title}</h3>
                    <div className="judgment-meta">
                      {[j.citation, j.court, j.year].filter(Boolean).join(' · ')}
                    </div>
                  </span>
                </a>
              ))}
              <p style={{ marginTop: 16 }}>
                <a href={`/topics/${slugifyTopic(result)}`}>See all {result} judgments →</a>
              </p>
            </>
          ) : (
            <p>
              We couldn&apos;t confidently match this to a topic in our database. Try adding a
              bit more detail, or{' '}
              <a href="/">browse and search all judgments directly</a>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
