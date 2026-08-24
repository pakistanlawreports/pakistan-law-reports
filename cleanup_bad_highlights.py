"""
One-time cleanup: removes the broken highlight entries that were actually
statutes/regulations, not judgments - these slipped through before the
filtering fix and show up as generic "this isn't a judgment" explanations.
"""

import json

HIGHLIGHTS_FILE = "data/case_highlights.json"

BAD_SLUGS = {
    "the-trusts-act-1882-act-no-ii-of-1882-13th-january-1882",
    "the-glanders-and-farcy-act-1899",
    "enforcement-of-shari-ah-act-1991",
    "nepra-regulations-2012",
    "the-sacked-employees-reinstatement-ordinance-2010",
    "the-cattle-trespass-act-1871",
    "quaid-e-azam-s-address-to-the-constituent-assembly-of-pakistan",
    "the-punjab-murderous-outrages-act-1867",
    "the-voluntary-social-welfare-agencies-registration-and-control-ordinance-1961",
    "the-provincial-employees-social-security-ordinance-1965",
    "administrator-general-s-act-amendment-of-2012",
    "amendment-to-the-pakistan-penal-code-section-509",
}

with open(HIGHLIGHTS_FILE, encoding="utf-8") as f:
    highlights = json.load(f)

before = len(highlights)
highlights = [h for h in highlights if h["slug"] not in BAD_SLUGS]
after = len(highlights)

with open(HIGHLIGHTS_FILE, "w", encoding="utf-8") as f:
    json.dump(highlights, f, ensure_ascii=False, indent=2)

print(f"Removed {before - after} broken entries. {after} highlights remain.")
