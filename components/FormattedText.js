// Formats raw judgment/legal text into properly readable paragraphs.
//
// The source text often has a line break after nearly every printed line
// (an artifact of how text gets extracted from PDFs), not just at real
// paragraph boundaries. Treating every line break as a new paragraph was
// causing names and sentences to fragment across many one-line paragraphs.
//
// Instead: collapse those line-wrap artifacts back into flowing text, and
// only start a genuinely new paragraph at real markers - numbered
// paragraphs (Pakistani judgments consistently use "1.", "2.", "3." ...),
// or actual blank-line breaks in the source.
export default function FormattedText({ text, className }) {
  if (!text) return null;

  // Step 1: split on genuine blank-line breaks first
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  const paragraphs = [];
  blocks.forEach((block) => {
    // Step 2: within each block, split further at numbered paragraph
    // markers (e.g. a line starting with "12. ") - this is the judgment's
    // real internal structure
    const numbered = block.split(/\n(?=\d{1,3}\.\s)/);

    numbered.forEach((chunk) => {
      // Step 3: collapse any remaining single line breaks (word-wrap
      // artifacts) into plain spaces, so names/sentences read normally
      const collapsed = chunk.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      if (collapsed) paragraphs.push(collapsed);
    });
  });

  // Safety fallback: if this produced nothing usable, just show the
  // original text with basic paragraph splitting rather than nothing at all
  if (paragraphs.length === 0) {
    return (
      <div className={className}>
        <p style={{ lineHeight: 1.75 }}>{text}</p>
      </div>
    );
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
