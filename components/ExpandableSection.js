'use client';

import { useState } from 'react';

export default function ExpandableSection({ icon, title, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        border: '1px solid var(--line)', borderRadius: 6, background: 'var(--paper-raised)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', fontFamily: 'inherit',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.3rem' }} aria-hidden="true">{icon}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--navy)', fontSize: '1rem' }}>
            {title}
          </span>
          {count != null && (
            <span
              style={{
                fontSize: '0.75rem', color: 'var(--ink-muted)', fontFamily: 'var(--font-mono)',
                background: 'var(--paper)', padding: '2px 8px', borderRadius: 10,
              }}
            >
              {count}
            </span>
          )}
        </span>
        <span style={{ color: 'var(--gold)', fontSize: '1.1rem', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}>
          ▾
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 18px 18px' }}>
          {children}
        </div>
      )}
    </div>
  );
}
