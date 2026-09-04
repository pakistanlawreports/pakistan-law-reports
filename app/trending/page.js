import fs from 'fs';
import path from 'path';

function getReport() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'analytics_report.json');
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export const metadata = {
  title: 'Trending',
  description: 'Most visited pages and most searched topics on Pakistan Law Reports, updated daily.',
};

function List({ items, labelKey, countKey, emptyText }) {
  if (!items || items.length === 0) {
    return <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>{emptyText}</p>;
  }
  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 0',
            borderBottom: '1px solid var(--line)', fontSize: '0.92rem',
          }}
        >
          <span>{item[labelKey]}</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
            {item[countKey].toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TrendingPage() {
  const report = getReport();

  return (
    <div className="content-page" style={{ maxWidth: 760 }}>
      <h1>Trending</h1>
      <p>
        Real, automatically updated data on what people actually visit and search for on
        Pakistan Law Reports.
      </p>

      {!report ? (
        <p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>
          No data yet — check back once the daily analytics report has run at least once.
        </p>
      ) : (
        <>
          <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
            Last updated: {report.generated_at} · Based on the last 30 days
          </p>

          <h2 style={{ marginTop: 28 }}>Most Visited Pages</h2>
          <List items={report.top_pages} labelKey="page" countKey="views" emptyText="No page-view data yet." />

          <h2 style={{ marginTop: 28 }}>Most Searched Terms</h2>
          <List items={report.top_searches} labelKey="value" countKey="count" emptyText="No search term data yet." />

          <h2 style={{ marginTop: 28 }}>Most Common Find Cases Topics</h2>
          <List items={report.top_find_cases_topics} labelKey="value" countKey="count" emptyText="No topic data yet." />
        </>
      )}
    </div>
  );
}
