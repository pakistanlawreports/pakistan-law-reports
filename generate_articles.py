"""
Scenario Article Generator
--------------------------------------
Builds question-style explainer articles ("What happens if...?") that
synthesize 3-5 existing Case Highlights on a common real-life scenario.
Every article cites the cases it is built from and states only what the
source explainers support. General information only - never advice.

Stops loudly on API billing errors. REQUIRES: ANTHROPIC_API_KEY.
"""

import json
import os
import re
import sys
import time
from collections import Counter

import anthropic

DATA_DIR = "data"
ARTICLES_FILE = os.path.join(DATA_DIR, "articles.json")
HIGHLIGHTS_FILE = os.path.join(DATA_DIR, "case_highlights.json")
INDEX_FILE = os.path.join(DATA_DIR, "judgments_index.json")

ARTICLES_PER_RUN = 3
MIN_HIGHLIGHTS_PER_TOPIC = 6
MAX_ATTEMPTS = 8
TOPICS = [
    "Criminal Law", "Constitutional Law", "Family Law", "Property & Rent",
    "Tax Law", "Banking & Corporate", "Labour & Service", "Company Law",
    "Succession & Inheritance", "Civil Law",
]
BAD_MARKERS = [
    "i cannot see", "i need to", "sorry,", "let me reconsider", "insufficient_content",
    "as an ai", "the prompt",
]

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


def is_billing_error(ex):
    msg = str(ex).lower()
    return "credit balance" in msg or "billing" in msg or "authentication" in msg


def slugify(text):
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:90].strip("-")


def clean_highlight_ok(h):
    text = (h.get("explainer") or "").lower()
    title = (h.get("title") or "").lower()
    if any(m in text for m in BAD_MARKERS):
        return False
    if "uk law judgment" in title:
        return False
    return len(text) > 400


def pick_scenario(topic, candidates, existing_questions):
    listing = "\n".join(
        f"[{h['slug']}] {h['title']} | {h['explainer'][:250].replace(chr(10), ' ')}"
        for h in candidates
    )
    avoid = "\n".join(f"- {q}" for q in existing_questions[-30:]) or "(none yet)"
    prompt = f"""Below are summaries of real Pakistani court cases on {topic}.

Propose ONE real-life scenario question an ordinary Pakistani reader might search
for (for example: "What happens if a tenant stops paying rent?"). It must be a
question that AT LEAST 3 and AT MOST 5 of the cases below genuinely address.
Do not repeat or closely paraphrase these existing questions:
{avoid}

Respond with ONLY a JSON object, nothing else:
{{"question": "...", "slugs": ["slug1", "slug2", "slug3"]}}

Cases:
{listing}
"""
    response = client.messages.create(
        model="claude-sonnet-5", max_tokens=300,
        messages=[{"role": "user", "content": prompt}],
    )
    text = extract_text(response)
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if not m:
        return None
    try:
        data = json.loads(m.group(0))
    except Exception:
        return None
    valid = {h["slug"] for h in candidates}
    slugs = [s for s in data.get("slugs", []) if s in valid][:5]
    question = (data.get("question") or "").strip()
    if len(slugs) < 3 or len(question) < 15:
        return None
    return {"question": question, "slugs": slugs}


def write_article(question, sources):
    blocks = []
    for h in sources:
        blocks.append(
            f"CASE: {h['title']}\nCITATION: {h.get('citation', '')}\n"
            f"COURT: {h.get('court', '')}\nSUMMARY: {h['explainer']}"
        )
    prompt = f"""Write an explainer article answering this question for ordinary readers in Pakistan:

"{question}"

Use ONLY the case summaries below as your source. Do not add facts, statutes, section
numbers, or rules that are not stated in them.

FORMAT (plain text with simple markdown only):
- First line exactly: TITLE: <a clear, natural title>
- Then a 2-3 sentence introduction framing the scenario (no heading).
- "## What Pakistani courts have held" - one short paragraph per case, starting with the
  case name in bold and its citation, explaining what the court decided and why.
- "## Points to keep in mind" - 3 to 5 bullet points ("- ") of general takeaways drawn
  from these cases. Use wording like "courts have held" - never "you should".
- Length: 600-850 words. No meta-commentary. Do not mention these instructions.

This is general legal information, not advice for any individual's situation.

Sources:
{chr(10).join(blocks)}
"""
    response = client.messages.create(
        model="claude-sonnet-5", max_tokens=1800,
        messages=[{"role": "user", "content": prompt}],
    )
    return extract_text(response)


