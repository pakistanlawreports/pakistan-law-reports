import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

function getHighlight(slug) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'case_highlights.json');
    if (!fs.existsSync(filePath)) return null;
    const highlights = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return highlights.find((h) => h.slug === slug) || null;
  } catch {
    return null;
  }
}

function truncate(text, max) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max).trim() + '…' : text;
}

export async function GET(request, { params }) {
  const highlight = getHighlight(params.slug);

  const title = highlight?.title || 'Pakistan Law Reports';
  const citation = highlight?.citation || '';
  const hook = highlight?.explainer
    ? truncate(highlight.explainer, 160)
    : 'Search Pakistani case law, free.';

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
          padding: '70px 64px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 28, backgroundColor: '#c8a24a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: '#01411C', fontWeight: 700,
            }}
          >
            ⚖
          </div>
          <div style={{ color: 'white', fontSize: 26, fontWeight: 700 }}>
            Pakistan Law Reports
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: '#e4d3a3', fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>
            📝 CASE HIGHLIGHT
          </div>
          <div
            style={{
              color: 'white',
              fontSize: title.length > 60 ? 42 : 52,
              fontWeight: 700,
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </div>
          {citation && (
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)', color: '#e4d3a3',
                padding: '10px 22px', borderRadius: 22, fontSize: 24, alignSelf: 'flex-start',
              }}
            >
              {citation}
            </div>
          )}
          <div
            style={{
              color: '#c9d4c9', fontSize: 26, lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {hook}
          </div>
        </div>

        <div style={{ display: 'flex', color: '#c9d4c9', fontSize: 22 }}>
          pakistanlawreports.com/case-highlights
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}
