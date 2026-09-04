"""
Search Console Report Generator
--------------------------------------
Pulls real search performance data from Google Search Console via the API:
- Top search queries (with impressions, clicks, CTR, average position)
- Top pages by clicks

Reuses the same service account already set up for the Analytics report.

REQUIRES: GA4_SERVICE_ACCOUNT_KEY environment variable (same secret as the
analytics report - this is the same service account, just also granted
access in Search Console directly).
"""

import json
import os
import datetime

from google.oauth2 import service_account
from googleapiclient.discovery import build

DATA_DIR = "data"
OUTPUT_FILE = os.path.join(DATA_DIR, "search_console_report.json")
SITE_URL = "https://pakistanlawreports.com/"


def get_service():
    key_json = json.loads(os.environ["GA4_SERVICE_ACCOUNT_KEY"])
    credentials = service_account.Credentials.from_service_account_info(
        key_json, scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
    )
    return build("webmasters", "v3", credentials=credentials)


def query_search_analytics(service, dimension, row_limit=15):
    end_date = datetime.date.today() - datetime.timedelta(days=3)  # Search Console data lags a few days
    start_date = end_date - datetime.timedelta(days=28)

    request = {
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "dimensions": [dimension],
        "rowLimit": row_limit,
    }

    response = service.searchanalytics().query(siteUrl=SITE_URL, body=request).execute()
    rows = response.get("rows", [])

    return [
        {
            dimension: row["keys"][0],
            "clicks": row.get("clicks", 0),
            "impressions": row.get("impressions", 0),
            "ctr": round(row.get("ctr", 0) * 100, 2),
            "position": round(row.get("position", 0), 1),
        }
        for row in rows
    ]


def main():
    service = get_service()

    print("Fetching top search queries...")
    top_queries = query_search_analytics(service, "query")

    print("Fetching top pages by search performance...")
    top_pages = query_search_analytics(service, "page")

    report = {
        "generated_at": __import__("time").strftime("%Y-%m-%d"),
        "top_queries": top_queries,
        "top_pages_by_search": top_pages,
    }

    os.makedirs(DATA_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\nTop queries: {len(top_queries)}, top pages: {len(top_pages)}")
    print("Report saved.")


if __name__ == "__main__":
    main()
