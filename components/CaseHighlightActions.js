'use client';

import { useState } from 'react';

export default function CaseHighlightActions({ title, citation, url }) {
  const [copied, setCopied] = useState(false);

  const shareText = `${title}${citation ? ` (${citation})` : ''} — Pakistan Law Reports`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail in some browser contexts - fail silently
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="action-btn whatsapp"
        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
      >
        WhatsApp
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="action-btn"
        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
      >
        Facebook
      </a>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="action-btn"
        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
      >
        X / Twitter
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="action-btn"
        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
      >
        {copied ? '✓ Link copied' : '🔗 Copy link'}
      </button>
    </div>
  );
}
