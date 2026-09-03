export const metadata = {
  title: 'Pakistani Legal History Timeline',
  description: 'Key milestones in the development of Pakistan\'s constitution and judicial system.',
};

const EVENTS = [
  { year: '1947', title: 'Independence and the Government of India Act', desc: 'Pakistan gains independence; the Government of India Act, 1935 (as adapted) serves as an interim constitution.' },
  { year: '1956', title: 'First Constitution of Pakistan', desc: 'Pakistan\'s first constitution is adopted, establishing it as an Islamic Republic.' },
  { year: '1962', title: 'Second Constitution', desc: 'A new constitution is promulgated under President Ayub Khan, introducing a presidential system.' },
  { year: '1973', title: 'The 1973 Constitution', desc: 'Pakistan\'s current constitution is adopted, establishing a parliamentary system and remaining the foundational legal document today, as subsequently amended.' },
  { year: '1979', title: 'Federal Shariat Court Established', desc: 'The Federal Shariat Court is created to examine whether laws conform to Islamic injunctions.' },
  { year: '2009', title: '18th Amendment (initiated)', desc: 'A major constitutional reform process begins, ultimately passed in 2010, significantly devolving powers to the provinces.' },
  { year: '2010', title: '18th Amendment Passed', desc: 'One of the most significant amendments to the 1973 Constitution, restoring parliamentary powers reduced under earlier military rule and devolving several federal subjects to the provinces.' },
  { year: '2025', title: '27th Amendment — Federal Constitutional Court Created', desc: 'A new apex court, the Federal Constitutional Court, is established with exclusive jurisdiction over constitutional matters, separating this role from the Supreme Court for the first time. See our full explainer.' },
];

export default function LegalHistoryPage() {
  return (
    <div className="content-page" style={{ maxWidth: 760 }}>
      <h1>Pakistani Legal History Timeline</h1>
      <p>
        Key milestones in the development of Pakistan&apos;s constitution and judicial system.
      </p>

      <div style={{ marginTop: 24, borderLeft: '2px solid var(--line)', paddingLeft: 24 }}>
        {EVENTS.map((e) => (
          <div key={e.year} style={{ marginBottom: 28, position: 'relative' }}>
            <div
              style={{
                position: 'absolute', left: -30, top: 4, width: 10, height: 10,
                borderRadius: '50%', background: 'var(--gold, #c8a24a)',
              }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--navy)', fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>
              {e.year}
            </div>
            <h2 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{e.title}</h2>
            <p style={{ margin: 0 }}>
              {e.desc.includes('full explainer') ? (
                <>
                  A new apex court, the Federal Constitutional Court, is established with
                  exclusive jurisdiction over constitutional matters, separating this role from
                  the Supreme Court for the first time. See our{' '}
                  <a href="/federal-constitutional-court">full explainer</a>.
                </>
              ) : e.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
