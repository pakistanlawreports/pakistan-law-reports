"""
Analytics Report Generator
--------------------------------------
Pulls real data from Google Analytics 4 via the Analytics Data API:
- Most visited pages (last 30 days)
- Most common search terms (from the homepage search bar)
- Most common Find Cases topics (from case_finder_search events)

REQUIRES: GA4_SERVICE_ACCOUNT_KEY and GA4_PROPERTY_ID environment variables.
"""

import json
import os

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest, DateRange, Dimension, Metric,
)
from google.oauth2 import service_account

DATA_DIR = "data"
OUTPUT_FILE = os.path.join(DATA_DIR, "analytics_report.json")
PROPERTY_ID = os.environ["GA4_PROPERTY_ID"]


def get_client():
    key_json = json.loads(os.environ["GA4_SERVICE_ACCOUNT_KEY"])
    credentials = service_account.Credentials.from_service_account_info(
        key_json, scopes=["https://www.googleapis.com/auth/analytics.readonly"]
    )
    return BetaAnalyticsDataClient(credentials=credentials)


def get_top_pages(client, limit=15):
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="pagePath")],
        metrics=[Metric(name="screenPageViews")],
        date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
        limit=limit,
        order_bys=[{"metric": {"metric_name": "screenPageViews"}, "desc": True}],
    )
    response = client.run_report(request)
    return [
        {"page": row.dimension_values[0].value, "views": int(row.metric_values[0].value)}
        for row in response.rows
    ]


def get_top_event_param(client, event_name, param_dimension, limit=15):
    """Pull top values for a custom event parameter (must be registered as
    a custom dimension in GA4 first, or this will return no rows)."""
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="eventName"), Dimension(name=param_dimension)],
        metrics=[Metric(name="eventCount")],
        date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
        dimension_filter={
            "filter": {
                "field_name": "eventName",
                "string_filter": {"value": event_name},
            }
        },
        limit=limit,
        order_bys=[{"metric": {"metric_name": "eventCount"}, "desc": True}],
    )
    try:
        response = client.run_report(request)
        return [
            {"value": row.dimension_values[1].value, "count": int(row.metric_values[0].value)}
            for row in response.rows
            if row.dimension_values[1].value
        ]
    except Exception as ex:
        print(f"  [warn] could not fetch {param_dimension} for {event_name}: {ex}")
        return []


def main():
    client = get_client()

    print("Fetching top pages...")
    top_pages = get_top_pages(client)

    print("Fetching top search terms...")
    top_searches = get_top_event_param(client, "search", "customEvent:search_term")

    print("Fetching top Find Cases topics...")
    top_topics = get_top_event_param(client, "case_finder_search", "customEvent:matched_topic")

    report = {
        "generated_at": __import__("time").strftime("%Y-%m-%d"),
        "top_pages": top_pages,
        "top_searches": top_searches,
        "top_find_cases_topics": top_topics,
    }

    os.makedirs(DATA_DIR, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print(f"\nTop pages: {len(top_pages)}, top searches: {len(top_searches)}, top topics: {len(top_topics)}")
    print("Report saved.")


if __name__ == "__main__":
    main()
