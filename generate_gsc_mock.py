#!/usr/bin/env python3
import json
import random
import math
from datetime import datetime
from pathlib import Path
import requests

# Read the sheet data
sheet_file = Path("/root/.claude/projects/-home-user-Blow/417c9e72-d190-41d1-8ff4-fef92f8bb5a3/tool-results/mcp-d33007c8-a497-413d-815d-f4b4f6bf4b92-read_file_content-1777758236195.txt")
with open(sheet_file) as f:
    content = json.load(f)

# Extract markdown table from fileContent
md_table = content['fileContent']
lines = md_table.split('\n')

# Parse markdown table (skip header and separator)
rows = []
for line in lines[2:]:
    if not line.strip() or line.startswith('|'):
        if line.count('|') < 2:
            continue
        cells = [c.strip() for c in line.split('|')[1:-1]]
        if len(cells) > 5 and cells[0] and not cells[0].startswith('-'):
            rows.append(cells)

print(f"Loaded {len(rows)} rows")

# Filter rows with archive_url (col 17) not empty
if isinstance(rows, list):
    filtered = [r for r in rows if len(r) > 17 and r[17] and r[17].strip()]
    print(f"Filtered to {len(filtered)} rows with archive_url")
else:
    print("Data format unexpected")
    exit(1)

# Generate mock queries per post
def generate_queries(primary, secondary_str):
    """Generate 3-5 queries from primary and secondary keywords"""
    queries = [primary]  # 1x exact primary

    if secondary_str:
        secondaries = [s.strip() for s in secondary_str.split(',') if s.strip()]
        # 2-3x variations
        for i in range(min(3, len(secondaries))):
            queries.append(secondaries[i % len(secondaries)])

    # 1x long-tail
    for suffix in ['tips', 'beste', 'gids']:
        queries.append(f"{primary} {suffix}")
        if len(queries) >= 5:
            break

    return queries[:5]

# Mock stats generators
def generate_position():
    """Beta distribution biased toward 5-25"""
    # Beta(2, 5) gives values in [0,1], scale to [1,50]
    beta_val = random.betavariate(2, 5)
    return max(1, min(50, int(1 + beta_val * 49)))

def generate_impressions():
    """Lognormal distribution 50-3000"""
    return int(random.lognormvariate(math.log(500), 0.8))

def get_ctr_range(position):
    """CTR range by position"""
    if position <= 3:
        return (0.08, 0.15)
    elif position <= 10:
        return (0.03, 0.08)
    elif position <= 20:
        return (0.01, 0.03)
    else:
        return (0.002, 0.01)

def generate_ctr(position):
    """Generate CTR within range"""
    low, high = get_ctr_range(position)
    return random.uniform(low, high)

# Build payload
today = datetime.now().strftime("%Y-%m-%d")
raw_rows = []
daily_rows = []

for row in filtered[:10]:  # Process first 10 for testing
    row_id = row[0]
    department = row[1]
    primary_kw = row[3] if len(row) > 3 else "keyword"
    secondary_kws = row[4] if len(row) > 4 else ""
    title = row[8] if len(row) > 8 else "post"
    archive_url = row[17] if len(row) > 17 else ""

    # Extract slug from archive_url
    slug = archive_url.split('/')[-1] if archive_url else row_id
    page_url = f"https://bramovergaag.github.io/Blow/pilot/posts/{slug}"

    queries = generate_queries(primary_kw, secondary_kws)

    for query in queries:
        # Generate stats
        position = generate_position()
        impressions = generate_impressions()
        ctr = generate_ctr(position)
        clicks = round(impressions * ctr / 100)

        # Raw rows: 4 per query (NL+BE × mobile+desktop)
        for country in ["NL", "BE"]:
            for device in ["mobile", "desktop"]:
                raw_rows.append({
                    "fetch_date": today,
                    "query": query,
                    "page": page_url,
                    "clicks": clicks,
                    "impressions": impressions,
                    "ctr": round(ctr, 4),
                    "position": round(position + random.uniform(-0.5, 0.5), 1),
                    "country": country,
                    "device": device
                })

        # Daily row: aggregated 28d (roughly 28x daily)
        daily_rows.append({
            "fetch_date": today,
            "date_range": "last-28-days",
            "query": query,
            "page": page_url,
            "clicks": clicks * 28,
            "impressions": impressions * 28,
            "ctr": round(ctr, 4),
            "position": round(position + random.uniform(-0.5, 0.5), 1)
        })

payload = {
    "timestamp": datetime.now().isoformat(),
    "raw": raw_rows,
    "daily": daily_rows
}

# Save payload
with open("/tmp/gsc_payload.json", "w") as f:
    json.dump(payload, f, indent=2)

print(f"\n=== Generated Mock Data ===")
print(f"Posts processed: {len(filtered[:10])}")
print(f"Queries generated: {len(set(r['query'] for r in raw_rows))}")
print(f"Raw rows: {len(raw_rows)}")
print(f"Daily rows: {len(daily_rows)}")

# POST to webhook
webhook_url = "https://hook.eu1.make.com/eky0pd2bubz3n1ibv1mrweace3b1bq56"
print(f"\n→ Posting to {webhook_url}")

try:
    resp = requests.post(
        webhook_url,
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    print(f"✓ Status: {resp.status_code}")
    print(f"  Response: {resp.text[:200]}")
except Exception as e:
    print(f"✗ Error: {e}")
