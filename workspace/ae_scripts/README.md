# NGL After Effects Leading Animation Scripts

Simple utility suite for animating text leading in After Effects 2026.

## Scripts Included

### 1. `noixzy_animate_leading.jsx` — Basic Leading Animation
Creates a new text animator with animated leading (line spacing).

**Requirements:**
- Open a composition
- Select exactly ONE text layer

**What it does:**
- Adds new text animator: `noixzy_leading_animator`
- Animates line spacing from 6px → 48px → 6px over 2 seconds
- Applies Bezier easing for smooth motion

**Output:** Creates keyframes at current composition time

---

### 2. `noixzy_animate_leading_enhanced.jsx` — Enhanced with Config
Enhanced version with adjustable parameters.

**Requirements:**
- Open a composition
- Select exactly ONE text layer

**Customizable:**
- `startLeading`: 6px (initial line spacing)
- `peakLeading`: 48px (max line spacing at midpoint)
- `endLeading`: 6px (final line spacing)
- `duration`: 2.0s (animation length)
- `easeStrength`: 60 (Bezier curve tension)

**To modify:** Edit the `config` object inside the script (lines 18-23)

---

### 3. `noixzy_add_leading_companion.jsx` — Companion to Existing Animator
Adds leading animation to an existing text animator.

**Requirements:**
- Open a composition
- Select ONE text layer that already has an animator

**What it does:**
- Finds the last animator on the text layer
- Adds line spacing property to it
- Creates identical keyframe animation

**Use case:** Layer already has scale/position animators, add leading too

---

### 4. `noixzy_animate_leading_batch.jsx` — Batch Mode
Applies leading animation to ALL text layers in composition.

**Requirements:**
- Open a composition (no selection needed)

**What it does:**
- Finds all text layers
- Creates individual animator on each layer
- Names each: `noixzy_leading_batch_1`, `noixzy_leading_batch_2`, etc.
- Applies identical animation to all

**Output:** Logs number of layers processed to After Effects console

---

## How to Run

### Method 1: File > Scripts > Run Script File
1. File → Scripts → Run Script File
2. Navigate to `workspace/ae_scripts/`
3. Select desired script
4. Click "Open"

### Method 2: Terminal
```bash
"/Applications/Adobe After Effects 2026/Adobe After Effects 2026.app/Contents/MacOS/After Effects" \
  -r "/path/to/workspace/ae_scripts/noixzy_animate_leading.jsx"
```

### Method 3: Add to After Effects Scripts Folder
Copy to: `/Applications/Adobe After Effects 2026/Scripts/ScriptUI Panels/`
Then access via: File → Scripts → [scriptname]

---

## Workflow

**Quick Single Layer:**
```
1. Open comp
2. Select text layer
3. Run: noixzy_animate_leading.jsx
4. Adjust keyframe values if needed
```

**Enhance Existing Animator:**
```
1. Create/select existing animator
2. Select text layer
3. Run: noixzy_add_leading_companion.jsx
```

**Batch Apply to Multiple Layers:**
```
1. Open comp with multiple text layers
2. Run: noixzy_animate_leading_batch.jsx (no selection)
3. Check console for confirmation
```

---

## Console Output

Scripts write to After Effects console:
- ✓ Success confirmations
- Layer names affected
- Animation parameters applied
- Number of layers processed (batch mode)

**View Console:** Window → Developer → Console

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Open a comp..." error | Make sure a composition is active (not project panel) |
| "Select exactly one..." error | Only one text layer should be selected |
| "No text layers found" | Add text layers to composition first |
| "No existing animators" | Create an animator before using companion script |
| Script doesn't run | Check After Effects version (2026 required) |

---

## Animation Values

Default animation (all scripts):
- **Start:** 6px line spacing
- **Peak:** 48px line spacing (at 1 second)
- **End:** 6px line spacing (at 2 seconds)
- **Easing:** Bezier (smooth acceleration/deceleration)

To customize in enhanced version, modify config object in script.

---

## Log File Location

Scripts append execution log to:
```
workspace/ae_scripts/EXECUTION_LOG.txt
```

Each run records:
- Timestamp
- Script name
- Composition name
- Layers affected
- Status (success/error)

---

## Version

Created: June 27, 2026  
After Effects: 2026  
Status: Production ready

---

## Notes

- All keyframes start at current composition playhead time
- Batch mode creates unique animator names to avoid conflicts
- Enhanced version config is editable in-script (no external config file)
- Scripts are non-destructive (undo with Ctrl+Z / Cmd+Z)
