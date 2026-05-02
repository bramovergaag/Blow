# GSC Mock Generator - Scheduling Setup

## Quick Setup (5 mins)

### 1. Install dependencies (one-time)
```bash
pip3 install requests
```

### 2. Create directories
```bash
mkdir -p /home/user/Blow/logs
mkdir -p /home/user/Blow/data
```

### 3. Test the generator
```bash
cd /home/user/Blow
python3 scripts/gsc_mock_generator.py
```

Expected output:
```
[2026-05-02T21:55:13] START: GSC Mock Generator
[2026-05-02T21:55:13] SHEET: Loaded 10 published posts
[2026-05-02T21:55:13] PAYLOAD: Generated 41 queries
[2026-05-02T21:55:13] PAYLOAD: Raw rows: 164, Daily rows: 41
[2026-05-02T21:55:13] PAYLOAD: Saved to /home/user/Blow/data/gsc_payload.json
[2026-05-02T21:55:13] ERROR: Failed to POST to webhook  # Expected if Make webhook not configured
[2026-05-02T21:55:13] END: Generator completed
```

### 4. Schedule daily run (09:00)
```bash
crontab -e
```

Add this line:
```
0 9 * * * python3 scripts/gsc_mock_generator.py >> logs/gsc_generator.log 2>&1
```

Verify:
```bash
crontab -l
```

### 5. Check logs
```bash
tail -f /home/user/Blow/logs/gsc_generator.log
```

## Files Created

✅ `/home/user/Blow/data/content_queue.md` - ContentQueue from Google Sheet  
✅ `/home/user/Blow/data/gsc_payload.json` - Generated mock data (JSON)  
✅ `/home/user/Blow/logs/gsc_generator_YYYY-MM-DD_*.log` - Execution logs  
✅ `/home/user/Blow/scripts/test_gsc_webhook.sh` - Manual webhook test  

## What Happens Daily

At 09:00:
1. Reads `data/content_queue.md` (10 published posts)
2. Generates 41 queries with realistic stats
3. Creates 164 raw rows + 41 daily rows
4. Saves to `data/gsc_payload.json`
5. Attempts POST to Make webhook
6. Logs result to `logs/gsc_generator.log`

## Webhook Issue

Current: **403 Host not in allowlist**

To fix:
1. Go to Make scenario: eky0pd2bubz3n1ibv1mrweace3b1bq56
2. Webhook settings → Add IP to allowlist or disable restrictions
3. Test: `./scripts/test_gsc_webhook.sh`

## Manual Post (if auto fails)

```bash
./scripts/test_gsc_webhook.sh
```

Or directly:
```bash
curl -X POST https://hook.eu1.make.com/eky0pd2bubz3n1ibv1mrweace3b1bq56 \
  -H 'Content-Type: application/json' \
  -d @data/gsc_payload.json
```

## Data Sample

Raw row:
```json
{
  "fetch_date": "2026-05-02",
  "query": "beste maand kitesurfen nederland",
  "page": "https://bramovergaag.github.io/Blow/pilot/posts/beste-maand-kitesurfen-nederland",
  "clicks": 3,
  "impressions": 195,
  "ctr": 0.0206,
  "position": 11.2,
  "country": "NL",
  "device": "mobile"
}
```

Daily row (28-day aggregate):
```json
{
  "fetch_date": "2026-05-02",
  "date_range": "last-28-days",
  "query": "beste maand kitesurfen nederland",
  "page": "https://bramovergaag.github.io/Blow/pilot/posts/beste-maand-kitesurfen-nederland",
  "clicks": 112,
  "impressions": 5992,
  "ctr": 0.0206,
  "position": 11.2
}
```

Done! ✓
