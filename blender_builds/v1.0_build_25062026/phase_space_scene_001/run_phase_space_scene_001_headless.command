#!/bin/bash
set -euo pipefail

# Run from this scene build folder. No Downloads scattering. No root scripts folder.
SCENE_DIR="$(cd "$(dirname "$0")" && pwd)"
BLENDER="/Applications/Blender.app/Contents/MacOS/Blender"
LOG="$SCENE_DIR/headless.log"

mkdir -p "$SCENE_DIR/renders"
cd "$SCENE_DIR"

"$BLENDER" \
  --background \
  --factory-startup \
  --python "$SCENE_DIR/phase_space_scene_001.py" \
  2>&1 | tee "$LOG"

{
  echo
  echo "=== PHASE SPACE SCENE 001 VERIFY ==="
  find "$SCENE_DIR" -maxdepth 2 -type f -print
  echo
  echo "=== BLEND ==="
  ls -lh "$SCENE_DIR/phase_space_scene_001.blend" 2>/dev/null || true
  echo
  echo "=== RENDER ==="
  ls -lh "$SCENE_DIR/renders/phase_space_scene_001.png" 2>/dev/null || true
  echo
  echo "=== FLAT BROWSE ==="
  ls -lh "/Volumes/noixzy T5 EVO SSD/ASSET LIBRARY/______newDemo Renders/phase_space_scene_001.png" 2>/dev/null || true
} | tee /dev/tty | pbcopy
