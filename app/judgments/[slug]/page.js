import { getAllSlugs, getJudgmentBySlug, getRelatedJudgments } from '../../../lib/data';
import JudgmentActions from '../../../components/JudgmentActions';
import FormattedText from '../../../components/FormattedText';
import fs from 'fs';
import path from 'path';

const TOPIC_CLASS = {
  'Criminal Law': 'topic-criminal',
  'Constitutional Law': 'topic-constitutional',
  'Family Law': 'topic-family',
  'Property & Rent': 'topic-property',
  'Tax Law': 'topic-tax',
  'Banking & Corporate': 'topic-banking',
  'Labour & Service': 'topic-labour',
  'Company Law': 'topic-company',
  'Succession & Inheritance': 'topic-succession',
  'Civil Law': 'topic-civil',
};

function getHighlightForSlug(slug) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'case_highlights.json');
    if (!fs.existsSync(filePath)) return null;
    const highlights = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return highlights.find((h) => h.slug === slug) || null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const j = getJudgmentBySlug(params.slug);
  if (!j) return { title: 'Judgment not found' };

  const descBase = j.excerpt || j.title;
  const description = `${j.title}${j.citation ? ` (${j.citation})` : ''}${j.court ? ` — ${j.court}` : ''}. ${descBase}`.slice(0, 160);

  return {
    title: j.title,
    description,
    alternates: { canonical: `/judgments/${j.slug}` },
    openGraph: {
      title: `${j.title} | Pakistan Law Reports`,
      description,
      type: 'article',
    },
    ...(j.has_full_text === false ? { robots: { index: false, follow: true } } : {}),
  };
}

export default function JudgmentPage({ params }) {
  const j = getJudgmentBySlug(params.slug);

  if (!j) {
    return (
      <div className="content-page">
        <h1>Judgment not found</h1>
        <p>This judgment may have been moved or removed. <a href="/">Return to search</a>.</p>
      </div>
    );
  }

  const related = getRelatedJudgments(j, 5);
  const pageUrl = `https://pakistanlawreports.com/judgments/${j.slug}`;
  const highlight = getHighlightForSlug(j.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Legislation',
    name: j.title,
    legislationIdentifier: j.citation || undefined,
    datePublished: j.year || undefined,
    about: j.court || undefined,
    inLanguage: 'en',
  };

  return (
    <div className="judgment-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="judgment-header">
        <h1>{j.title}</h1>
        {j.content_type && j.content_type !== 'JUDGMENT' && (
          <div
            style={{
              background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 3,
              padding: '10px 14px', marginBottom: 14, fontSize: '0.85rem', color: '#3730a3',
            }}
          >
            📌 <strong>Note:</strong> this is not a court judgment — it&apos;s a{' '}
            {j.content_type === 'STATUTE' ? 'statute/ordinance' :
             j.content_type === 'FORM' ? 'form/template' :
             j.content_type === 'ARTICLE' ? 'informational article' : 'legal document'}.
            See our <a href="/legal-texts">Statutes, Forms &amp; Legal Resources</a> section for more like this.
          </div>
        )}
        <div className="tag-row">
          {j.citation && <span className="tag">{j.citation}</span>}
          {j.court && j.court !== 'Not specified' && <span className="tag outline">{j.court}</span>}
          {j.topic && j.topic !== 'General' && (
            <span className={`tag ${TOPIC_CLASS[j.topic] || ''}`}>{j.topic}</span>
          )}
          {j.year && <span className="tag outline">{j.year}</span>}
        </div>
        {j.judges && (
          <p style={{ marginTop: 14, fontSize: '0.92rem', color: 'var(--ink-muted)' }}>
            <strong>Bench:</strong> {j.judges}
          </p>
        )}
        <JudgmentActions title={j.title} citation={j.citation} court={j.court} year={j.year} url={pageUrl} />
      </div>

      {highlight && (
        <div
          style={{
            marginBottom: 28, padding: 20, background: '#f0f7f2',
            border: '1px solid #cde3d3', borderRadius: 4,
          }}
        >
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 10 }}>
            📝 AI Summary — Plain-Language Overview
          </p>
          <FormattedText text={highlight.explainer} />
          {highlight.explainer_ur && (
            <div style={{ marginTop: 10, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
              <div dir="rtl" lang="ur" style={{ fontFamily: 'var(--font-body), "Noto Nastaliq Urdu", sans-serif', fontSize: '1rem' }}>
                <FormattedText text={highlight.explainer_ur} />
              </div>
            </div>
          )}
          <p style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', marginTop: 10, marginBottom: 0 }}>
            Generated from the full judgment text below — not a substitute for reading the actual opinion.
          </p>
        </div>
      )}

      <FormattedText text={j.full_text} className="judgment-body" />

      {j.has_full_text === false && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            borderRadius: 3,
            fontSize: '0.9rem',
          }}
        >
          Full judgment text for this case is not yet available on Pakistan Law Reports.
          {j.source_url ? (
            <>
              {' '}
              <a href={j.source_url} target="_blank" rel="noopener noreferrer">
                View the full order on the official Sindh High Court portal
              </a>.
            </>
          ) : (
            ' Check the official Sindh High Court case law portal for the complete order.'
          )}
        </div>
      )}

      <div className="source-note">
        This judgment is reproduced from a publicly available source for informational purposes
        and does not constitute legal advice. If you believe this listing contains an error,{' '}
        <a href="/contact">let us know</a>.
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>Related judgments</h2>
          {related.map((r) => (
            <a key={r.slug} href={`/judgments/${r.slug}`} className="judgment-card">
              <span>
                <h3 className="judgment-title" style={{ fontSize: '0.95rem' }}>{r.title}</h3>
                <div className="judgment-meta">
                  {[r.citation, r.court, r.year].filter(Boolean).join(' · ')}
                </div>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
