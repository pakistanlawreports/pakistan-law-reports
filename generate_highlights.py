"""
Automated Case Highlights Generator
--------------------------------------
Goes through full-text judgments not yet covered in case_highlights.json,
sends each one's actual text to Claude via the Anthropic API to generate a
genuine, accurate plain-language explainer, and appends the results.

Processes a limited batch per run (to control cost and avoid rate limits) -
run this repeatedly (manually or on a schedule) to gradually build up
coverage across all full-text judgments.

REQUIRES: an Anthropic API key, set as the ANTHROPIC_API_KEY environment
variable (see setup instructions).
"""

import json
import os
import glob
import time

import anthropic

DATA_DIR = "data"
HIGHLIGHTS_FILE = os.path.join(DATA_DIR, "case_highlights.json")
JUDGMENTS_DIR = os.path.join(DATA_DIR, "judgments")
BATCH_SIZE = 20  # how many new highlights to generate per run - keeps cost/time bounded

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


def load_json(path, default):
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return default


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def generate_explainer(record):
    """Ask Claude to genuinely read the judgment and write an accurate explainer."""
    prompt = f"""Below is the full text of a real Pakistani court judgment. Write a
plain-language explainer (150-250 words) suitable for a general audience -
explain what the case was about, what the court decided, and why it matters,
based ONLY on what's actually in this text. Do not invent facts not present
in the judgment. If the text is unclear or too fragmentary to summarize
accurately, respond with exactly: INSUFFICIENT_CONTENT

Case: {record.get('title', '')}
Citation: {record.get('citation', '')}
Court: {record.get('court', '')}

Full text:
{record.get('full_text', '')[:8000]}
"""

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}],
    )
    text = response.content[0].text.strip()
    if text == "INSUFFICIENT_CONTENT" or len(text) < 50:
        return None
    return text


def main():
    highlights = load_json(HIGHLIGHTS_FILE, [])
    covered_slugs = {h["slug"] for h in highlights}

    print(f"Already have {len(highlights)} case highlights.")

    added = 0
    for fname in sorted(glob.glob(os.path.join(JUDGMENTS_DIR, "shard-*.json"))):
        if added >= BATCH_SIZE:
            break

        with open(fname, encoding="utf-8") as f:
            shard = json.load(f)

        for slug, record in shard.items():
            if added >= BATCH_SIZE:
                break
            if slug in covered_slugs:
                continue
            if record.get("has_full_text") is False:
                continue  # skip summary-only entries - nothing genuine to summarize
            if len(record.get("full_text", "")) < 1500:
                continue  # too short to meaningfully summarize beyond the original

            print(f"  Generating explainer for: {record.get('title', slug)[:60]}")
            try:
                explainer = generate_explainer(record)
            except Exception as ex:
                print(f"    [warn] API call failed: {ex}")
                continue

            if not explainer:
                print("    [skip] insufficient content for a genuine summary")
                covered_slugs.add(slug)  # don't keep retrying this one
                continue

            highlights.append({
                "slug": slug,
                "title": record.get("title", ""),
                "citation": record.get("citation", ""),
                "court": record.get("court", ""),
                "explainer": explainer,
            })
            covered_slugs.add(slug)
            added += 1
            time.sleep(1)  # be gentle on rate limits

    save_json(HIGHLIGHTS_FILE, highlights)
    print(f"\nAdded {added} new case highlights. Total now: {len(highlights)}.")


if __name__ == "__main__":
    main()
