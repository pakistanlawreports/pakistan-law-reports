import JudgmentSummarizer from '../../components/JudgmentSummarizer';

export const metadata = {
  title: 'Judgment Summarizer',
  description: 'Upload a lengthy judgment and get a one-page brief with facts, issues, holdings, precedents, and takeaways.',
};

export default function JudgmentSummarizerPage() {
  return (
    <div className="content-page" style={{ maxWidth: 700 }}>
      <h1>Judgment Summarizer</h1>
      <p>
        Upload a lengthy judgment and receive a one-page brief — facts, issues, holdings,
        precedents cited, and practical takeaways — generated strictly from the document itself.
      </p>

      <JudgmentSummarizer />
    </div>
  );
}
