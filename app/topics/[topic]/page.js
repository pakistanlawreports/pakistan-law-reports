import fs from 'fs';
import path from 'path';
import { getAllTopics, topicToSlug, getTopicBySlug, getJudgmentsByTopic } from '../../../lib/data';

const PAGE_SIZE = 100;

function getHighlightsForTopic(topic, index) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'case_highlights.json');
    if (!fs.existsSync(filePath)) return [];
    const highlights = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const slugToTopic = {};
    index.forEach((j) => { slugToTopic[j.slug] = j.topic; });
    return highlights.filter((h) => slugToTopic[h.slug] === topic).slice(0, 3);
  } catch {
    return [];
  }
}

function hasStudyGuide(topic) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'study_guides.json');
    if (!fs.existsSync(filePath)) return false;
    const guides = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return Boolean(guides[topic]);
  } catch {
    return false;
  }
}

export async function generateStaticParams() {
  return getAllTopics().map((t) => ({ topic: topicToSlug(t) }));
}

export async function generateMetadata({ params }) {
  const topic = getTopicBySlug(params.topic);
  if (!topic) return { title: 'Topic not found' };
  return {
    title: `${topic} Judgments`,
    description: `Browse ${topic} judgments and case law, reported on Pakistan Law Reports.`,
    alternates: { canonical: `/topics/${params.topic}` },
  };
}

export const dynamic = 'force-dynamic';

export default function TopicPage({ params, searchParams }) {
  const topic = getTopicBySlug(params.topic);

  if (!topic) {
    return (
      <div className="content-page">
        <h1>Topic not found</h1>
        <p><a href="/">Return to search</a>.</p>
      </div>
    );
  }

  const rawJudgments = getJudgmentsByTopic(topic);

  // Full-text judgments first - genuine complete opinions ahead of bare
  // summaries.
  const allJudgments = [...rawJudgments].sort((a, b) => {
    const aFull = a.has_full_text !== false ? 0 : 1;
    const bFull = b.has_full_text !== false ? 0 : 1;
    return aFull - bFull;
  });

  const highlights = getHighlightsForTopic(topic, rawJudgments);
  const guideExists = hasStudyGuide(topic);

  const totalPages = Math.max(1, Math.ceil(allJudgments.length / PAGE_SIZE));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, parseInt(searchParams?.page, 10) || 1)
  );
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageJudgments = allJudgments.slice(start, start + PAGE_SIZE);
  const slug = topicToSlug(topic);

  return (
    <div className="results-section" style={{ paddingTop: 48 }}>
      <h1 style={{ marginBottom: 6 }}>{topic}</h1>
      <p className="results-count">
        {allJudgments.length.toLocaleString()} judgments — showing {start + 1}-
        {Math.min(start + PAGE_SIZE, allJudgments.length)}
      </p>

      {(guideExists || highlights.length > 0) && (
        <div
          style={{
            marginBottom: 24, padding: 18, background: '#f0f7f2',
            border: '1px solid #cde3d3', borderRadius: 4,
          }}
        >
          {guideExists && (
            <p style={{ fontSize: '0.9rem', marginBottom: highlights.length > 0 ? 14 : 0 }}>
              📚 <a href="/study-guides"><strong>Read the {topic} Study Guide</strong></a> —
              a topic overview grounded in real cases from this database.
            </p>
          )}
          {highlights.length > 0 && (
            <>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 10 }}>
                📝 Case Highlights on this topic
              </p>
              {highlights.map((h) => (
                <a key={h.slug} href="/case-highlights" style={{ display: 'block', fontSize: '0.9rem', marginBottom: 6 }}>
                  {h.title}
                </a>
              ))}
              <a href="/case-highlights" style={{ fontSize: '0.85rem' }}>See all Case Highlights →</a>
            </>
          )}
        </div>
      )}

      {pageJudgments.map((j) => (
        <a key={j.slug} href={`/judgments/${j.slug}`} className="judgment-card">
          <span>
            <h3 className="judgment-title">{j.title}</h3>
            <div className="judgment-meta">
              {[j.citation, j.court, j.year].filter(Boolean).join(' · ')}
            </div>
            <p className="judgment-excerpt">{j.excerpt}…</p>
          </span>
        </a>
      ))}

      {totalPages > 1 && (
        <nav
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 32,
            flexWrap: 'wrap',
          }}
        >
          {currentPage > 1 && (
            <a href={`/topics/${slug}?page=${currentPage - 1}`} style={{ padding: '8px 16px', border: '1px solid var(--line)', borderRadius: 3 }}>
              ← Previous
            </a>
          )}
          <span style={{ padding: '8px 16px', color: 'var(--ink-muted)' }}>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <a href={`/topics/${slug}?page=${currentPage + 1}`} style={{ padding: '8px 16px', border: '1px solid var(--line)', borderRadius: 3 }}>
              Next →
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
