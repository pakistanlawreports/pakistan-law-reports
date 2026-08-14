import { ImageResponse } from 'next/og';
import { getTopicBySlug, getJudgmentsByTopic } from '../../../lib/data';

export const alt = 'Pakistan Law Reports topic page';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TOPIC_ICONS = {
  'Criminal Law': '⚖️',
  'Constitutional Law': '📜',
  'Family Law': '👨‍👩‍👧',
  'Property & Rent': '🏠',
  'Tax Law': '💰',
  'Banking & Corporate': '🏦',
  'Labour & Service': '👷',
  'Company Law': '🏢',
  'Succession & Inheritance': '📋',
  'Civil Law': '🗂️',
  'General': '📄',
};

export default async function Image({ params }) {
  const topic = getTopicBySlug(params.topic);
  const count = topic ? getJudgmentsByTopic(topic).length : 0;
  const icon = TOPIC_ICONS[topic] || '📄';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', backgroundColor: '#01411C',
          padding: '60px', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>{icon}</div>
        <div style={{ color: 'white', fontSize: 54, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>
          {topic || 'Pakistan Law Reports'}
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.12)', color: '#e4d3a3',
            padding: '10px 26px', borderRadius: 22, fontSize: 24, marginBottom: 40,
          }}
        >
          {count.toLocaleString()} judgments
        </div>
        <div style={{ display: 'flex', color: '#c9d4c9', fontSize: 18 }}>
          pakistanlawreports.com — Free, searchable Pakistani case law
        </div>
      </div>
    ),
    { ...size }
  );
}
