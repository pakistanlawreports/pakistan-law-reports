"""
Study Guides Generator
--------------------------------------
For each legal topic, gathers several real full-text judgments already in
our database and asks Claude to synthesize a genuine study-guide overview
of that area of law - grounded strictly in what these real cases actually
establish, citing them by their real citation. Not generated from general
legal knowledge - only from our own verified judgment text.

Regenerates each topic's guide periodically as more full-text judgments
accumulate in that topic, so guides improve over time.

REQUIRES: ANTHROPIC_API_KEY environment variable (same secret already used
by the other automations).
"""

import json
import os
import glob
import time

import anthropic

DATA_DIR = "data"
GUIDES_FILE = os.path.join(DATA_DIR, "study_guides.json")
JUDGMENTS_DIR = os.path.join(DATA_DIR, "judgments")
INDEX_FILE = os.path.join(DATA_DIR, "judgments_index.json")

MIN_CASES_PER_TOPIC = 3     # don't generate a guide with too little real grounding
MAX_CASES_PER_TOPIC = 6     # keep prompt size reasonable
TOPICS_PER_RUN = 2          # generate/update a couple of topics per run

VALID_TOPICS = [
    'Criminal Law', 'Constitutional Law', 'Family Law', 'Property & Rent',
    'Tax Law', 'Banking & Corporate', 'Labour & Service', 'Company Law',
    'Succession & Inheritance', 'Civil Law',
]

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


def load_json(path, default):
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return default


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def get_full_text_cases_for_topic(topic, index, limit=MAX_CASES_PER_TOPIC):
    """Find real full-text judgments in this topic, pulling their actual text."""
    candidates = [e for e in index if e.get("topic") == topic and e.get("has_full_text") is not False]
    if not candidates:
        return []

    cases = []
    shard_cache = {}
    for entry in candidates[:limit * 3]:  # scan a few extra in case some lack real text
        if len(cases) >= limit:
            break
        slug = entry["slug"]
        found_text = None
        for fname in glob.glob(os.path.join(JUDGMENTS_DIR, "shard-*.json")):
            if fname not in shard_cache:
                with open(fname, encoding="utf-8") as f:
                    shard_cache[fname] = json.load(f)
            if slug in shard_cache[fname]:
                record = shard_cache[fname][slug]
                if len(record.get("full_text", "")) > 1500:
                    found_text = record
                break
        if found_text:
            cases.append(found_text)
    return cases


def generate_study_guide(topic, cases):
    """Ask Claude to synthesize a genuine overview from these specific real cases only."""
    case_texts = "\n\n---\n\n".join([
        f"Case: {c.get('title','')}\nCitation: {c.get('citation','')}\nText: {c.get('full_text','')[:3000]}"
        for c in cases
    ])

    prompt = f"""Below are {len(cases)} real Pakistani court judgments, all classified under
"{topic}". Write a study-guide overview (400-600 words) of this area of law, based STRICTLY
on what these specific cases actually establish - do not add general legal knowledge beyond
what's in this text. Reference the specific cases by citation where relevant. Organize it with
a brief intro, then key principles as bullet points or short sections, each tied to a specific
case. This is for law students - clear and educational, not exhaustive.

If these cases don't provide enough substantive legal principles to write a genuine, grounded
guide, respond with exactly: INSUFFICIENT_CONTENT

{case_texts}
"""

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1200,
        messages=[{"role": "user", "content": prompt}],
    )
    text = response.content[0].text.strip()
    if text == "INSUFFICIENT_CONTENT" or len(text) < 100:
        return None
    return text


def main():
    guides = load_json(GUIDES_FILE, {})
    index = load_json(INDEX_FILE, [])

    # Prioritize topics with no guide yet, then topics whose guide is oldest
    topics_to_process = sorted(
        VALID_TOPICS,
        key=lambda t: (t in guides, guides.get(t, {}).get("generated_at", ""))
    )[:TOPICS_PER_RUN]

    print(f"Processing topics this run: {topics_to_process}")

    for topic in topics_to_process:
        print(f"\n=== {topic} ===")
        cases = get_full_text_cases_for_topic(topic, index)
        print(f"  Found {len(cases)} real full-text cases in this topic")

        if len(cases) < MIN_CASES_PER_TOPIC:
            print(f"  [skip] fewer than {MIN_CASES_PER_TOPIC} full-text cases available yet")
            continue

        try:
            guide_text = generate_study_guide(topic, cases)
        except Exception as ex:
            print(f"  [warn] API call failed: {ex}")
            continue

        if not guide_text:
            print("  [skip] insufficient grounded content for a genuine guide")
            continue

        guides[topic] = {
            "topic": topic,
            "guide": guide_text,
            "based_on_cases": [{"title": c.get("title"), "citation": c.get("citation"), "slug": c.get("slug")} for c in cases],
            "generated_at": time.strftime("%Y-%m-%d"),
        }
        print(f"  Generated guide ({len(guide_text)} characters)")
        time.sleep(1)

    save_json(GUIDES_FILE, guides)
    print(f"\nTotal study guides now: {len(guides)}")


if __name__ == "__main__":
    main()
