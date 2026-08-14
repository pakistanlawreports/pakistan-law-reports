import { ImageResponse } from 'next/og';
import { getLawyerBySlug } from '../../../../lib/data';

export const alt = 'Pakistan Law Reports lawyer profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const lawyer = getLawyerBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', backgroundColor: '#01411C',
          padding: '60px', fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            width: 110, height: 110, borderRadius: 55, backgroundColor: '#c8a24a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, color: '#01411C', fontWeight: 700, marginBottom: 28,
          }}
        >
          {lawyer?.name ? lawyer.name.charAt(0).toUpperCase() : '⚖'}
        </div>

        <div style={{ color: 'white', fontSize: 50, fontWeight: 700, textAlign: 'center', marginBottom: 16 }}>
          {lawyer?.name || 'Pakistan Law Reports'}
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          {lawyer?.city && (
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)', color: '#e4d3a3',
                padding: '8px 20px', borderRadius: 20, fontSize: 22,
              }}
            >
              {lawyer.city}
            </div>
          )}
          {lawyer?.practice_area && (
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)', color: 'white',
                padding: '8px 20px', borderRadius: 20, fontSize: 22,
              }}
            >
              {lawyer.practice_area}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', color: '#c9d4c9', fontSize: 18 }}>
          pakistanlawreports.com/lawyers — Free Lawyer Directory
        </div>
      </div>
    ),
    { ...size }
  );
}
