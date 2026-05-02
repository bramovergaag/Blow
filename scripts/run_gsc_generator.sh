#!/bin/bash
# Run GSC Mock Generator
# Schedule with: 0 9 * * * /home/user/Blow/scripts/run_gsc_generator.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/../logs"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
LOG_FILE="$LOG_DIR/gsc_generator_$TIMESTAMP.log"

mkdir -p "$LOG_DIR"

echo "=== GSC Mock Generator Run ===" | tee -a "$LOG_FILE"
echo "Start: $(date)" | tee -a "$LOG_FILE"

python3 "$SCRIPT_DIR/gsc_mock_generator.py" 2>&1 | tee -a "$LOG_FILE"

echo "End: $(date)" | tee -a "$LOG_FILE"
echo "Log saved to: $LOG_FILE"
