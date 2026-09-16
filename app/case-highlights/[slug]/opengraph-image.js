import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const alt = 'Pakistan Law Reports - Case Highlight';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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

export default async function Image({ params }) {
  const highlight = getHighlight(params.slug);

  const title = highlight?.title || 'Pakistan Law Reports';
  const citation = highlight?.citation || '';
  const hook = highlight?.explainer ? truncate(highlight.explainer, 140) : '';

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
          padding: '56px 64px',
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
          <div style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>Pakistan Law Reports</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: '#e4d3a3', fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>
            📝 CASE HIGHLIGHT
          </div>
          <div
            style={{
              color: 'white',
              fontSize: title.length > 70 ? 38 : 48,
              fontWeight: 700,
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
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
                padding: '8px 20px', borderRadius: 20, fontSize: 20, alignSelf: 'flex-start',
              }}
            >
              {citation}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', color: '#c9d4c9', fontSize: 18 }}>
          pakistanlawreports.com — Free, searchable Pakistani case law
        </div>
      </div>
    ),
    { ...size }
  );
}
