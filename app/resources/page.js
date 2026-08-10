import ExpandableSection from '../../components/ExpandableSection';

export const metadata = {
  title: 'Legal Resources',
  description: 'Practical legal information and links to official Pakistani government resources.',
};

const DRAFT_CATEGORIES = [
  {
    icon: '📄',
    title: 'Important Drafts',
    links: [
      { href: 'https://www.draftify.org/category/cat_imp/pt_written_statement', label: 'Written Statement' },
    ],
  },
  {
    icon: '📋',
    title: 'Miscellaneous Applications',
    links: [
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_urgency_application', label: 'Application For Urgency Application' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_exempt_application', label: 'Application For Exemption Application' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_notice', label: 'Notice' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_pasting', label: 'Pasting' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_return_of_surety', label: 'Application for Return of Surety' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_change_of_surety', label: 'Application for Change of Surety' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_accept_fresh_of_surety', label: 'Application for Accept of Fresh Surety' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_reduction_of_surety', label: 'Application for Reduction of Surety' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_no_objection', label: 'Application for No Objection' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_statement_of_citation', label: 'Statement of Citation' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_540_application', label: '540 Cr.PC Application' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_523_restoration_application', label: 'Application under Section 523 Cr.P.C for Release of Property Seized under Section 550 Cr.P.C' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_certified_true_copies', label: 'Certified True Copy Application' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_special_power_of_attorney', label: 'Special Power of Attorney' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_condonation_75_2_crpc', label: 'Condonation of Absence under Section 75(2) Cr.P.C' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_section_173_cpc', label: 'Application under Section 173 C.P.C' },
      { href: 'https://www.draftify.org/category/cat_misc_application/pt_exemption_from_attendance_205_crpc', label: 'Exemption from Attendance under Section 205 CrPC' },
    ],
  },
  {
    icon: '🏠',
    title: 'Property Transaction Documents',
    links: [
      { href: 'https://www.draftify.org/category/cat_property/pt_sale_deed', label: 'Sale Deed' },
      { href: 'https://www.draftify.org/category/cat_property/pt_gift_deed', label: 'Gift Deed' },
      { href: 'https://www.draftify.org/category/cat_property/pt_general_power_of_attorney', label: 'General Power of Attorney' },
    ],
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Family Suit',
    links: [
      { href: 'https://www.draftify.org/category/cat_family/pt_khula', label: 'Khula Suit' },
      { href: 'https://www.draftify.org/category/cat_family/pt_khula_dowry', label: 'Khula & Dowry Recovery Suit' },
      { href: 'https://www.draftify.org/category/cat_family/pt_khula_maintenance_dowry', label: 'Khula, Maintenance & Dowry Recovery Suit' },
      { href: 'https://www.draftify.org/category/cat_family/pt_khula_maintenance_minors_dowry', label: 'Khula, Maintenance (Plaintiff & Minors) & Dowry Recovery Suit' },
      { href: 'https://www.draftify.org/category/cat_family/pt_maintenance_plaintiff', label: 'Maintenance Suit (Plaintiff)' },
      { href: 'https://www.draftify.org/category/cat_family/pt_maintenance_plaintiff_minors', label: 'Maintenance Suit (Plaintiff & Minors)' },
      { href: 'https://www.draftify.org/category/cat_family/pt_restitution', label: 'Restitution of Conjugal Rights Suit' },
      { href: 'https://www.draftify.org/category/cat_family/pt_guardianship', label: 'Guardianship & Custody Suit' },
    ],
  },
  {
    icon: '⚖️',
    title: 'Bail Applications',
    links: [
      { href: 'https://www.draftify.org/category/cat_bail/pt_bail_426', label: 'Bail U/S 426 CrPC' },
      { href: 'https://www.draftify.org/category/cat_bail/pt_bail_496', label: 'Bail U/S 496 CrPC' },
      { href: 'https://www.draftify.org/category/cat_bail/pt_bail_497', label: 'Bail U/S 497 CrPC' },
      { href: 'https://www.draftify.org/category/cat_bail/pt_bail_498', label: 'Pre-Arrest Bail U/S 498 CrPC' },
      { href: 'https://www.draftify.org/category/cat_bail/pt_bail_protective', label: 'Protective Bail U/S 498 CrPC' },
    ],
  },
  {
    icon: '🚔',
    title: 'Criminal Misc Applications',
    links: [
      { href: 'https://www.draftify.org/category/cat_criminal/pt_criminal_249A', label: '249-A' },
      { href: 'https://www.draftify.org/category/cat_criminal/pt_criminal_265K', label: '265-K' },
      { href: 'https://www.draftify.org/category/cat_criminal/pt_criminal_516A', label: '516-A' },
      { href: 'https://www.draftify.org/category/cat_criminal/pt_criminal_517', label: '517' },
      { href: 'https://www.draftify.org/category/cat_criminal/pt_22-A', label: '22-A' },
    ],
  },
  {
    icon: '🔑',
    title: 'Rent Applications',
    links: [
      { href: 'https://www.draftify.org/category/cat_rent/pt_section_14_rent', label: 'Section 14 Rent Application' },
      { href: 'https://www.draftify.org/category/cat_rent/pt_section_8_rent', label: 'Section 8 Rent Application' },
      { href: 'https://www.draftify.org/category/cat_rent/pt_section_15_2_II_rent', label: 'Section 15(2)(II) Rent Application' },
      { href: 'https://www.draftify.org/category/cat_rent/pt_section_15_2_VII_rent', label: 'Section 15(2)(VII) Rent Application' },
      { href: 'https://www.draftify.org/category/cat_rent/pt_section_16', label: 'Section 16 Rent Application' },
    ],
  },
  {
    icon: '📜',
    title: 'Constitutional Petition — High Court',
    links: [
      { href: 'https://www.draftify.org/category/cat_constitutional/pt_habeas_corpus_cp_highcourt', label: 'Habeas Corpus Petition in High Court' },
      { href: 'https://www.draftify.org/category/cat_constitutional/pt_MANDAMUS_cp_highcourt', label: 'Mandamus Petition in High Court' },
      { href: 'https://www.draftify.org/category/cat_constitutional/pt_Prohibition_cp_highcourt', label: 'Prohibition Petition in High Court' },
      { href: 'https://www.draftify.org/category/cat_constitutional/pt_Certiorari_cp_highcourt', label: 'Certiorari Petition in High Court' },
      { href: 'https://www.draftify.org/category/cat_constitutional/pt_quo_warranto_cp_highcourt', label: 'Quo Warranto Petition in High Court' },
      { href: 'https://www.draftify.org/category/cat_constitutional/pt_Legal_Protection_cp_highcourt', label: 'Legal Protection Petition in High Court' },
    ],
  },
  {
    icon: '🗂️',
    title: 'Civil Applications',
    links: [
      { href: 'https://www.draftify.org/category/cat_civil/pt_order1_rule10', label: 'Application for Addition/Substitution of Parties (Order I Rule 10 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order7_rule10', label: 'Application for Return of Plaint (Order VII Rule 10 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order7_rule11', label: 'Application for Rejection of Plaint (Order VII Rule 11 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order14_rule5', label: 'Application for Framing Additional Issues (Order XIV Rule 5 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order16', label: 'Application for Summoning Witnesses (Order XVI CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order18_rule17', label: 'Application for Recalling a Witness (Order XVIII Rule 17 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order26', label: 'Application for Commission for Examination of Witness (Order XXVI CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order26_rule9', label: 'Application for Local Investigation (Order XXVI Rule 9 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order39_rule1', label: 'Application for Temporary Injunction (Order XXXIX Rule 1 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order39_rule6', label: 'Application for Interim Sale (Order XXXIX Rule 6 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order39_rule7', label: 'Application for Detention/Preservation of Subject Matter (Order XXXIX Rule 7 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_order40', label: 'Application for Appointment of Receiver (Order XL CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_cpc144', label: 'Application for Restitution (Section 144 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_cpc152', label: 'Application for Correction of Clerical/Arithmetical Error (Section 152 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_guardian_appointment', label: 'Application for Appointment of Guardian (Order 32 Rule 3 CPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_discharge_of_sureties_502_crpc', label: 'Discharge of Sureties (Section 502 CrPC)' },
      { href: 'https://www.draftify.org/category/cat_civil/pt_suspension_of_execution_o21_r26', label: 'Suspension of Execution (Order 21 Rule 26 CPC)' },
    ],
  },
];

