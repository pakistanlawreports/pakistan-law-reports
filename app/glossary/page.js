export const metadata = {
  title: 'Legal Glossary',
  description: 'Plain-language definitions of common Pakistani legal terms, in English and Urdu.',
};

const TERMS = [
  { term: 'FIR (First Information Report)', ur: 'ایف آئی آر', def: 'The document police prepare when they first receive information about a cognizable (arrestable) offence. It records the date, time, place, and the informant\'s account of what happened.' },
  { term: 'Khula', ur: 'خلع', def: 'A form of dissolution of marriage initiated by the wife, granted by a Family Court, generally without needing to prove fault by the husband.' },
  { term: 'Talaq', ur: 'طلاق', def: 'Divorce initiated by the husband under Muslim family law, subject to procedural requirements including notice to the Union Council.' },
  { term: 'Suo Motu', ur: 'از خود نوٹس', def: 'Latin for "on its own motion" — when a court takes up a case on its own initiative, without anyone filing a formal petition, usually in matters of public importance.' },
  { term: 'Habeas Corpus', ur: 'حبس بے جا', def: 'A constitutional petition asking a court to order that a detained person be brought before it, to determine whether their detention is lawful.' },
  { term: 'Nikahnama', ur: 'نکاح نامہ', def: 'The official Muslim marriage contract/registration document, which also records agreed terms like haq mehr (dower).' },
  { term: 'Haq Mehr (Dower)', ur: 'حق مہر', def: 'An amount or property the husband agrees to give the wife as part of the marriage contract, which becomes her legal right.' },
  { term: 'Benami', ur: 'بینامی', def: 'Property held in one person\'s name but actually owned/paid for by another — often the subject of disputes over the true ownership of an asset.' },
  { term: 'Vakalatnama', ur: 'وکالت نامہ', def: 'A formal document authorizing a lawyer (advocate) to represent a client in court proceedings.' },
  { term: 'Ex-parte', ur: 'یک طرفہ', def: 'A proceeding or decision made with only one side present, typically because the other party failed to appear despite notice.' },
  { term: 'Locus Standi', ur: 'حقِ استدعا', def: 'The legal right of a person to bring a case or petition before a court — whether they are a proper party to raise the issue.' },
  { term: 'Zimni (Order Sheet Entry)', ur: 'ضمنی', def: 'A brief entry recorded by a court on each hearing date, noting what happened and the next steps or date.' },
  { term: 'Mutation (Intiqal)', ur: 'انتقال', def: 'The official process of updating land revenue records to reflect a change in ownership, such as after a sale or inheritance.' },
  { term: 'Qabza', ur: 'قبضہ', def: 'Possession of property — often used in the context of disputes over illegal or forcible possession ("illegal qabza").' },
  { term: 'Anticipatory/Pre-Arrest Bail', ur: 'ضمانت قبل از گرفتاری', def: 'Bail sought before arrest, when a person fears they may be wrongfully implicated in a criminal case.' },
  { term: 'Cognizable Offence', ur: 'قابلِ دست اندازی جرم', def: 'A crime serious enough that police can arrest without a warrant and must register an FIR, such as murder or robbery.' },
  { term: 'Non-Cognizable Offence', ur: 'ناقابلِ دست اندازی جرم', def: 'A less serious offence where police cannot arrest without a warrant or investigate without a magistrate\'s permission.' },
  { term: 'Plaint', ur: 'دعویٰ / استغاثہ', def: 'The formal written document that starts a civil lawsuit, setting out the plaintiff\'s claims and the relief sought.' },
  { term: 'Decree', ur: 'ڈگری', def: 'The formal expression of a court\'s final decision in a civil suit, determining the rights of the parties.' },
  { term: 'Revision Petition', ur: 'نظرثانی درخواست', def: 'A request asking a higher court to review a lower court\'s decision for legal errors, distinct from a full appeal.' },
];

export default function GlossaryPage() {
  return (
    <div className="content-page" style={{ maxWidth: 800 }}>
      <h1>Legal Glossary</h1>
      <p>
        Plain-language definitions of common terms you&apos;ll encounter in Pakistani case law and
        legal proceedings.
      </p>

      <div style={{ marginTop: 24 }}>
        {TERMS.map((t) => (
          <div
            key={t.term}
            style={{
              padding: '16px 0', borderBottom: '1px solid var(--line)',
            }}
          >
            <h2 style={{ fontSize: '1.05rem', marginBottom: 4 }}>
              {t.term} <span dir="rtl" lang="ur" style={{ fontWeight: 400, fontSize: '0.95rem', color: 'var(--ink-muted)' }}>({t.ur})</span>
            </h2>
            <p style={{ margin: 0 }}>{t.def}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
