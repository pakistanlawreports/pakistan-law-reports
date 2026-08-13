'use client';

import { useState, useMemo } from 'react';

const TYPE_LABELS = {
  judgment: { label: 'Judgments', icon: '⚖️' },
  highlight: { label: 'Case Highlights', icon: '📝' },
  guide: { label: 'Study Guides', icon: '📚' },
  news: { label: 'Legal News', icon: '📰' },
};

export default function UnifiedSearch({ items }) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const hasSearched = Boolean(query.trim() || typeFilter);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (typeFilter && item.type !== typeFilter) return false;
      if (q) {
        const hay = `${item.title} ${item.meta || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, query, typeFilter]);

  return (
    <div>
      <div className="search-wrap">
        <input
          type="text"
          className="search-input"
          placeholder="Search judgments, case highlights, study guides, news…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search all content"
        />
        <div className="filter-row">
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by content type"
          >
            <option value="">All content types</option>
            {Object.entries(TYPE_LABELS).map(([key, v]) => (
              <option key={key} value={key}>{v.label}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="results-section">
        {!hasSearched ? (
          <div className="empty-state">
            Start typing above, or choose a content type, to search across {items.length.toLocaleString()} items.
          </div>
        ) : (
          <>
            <p className="results-count">{filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''} found</p>
            {filtered.length === 0 && (
              <div className="empty-state">No results match that search. Try a different keyword.</div>
            )}
            {filtered.slice(0, 50).map((item, i) => (
              <a key={i} href={item.href} className="judgment-card">
                <span>
                  <span
                    style={{
                      display: 'inline-block', fontSize: '0.68rem', fontWeight: 700,
                      letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--gold, #c8a24a)',
                      marginBottom: 4,
                    }}
                  >
                    {TYPE_LABELS[item.type]?.icon} {TYPE_LABELS[item.type]?.label}
                  </span>
                  <h3 className="judgment-title" style={{ fontSize: '0.95rem' }}>{item.title}</h3>
                  {item.meta && <div className="judgment-meta">{item.meta}</div>}
                </span>
              </a>
            ))}
          </>
        )}
      </section>
    </div>
  );
}
