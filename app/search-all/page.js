import fs from 'fs';
import path from 'path';
import { getAllJudgments } from '../../lib/data';
import UnifiedSearch from '../../components/UnifiedSearch';

function readJsonSafe(filename, fallback) {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return fallback;
  }
}

export const metadata = {
  title: 'Search Everything',
  description: 'Search across judgments, case highlights, study guides, and legal news in one place.',
};

export default function SearchAllPage() {
  const judgments = getAllJudgments().map((j) => ({
    type: 'judgment',
    title: j.title,
    meta: [j.citation, j.court, j.year].filter(Boolean).join(' · '),
    href: `/judgments/${j.slug}`,
  }));

  const highlights = readJsonSafe('case_highlights.json', []).map((h) => ({
    type: 'highlight',
    title: h.title,
    meta: [h.citation, h.court].filter(Boolean).join(' · '),
    href: '/case-highlights',
  }));

  const guidesData = readJsonSafe('study_guides.json', {});
  const guides = Object.values(guidesData).map((g) => ({
    type: 'guide',
    title: g.topic,
    meta: `Based on ${g.based_on_cases?.length || 0} cases`,
    href: '/study-guides',
  }));

  const news = readJsonSafe('news_digest.json', []).map((n) => ({
    type: 'news',
    title: n.title,
    meta: n.source || '',
    href: '/news-digest',
  }));

  const allItems = [...judgments, ...highlights, ...guides, ...news];

  return (
    <div className="content-page" style={{ maxWidth: 900 }}>
      <h1>Search Everything</h1>
      <p>
        Search across judgments, case highlights, study guides, and legal news — all in one
        place.
      </p>

      <UnifiedSearch items={allItems} />
    </div>
  );
}
