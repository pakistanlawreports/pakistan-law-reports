import { ImageResponse } from 'next/og';

export const alt = 'Pakistan Law Reports - Free Pakistani Case Law';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#01411C',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            width: 90, height: 90, borderRadius: 45, backgroundColor: '#c8a24a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 44, color: '#01411C', fontWeight: 700, marginBottom: 28,
          }}
        >
          ⚖
        </div>

        <div
          style={{
            color: 'white', fontSize: 60, fontWeight: 700, textAlign: 'center',
            marginBottom: 16,
          }}
        >
          Pakistan Law Reports
        </div>

        <div
          style={{
            color: '#e4d3a3', fontSize: 26, textAlign: 'center', marginBottom: 36,
          }}
        >
          Search Pakistani Case Law, Free
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)', color: 'white',
              padding: '10px 22px', borderRadius: 22, fontSize: 20,
            }}
          >
            22,000+ Judgments
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)', color: 'white',
              padding: '10px 22px', borderRadius: 22, fontSize: 20,
            }}
          >
            Updated Daily
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)', color: 'white',
              padding: '10px 22px', borderRadius: 22, fontSize: 20,
            }}
          >
            No Login Required
          </div>
        </div>

        <div style={{ display: 'flex', color: '#c9d4c9', fontSize: 20, marginTop: 40 }}>
          pakistanlawreports.com
        </div>
      </div>
    ),
    { ...size }
  );
}
