import fs from 'fs';
import path from 'path';
import { getLatestJudgments } from '../../lib/data';

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
  title: "What's New",
  description: 'The newest additions across Pakistan Law Reports - judgments, case highlights, study guides, and legal news.',
};

export default function WhatsNewPage() {
  const latestJudgments = (getLatestJudgments ? getLatestJudgments(6) : []).map((j) => ({
    type: 'Judgment',
    icon: '⚖️',
    title: j.title,
    meta: [j.citation, j.court, j.year].filter(Boolean).join(' · '),
    href: `/judgments/${j.slug}`,
    date: j.year || '',
  }));

  const highlights = readJsonSafe('case_highlights.json', []).slice(-4).reverse().map((h) => ({
    type: 'Case Highlight',
    icon: '📝',
    title: h.title,
    meta: [h.citation, h.court].filter(Boolean).join(' · '),
    href: '/case-highlights',
    date: '',
  }));

  const guidesData = readJsonSafe('study_guides.json', {});
  const guides = Object.values(guidesData).map((g) => ({
    type: 'Study Guide',
    icon: '📚',
    title: g.topic,
    meta: `Based on ${g.based_on_cases?.length || 0} cases · Updated ${g.generated_at || ''}`,
    href: '/study-guides',
    date: g.generated_at || '',
  }));

  const news = readJsonSafe('news_digest.json', []).slice(0, 4).map((n) => ({
    type: 'Legal News',
    icon: '📰',
    title: n.title,
    meta: n.source || '',
    href: '/news-digest',
    date: n.added_at || '',
  }));

  const allItems = [...highlights, ...news, ...guides, ...latestJudgments];

  return (
    <div className="content-page" style={{ maxWidth: 780 }}>
      <h1>What&apos;s New</h1>
      <p>
        The newest additions across Pakistan Law Reports — judgments, case explainers, study
        guides, and legal news, all in one place.
      </p>

      {allItems.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)' }}>Nothing to show yet — check back soon.</p>
      ) : (
        <div style={{ marginTop: 24 }}>
          {allItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              style={{
                display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--line)',
                textDecoration: 'none', color: 'inherit',
              }}
            >
              <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ minWidth: 0 }}>
                <span
                  style={{
                    display: 'inline-block', fontSize: '0.7rem', fontWeight: 700,
                    letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gold, #c8a24a)',
                    marginBottom: 4,
                  }}
                >
                  {item.type}
                </span>
                <h3 style={{ fontSize: '0.98rem', margin: '0 0 2px', color: 'var(--navy)' }}>{item.title}</h3>
                {item.meta && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                    {item.meta}
                  </span>
                )}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
