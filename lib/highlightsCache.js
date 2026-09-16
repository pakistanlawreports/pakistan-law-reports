import fs from 'fs';
import path from 'path';

// Module-level cache - the file is read and parsed ONCE, the first time
// any page needs it, then reused for every subsequent page during the
// same build. Previously, every single judgment/court/topic page was
// re-reading and re-parsing this entire (large, growing) file from disk
// on its own, which is what pushed build time past Vercel's 45-minute
// limit once the file grew past ~1,700 entries.
let _cachedHighlights = null;
let _cachedSlugMap = null;

function loadHighlights() {
  if (_cachedHighlights !== null) return _cachedHighlights;

  try {
    const filePath = path.join(process.cwd(), 'data', 'case_highlights.json');
    if (!fs.existsSync(filePath)) {
      _cachedHighlights = [];
    } else {
      _cachedHighlights = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch {
    _cachedHighlights = [];
  }
  return _cachedHighlights;
}

function loadSlugMap() {
  if (_cachedSlugMap !== null) return _cachedSlugMap;
  const highlights = loadHighlights();
  _cachedSlugMap = {};
  highlights.forEach((h) => {
    _cachedSlugMap[h.slug] = h;
  });
  return _cachedSlugMap;
}

export function getAllHighlightsCached() {
  return loadHighlights();
}

export function getHighlightBySlugCached(slug) {
  return loadSlugMap()[slug] || null;
}

export function getHighlightsForCourtCached(court) {
  return loadHighlights().filter((h) => h.court === court).slice(0, 3);
}

export function getHighlightsForTopicCached(topic, index) {
  const highlights = loadHighlights();
  const slugToTopic = {};
  index.forEach((j) => { slugToTopic[j.slug] = j.topic; });
  return highlights.filter((h) => slugToTopic[h.slug] === topic).slice(0, 3);
}
