import fs from 'fs';
import path from 'path';
import MarkdownLite from '../../../components/MarkdownLite';

function getArticles() {
  try {
    const p = path.join(process.cwd(), 'data', 'articles.json');
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const a = getArticles().find((x) => x.slug === params.slug);
  if (!a) return { title: 'Article not found' };
  const description = (a.body || '').replace(/[#*\-]/g, '').split('\n').find((l) => l.trim().length > 60) || a.title;
  return {
    title: a.title,
    description: description.slice(0, 160),
    alternates: { canonical: `/articles/${a.slug}` },
    openGraph: { title: `${a.title} | Pakistan Law Reports`, description: description.slice(0, 160), type: 'article' },
  };
}

export default function ArticlePage({ params }) {
  const all = getArticles();
  const a = all.find((x) => x.slug === params.slug);

  if (!a) {
    return (
      <div className="content-page">
        <h1>Article not found</h1>
        <p><a href="/articles">Back to Legal Explainers</a></p>
      </div>
    );
  }

  const related = all.filter((x) => x.topic === a.topic && x.slug !== a.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    datePublished: a.created,
    author: { '@type': 'Organization', name: 'Pakistan Law Reports' },
    publisher: { '@type': 'Organization', name: 'Pakistan Law Reports' },
    mainEntityOfPage: `https://pakistanlawreports.com/articles/${a.slug}`,
  };

  return (
    <div className="content-page" style={{ maxWidth: 720 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p style={{ fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
        <a href="/">Home</a> › <a href="/articles">Legal Explainers</a> › {a.topic}
      </p>

      <h1 style={{ fontSize: '1.7rem' }}>{a.title}</h1>
      <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)' }}>
        {a.topic} · {a.created}
      </p>

      <MarkdownLite text={a.body} />

      <h2 style={{ fontSize: '1.05rem', marginTop: 36 }}>Cases discussed</h2>
      <ul style={{ paddingLeft: 18 }}>
        {a.cases.map((c) => (
          <li key={c.slug} style={{ marginBottom: 8, fontSize: '0.92rem' }}>
            <a href={`/case-highlights/${c.slug}`}>{c.title}</a>
            <span style={{ color: 'var(--ink-muted)' }}> — {[c.citation, c.court].filter(Boolean).join(' · ')}</span>
            {' '}(<a href={`/judgments/${c.slug}`}>full judgment</a>)
          </li>
        ))}
      </ul>

      {related.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.05rem', marginTop: 32 }}>More on {a.topic}</h2>
          <ul style={{ paddingLeft: 18 }}>
            {related.map((r) => (
              <li key={r.slug} style={{ marginBottom: 6 }}><a href={`/articles/${r.slug}`}>{r.title}</a></li>
            ))}
          </ul>
        </>
      )}

      <p style={{ marginTop: 36, fontSize: '0.82rem', color: 'var(--ink-muted)' }}>
        This article is general legal information based on published judgments. It is not legal
        advice, and outcomes depend on the facts of each case. For advice on your situation,
        consult a licensed advocate.
      </p>
    </div>
  );
}
