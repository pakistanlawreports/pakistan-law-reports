import fs from 'fs';
import path from 'path';

function getStudyGuides() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'study_guides.json');
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

export const metadata = {
  title: 'Study Guides',
  description: 'Topic-wise study guides for law students, synthesized from real Pakistani case law.',
};

export default function StudyGuidesPage() {
  const guides = getStudyGuides();
  const topics = Object.keys(guides);

  return (
    <div className="content-page" style={{ maxWidth: 800 }}>
      <h1>Study Guides</h1>
      <p>
        Topic-wise overviews for law students, synthesized strictly from real judgments in our
        database — each guide is grounded in, and cites, the actual cases it&apos;s based on.
      </p>

      {topics.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>
          No study guides yet — our weekly automation generates these as enough full-text
          judgments accumulate in each topic. Check back soon.
        </p>
      ) : (
        topics.map((topic) => {
          const g = guides[topic];
          return (
            <div
              key={topic}
              style={{
                marginTop: 28, padding: 22, background: 'var(--paper-raised)',
                border: '1px solid var(--line)', borderRadius: 3,
              }}
            >
              <h2 style={{ fontSize: '1.2rem', marginBottom: 4 }}>{topic}</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: 14 }}>
                Based on {g.based_on_cases?.length || 0} case{g.based_on_cases?.length !== 1 ? 's' : ''} · Updated {g.generated_at}
              </p>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, marginBottom: 16 }}>
                {g.guide}
              </div>
              {g.based_on_cases?.length > 0 && (
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>Cases referenced:</p>
                  {g.based_on_cases.map((c) => (
                    <a
                      key={c.slug}
                      href={`/judgments/${c.slug}`}
                      style={{ display: 'block', fontSize: '0.85rem', marginBottom: 4 }}
                    >
                      {c.title} ({c.citation})
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
