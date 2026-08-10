// Converts basic markdown formatting (**bold**, ## headers) that AI-generated
// text sometimes includes into actual rendered HTML, instead of showing the
// literal asterisks/hashes as plain characters.
export default function MarkdownLite({ text }) {
  if (!text) return null;

  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const renderInline = (str) => {
    // Split on **bold** markers and alternate plain/bold spans
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {paragraphs.map((para, i) => {
        // Treat lines starting with ### or ## as small headers
        const headerMatch = para.match(/^#{1,3}\s+(.+)/);
        if (headerMatch) {
          return (
            <h4 key={i} style={{ fontSize: '1rem', marginTop: 16, marginBottom: 6 }}>
              {renderInline(headerMatch[1])}
            </h4>
          );
        }
        // Treat lines starting with "- " as a simple bullet
        if (para.startsWith('- ')) {
          const items = para.split(/\n-\s+/).map((s) => s.replace(/^-\s+/, ''));
          return (
            <ul key={i} style={{ marginBottom: '1em' }}>
              {items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
            </ul>
          );
        }
        return (
          <p key={i} style={{ marginBottom: '1em', lineHeight: 1.75 }}>
            {renderInline(para)}
          </p>
        );
      })}
    </>
  );
}
