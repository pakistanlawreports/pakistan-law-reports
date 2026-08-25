"""
Case Highlights Generator (v7 - scaled to 100/day)
--------------------------------------
Includes all fixes: correct response parsing (handles thinking blocks),
newest-first ordering, filters out known non-judgments, keeps scanning
past skips instead of giving up, rejects leaked AI self-correction text.

Scaled from 15/day to 100/day as a controlled first step toward full
database coverage, rather than an untested jump straight to 400+/day.

REQUIRES: ANTHROPIC_API_KEY environment variable.
"""

import json
import os
import glob
import time

import anthropic

DATA_DIR = "data"
HIGHLIGHTS_FILE = os.path.join(DATA_DIR, "case_highlights.json")
JUDGMENTS_DIR = os.path.join(DATA_DIR, "judgments")
INDEX_FILE = os.path.join(DATA_DIR, "judgments_index.json")
BATCH_SIZE = 100
MAX_SCANNED = 350

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


def extract_text(response):
    for block in response.content:
        if block.type == "text":
            return block.text.strip()
    return ""


def load_json(path, default):
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return default


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def is_insufficient(text):
    if not text or len(text) < 50:
        return True
    markers = ["INSUFFICIENT_CONTENT", "isn't a court judgment", "is not a court judgment",
               "not a judgment", "this is legislation", "this is a statute",
               "cannot accurately produce", "I cannot provide a summary",
               "let me reconsider", "I need to write", "I need to decline",
               "I need more of the judgment"]
    lowered = text.lower()
    return any(m.lower() in lowered for m in markers)


def clean_explainer(text):
    prefixes_to_strip = [
        "here's a plain-language explainer of the case:",
        "here is a plain-language explainer of the case:",
        "i need to write a plain-language explainer based only on this judgment text.",
    ]
    stripped = text.strip()
    for prefix in prefixes_to_strip:
        if stripped.lower().startswith(prefix):
            stripped = stripped[len(prefix):].strip()
    return stripped


def generate_explainer(record):
    prompt = f"""Below is the full text of a real Pakistani court judgment. Write a
plain-language explainer (150-250 words) suitable for a general audience -
explain what the case was about, what the court decided, and why it matters,
based ONLY on what's actually in this text. Do not invent facts not present
in the judgment. Do not use markdown formatting (no asterisks, no headers) -
plain prose only. Do NOT include any meta-commentary, self-correction, or
reasoning about whether you can write the summary - respond with ONLY the
final explainer text, or ONLY the word INSUFFICIENT_CONTENT, nothing else,
nothing in between.

If this text is NOT actually a court judgment - including statutes, ordinances,
regulations, speeches, historical documents, or any other non-judgment content -
respond with ONLY this exact text and nothing else: INSUFFICIENT_CONTENT

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
    text = extract_text(response)
    if is_insufficient(text):
        return None
    return clean_explainer(text)


def translate_to_urdu(english_explainer):
    prompt = f"""Translate the following legal case explainer into natural, fluent Urdu.
Keep it accurate to the original meaning - this is a translation, not a rewrite. Use
standard Urdu script. Do not use markdown formatting (no asterisks, no headers) - plain
prose only.

{english_explainer}"""

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=600,
        messages=[{"role": "user", "content": prompt}],
    )
    return extract_text(response)


def main():
    highlights = load_json(HIGHLIGHTS_FILE, [])
    covered_slugs = {h["slug"] for h in highlights}
    index = load_json(INDEX_FILE, [])

    non_judgment_slugs = {
        e["slug"] for e in index
        if e.get("content_type") and e["content_type"] != "JUDGMENT"
    }

    print(f"Already have {len(highlights)} case highlights.")
    print(f"Skipping {len(non_judgment_slugs)} entries already known to be non-judgments.")
    print(f"Target this run: {BATCH_SIZE} new highlights, scanning up to {MAX_SCANNED} candidates.")

    added = 0
    scanned = 0
    new_entries = []
    for fname in sorted(glob.glob(os.path.join(JUDGMENTS_DIR, "shard-*.json"))):
        if added >= BATCH_SIZE or scanned >= MAX_SCANNED:
            break

        with open(fname, encoding="utf-8") as f:
            shard = json.load(f)

        for slug, record in shard.items():
            if added >= BATCH_SIZE or scanned >= MAX_SCANNED:
                break
            if slug in covered_slugs:
                continue
            if slug in non_judgment_slugs:
                continue
            if record.get("has_full_text") is False:
                continue
            if len(record.get("full_text", "")) < 1500:
                continue

            scanned += 1
            print(f"  [{scanned}/{MAX_SCANNED}] ({added} added so far) {record.get('title', slug)[:60]}")
            try:
                explainer = generate_explainer(record)
            except Exception as ex:
                print(f"    [warn] API call failed: {ex}")
                continue

            if not explainer:
                print("    [skip] not a genuine judgment or insufficient content")
                covered_slugs.add(slug)
                continue

            try:
                explainer_ur = translate_to_urdu(explainer)
            except Exception as ex:
                print(f"    [warn] Urdu translation failed, keeping English only: {ex}")
                explainer_ur = ""

            new_entries.append({
                "slug": slug,
                "title": record.get("title", ""),
                "citation": record.get("citation", ""),
                "court": record.get("court", ""),
                "explainer": explainer,
                "explainer_ur": explainer_ur,
            })
            covered_slugs.add(slug)
            added += 1
            time.sleep(1)

    highlights = list(reversed(new_entries)) + highlights

    save_json(HIGHLIGHTS_FILE, highlights)
    print(f"\nScanned {scanned} candidates, added {added} new case highlights.")
    print(f"Total now: {len(highlights)}.")


if __name__ == "__main__":
    main()
