"""
Document-Type Classifier (v2 - fixed response parsing)
--------------------------------------
Identifies items mislabeled as judgments that are actually statutes,
forms, or other non-judgment content.

REQUIRES: ANTHROPIC_API_KEY environment variable.
"""

import json
import os
import glob
import time

import anthropic

DATA_DIR = "data"
INDEX_FILE = os.path.join(DATA_DIR, "judgments_index.json")
JUDGMENTS_DIR = os.path.join(DATA_DIR, "judgments")
BATCH_SIZE = 40

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
        json.dump(data, f, ensure_ascii=False)


def classify_content_type(entry):
    text = entry.get("excerpt", "") or entry.get("title", "")

    prompt = f"""Look at this item from a Pakistani legal database and determine what
kind of document it actually is.

Title: {entry.get('title', '')}
Citation: {entry.get('citation', '')}
Available text: {text[:1200]}

Respond with ONLY one of these exact labels, nothing else:
JUDGMENT - an actual court judgment/order deciding a real case between parties
STATUTE - a law, act, ordinance, or regulation
FORM - a government form, application template, or legal document template
ARTICLE - an informational/explanatory article about a legal topic
OTHER - anything else (speeches, conventions, historical documents, etc.)"""

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=10,
        messages=[{"role": "user", "content": prompt}],
    )
    result = extract_text(response).upper()
    valid = {"JUDGMENT", "STATUTE", "FORM", "ARTICLE", "OTHER"}
    return result if result in valid else "JUDGMENT"


def main():
    index = load_json(INDEX_FILE, [])
    print(f"Total entries: {len(index)}")

    attempted_file = os.path.join(DATA_DIR, "doctype_attempted.json")
    attempted = set(load_json(attempted_file, []))

    to_process = [
        e for e in index
        if e["slug"] not in attempted and e.get("content_type") is None
    ][:BATCH_SIZE]
    print(f"Processing {len(to_process)} entries this run...")

    slug_to_type = {}
    for entry in to_process:
        print(f"  Checking: {entry.get('title', entry['slug'])[:60]}")
        try:
            doc_type = classify_content_type(entry)
        except Exception as ex:
            print(f"    [warn] API call failed: {ex}")
            continue

        attempted.add(entry["slug"])
        slug_to_type[entry["slug"]] = doc_type
        if doc_type != "JUDGMENT":
            print(f"    -> NOT a judgment, actually: {doc_type}")
        time.sleep(0.5)

    if not slug_to_type:
        save_json(attempted_file, sorted(attempted))
        print("\nNo classifications made this run.")
        return

    for e in index:
        if e["slug"] in slug_to_type:
            e["content_type"] = slug_to_type[e["slug"]]
    save_json(INDEX_FILE, index)

    updated_shards = 0
    for fname in glob.glob(os.path.join(JUDGMENTS_DIR, "shard-*.json")):
        with open(fname, encoding="utf-8") as f:
            shard = json.load(f)
        changed = False
        for slug, doc_type in slug_to_type.items():
            if slug in shard:
                shard[slug]["content_type"] = doc_type
                changed = True
        if changed:
            save_json(fname, shard)
            updated_shards += 1

    save_json(attempted_file, sorted(attempted))

    non_judgments = sum(1 for t in slug_to_type.values() if t != "JUDGMENT")
    print(f"\nClassified {len(slug_to_type)} entries this run.")
    print(f"Found {non_judgments} non-judgment items (statutes/forms/articles/other).")


if __name__ == "__main__":
    main()
