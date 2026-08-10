import { ImageResponse } from 'next/og';
import { getJudgmentBySlug } from '../../../lib/data';

export const runtime = 'edge';
export const alt = 'Pakistan Law Reports judgment';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const j = getJudgmentBySlug(params.slug);

  const title = j?.title || 'Pakistan Law Reports';
  const citation = j?.citation || '';
  const court = j?.court || '';
  const year = j?.year || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#01411C',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 22, backgroundColor: '#c8a24a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: '#01411C', fontWeight: 700,
            }}
          >
            ⚖
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>Pakistan Law Reports</div>
            <div style={{ color: '#c9d4c9', fontSize: 14 }}>Judgments &amp; Pakistani case law</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              color: 'white',
              fontSize: title.length > 80 ? 40 : 52,
              fontWeight: 700,
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {citation && (
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)', color: '#e4d3a3',
                  padding: '8px 18px', borderRadius: 20, fontSize: 20,
                }}
              >
                {citation}
              </div>
            )}
            {court && (
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)', color: 'white',
                  padding: '8px 18px', borderRadius: 20, fontSize: 20,
                }}
              >
                {court}
              </div>
            )}
            {year && (
              <div
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)', color: 'white',
                  padding: '8px 18px', borderRadius: 20, fontSize: 20,
                }}
              >
                {year}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', color: '#c9d4c9', fontSize: 18 }}>
          pakistanlawreports.com — Free, searchable Pakistani case law
        </div>
      </div>
    ),
    { ...size }
  );
}
