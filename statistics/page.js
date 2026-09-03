import fs from 'fs';
import path from 'path';
import { getAllJudgments, getStats } from '../../lib/data';

function readJsonSafe(filename, fallback) {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return fallback;
  }
}

export const metadata = {
  title: 'Case Law Statistics',
  description: 'Real, computed statistics from the Pakistan Law Reports database.',
};

export default function StatisticsPage() {
  const judgments = getAllJudgments();
  const stats = getStats();
  const highlights = readJsonSafe('case_highlights.json', []);

  const courtCounts = {};
  const topicCounts = {};
  const yearCounts = {};
  judgments.forEach((j) => {
    if (j.court) courtCounts[j.court] = (courtCounts[j.court] || 0) + 1;
    if (j.topic) topicCounts[j.topic] = (topicCounts[j.topic] || 0) + 1;
    if (j.year) yearCounts[j.year] = (yearCounts[j.year] || 0) + 1;
  });

  const topCourts = Object.entries(courtCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  // Simple, honest keyword-based estimate from Case Highlight text - not a
  // rigorous legal classification, just an illustrative signal from the
  // explainers we've actually written.
  let acquitted = 0;
  let convictionUpheld = 0;
  highlights.forEach((h) => {
    const text = (h.explainer || '').toLowerCase();
    if (text.includes('acquitted') || text.includes('acquittal')) acquitted += 1;
    else if (text.includes('upheld') || text.includes('conviction') && text.includes('dismissed the appeal')) convictionUpheld += 1;
  });

  return (
    <div className="content-page" style={{ maxWidth: 800 }}>
      <h1>Case Law Statistics</h1>
      <p>
        Real, computed statistics from our own database — updated as the database grows.
      </p>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 24, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
            {stats.total.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Total Judgments</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
            {highlights.length.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Case Highlights Written</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--navy)', fontFamily: 'var(--font-display)' }}>
            {stats.courts}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Courts Covered</div>
        </div>
      </div>

      <h2>Judgments by Court</h2>
      <div style={{ marginBottom: 32 }}>
        {topCourts.map(([court, count]) => (
          <div key={court} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <span>{court}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>{count.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <h2>Judgments by Topic</h2>
      <div style={{ marginBottom: 32 }}>
        {topTopics.map(([topic, count]) => (
          <div key={topic} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <span>{topic}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>{count.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {highlights.length > 20 && (
        <>
          <h2>Criminal Appeals: Acquittal Mentions</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
            An illustrative signal from our written Case Highlights, not a rigorous legal
            classification — based on simple keyword detection in the explainer text.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>{acquitted}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Mention acquittal</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy)' }}>{convictionUpheld}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>Mention conviction upheld</div>
            </div>
          </div>
        </>
      )}

      <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginTop: 32 }}>
        These statistics reflect only the judgments currently in our database, not all Pakistani
        case law, and should not be read as representative of overall national trends.
      </p>
    </div>
  );
}
