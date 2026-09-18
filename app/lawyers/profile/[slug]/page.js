import { getAllLawyers, getLawyerBySlug } from '../../../../lib/data';

export async function generateStaticParams() {
  return getAllLawyers().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const lawyer = getLawyerBySlug(params.slug);
  if (!lawyer) return { title: 'Lawyer not found' };
  return {
    title: lawyer.name,
    description: `${lawyer.name}${lawyer.city ? ` — ${lawyer.city}` : ''}${lawyer.practice_area ? `, ${lawyer.practice_area}` : ''}. Listed on Pakistan Law Reports' free lawyer directory.`,
    alternates: { canonical: `/lawyers/profile/${params.slug}` },
  };
}

export default function LawyerProfilePage({ params }) {
  const lawyer = getLawyerBySlug(params.slug);

  if (!lawyer) {
    return (
      <div className="content-page">
        <h1>Lawyer not found</h1>
        <p><a href="/lawyers">Return to Lawyer Directory</a>.</p>
      </div>
    );
  }

  return (
    <div className="content-page" style={{ maxWidth: 700 }}>
      <p style={{ fontSize: '0.85rem' }}><a href="/lawyers">← Lawyer Directory</a></p>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {lawyer.photo ? (
          <img
            src={lawyer.photo}
            alt={lawyer.name}
            style={{
              width: 110, height: 110, borderRadius: '50%', objectFit: 'cover',
              border: '2px solid var(--line)',
            }}
          />
        ) : (
          <div
            style={{
              width: 110, height: 110, borderRadius: '50%', background: 'var(--paper-raised)',
              border: '2px solid var(--line)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '2.2rem', color: 'var(--navy)',
              fontFamily: 'var(--font-display)', fontWeight: 600,
            }}
          >
            {lawyer.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 style={{ marginBottom: 4 }}>{lawyer.name}</h1>
          <p style={{ color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', margin: 0 }}>
            {[lawyer.city, lawyer.practice_area].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        {lawyer.verified ? (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem',
              fontWeight: 600, padding: '5px 12px', borderRadius: 12,
              background: '#f0f7f2', border: '1px solid #cde3d3', color: '#1a5c38',
            }}
          >
            ✓ License verified via Bar Council records
          </span>
        ) : (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem',
              fontWeight: 600, padding: '5px 12px', borderRadius: 12,
              background: '#fff8e1', border: '1px solid #e4c869', color: '#7a5c1f',
            }}
          >
            ⓘ License number self-reported, not independently verified
          </span>
        )}
      </div>

      {lawyer.license_number && (
        <p style={{ marginTop: 14, fontSize: '0.88rem', color: 'var(--ink-muted)' }}>
          <strong>License / Registration:</strong> {lawyer.license_number}
        </p>
      )}

      {lawyer.bio && <p style={{ marginTop: 16 }}>{lawyer.bio}</p>}
      {lawyer.contact && (
        <p style={{ marginTop: 16 }}>
          <strong>Contact:</strong> {lawyer.contact}
        </p>
      )}

      <p style={{ marginTop: 32, fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
        Pakistan Law Reports does not vouch for the quality of this lawyer&apos;s services. This
        listing is provided for informational purposes only.
      </p>
    </div>
  );
}
