// Splits raw text into real paragraphs for readable display instead of
// one unbroken block.
export default function FormattedText({ text, className }) {
  if (!text) return null;

  let paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length <= 1) {
    paragraphs = text.split(/\n/).map((p) => p.trim()).filter(Boolean);
  }

  return (
    <div className={className}>
      {paragraphs.map((para, i) => (
        <p key={i} style={{ marginBottom: '1em', lineHeight: 1.75 }}>
          {para}
        </p>
      ))}
    </div>
  );
}
