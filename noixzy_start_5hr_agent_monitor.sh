#!/bin/zsh

ROOT="/Users/noixzy.macbookpro/Downloads/noixzy_generative_lab"
OPS_DIR="$ROOT/workspace/agent_ops_$(date +%Y%m%d)"
REPORT_DIR="$OPS_DIR/monitor_reports"
LOG="$OPS_DIR/noixzy_5hr_agent_monitor.log"
PID_FILE="$OPS_DIR/noixzy_5hr_agent_monitor.pid"
LATEST="$OPS_DIR/LATEST_MONITOR_REPORT.txt"

DURATION_MIN=300
INTERVAL_SEC=300
START_EPOCH="$(date +%s)"
END_EPOCH="$((START_EPOCH + DURATION_MIN * 60))"

mkdir -p "$REPORT_DIR"
cd "$ROOT" || exit 1

if [ -f "$PID_FILE" ]; then
  OLD_PID="$(cat "$PID_FILE")"
  if kill -0 "$OLD_PID" 2>/dev/null; then
    echo "Monitor already running with PID $OLD_PID"
    exit 0
  fi
fi

echo "$$" > "$PID_FILE"

echo "=== NOIXZY 5HR AGENT MONITOR STARTED ===" | tee -a "$LOG"
date | tee -a "$LOG"
echo "ROOT: $ROOT" | tee -a "$LOG"
echo "OPS_DIR: $OPS_DIR" | tee -a "$LOG"
echo "INTERVAL: ${INTERVAL_SEC}s" | tee -a "$LOG"
echo | tee -a "$LOG"

while [ "$(date +%s)" -lt "$END_EPOCH" ]; do
  STAMP="$(date +%Y%m%d_%H%M%S)"
  REPORT="$REPORT_DIR/noixzy_agent_monitor_$STAMP.txt"

  {
    echo "=== NOIXZY AUTOMATED AGENT MONITOR ==="
    date
    echo
    echo "ROOT: $ROOT"
    echo "REPORT: $REPORT"
    echo

    echo "=== GIT STATUS ==="
    git status --short
    echo

    echo "=== NEWEST HTML, LAST 6 HOURS ==="
    find . -path './.git' -prune -o -name '*.html' -mmin -360 -print0 \
      | xargs -0 ls -lt 2>/dev/null \
      | head -100
    echo

    echo "=== RECENT AGENT / PROMPT / HANDOFF FILES, LAST 6 HOURS ==="
    find . -path './.git' -prune -o -type f \( \
      -iname '*handoff*' -o \
      -iname '*agent*' -o \
      -iname '*claude*' -o \
      -iname '*copilot*' -o \
      -iname '*prompt*' -o \
      -iname '*todo*' -o \
      -iname '*plan*' -o \
      -iname '*.md' -o \
      -iname '*.txt' -o \
      -iname '*.log' \
    \) -mmin -360 -print0 \
      | xargs -0 ls -lt 2>/dev/null \
      | head -160
    echo

    echo "=== MODULE ESCROW CANDIDATES ==="
    if [ -d "./workspace/module_escrow_20260627/candidates" ]; then
      find ./workspace/module_escrow_20260627/candidates -name '*.html' -print0 \
        | xargs -0 ls -lt 2>/dev/null
    else
      echo "No escrow candidate folder found."
    fi
    echo

    echo "=== CANDIDATE HTML QUICK INSPECT ==="
    if [ -d "./workspace/module_escrow_20260627/candidates" ]; then
      find ./workspace/module_escrow_20260627/candidates -name '*.html' -print0 \
        | while IFS= read -r -d '' f; do
            echo
            echo "--- $f"
            ls -lh "$f"
            echo "signals:"
            grep -Ei '<title>|<canvas|module_id|moduleId|const MODULE|data-module|noixzy_|requestAnimationFrame|function setup|function draw|function animate' "$f" 2>/dev/null | head -28

            echo "blank-risk:"
            SIZE="$(wc -c < "$f" | tr -d ' ')"
            [ "$SIZE" -lt 5000 ] && echo "RISK: tiny file under 5KB"
            ! grep -qi '<canvas' "$f" && echo "RISK: missing canvas"
            ! grep -qi '<script' "$f" && echo "RISK: missing script"
            ! grep -qi '<title>' "$f" && echo "RISK: missing title"
            ! grep -qi 'requestAnimationFrame\|function draw\|function animate' "$f" && echo "RISK: no obvious animation loop"
          done
    fi
    echo

    echo "=== RESOURCE-SAFE RECOMMENDATION ==="
    echo "Monitor only. No source edits. No renders. No browser automation."
  } > "$REPORT"

  cp "$REPORT" "$LATEST"

  echo "[$(date)] wrote report: $REPORT" | tee -a "$LOG"

  sleep "$INTERVAL_SEC"
done

echo "=== NOIXZY 5HR AGENT MONITOR FINISHED ===" | tee -a "$LOG"
date | tee -a "$LOG"
rm -f "$PID_FILE"
