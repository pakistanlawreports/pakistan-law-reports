import { getAllCourts, getAllTopics, getAllYears, courtToSlug, topicToSlug, getTopicCounts } from '../../lib/data';

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

const CONTENT_TYPES = [
  { href: '/', icon: '🔍', title: 'Search Judgments', desc: 'The full case law database' },
  { href: '/case-highlights', icon: '📝', title: 'Case Highlights', desc: 'Plain-language explainers' },
  { href: '/study-guides', icon: '📚', title: 'Study Guides', desc: 'Topic-wise overviews for students' },
  { href: '/legal-texts', icon: '📜', title: 'Statutes & Resources', desc: 'Laws, ordinances, forms' },
  { href: '/news-digest', icon: '📰', title: 'Legal News Digest', desc: 'Recent court and legal news' },
  { href: '/whats-new', icon: '🆕', title: "What's New", desc: 'Everything recently added' },
];

function CardGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', border: '1px solid var(--line)', borderRadius: 6,
            background: 'var(--paper-raised)', textDecoration: 'none', color: 'var(--ink)',
            fontSize: '0.9rem',
          }}
        >
          <span>{item.icon && `${item.icon} `}{item.label}</span>
          {item.count != null && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
              {item.count.toLocaleString()}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}

export const metadata = {
  title: 'Browse',
  description: 'Explore Pakistan Law Reports by court, legal topic, year, or content type.',
};

export default function BrowsePage() {
  const courts = getAllCourts();
  const topics = getAllTopics().filter((t) => t !== 'General');
  const years = getAllYears();
  const topicCounts = getTopicCounts();

  return (
    <div className="content-page" style={{ maxWidth: 900 }}>
      <h1>Browse</h1>
      <p>Explore the full database by court, legal topic, year, or content type.</p>

      <h2 style={{ marginTop: 32 }}>By Content Type</h2>
      <CardGrid
        items={CONTENT_TYPES.map((c) => ({ href: c.href, icon: c.icon, label: c.title }))}
      />

      <h2 style={{ marginTop: 36 }}>By Legal Topic</h2>
      <CardGrid
        items={topics
          .sort((a, b) => (topicCounts[b] || 0) - (topicCounts[a] || 0))
          .map((t) => ({
            href: `/topics/${topicToSlug(t)}`,
            icon: TOPIC_ICONS[t] || '📄',
            label: t,
            count: topicCounts[t] || 0,
          }))}
      />

      <h2 style={{ marginTop: 36 }}>By Court</h2>
      <CardGrid
        items={courts.map((c) => ({ href: `/courts/${courtToSlug(c)}`, label: c }))}
      />

      <h2 style={{ marginTop: 36 }}>By Year</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {years.map((y) => (
          <a
            key={y}
            href={`/?year=${y}`}
            style={{
              padding: '6px 14px', border: '1px solid var(--line)', borderRadius: 14,
              background: 'var(--paper-raised)', textDecoration: 'none', color: 'var(--ink)',
              fontSize: '0.85rem', fontFamily: 'var(--font-mono)',
            }}
          >
            {y}
          </a>
        ))}
      </div>
    </div>
  );
}
