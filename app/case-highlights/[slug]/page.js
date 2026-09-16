import fs from 'fs';
import path from 'path';
import CaseHighlightActions from '../../../components/CaseHighlightActions';
import MarkdownLite from '../../../components/MarkdownLite';

function getHighlights() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'case_highlights.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

function getHighlight(slug) {
  return getHighlights().find((h) => h.slug === slug) || null;
}

export async function generateStaticParams() {
  return getHighlights().map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }) {
  const h = getHighlight(params.slug);
  if (!h) return { title: 'Case Highlight not found' };

  const description = h.explainer ? h.explainer.slice(0, 160) : '';

  return {
    title: h.title,
    description,
    alternates: { canonical: `/case-highlights/${h.slug}` },
    openGraph: {
      title: `${h.title} | Pakistan Law Reports`,
      description,
      type: 'article',
    },
  };
}

export default function CaseHighlightDetailPage({ params }) {
  const h = getHighlight(params.slug);

  if (!h) {
    return (
      <div className="content-page">
        <h1>Case Highlight not found</h1>
        <p><a href="/case-highlights">Return to Case Highlights</a>.</p>
      </div>
    );
  }

  const pageUrl = `https://pakistanlawreports.com/case-highlights/${h.slug}`;

  return (
    <div className="content-page" style={{ maxWidth: 700 }}>
      <p style={{ fontSize: '0.85rem' }}><a href="/case-highlights">← All Case Highlights</a></p>

      <h1 style={{ fontSize: '1.4rem', marginBottom: 6 }}>{h.title}</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', marginBottom: 20 }}>
        {h.citation} · {h.court}
      </p>

      <MarkdownLite text={h.explainer} />

      {h.explainer_ur ? (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px dashed var(--line)' }}>
          <div dir="rtl" lang="ur" style={{ fontFamily: 'var(--font-body), "Noto Nastaliq Urdu", sans-serif', fontSize: '1rem' }}>
            <MarkdownLite text={h.explainer_ur} />
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontStyle: 'italic', marginTop: 8 }}>
          Urdu translation not yet generated for this case.
        </p>
      )}

      <p style={{ marginTop: 20 }}>
        <a href={`/judgments/${h.slug}`}>Read the full judgment →</a>
      </p>

      <CaseHighlightActions title={h.title} citation={h.citation} url={pageUrl} />

      <div style={{ marginTop: 14 }}>
        <a
          href={`/case-highlights/${h.slug}/social-card`}
          download
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem',
            padding: '6px 12px', border: '1px solid var(--line)', borderRadius: 3,
            textDecoration: 'none', color: 'var(--ink)',
          }}
        >
          🖼️ Download social media graphic
        </a>
      </div>
    </div>
  );
}
