"""
Coverage Gap Analysis Agent
--------------------------------------
Looks at our own real data - how many judgments exist per topic vs. how
much genuine content (Case Highlights, Study Guides) we've generated for
that topic - and produces a priority report. This doesn't generate new
content itself; it tells the other automations (study_guides.py,
generate_highlights.py) which topics to prioritize next, so effort goes
toward genuinely underserved, high-volume areas first rather than
whatever happens to come up in file order.

Writes data/coverage_priority.json - the other scripts can read this to
decide processing order.
"""

import json
import os

DATA_DIR = "data"
INDEX_FILE = os.path.join(DATA_DIR, "judgments_index.json")
HIGHLIGHTS_FILE = os.path.join(DATA_DIR, "case_highlights.json")
GUIDES_FILE = os.path.join(DATA_DIR, "study_guides.json")
PRIORITY_FILE = os.path.join(DATA_DIR, "coverage_priority.json")

VALID_TOPICS = [
    'Criminal Law', 'Constitutional Law', 'Family Law', 'Property & Rent',
    'Tax Law', 'Banking & Corporate', 'Labour & Service', 'Company Law',
    'Succession & Inheritance', 'Civil Law',
]


def load_json(path, default):
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return default


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def main():
    index = load_json(INDEX_FILE, [])
    highlights = load_json(HIGHLIGHTS_FILE, [])
    guides = load_json(GUIDES_FILE, {})

    # Build a slug -> topic lookup for cross-referencing highlights
    slug_to_topic = {e["slug"]: e.get("topic") for e in index}

    report = []
    for topic in VALID_TOPICS:
        total_judgments = sum(1 for e in index if e.get("topic") == topic)
        full_text_judgments = sum(
            1 for e in index if e.get("topic") == topic and e.get("has_full_text") is not False
        )
        highlight_count = sum(1 for h in highlights if slug_to_topic.get(h["slug"]) == topic)
        has_guide = topic in guides

        # A simple, transparent priority score: topics with lots of real
        # full-text material but little generated content so far score
        # highest - these are the best next targets for the content
        # automations, since there's real substance to draw from and a
        # real gap to fill.
        coverage_ratio = highlight_count / full_text_judgments if full_text_judgments > 0 else 0
        priority_score = full_text_judgments * (1 - coverage_ratio) * (0.5 if has_guide else 1.0)

        report.append({
            "topic": topic,
            "total_judgments": total_judgments,
            "full_text_judgments": full_text_judgments,
            "highlights_generated": highlight_count,
            "has_study_guide": has_guide,
            "priority_score": round(priority_score, 1),
        })

    report.sort(key=lambda r: r["priority_score"], reverse=True)

    save_json(PRIORITY_FILE, {
        "generated_at": __import__("time").strftime("%Y-%m-%d"),
        "priority_order": [r["topic"] for r in report],
        "details": report,
    })

    print("Coverage gap analysis:")
    print(f"{'Topic':<28} {'Full-text':>10} {'Highlights':>11} {'Guide?':>7} {'Priority':>9}")
    for r in report:
        print(f"{r['topic']:<28} {r['full_text_judgments']:>10} {r['highlights_generated']:>11} "
              f"{'Yes' if r['has_study_guide'] else 'No':>7} {r['priority_score']:>9}")

    print(f"\nTop priority for next content generation: {report[0]['topic']}")


if __name__ == "__main__":
    main()
