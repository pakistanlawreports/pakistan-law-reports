import fs from 'fs';
import path from 'path';

function getArticles() {
  try {
    const p = path.join(process.cwd(), 'data', 'articles.json');
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Legal Explainers: Real-Life Scenarios in Pakistani Law',
  description:
    'Plain-language articles explaining how Pakistani courts have handled everyday legal situations, each built from real judgments.',
  alternates: { canonical: '/articles' },
};

function excerpt(body) {
  const first = (body || '').split('\n').find((l) => l.trim() && !l.startsWith('#') && !l.startsWith('-'));
  const clean = (first || '').replace(/\*\*/g, '');
  return clean.length > 220 ? clean.slice(0, 220).trim() + '…' : clean;
}

export default function ArticlesPage() {
  const articles = getArticles();

  return (
    <div className="content-page" style={{ maxWidth: 780 }}>
      <h1>Legal Explainers</h1>
      <p>
        Real-life situations, explained through what Pakistani courts have actually decided.
        Every article is built from real judgments and links to them. General information only,
        not legal advice.
      </p>

      {articles.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>
          The first explainers are on their way. Check back soon.
        </p>
      ) : (
        <div style={{ marginTop: 24 }}>
          {articles.map((a) => (
            <a
              key={a.slug}
              href={`/articles/${a.slug}`}
              style={{
                display: 'block', padding: '18px 0', borderBottom: '1px solid var(--line)',
                textDecoration: 'none', color: 'inherit',
              }}
            >
              <div style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                {a.topic} · {a.created}
              </div>
              <h2 style={{ fontSize: '1.15rem', marginBottom: 6 }}>{a.title}</h2>
              <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--ink-muted)' }}>{excerpt(a.body)}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
