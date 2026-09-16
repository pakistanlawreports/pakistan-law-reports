"""
Legal News Digest Generator (v2 - narrowed scope, topic concentration cap)
--------------------------------------
Narrowed to focus specifically on actual court rulings, judgments, and
legal developments - not general political/personal news that happens to
mention someone with an ongoing legal case. Also caps how many entries
mentioning the same named subject can be added in one run.

REQUIRES: NEWSAPI_KEY and ANTHROPIC_API_KEY environment variables.
"""

import json
import os
import re
import time
import urllib.request
import urllib.parse
from collections import Counter

import anthropic

DATA_DIR = "data"
DIGEST_FILE = os.path.join(DATA_DIR, "news_digest.json")
MAX_ARTICLES_PER_RUN = 8
MAX_PER_SUBJECT = 2

NEWSAPI_KEY = os.environ["NEWSAPI_KEY"]
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

SEARCH_QUERIES = [
    "Pakistan Supreme Court ruling",
    "Pakistan High Court verdict",
    "Pakistan court judgment",
    "Pakistan legislation passed",
    "Pakistan Federal Shariat Court",
]


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


def fetch_news(query):
    params = urllib.parse.urlencode({
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 10,
        "apiKey": NEWSAPI_KEY,
    })
    url = f"https://newsapi.org/v2/everything?{params}"
    try:
        with urllib.request.urlopen(url, timeout=20) as response:
            data = json.loads(response.read())
        return data.get("articles", [])
    except Exception as ex:
        print(f"  [warn] NewsAPI request failed for '{query}': {ex}")
        return []


def extract_proper_nouns(title):
    words = re.findall(r"\b[A-Z][a-zA-Z']+\b", title)
    skip = {"The", "A", "An", "Pakistan", "Supreme", "Court", "High", "In", "On", "Federal"}
    return set(w for w in words if w not in skip)


def check_relevance_and_write(article):
    title = article.get("title", "")
    description = article.get("description", "") or ""
    source = article.get("source", {}).get("name", "a news source")

    prompt = f"""You are curating a digest of genuine Pakistani LEGAL and COURT news - not
general politics, not personal/health news about public figures, even if they have an ongoing
legal case. You have ONLY the article's title and short description below.

STRICT RULES:
- Only proceed if this is genuinely about a court ruling, judgment, legal development, or
  legislation - NOT general political commentary, personal health updates, prison conditions,
  family statements, or similar coverage that merely mentions a legal case in passing
- If it doesn't meet that bar, respond with exactly: NOT_RELEVANT
- Otherwise, write 2-3 sentences in your OWN WORDS summarizing the actual legal development
- Do NOT quote more than a few words directly from the title/description
- Do NOT invent details, quotes, or facts not present in what's given below
- Mention "{source}" as the source by name

Title: {title}
Description: {description}
"""

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}],
    )
    text = extract_text(response)
    if text == "NOT_RELEVANT" or len(text) < 30:
        return None
    return text


def main():
    digest = load_json(DIGEST_FILE, [])
    seen_urls = {d["url"] for d in digest}

    all_articles = []
    for query in SEARCH_QUERIES:
        print(f"Searching: {query}")
        articles = fetch_news(query)
        all_articles.extend(articles)
        time.sleep(1)

    print(f"\nFound {len(all_articles)} total articles across queries")

    added = 0
    subject_counts = Counter()

    for article in all_articles:
        if added >= MAX_ARTICLES_PER_RUN:
            break
        url = article.get("url", "")
        if not url or url in seen_urls:
            continue

        title = article.get("title", "")
        subjects = extract_proper_nouns(title)

        if subjects and all(subject_counts[s] >= MAX_PER_SUBJECT for s in subjects):
            print(f"  [skip] subject concentration cap reached: {title[:60]}")
            seen_urls.add(url)
            continue

        print(f"  Processing: {title[:70]}")
        try:
            summary = check_relevance_and_write(article)
        except Exception as ex:
            print(f"    [warn] failed: {ex}")
            continue

        seen_urls.add(url)
        if not summary:
            print("    [skip] not a genuine court/legal development")
            continue

        digest.insert(0, {
            "title": title,
            "source": article.get("source", {}).get("name", ""),
            "url": url,
            "published_at": article.get("publishedAt", ""),
            "summary": summary,
            "added_at": time.strftime("%Y-%m-%d"),
        })
        for s in subjects:
            subject_counts[s] += 1
        added += 1
        time.sleep(1)

    digest = digest[:60]
    save_json(DIGEST_FILE, digest)

    print(f"\nAdded {added} new digest entries. Total in digest: {len(digest)}.")


if __name__ == "__main__":
    main()
