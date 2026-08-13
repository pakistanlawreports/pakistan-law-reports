"""
Legal News Digest Generator
--------------------------------------
Searches for recent, genuine news coverage of Pakistani courts using
NewsAPI, then has Claude write an ORIGINAL, PARAPHRASED digest entry for
each - never reproducing article text. Strict rules enforced in the
prompt itself: no quotes over a few words, always attribute the real
publication by name, link to the original article rather than
reproducing its content.

REQUIRES: NEWSAPI_KEY and ANTHROPIC_API_KEY environment variables.
"""

import json
import os
import time
import urllib.request
import urllib.parse

import anthropic

DATA_DIR = "data"
DIGEST_FILE = os.path.join(DATA_DIR, "news_digest.json")
MAX_ARTICLES_PER_RUN = 8

NEWSAPI_KEY = os.environ["NEWSAPI_KEY"]
client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

SEARCH_QUERIES = [
    "Pakistan Supreme Court",
    "Pakistan High Court judgment",
    "Pakistan court ruling",
]


def load_json(path, default):
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return default


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def fetch_news(query):
    """Fetch article title/description/source/url only - never full text."""
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


def write_digest_entry(article):
    """Ask Claude to write an ORIGINAL paraphrased summary - strict rules
    against reproducing the source text."""
    title = article.get("title", "")
    description = article.get("description", "") or ""
    source = article.get("source", {}).get("name", "a news source")
    url = article.get("url", "")

    prompt = f"""You are writing a brief digest entry about a news article, for a legal news
digest. You have ONLY the article's title and short description below - not the full article.

STRICT RULES:
- Write 2-3 sentences in your OWN WORDS summarizing what this article appears to be about
- Do NOT quote more than a few words directly from the title/description
- Do NOT invent details, quotes, or facts not present in what's given below
- Mention "{source}" as the source by name
- If the title/description doesn't clearly relate to a real Pakistani court case or legal
  development, respond with exactly: NOT_RELEVANT

Title: {title}
Description: {description}
"""

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}],
    )
    text = response.content[0].text.strip()
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
    for article in all_articles:
        if added >= MAX_ARTICLES_PER_RUN:
            break
        url = article.get("url", "")
        if not url or url in seen_urls:
            continue

        print(f"  Processing: {article.get('title', '')[:70]}")
        try:
            summary = write_digest_entry(article)
        except Exception as ex:
            print(f"    [warn] failed: {ex}")
            continue

        seen_urls.add(url)
        if not summary:
            print("    [skip] not relevant to Pakistani courts")
            continue

        digest.insert(0, {
            "title": article.get("title", ""),
            "source": article.get("source", {}).get("name", ""),
            "url": url,
            "published_at": article.get("publishedAt", ""),
            "summary": summary,
            "added_at": time.strftime("%Y-%m-%d"),
        })
        added += 1
        time.sleep(1)

    # Keep a reasonable rolling window - most recent 60 entries
    digest = digest[:60]
    save_json(DIGEST_FILE, digest)

    print(f"\nAdded {added} new digest entries. Total in digest: {len(digest)}.")


if __name__ == "__main__":
    main()
