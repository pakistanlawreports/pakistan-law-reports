import { ImageResponse } from 'next/og';
import { getCourtBySlug, getJudgmentsByCourt } from '../../../lib/data';

export const alt = 'Pakistan Law Reports court page';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const court = getCourtBySlug(params.court);
  const count = court ? getJudgmentsByCourt(court).length : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', backgroundColor: '#01411C',
          padding: '60px 70px', fontFamily: 'sans-serif',
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
          <div style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>Pakistan Law Reports</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ color: '#e4d3a3', fontSize: 22, fontWeight: 700 }}>COURT</div>
          <div style={{ color: 'white', fontSize: 54, fontWeight: 700, lineHeight: 1.2 }}>
            {court || 'Pakistan Law Reports'}
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)', color: 'white',
              padding: '10px 22px', borderRadius: 22, fontSize: 22, alignSelf: 'flex-start',
            }}
          >
            {count.toLocaleString()} judgments
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
