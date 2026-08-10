"""
Case Highlights Generator (v2 - with Urdu translation)
--------------------------------------
Goes through full-text judgments not yet covered in case_highlights.json,
generates a genuine English explainer, then translates that same
already-verified explainer into Urdu.

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
BATCH_SIZE = 15

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
    prompt = f"""Below is the full text of a real Pakistani court judgment. Write a
plain-language explainer (150-250 words) suitable for a general audience -
explain what the case was about, what the court decided, and why it matters,
based ONLY on what's actually in this text. Do not invent facts not present
in the judgment. Do not use markdown formatting (no asterisks, no headers) -
plain prose only. If the text is unclear or too fragmentary to summarize
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
    return response.content[0].text.strip()


def main():
    highlights = load_json(HIGHLIGHTS_FILE, [])
    covered_slugs = {h["slug"] for h in highlights}

    print(f"Already have {len(highlights)} case highlights.")

    backfilled = 0
    for h in highlights:
        if not h.get("explainer_ur") and h.get("explainer"):
            print(f"  Translating existing highlight: {h.get('title', h['slug'])[:60]}")
            try:
                h["explainer_ur"] = translate_to_urdu(h["explainer"])
                backfilled += 1
                time.sleep(1)
            except Exception as ex:
                print(f"    [warn] translation failed: {ex}")
            if backfilled >= BATCH_SIZE:
                break

    added = 0
    if backfilled < BATCH_SIZE:
        for fname in sorted(glob.glob(os.path.join(JUDGMENTS_DIR, "shard-*.json"))):
            if added + backfilled >= BATCH_SIZE:
                break

            with open(fname, encoding="utf-8") as f:
                shard = json.load(f)

            for slug, record in shard.items():
                if added + backfilled >= BATCH_SIZE:
                    break
                if slug in covered_slugs:
                    continue
                if record.get("has_full_text") is False:
                    continue
                if len(record.get("full_text", "")) < 1500:
                    continue

                print(f"  Generating explainer for: {record.get('title', slug)[:60]}")
                try:
                    explainer = generate_explainer(record)
                except Exception as ex:
                    print(f"    [warn] API call failed: {ex}")
                    continue

                if not explainer:
                    print("    [skip] insufficient content for a genuine summary")
                    covered_slugs.add(slug)
                    continue

                try:
                    explainer_ur = translate_to_urdu(explainer)
                except Exception as ex:
                    print(f"    [warn] Urdu translation failed, keeping English only: {ex}")
                    explainer_ur = ""

                highlights.append({
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

    save_json(HIGHLIGHTS_FILE, highlights)
    print(f"\nAdded {added} new case highlights, backfilled Urdu on {backfilled} existing ones.")
    print(f"Total now: {len(highlights)}.")


if __name__ == "__main__":
    main()
