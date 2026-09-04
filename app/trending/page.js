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

function BarList({ items, labelKey, countKey, emptyText, extra, filterNotSet }) {
  const filtered = filterNotSet ? (items || []).filter((i) => i[labelKey] !== '(not set)') : items;

  if (!filtered || filtered.length === 0) {
    return (
      <div style={{ padding: '20px 0', color: 'var(--ink-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
        {emptyText}
      </div>
    );
  }

  const max = Math.max(...filtered.map((i) => i[countKey]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {filtered.map((item, i) => {
        const pct = max > 0 ? Math.max(4, (item[countKey] / max) * 100) : 0;
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span
                style={{
                  fontSize: '0.88rem', fontWeight: 500, color: 'var(--ink)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '70%',
                }}
              >
                {i + 1}. {item[labelKey]}
              </span>
              <span style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexShrink: 0 }}>
                {extra && <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>{extra(item)}</span>}
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--navy)', fontSize: '0.85rem' }}>
                  {item[countKey].toLocaleString()}
                </span>
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--paper)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%', width: `${pct}%`, borderRadius: 3,
                  background: 'linear-gradient(90deg, var(--gold, #c8a24a), var(--navy))',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Card({ icon, title, subtitle, children }) {
  return (
    <div
      style={{
        background: 'var(--paper-raised)', border: '1px solid var(--line)', borderRadius: 8,
        padding: 24, marginBottom: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
        <h2 style={{ fontSize: '1.05rem', margin: 0 }}>{title}</h2>
      </div>
      {subtitle && (
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginBottom: 18, marginTop: 4 }}>{subtitle}</p>
      )}
      {children}
    </div>
  );
}

export default function TrendingPage() {
  const report = readJsonSafe('analytics_report.json');
  const scReport = readJsonSafe('search_console_report.json');

  return (
    <div className="content-page" style={{ maxWidth: 780 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ marginBottom: 8 }}>📈 Trending</h1>
        <p style={{ color: 'var(--ink-muted)', margin: 0 }}>
          Real, automatically updated data on what people actually visit and search for.
        </p>
      </div>

      {!report && !scReport ? (
        <p style={{ color: 'var(--ink-muted)', textAlign: 'center', marginTop: 24 }}>
          No data yet — check back once the daily reports have run at least once.
        </p>
      ) : (
        <>
          {report && (
            <>
              <Card icon="👀" title="Most Visited Pages" subtitle={`Last 30 days · updated ${report.generated_at}`}>
                <BarList items={report.top_pages} labelKey="page" countKey="views" emptyText="No page-view data yet." />
              </Card>

              <Card icon="🔍" title="Most Searched Terms" subtitle="From the homepage search bar">
                <BarList items={report.top_searches} labelKey="value" countKey="count" emptyText="No search term data yet — this can take a day or two to appear after setup." filterNotSet />
              </Card>

              <Card icon="🧭" title="Most Common Find Cases Topics" subtitle="From the Find Related Cases tool">
                <BarList items={report.top_find_cases_topics} labelKey="value" countKey="count" emptyText="No topic data yet — this can take a day or two to appear after setup." filterNotSet />
              </Card>
            </>
          )}

          {scReport && (
            <>
              <Card icon="🌐" title="Top Google Search Queries" subtitle={`Last 28 days · updated ${scReport.generated_at}`}>
                <BarList
                  items={scReport.top_queries}
                  labelKey="query"
                  countKey="clicks"
                  emptyText="No search query data yet."
                  extra={(item) => `${item.impressions.toLocaleString()} impr · ${item.ctr}% CTR`}
                />
              </Card>

              <Card icon="📄" title="Top Pages in Google Search" subtitle="Ranked by clicks from Google">
                <BarList
                  items={scReport.top_pages_by_search}
                  labelKey="page"
                  countKey="clicks"
                  emptyText="No page search data yet."
                  extra={(item) => `avg. position ${item.position}`}
                />
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}
