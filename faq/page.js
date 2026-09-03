export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Common questions about using Pakistan Law Reports and understanding Pakistani case law.',
};

const FAQS = [
  { q: 'Is Pakistan Law Reports really free?', a: 'Yes, entirely free. No login, no subscription, no paywall — the full database and all tools are free to use.' },
  { q: 'Where does the judgment data come from?', a: 'Directly from official court sources, including the Sindh High Court\'s public case law portal, updated automatically every day.' },
  { q: 'Is this a substitute for legal advice?', a: 'No. Pakistan Law Reports is an informational resource for researching case law. For advice on your specific situation, consult a licensed advocate.' },
  { q: 'What is a Case Highlight?', a: 'A plain-language explainer of a judgment\'s facts, holding, and significance, written after reading the full judgment text — available in English and Urdu.' },
  { q: 'Can I search in Urdu?', a: 'Yes — the Find Related Cases tool accepts English, Urdu, and Roman Urdu, and Case Highlights are available in both languages.' },
  { q: 'How do I get listed in the Lawyer Directory?', a: 'Submit your details through the Lawyers page. Every submission is reviewed and license numbers are verified before publishing.' },
  { q: 'What is the Judgment Summarizer?', a: 'A free tool where you can upload any judgment (PDF or pasted text) and receive a structured brief — facts, issues, holding, precedents cited, and practical takeaways.' },
  { q: 'How often is the database updated?', a: 'New Sindh High Court judgments are added daily. Case Highlights and Study Guides are generated on an ongoing basis as more full-text judgments are added.' },
  { q: 'What is the Federal Constitutional Court?', a: 'A new apex court created in November 2025 that now holds exclusive jurisdiction over constitutional matters, separate from the Supreme Court. See our full explainer page for details.' },
  { q: 'Can I request a specific judgment be added?', a: 'Yes — use the Judgment Summarizer to generate a brief, then use the submit option to send it for review and possible inclusion in the database.' },
];

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="content-page" style={{ maxWidth: 760 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>Frequently Asked Questions</h1>

      <div style={{ marginTop: 24 }}>
        {FAQS.map((f) => (
          <div key={f.q} style={{ padding: '16px 0', borderBottom: '1px solid var(--line)' }}>
            <h2 style={{ fontSize: '1.05rem', marginBottom: 6 }}>{f.q}</h2>
            <p style={{ margin: 0 }}>{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
