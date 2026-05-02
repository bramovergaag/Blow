#!/usr/bin/env python3
"""
BLOW GSC Mock Generator
Generates realistic mock Google Search Console data and POSTs to Make webhook.
"""

import json
import random
import math
import requests
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any
import re

# Configuration
MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/eky0pd2bubz3n1ibv1mrweace3b1bq56"
SHEET_PATH = Path(__file__).parent.parent / "data" / "content_queue.md"
SITE_URL = "https://bramovergaag.github.io/Blow/pilot/posts"

# Logging helper
def log_event(stage: str, message: str):
    ts = datetime.now().isoformat(timespec='seconds')
    print(f"[{ts}] {stage}: {message}")

def parse_sheet(sheet_path: str) -> List[Dict[str, str]]:
    """Parse markdown table from Google Drive export."""
    with open(sheet_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Parse headers from first line
    header_line = lines[0]
    headers = [h.strip() for h in header_line.split('|')[1:-1]]
    # Unescape column names
    headers = [h.replace('\\_', '_') for h in headers]

    # Find relevant column indices
    col_indices = {}
    for col_name in ['row_id', 'department', 'primary_keyword', 'secondary_keywords', 'title', 'archive_url']:
        try:
            col_indices[col_name] = headers.index(col_name)
        except ValueError:
            raise ValueError(f"Column '{col_name}' not found. Headers: {headers}")

    # Parse data rows (skip header and separator line)
    published_posts = []
    for line in lines[2:]:
        if not line.strip().startswith('|'):
            continue

        cells = [c.strip() for c in line.split('|')[1:-1]]

        # Check if we have enough cells
        if len(cells) <= col_indices['archive_url']:
            continue

        archive_url = cells[col_indices['archive_url']]

        # Only include posts with archive_url
        if archive_url and archive_url != '':
            post = {
                'row_id': cells[col_indices['row_id']],
                'department': cells[col_indices['department']],
                'primary_keyword': cells[col_indices['primary_keyword']],
                'secondary_keywords': cells[col_indices['secondary_keywords']],
                'title': cells[col_indices['title']],
                'archive_url': archive_url,
            }
            published_posts.append(post)

    return published_posts

def generate_slug_from_keyword(keyword: str) -> str:
    """Generate URL slug from keyword."""
    return re.sub(r'[^a-z0-9]+', '-', keyword.lower()).strip('-')

def generate_queries(post: Dict[str, str]) -> List[str]:
    """Generate 3-5 queries from primary and secondary keywords."""
    queries = []
    primary = post['primary_keyword'].strip()

    # 1x exact primary keyword
    queries.append(primary)

    # Parse secondary keywords
    secondary = [k.strip() for k in post['secondary_keywords'].split(',')]
    secondary = [k for k in secondary if k][:3]  # Max 3

    # 2-3x variations from secondary keywords
    for sec in secondary[:min(3, len(secondary))]:
        queries.append(sec)

    # 1x long-tail
    long_tail_suffix = random.choice(['tips', 'beste', 'gids', 'handleiding', 'tutorial'])
    queries.append(f"{primary} {long_tail_suffix}")

    return queries[:5]  # Max 5

def beta_distribution_position(alpha=2.0, beta=5.0) -> int:
    """Generate position with bias toward 5-25 using beta distribution."""
    u = random.betavariate(alpha, beta)  # 0-1
    position = int(1 + u * 49) + 1  # 1-50
    return min(50, max(1, position))

def lognormal_impressions(mu=4.5, sigma=1.0) -> int:
    """Generate impressions with lognormal distribution (50-3000)."""
    value = random.lognormvariate(mu, sigma)
    return max(50, min(3000, int(value)))

def get_ctr_range(position: int) -> tuple:
    """Get CTR range (min, max) based on position."""
    if position <= 3:
        return (0.08, 0.15)
    elif position <= 10:
        return (0.03, 0.08)
    elif position <= 20:
        return (0.01, 0.03)
    else:
        return (0.002, 0.01)

def generate_mock_stat(position: int) -> Dict[str, Any]:
    """Generate mock GSC statistics for a query."""
    impressions = lognormal_impressions()
    ctr_min, ctr_max = get_ctr_range(position)
    ctr = random.uniform(ctr_min, ctr_max)
    clicks = round(impressions * ctr)

    return {
        'position': round(position + random.uniform(-0.3, 0.3), 1),
        'impressions': impressions,
        'clicks': clicks,
        'ctr': round(ctr, 4),
    }

def build_payload(posts: List[Dict[str, str]]) -> Dict[str, Any]:
    """Build complete payload with raw and daily rows."""
    fetch_date = datetime.now().strftime('%Y-%m-%d')
    raw_rows = []
    daily_rows = []

    total_queries = 0

    for post in posts:
        slug = generate_slug_from_keyword(post['primary_keyword'])
        page_url = f"{SITE_URL}/{slug}"

        queries = generate_queries(post)
        total_queries += len(queries)

        for query in queries:
            position = beta_distribution_position()
            stat = generate_mock_stat(position)

            # Raw rows: 4 per query (NL+BE × mobile+desktop)
            for country in ['NL', 'BE']:
                for device in ['mobile', 'desktop']:
                    # Light day-to-day drift ±10%
                    drift = random.uniform(0.9, 1.1)

                    raw_rows.append({
                        'fetch_date': fetch_date,
                        'query': query,
                        'page': page_url,
                        'clicks': max(0, int(stat['clicks'] * drift)),
                        'impressions': int(stat['impressions'] * drift),
                        'ctr': round(stat['ctr'], 4),
                        'position': round(stat['position'], 1),
                        'country': country,
                        'device': device,
                    })

            # Daily row: aggregated 28d
            daily_rows.append({
                'fetch_date': fetch_date,
                'date_range': 'last-28-days',
                'query': query,
                'page': page_url,
                'clicks': stat['clicks'] * 28,
                'impressions': stat['impressions'] * 28,
                'ctr': round(stat['ctr'], 4),
                'position': round(stat['position'], 1),
            })

    return {
        'fetch_date': fetch_date,
        'posts_processed': len(posts),
        'total_queries': total_queries,
        'raw_rows_count': len(raw_rows),
        'daily_rows_count': len(daily_rows),
        'raw_data': raw_rows,
        'daily_data': daily_rows,
    }

def post_to_webhook(payload: Dict[str, Any]) -> bool:
    """POST payload to Make webhook."""
    try:
        response = requests.post(
            MAKE_WEBHOOK_URL,
            json=payload,
            timeout=30,
        )
        return response.status_code in [200, 204, 202]
    except Exception as e:
        log_event("ERROR", f"Webhook POST failed: {e}")
        return False

def main():
    log_event("START", "GSC Mock Generator")

    # Read sheet
    try:
        posts = parse_sheet(str(SHEET_PATH))
        log_event("SHEET", f"Loaded {len(posts)} published posts")
    except Exception as e:
        log_event("ERROR", f"Failed to read sheet: {e}")
        return False

    if not posts:
        log_event("INFO", "No published posts to process")
        return True

    # Generate payload
    payload = build_payload(posts)
    log_event("PAYLOAD", f"Generated {payload['total_queries']} queries")
    log_event("PAYLOAD", f"Raw rows: {payload['raw_rows_count']}, Daily rows: {payload['daily_rows_count']}")

    # Save payload for inspection
    payload_file = Path(__file__).parent.parent / "data" / "gsc_payload.json"
    payload_file.parent.mkdir(parents=True, exist_ok=True)
    with open(payload_file, 'w') as f:
        json.dump(payload, f, indent=2)
    log_event("PAYLOAD", f"Saved to {payload_file}")

    # POST to webhook
    success = post_to_webhook(payload)
    if success:
        log_event("SUCCESS", "Payload POSTed to Make webhook")
    else:
        log_event("ERROR", "Failed to POST to webhook")

    log_event("END", f"Generator completed")
    return success

if __name__ == '__main__':
    main()