const LEGAL_GUIDES = [
  {
    icon: '🚓',
    title: 'Filing an FIR',
    text: `A First Information Report is the document police prepare when they first receive
      information about a cognizable offence. Under Pakistani law, a police officer in charge of
      a station is generally required to register an FIR when informed of a cognizable offence,
      free of cost. If a station refuses, a complainant can approach a higher police officer, a
      magistrate, or file a private complaint under the Criminal Procedure Code. The FIR should
      record the date, time, and place of occurrence, the informant's statement, and be
      signed by the informant after it is read back to them.`,
  },
  {
    icon: '⚖️',
    title: 'Bail — the Basics',
    text: `Bail in Pakistan is broadly divided into bailable and non-bailable offences. In bailable
      offences, bail is a right and must be granted. In non-bailable offences, bail is at the
      court's discretion, weighing factors like the nature of the offence, evidence, and
      flight risk. Applications are typically made first before a Sessions Court, and if
      refused, can be pursued before the relevant High Court.`,
  },
  {
    icon: '🗂️',
    title: 'Small Claims & Civil Suits',
    text: `Civil disputes — property, contracts, recovery of money — are generally filed as a suit
      before the civil court with jurisdiction over the matter, under the Civil Procedure Code.
      Many provinces also have simplified small-claims procedures for lower-value disputes,
      intended to resolve matters faster than a full civil suit.`,
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Family Law — Khula & Dissolution',
    text: `Family matters, including dissolution of marriage, custody, and maintenance, are handled
      by Family Courts under the Family Courts Act. A wife seeking dissolution through khula
      does not need to prove fault by the husband; courts have generally held that an
      irreconcilable breakdown of the marriage is sufficient grounds.`,
  },
];

