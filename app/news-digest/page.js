import fs from 'fs';
import path from 'path';

function getNewsDigest() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'news_digest.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

export const metadata = {
  title: 'Legal News Digest',
  description: 'A weekly digest of Pakistani court and legal news, summarized in our own words with links to original sources.',
};

export default function NewsDigestPage() {
  const digest = getNewsDigest();

  return (
    <div className="content-page" style={{ maxWidth: 760 }}>
      <h1>Legal News Digest</h1>
      <p>
        Original summaries of recent Pakistani court and legal news, written in our own words —
        always with a link to the original source. This is a summary, not a substitute for
        reading the full article.
      </p>

      {digest.length === 0 ? (
        <p style={{ color: 'var(--ink-muted)', marginTop: 24 }}>
          No digest entries yet — check back soon as our weekly automation adds new coverage.
        </p>
      ) : (
        digest.map((item, i) => (
          <div
            key={i}
            style={{
              marginTop: 20, padding: 18, background: 'var(--paper-raised)',
              border: '1px solid var(--line)', borderRadius: 3,
            }}
          >
            <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
              {item.source} · {item.published_at ? new Date(item.published_at).toLocaleDateString() : ''}
            </p>
            <p style={{ marginBottom: 10 }}>{item.summary}</p>
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem' }}>
              Read the original article at {item.source} →
            </a>
          </div>
        ))
      )}
    </div>
  );
}
