import { getAllJudgments, getAllCourts, getAllYears, getAllTopics, getStats, getLatestUpdate, getTopicCounts, topicToSlug, getAllLawyers, getCaseHighlights } from '../lib/data';
import SearchBrowse from '../components/SearchBrowse';

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
  'General': '📄',
};

export default function HomePage() {
  const judgments = getAllJudgments();
  const courts = getAllCourts();
  const years = getAllYears();
  const topics = getAllTopics();
  const stats = getStats();
  const latestUpdate = getLatestUpdate();
  const topicCounts = getTopicCounts();
  const lawyers = getAllLawyers();
  const featuredLawyers = lawyers.slice(0, 3);
  const caseHighlights = getCaseHighlights().slice(0, 3);

  const topTopics = topics
    .filter((t) => t !== 'General')
    .sort((a, b) => (topicCounts[b] || 0) - (topicCounts[a] || 0));

  return (
    <>
      <div className="announcement-bar">
        <span className="announcement-badge">
          {latestUpdate && latestUpdate.added > 0 ? 'UPDATED TODAY' : 'LIVE'}
        </span>
        <span className="announcement-text">
          {latestUpdate && latestUpdate.added > 0 ? (
            <>
              <strong>{latestUpdate.added} new judgments</strong> added on {latestUpdate.date} —
              Pakistan Law Reports now covers <strong>{stats.total.toLocaleString()} cases</strong>,
              updated daily, free to search.
            </>
          ) : (
            <>
              Pakistan Law Reports now covers <strong>{stats.total.toLocaleString()} cases</strong> across
              every major court in Pakistan — updated daily, free to search.
            </>
          )}
        </span>
      </div>

      <section className="hero">
        <h1>Search Pakistani case law, free.</h1>
        <p className="lede">
          A free, searchable archive of judgments from the Supreme Court and High Courts of
          Pakistan — built for lawyers, students, journalists, and the public.
        </p>

        <div className="stat-row">
          <div className="stat">
            <span className="stat-num">{stats.total.toLocaleString()}</span>
            <span className="stat-label">Judgments</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.courts}</span>
            <span className="stat-label">Courts</span>
          </div>
          <div className="stat">
            <span className="stat-num">{stats.years[stats.years.length - 1]}–{stats.years[0]}</span>
            <span className="stat-label">Year range</span>
          </div>
        </div>
      </section>

      <div style={{ paddingTop: 8 }}>
        <SearchBrowse judgments={judgments} courts={courts} years={years} topics={topics} />
      </div>

      <div
        className="homepage-grid"
        style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 32px 40px',
          display: 'grid', gridTemplateColumns: '1fr 260px', gap: 32,
        }}
      >
        <div style={{ minWidth: 0 }}>
          {caseHighlights.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.15rem', marginBottom: 16 }}>Case Highlights</h2>
              {caseHighlights.map((h) => (
                <div
                  key={h.slug}
                  style={{
                    marginBottom: 16, padding: 18, background: 'var(--paper-raised)',
                    border: '1px solid var(--line)', borderRadius: 3,
                  }}
                >
                  <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{h.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
                    {h.citation} · {h.court}
                  </p>
                  <p style={{ fontSize: '0.9rem', marginBottom: 10 }}>
                    {h.explainer.slice(0, 220)}{h.explainer.length > 220 ? '…' : ''}
                  </p>
                  <a href={`/case-highlights`} style={{ fontSize: '0.85rem' }}>Read more →</a>
                </div>
              ))}
              <p style={{ textAlign: 'right' }}>
                <a href="/case-highlights" style={{ fontSize: '0.88rem' }}>See all Case Highlights →</a>
              </p>
            </section>
          )}

          {featuredLawyers.length > 0 && (
            <section style={{ marginTop: 32 }}>
              <h2 style={{ fontSize: '1rem', marginBottom: 14 }}>Featured Lawyers</h2>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {featuredLawyers.map((l, i) => (
                  <a
                    key={i}
                    href={`/lawyers/profile/${l.slug}`}
                    style={{
                      padding: '14px 20px', border: '1px solid var(--line)', borderRadius: 3,
                      background: 'var(--paper-raised)', textDecoration: 'none', minWidth: 180,
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--navy)' }}>{l.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
                      {[l.city, l.practice_area].filter(Boolean).join(' · ')}
                    </div>
                  </a>
                ))}
                <a
                  href="/lawyers"
                  style={{
                    padding: '14px 20px', border: '1px dashed var(--line)', borderRadius: 3,
                    display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--ink-muted)',
                  }}
                >
                  See full directory →
                </a>
              </div>
            </section>
          )}
        </div>

        <aside className="homepage-sidebar">
          <h2 style={{ fontSize: '0.95rem', marginBottom: 12 }}>Browse by Topic</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {topTopics.map((t) => (
              <a
                key={t}
                href={`/topics/${topicToSlug(t)}`}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 3,
                  fontSize: '0.85rem', textDecoration: 'none', color: 'var(--ink)',
                }}
              >
                <span>{TOPIC_ICONS[t] || '📄'} {t}</span>
                <span style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  {(topicCounts[t] || 0).toLocaleString()}
                </span>
              </a>
            ))}
          </div>
        </aside>
      </div>

      <div className="lawyer-cta-minimal">
        📌 <strong>Are you a lawyer?</strong> Get listed for free.{' '}
        <a href="/lawyers">Submit your profile →</a>
      </div>
    </>
  );
}