export default function ResourcesPage() {
  return (
    <div className="content-page" style={{ maxWidth: 820 }}>
      <h1>Legal Resources</h1>
      <p>
        Practical legal information and templates, organized into categories below — click any
        section to expand it. This is informational only and does not constitute legal advice —
        for anything specific to your situation, consult a licensed advocate.
      </p>

      <h2 style={{ marginTop: 32 }}>Legal Guides</h2>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {LEGAL_GUIDES.map((g) => (
          <ExpandableSection key={g.title} icon={g.icon} title={g.title}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>{g.text}</p>
          </ExpandableSection>
        ))}
      </div>

      <h2 style={{ marginTop: 36 }}>Document Drafting Templates</h2>
      <p style={{ fontSize: '0.88rem', color: 'var(--ink-muted)' }}>
        Template resources provided by{' '}
        <a href="https://www.draftify.org" target="_blank" rel="noopener noreferrer">Draftify</a>,
        an independent drafting service. Pakistan Law Reports is not affiliated with Draftify and
        does not vouch for the accuracy of any specific template — always review and adapt any
        draft to your specific facts, and have it checked by a licensed advocate before filing.
      </p>
      <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
        {DRAFT_CATEGORIES.map((cat) => (
          <ExpandableSection key={cat.title} icon={cat.icon} title={cat.title} count={cat.links.length}>
            <ul style={{ margin: 0 }}>
              {cat.links.map((link) => (
                <li key={link.href} style={{ marginBottom: 4 }}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.92rem' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </ExpandableSection>
        ))}
      </div>

      <h2 style={{ marginTop: 36 }}>Specialized Support</h2>
      <div
        style={{
          border: '1px solid var(--line)', borderRadius: 6, background: 'var(--paper-raised)',
          padding: 18, marginTop: 12,
        }}
      >
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          🛡️ For domestic violence situations specifically,{' '}
          <a href="https://mehfooz.ai" target="_blank" rel="noopener noreferrer">Mehfooz.ai</a>{' '}
          offers AI-powered tools grounded in Pakistani law — including help drafting an FIR,
          documenting evidence, and assessing risk. Pakistan Law Reports is not affiliated with
          Mehfooz.ai; this is a pointer to an independent, specialized resource.
        </p>
      </div>

      <h2 style={{ marginTop: 36 }}>Official Government Resources</h2>
      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10,
          marginTop: 12,
        }}
      >
        {[
          { href: 'https://www.supremecourt.gov.pk', label: 'Supreme Court of Pakistan' },
          { href: 'https://www.pakistanbarcouncil.org', label: 'Pakistan Bar Council' },
          { href: 'https://na.gov.pk', label: 'National Assembly of Pakistan (legislation)' },
          { href: 'https://www.hec.gov.pk', label: 'Higher Education Commission (verify law school accreditation)' },
        ].map((r) => (
          <a
            key={r.href}
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', padding: '14px 16px', border: '1px solid var(--line)',
              borderRadius: 6, background: 'var(--paper-raised)', fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            {r.label}
          </a>
        ))}
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--ink-muted)', marginTop: 32 }}>
        Laws and procedures can change, and their application varies by case. Always verify
        current requirements with a licensed advocate or the relevant court/authority directly.
      </p>
    </div>
  );
}
