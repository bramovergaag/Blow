#!/bin/bash
# Test GSC webhook POST
# Usage: ./test_gsc_webhook.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAYLOAD_FILE="$SCRIPT_DIR/../data/gsc_payload.json"
WEBHOOK_URL="https://hook.eu1.make.com/eky0pd2bubz3n1ibv1mrweace3b1bq56"

if [ ! -f "$PAYLOAD_FILE" ]; then
    echo "Error: Payload file not found: $PAYLOAD_FILE"
    echo "Run: python3 scripts/gsc_mock_generator.py"
    exit 1
fi

echo "=== GSC Webhook Test ==="
echo "Payload: $PAYLOAD_FILE"
echo "Webhook: $WEBHOOK_URL"
echo

# Show payload summary
python3 << 'EOF'
import json
with open("$PAYLOAD_FILE") as f:
    data = json.load(f)
print(f"Posts processed: {data['posts_processed']}")
print(f"Queries generated: {data['total_queries']}")
print(f"Raw rows: {data['raw_rows_count']} (4 per query: NL/BE × mobile/desktop)")
print(f"Daily rows: {data['daily_rows_count']} (28-day aggregates)")
print(f"\nPayload size: {len(json.dumps(data)):,} bytes")
EOF

echo
echo "POST to webhook..."
curl -X POST "$WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d @"$PAYLOAD_FILE" \
    -w "\nHTTP Status: %{http_code}\n"

echo
echo "Done."
