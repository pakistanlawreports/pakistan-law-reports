import { headers } from 'next/headers';

export default function WelcomeBanner() {
  const headersList = headers();
  const city = headersList.get('x-vercel-ip-city');
  const country = headersList.get('x-vercel-ip-country');

  if (!city && !country) return null;

  const decodedCity = city ? decodeURIComponent(city) : '';
  const location = [decodedCity, country].filter(Boolean).join(', ');

  return (
    <div
      style={{
        background: 'var(--paper-raised)', borderBottom: '1px solid var(--line)',
        padding: '6px 24px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--ink-muted)',
      }}
    >
      👋 Welcome, visitor from {location}!
    </div>
  );
}
