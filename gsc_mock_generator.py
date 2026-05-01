#!/usr/bin/env python3
"""BLOW GSC Mock Generator - daily run 09:00 AMS"""

import random
import math
import json
import subprocess
import sys

TODAY = "2026-05-01"

# Seed op datum voor consistente drift (zelfde query = vergelijkbare impressions)
seed = int(TODAY.replace("-", ""))
random.seed(seed)

WEBHOOK_URL = "https://hook.eu1.make.com/eky0pd2bubz3n1ibv1mrweace3b1bq56"

# Gepubliceerde posts (archive_url aanwezig in ContentQueue)
POSTS = [
    {
        "row_id": 32,
        "department": "beach-house",
        "primary_keyword": "power-lunch zakelijk kijkduin",
        "secondary_keywords": ["zakenlunch den haag", "business lunch strand"],
        "title": "Power Lunch Zakelijk Kijkduin | BLOW Beach House",
        "page": "https://bramovergaag.github.io/Blow/pilot/posts/32-power-lunch-zakelijk-kijkduin.html"
    },
    {
        "row_id": 35,
        "department": "beach-house",
        "primary_keyword": "yoga retreat strand den haag",
        "secondary_keywords": ["weekend yoga retreat", "mindfulness aan zee"],
        "title": "Yoga Retreat aan het Strand van Den Haag | BLOW Beach House",
        "page": "https://bramovergaag.github.io/Blow/pilot/posts/35-yoga-retreat-strand-den-haag.html"
    }
]

LONG_TAIL_PREFIXES = ["beste", "gids", "tips", "beginners", "ervaringen"]


def gaussian_position(mean=15, std=8):
    val = random.gauss(mean, std)
    return round(max(1.0, min(50.0, val)), 1)


def lognormal_impressions(mean=5.5, std=1.2):
    val = random.lognormvariate(mean, std)
    return max(1, round(val))


def ctr_for_position(pos):
    if pos <= 3:
        return round(random.uniform(0.08, 0.15), 4)
    elif pos <= 10:
        return round(random.uniform(0.03, 0.08), 4)
    elif pos <= 20:
        return round(random.uniform(0.01, 0.03), 4)
    else:
        return round(random.uniform(0.002, 0.01), 4)


def generate_queries(post):
    queries = []
    queries.append(post["primary_keyword"])
    for kw in post["secondary_keywords"][:3]:
        queries.append(kw.strip())
    suffix = random.choice(LONG_TAIL_PREFIXES)
    queries.append(f"{post['primary_keyword']} {suffix}")
    return queries


def build_payloads():
    raw_rows = []
    daily_rows = []

    for post in POSTS:
        queries = generate_queries(post)
        page = post["page"]

        for query in queries:
            position = gaussian_position()
            impressions_daily = lognormal_impressions()
            ctr = ctr_for_position(position)

            # Raw: NL+BE × mobile+desktop (4 rows per query)
            breakdowns = [
                ("NL", "mobile",  0.42),
                ("NL", "desktop", 0.28),
                ("BE", "mobile",  0.09),
                ("BE", "desktop", 0.06),
            ]
            for country, device, frac in breakdowns:
                imp = max(1, round(impressions_daily * frac))
                clk = round(imp * ctr)
                raw_rows.append({
                    "fetch_date": TODAY,
                    "query": query,
                    "page": page,
                    "clicks": clk,
                    "impressions": imp,
                    "ctr": ctr,
                    "position": position,
                    "country": country,
                    "device": device
                })

            # Daily: 28-day aggregaat
            impressions_28 = round(impressions_daily * 28)
            clicks_28 = round(impressions_28 * ctr)
            daily_rows.append({
                "fetch_date": TODAY,
                "date_range": "last-28-days",
                "query": query,
                "page": page,
                "clicks": clicks_28,
                "impressions": impressions_28,
                "ctr": ctr,
                "position": position
            })

    return raw_rows, daily_rows


def post_webhook(payload, attempt=1):
    payload_json = json.dumps(payload, ensure_ascii=False)
    result = subprocess.run(
        ["curl", "-s", "-w", "\n%{http_code}", "-X", "POST",
         "-H", "Content-Type: application/json",
         "-d", payload_json,
         WEBHOOK_URL],
        capture_output=True, text=True, timeout=30
    )
    lines = result.stdout.strip().split("\n")
    http_code = lines[-1].strip() if lines else "000"
    body = "\n".join(lines[:-1])
    return http_code, body


def main():
    raw_rows, daily_rows = build_payloads()
    payload = {"raw": raw_rows, "daily": daily_rows}

    print(f"Posts processed  : {len(POSTS)}")
    print(f"Queries generated: {len(daily_rows)}")
    print(f"Raw rows         : {len(raw_rows)}")
    print(f"Daily rows       : {len(daily_rows)}")
    print()

    # Voorbeeld van eerste paar rows
    print("Sample raw rows:")
    for r in raw_rows[:4]:
        print(f"  {r['query'][:40]:<40} pos={r['position']:5} imp={r['impressions']:4} ctr={r['ctr']:.2%} {r['country']}/{r['device']}")
    print()
    print("Sample daily rows:")
    for d in daily_rows[:2]:
        print(f"  {d['query'][:40]:<40} pos={d['position']:5} imp={d['impressions']:5} clicks={d['clicks']:4} ctr={d['ctr']:.2%}")
    print()

    # POST naar webhook
    print("POSTing to webhook...")
    status, body = post_webhook(payload)
    print(f"Response status  : {status}")
    print(f"Response body    : {body[:200]}")

    if status != "200":
        print("Retry 1x...")
        status, body = post_webhook(payload)
        print(f"Retry status     : {status}")
        print(f"Retry body       : {body[:200]}")
        if status != "200":
            print("ERROR: webhook failed after retry")
            sys.exit(1)

    print()
    print("Done.")


if __name__ == "__main__":
    main()
