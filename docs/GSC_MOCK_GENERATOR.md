# BLOW GSC Mock Generator

Automatische mock Google Search Console data generator voor BLOW pilot project.

## Overview

**Doel:** Genereer realistische mock GSC data vanuit ContentQueue en POST naar Make webhook  
**Schedule:** Dagelijks 09:00 uur  
**Output:** JSON payload (raw + daily rows)  
**Status:** ✅ Generator werkt | ⚠️ Webhook blokt (403 - Host not in allowlist)

## Status Report (2026-05-02)

**Laatste run:**
- ✅ 10 published posts geladen
- ✅ 41 queries gegenereerd
- ✅ 164 raw rows (4 per query: NL/BE × mobile/desktop)
- ✅ 41 daily rows (28-dag aggregates)
- ✅ Payload opgeslagen: `data/gsc_payload.json` (52KB)
- ❌ Webhook POST failed: 403 Host not in allowlist

**Oplossing voor webhook:** 
1. Ga naar Make.com scenario
2. Open webhook settings voor `eky0pd2bubz3n1ibv1mrweace3b1bq56`
3. Add IP allowlist entry of disable restrictions
4. Test: `./scripts/test_gsc_webhook.sh`

## Setup

### Prerequisites
```bash
pip install requests
```

### Configuration

Webhook URL (in `gsc_mock_generator.py`):
```python
MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/eky0pd2bubz3n1ibv1mrweace3b1bq56"
```

Sheet autosync via Google Drive MCP of lokale markdown export.

## Data Generation

### Input
- **ContentQueue Sheet:** Posts met `archive_url` niet leeg
- **Kolommen:** row_id, department, primary_keyword, secondary_keywords, title, archive_url

### Output per Post

**Queries genereren (3-5 per post):**
- 1× exact `primary_keyword`
- 2-3× variaties uit `secondary_keywords` 
- 1× long-tail (`primary_keyword + 'tips'/'beste'/'gids'`)

**Mock Statistics:**
- **Position:** Beta distribution bias naar 5-25 (range 1-50)
- **Impressions:** Lognormal 50-3000
- **CTR:** Position-afhankelijk
  - Pos 1-3: 8-15%
  - Pos 4-10: 3-8%
  - Pos 11-20: 1-3%
  - Pos 21-50: 0.2-1%
- **Clicks:** `round(impressions × ctr)`

### Payload Structure

**Raw rows** (per query × country × device):
- NL + BE × mobile + desktop = 4 rows per query
- fetch_date, query, page, clicks, impressions, ctr, position, country, device

**Daily rows** (per query, aggregated 28d):
- Clicks/impressions = ~28× daily value
- fetch_date, date_range, query, page, clicks, impressions, ctr, position

## Running

### Manual
```bash
python3 scripts/gsc_mock_generator.py
```

### Automated (Cron)
```bash
0 9 * * * /home/user/Blow/scripts/run_gsc_generator.sh
```

Edit crontab:
```bash
crontab -e
```

### Output Files
- **Payload:** `data/gsc_payload.json`
- **Logs:** `logs/gsc_generator_YYYY-MM-DD_HH-MM-SS.log`

## Examples

### Generated Query
```json
{
  "fetch_date": "2026-05-02",
  "query": "beste maand kitesurfen nederland",
  "page": "https://bramovergaag.github.io/Blow/pilot/posts/beste-maand-kitesurfen-nederland",
  "clicks": 1,
  "impressions": 84,
  "ctr": 0.0083,
  "position": 24.0,
  "country": "NL",
  "device": "mobile"
}
```

### Payload Structure
```json
{
  "fetch_date": "2026-05-02",
  "posts_processed": 11,
  "total_queries": 45,
  "raw_rows_count": 180,
  "daily_rows_count": 45,
  "raw_data": [...],
  "daily_data": [...]
}
```

## Realistic Features

✅ Position bias toward 5-25 (most real GSC data)  
✅ CTR inverse correlated with position  
✅ Impressions span realistic range with lognormal distribution  
✅ Light day-to-day drift (±10%)  
✅ Multiple countries (NL, BE)  
✅ Multiple devices (mobile, desktop)  
✅ 28-day aggregation for daily rows  

## Troubleshooting

### Webhook Returns 403 (Host not in allowlist)
**Dit is de huidige situatie.** De Make webhook blokkeert verzoeken van dit IP/host.

**Oplossingen:**
1. **In Make.com:** Webhook settings → allowlist → add IP of disable restrictions
2. **Test lokaal:** `./scripts/test_gsc_webhook.sh` (toont payload summary + POST response)
3. **Curl test:** 
```bash
curl -X POST https://hook.eu1.make.com/eky0pd2bubz3n1ibv1mrweace3b1bq56 \
  -H 'Content-Type: application/json' \
  -d @data/gsc_payload.json -w "\\nStatus: %{http_code}\\n"
```

### Script niet lezen sheet
- Check path: `data/content_queue.md` exists?
- Verify column names match (case-sensitive, escaped underscores)
- Regenerate met: `python3 scripts/update_content_queue.py` (als beschikbaar)

### No posts processed
- Ensure posts punya non-empty `archive_url` value
- Check ContentQueue status = "published"
- Verify `data/content_queue.md` has data rows

## Future Enhancements

- [ ] Direct Google Drive API read (instead of markdown export)
- [ ] Webhook retry logic dengan exponential backoff
- [ ] Configurable query generation rules
- [ ] Historical data smoothing (trend simulation)
- [ ] Real GSC data hybrid (mock + actual blend)
