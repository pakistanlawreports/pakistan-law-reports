import { getCaseHighlights, getAllJudgments } from '../../lib/data';
import CaseHighlightActions from '../../components/CaseHighlightActions';
import FormattedText from '../../components/FormattedText';

export const metadata = {
  title: 'Case Highlights',
  description: 'Plain-language explainers of notable Pakistani court judgments, written from the full judgment text.',
};

const TOPIC_ICONS = {
  'Criminal Law': '⚖️',
  'Constitutional Law': '📜',
  'Family Law': '👨‍👩‍👧',
  'Property & Rent': '🏠',
  'Tax Law': '💰',
  'Banking & Corporate': '🏦',
  'Labour & Service': '👷',
  'Company Law': '🏢',
  'Succession & Inheritance': '📋',
  'Civil Law': '🗂️',
};

export default function CaseHighlightsPage() {
  const highlights = getCaseHighlights() || [];

  let stats = { total: highlights.length, topicCount: 0, topics: [], topicCounts: {} };
  try {
    const allJudgments = getAllJudgments() || [];
    const slugToTopic = {};
    allJudgments.forEach((j) => {
      slugToTopic[j.slug] = j.topic;
    });

    const topicCounts = {};
    highlights.forEach((h) => {
      const topic = slugToTopic[h.slug] || 'General';
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    const topics = Object.keys(topicCounts).filter((t) => t !== 'General');
    stats = { total: highlights.length, topicCount: topics.length, topics, topicCounts };
  } catch {
    // Fall back to just the total count if topic cross-referencing fails
  }

  return (
    <div>
      <div
        style={{
          background: 'var(--navy)', color: 'white', padding: '48px 32px 40px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: 'white', marginBottom: 10, fontSize: '1.8rem' }}>Case Highlights</h1>
        <p style={{ color: '#c9d4e3', maxWidth: 600, margin: '0 auto 32px', fontSize: '0.95rem' }}>
          Plain-language explainers of notable judgments, written after reading the full judgment
          text — not a substitute for the actual opinion. Available in English and Urdu.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--gold, #c8a24a)' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#c9d4e3' }}>
              Case{stats.total !== 1 ? 's' : ''} Explained
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2.6rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--gold, #c8a24a)' }}>
              {stats.topicCount}
            </div>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#c9d4e3' }}>
              Topics Covered
            </div>
          </div>
        </div>

        {stats.topics.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {stats.topics.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: '0.82rem', padding: '6px 14px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.25)',
                  color: '#e4d3a3',
                }}
              >
                {TOPIC_ICONS[t] || '📄'} {t} ({stats.topicCounts[t]})
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 28, fontSize: '1.3rem', opacity: 0.6 }}>↓ scroll for details</div>
      </div>

      <div className="content-page" style={{ maxWidth: 760 }}>
        {highlights.map((h) => (
          <div
            key={h.slug}
            id={h.slug}
            style={{
              marginTop: 28, padding: 20, background: 'var(--paper-raised)',
              border: '1px solid var(--line)', borderRadius: 3,
            }}
          >
            <h2 style={{ fontSize: '1.15rem', marginBottom: 4 }}>{h.title}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', marginBottom: 14 }}>
              {h.citation} · {h.court}
            </p>

            <FormattedText text={h.explainer} />

            {h.explainer_ur ? (
              <div style={{ marginTop: 10, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
                <div dir="rtl" lang="ur" style={{ fontFamily: 'var(--font-body), "Noto Nastaliq Urdu", sans-serif', fontSize: '1rem' }}>
                  <FormattedText text={h.explainer_ur} />
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontStyle: 'italic', marginTop: 8 }}>
                Urdu translation not yet generated for this case.
              </p>
            )}

            <a href={`/judgments/${h.slug}`} style={{ fontSize: '0.9rem' }}>Read the full judgment →</a>
            <CaseHighlightActions
              title={h.title}
              citation={h.citation}
              url={`https://pakistanlawreports.com/case-highlights#${h.slug}`}
            />
          </div>
        ))}

        {highlights.length === 0 && (
          <p style={{ color: 'var(--ink-muted)', textAlign: 'center', marginTop: 32 }}>
            No case highlights yet — check back soon as our weekly automation adds more.
          </p>
        )}
      </div>
    </div>
  );
}
