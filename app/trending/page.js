import fs from 'fs';
import path from 'path';

function readJsonSafe(filename) {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export const metadata = {
  title: 'Trending',
  description: 'Most visited pages, top search queries, and most searched topics on Pakistan Law Reports, updated daily.',
};

function List({ items, labelKey, countKey, emptyText, extra }) {
  if (!items || items.length === 0) {
    return <p style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>{emptyText}</p>;
  }
  return (
    <div>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0',
            borderBottom: '1px solid var(--line)', fontSize: '0.92rem',
          }}
        >
          <span>{item[labelKey]}</span>
          <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {extra && extra(item)}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-muted)' }}>
              {item[countKey].toLocaleString()}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TrendingPage() {
  const report = readJsonSafe('analytics_report.json');
  const scReport = readJsonSafe('search_console_report.json');

  return (
    <div className="content-page" style={{ maxWidth: 780 }}>
      <h1>Trending</h1>
      <p>
        Real, automatically updated data on what people actually visit and search for on
        Pakistan Law Reports.
      </p>

      {!report && !scReport ? (
        <p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>
          No data yet — check back once the daily reports have run at least once.
        </p>
      ) : (
        <>
          {report && (
            <>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                Site activity last updated: {report.generated_at} · Based on the last 30 days
              </p>

              <h2 style={{ marginTop: 28 }}>Most Visited Pages</h2>
              <List items={report.top_pages} labelKey="page" countKey="views" emptyText="No page-view data yet." />

              <h2 style={{ marginTop: 28 }}>Most Searched Terms (on-site)</h2>
              <List items={report.top_searches} labelKey="value" countKey="count" emptyText="No search term data yet." />

              <h2 style={{ marginTop: 28 }}>Most Common Find Cases Topics</h2>
              <List items={report.top_find_cases_topics} labelKey="value" countKey="count" emptyText="No topic data yet." />
            </>
          )}

          {scReport && (
            <>
              <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginTop: 36 }}>
                Google Search data last updated: {scReport.generated_at} · Based on the last 28 days
              </p>

              <h2 style={{ marginTop: 20 }}>Top Google Search Queries</h2>
              <List
                items={scReport.top_queries}
                labelKey="query"
                countKey="clicks"
                emptyText="No search query data yet."
                extra={(item) => (
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                    {item.impressions.toLocaleString()} impressions · {item.ctr}% CTR
                  </span>
                )}
              />

              <h2 style={{ marginTop: 28 }}>Top Pages in Google Search</h2>
              <List
                items={scReport.top_pages_by_search}
                labelKey="page"
                countKey="clicks"
                emptyText="No page search data yet."
                extra={(item) => (
                  <span style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                    avg. position {item.position}
                  </span>
                )}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