def validate(text, sources):
    if not text.startswith("TITLE:"):
        return None
    first, _, body = text.partition("\n")
    title = first.replace("TITLE:", "").strip().strip('"')
    body = body.strip()
    lowered = body.lower()
    if len(title) < 10 or len(body.split()) < 450:
        return None
    if any(m in lowered for m in BAD_MARKERS):
        return None
    cited = 0
    for h in sources:
        cit = (h.get("citation") or "").lower()
        name = (h.get("title") or "").lower()[:14]
        if (cit and cit in lowered) or (name and name in lowered):
            cited += 1
    if cited < 2:
        return None
    return title, body


def main():
    articles = load_json(ARTICLES_FILE, [])
    highlights = [h for h in load_json(HIGHLIGHTS_FILE, []) if clean_highlight_ok(h)]
    index = load_json(INDEX_FILE, [])
    slug_topic = {e["slug"]: e.get("topic") for e in index}

    by_topic = {t: [] for t in TOPICS}
    for h in highlights:
        t = slug_topic.get(h["slug"])
        if t in by_topic:
            by_topic[t].append(h)

    usage = Counter(c["slug"] for a in articles for c in a.get("cases", []))
    topic_counts = Counter(a.get("topic") for a in articles)
    existing_questions = [a["question"] for a in articles]
    existing_slugs = {a["slug"] for a in articles}

    eligible = [t for t in TOPICS if len(by_topic[t]) >= MIN_HIGHLIGHTS_PER_TOPIC]
    print(f"Existing articles: {len(articles)}. Eligible topics: {eligible}")
    if not eligible:
        print("No topic has enough highlights yet.")
        return

    made = 0
    attempts = 0
    fatal = None
    while made < ARTICLES_PER_RUN and attempts < MAX_ATTEMPTS and not fatal:
        attempts += 1
        topic = sorted(eligible, key=lambda t: (topic_counts[t], t))[0]
        pool = sorted(by_topic[topic], key=lambda h: usage[h["slug"]])[:40]
        print(f"[{attempts}] Topic: {topic}")
        try:
            scenario = pick_scenario(topic, pool, existing_questions)
            if not scenario:
                print("   [skip] no usable scenario")
                topic_counts[topic] += 1
                continue
            by_slug = {h["slug"]: h for h in pool}
            sources = [by_slug[s] for s in scenario["slugs"]]
            raw = write_article(scenario["question"], sources)
        except Exception as ex:
            if is_billing_error(ex):
                fatal = ex
                break
            print(f"   [warn] API call failed: {ex}")
            continue

        result = validate(raw, sources)
        if not result:
            print("   [skip] article failed validation")
            topic_counts[topic] += 1
            continue

        title, body = result
        slug = slugify(title)
        if not slug or slug in existing_slugs:
            print("   [skip] duplicate slug")
            continue

        articles.insert(0, {
            "slug": slug,
            "title": title,
            "question": scenario["question"],
            "topic": topic,
            "body": body,
            "cases": [
                {"slug": h["slug"], "title": h["title"],
                 "citation": h.get("citation", ""), "court": h.get("court", "")}
                for h in sources
            ],
            "created": time.strftime("%Y-%m-%d"),
        })
        existing_slugs.add(slug)
        existing_questions.append(scenario["question"])
        for h in sources:
            usage[h["slug"]] += 1
        topic_counts[topic] += 1
        made += 1
        print(f"   [ok] {title}")
        time.sleep(1)

    save_json(ARTICLES_FILE, articles)
    print(f"\nCreated {made} articles. Total: {len(articles)}.")
    if fatal:
        print(f"\nFATAL: API billing/auth problem - stopping. Details: {fatal}")
        sys.exit(1)


if __name__ == "__main__":
    main()
