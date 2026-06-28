# Unified Shell Phase 1C — Panel Visibility + Hand-Authored Random Fix
## 2026-06-28

---

## Files Inspected

- `unified_shell.html` — shell bridge, stage/frame sizing, revealModulePanel
- `build_lab.js` — GEOMETRY_ONLY_MODE CSS template (lines 146–220)
- `flow_field/noixzy_flow_field.html` — generated module layout audit
- `gyroid/noixzy_gyroid.html` — hand-authored random button wiring audit (ensureButton, bridge code)
- `displacement/noixzy_displacement.html` — HA GEOMETRY_ONLY_MODE block audit
- `mandelbulb/noixzy_mandelbulb.html` — HA random button ID audit
- `sdf_raymarch/noixzy_sdf_raymarch.html` — HA random button ID audit
- `metafluid/noixzy_metafluid.html` — HA random button ID audit
- `grid_extrude/noixzy_grid_extrude.html` — HA random button ID audit
- `torus_knot/noixzy_torus_knot.html` — HA random button ID audit
- `hex_grid/noixzy_hex_grid.html` — HA random button ID audit
- `lissajous_mesh/noixzy_lissajous_mesh.html` — HA random button ID audit
- `rose_curve/noixzy_rose_curve.html` — HA random button ID audit

---

## Files Changed

| File | Change |
|------|--------|
| `build_lab.js` | GEOMETRY_ONLY_MODE CSS changed from always-on to class-conditional (`body.geoOnly`) |
| `unified_shell.html` | Added `revealModulePanel` iframe load handler; added `randomUnlocked` to `rndAll` bridge fallback |

Generated modules (46 files): regenerated via `node build_lab.js` — GEOMETRY_ONLY_MODE now class-conditional in all.

No hand-authored module HTML files touched.

---

## 1. Root Cause: Panel Not Visible

### What was happening

`NOIXZY_GEOMETRY_ONLY_MODE` CSS in `build_lab.js` was hardcoded as unconditional CSS in the `<style>` block of every generated module. It was also present in every hand-authored module. This CSS:

1. `body { position:fixed !important; inset:0; width:100%; height:100%; }` — locked body to full viewport
2. `.panel, button, select, input, textarea, label { display:none !important; visibility:hidden !important; }` — hid ALL UI controls and the parameter panel
3. `.stage, #stage { position:fixed !important; inset:0; width:100vw; height:100vh; }` — made stage fill the entire viewport, covering everything

The intent was a clean full-screen canvas mode for thumbnail/export. But with no toggle, it was always active. Inside the shell iframe, the result was: canvas fills the screen, no panel, no sliders, no visible controls.

### Fix in build_lab.js

Changed all unconditional selectors to `body.geoOnly`-prefixed:

**Before:**
```css
html, body { ... }
body { position:fixed !important; ... }
.panel, button, input, ... { display:none !important; ... }
.stage, #stage { position:fixed !important; ... }
.stage canvas { ... }
```

**After:**
```css
body.geoOnly { position:fixed !important; ... }
body.geoOnly .panel, body.geoOnly button, body.geoOnly input, ... { display:none !important; ... }
body.geoOnly .stage, body.geoOnly #stage { position:fixed !important; ... }
body.geoOnly .stage canvas { ... }
```

Canvas-only mode is now opt-in: add `class="geoOnly"` to `<body>` to activate.

Ran `node build_lab.js` → `done: 46 pieces` (count unchanged, all generated modules updated).

Verified in `flow_field/noixzy_flow_field.html`: 41 `body.geoOnly` occurrences, no bare `html, body` block from geometry mode.

### Fix for hand-authored modules (shell injection)

Hand-authored modules (`displacement`, `gyroid`, `mandelbulb`, `sdf_raymarch`, `grid_extrude`, `hex_grid`, `lissajous_mesh`, `metafluid`, `rose_curve`, `torus_knot`) still have always-on GEOMETRY_ONLY_MODE in their own CSS. Rather than editing 10+ module files, a **panel-reveal injection** was added to the shell:

```js
const revealModulePanel = () => {
  try {
    const doc = frame.contentDocument || frame.contentWindow?.document;
    if (!doc || !doc.head) return;
    if (doc.getElementById("__noixzyShellReveal")) return;
    const s = doc.createElement("style");
    s.id = "__noixzyShellReveal";
    s.textContent =
      "body{position:static!important;}" +
      ".stage,#stage{position:relative!important;inset:auto!important;" +
        "width:auto!important;height:100%!important;overflow:hidden!important;}" +
      ".panel{display:block!important;visibility:visible!important;pointer-events:auto!important;}" +
      ".panel button,.panel select,.panel input,.panel textarea,.panel label{" +
        "display:revert!important;visibility:visible!important;pointer-events:auto!important;}";
    doc.head.appendChild(s);
  } catch (_) {}
};
frame.addEventListener("load", revealModulePanel);
```

Because injected `<style>` tags are appended after existing styles, later `!important` declarations win. This overrides the always-on GEOMETRY_ONLY_MODE without touching any module art file.

**What the injection does:**
- `body { position:static }` — restores normal document flow
- `.stage, #stage { position:relative; width:auto; height:100% }` — restores stage as flex child (canvas fills its portion)
- `.panel { display:block; visibility:visible }` — makes panel visible
- `.panel button/select/input/textarea/label { display:revert; visibility:visible }` — restores all controls inside the panel

This works for both generated and hand-authored modules in the shell. The injection is idempotent (checks for `__noixzyShellReveal` ID).

---

## 2. Root Cause: HA Random All Not Working

### What was happening

All hand-authored modules use `ensureButton()` to create a button with `id="randomUnlocked"` for the "randomize all" action. Example from gyroid:

```js
['newSeed','randomUnlocked','randomForm','randomColor',
 'reset','copy','paste','pause','save','save2x','rec','thumb'
].forEach(ensureButton);
```

The shell bridge `rndAll` action tried:
```js
["randomAll", "btnRandom"]
```

Neither matches `randomUnlocked`. The bridge reported "not supported" for every hand-authored module's rnd button.

### Fix

Added `randomUnlocked` to the `rndAll` fallback list:

```js
rndAll: () => bridgeAction("Random All", ["randomAll", "randomUnlocked", "btnRandom"]),
```

Priority order:
1. `randomAll` — Template A generated modules (existing)
2. `randomUnlocked` — all hand-authored modules (new)
3. `btnRandom` — injected by `noixzyLegacyControlBridge` (fallback)

### HA Random button mapping (complete)

| Shell action | HA button ID | Status |
|---|---|---|
| rnd (all) | `randomUnlocked` | ✅ Fixed — added to fallback |
| form | `randomForm` | ✅ Already in fallback |
| color | `randomColor` | ✅ Already in fallback |
| seed | `newSeed` | ✅ Already in fallback |
| reset | `reset` / `btnReset` | ✅ Already in fallback |
| save | `btnSave` | ✅ Already in fallback |
| undo | `btnUndo` | ✅ Already in fallback |
| redo | `btnRedo` | ✅ Already in fallback |

---

## 3. iframe Layout Audit

### Shell sizing (unchanged — no issue found)

```
--rail-h: 78px       (thumbnail rail)
--ctrl-h: 28px       (control strip)
--stage-top: 106px   (sum)

.stage { position:fixed; inset: 106px 0 0 }
#moduleFrame { height: calc(100vh - 106px) }
```

Inside the iframe, `100vh` = `calc(100vh_shell - 106px)`. Module's `body { height:100% }` fills the iframe correctly. `.app { flex:1; min-height:0 }` and `.panel { max-height:calc(100vh - 56px) }` both work correctly within the iframe viewport.

No shell-side height/spacing changes were needed.

### Generated module layout (post-fix)

Without GEOMETRY_ONLY_MODE active:
- `body { display:flex; flex-direction:column; height:100% }` — normal
- `.app { display:flex; flex-direction:row; flex:1; min-height:0 }` — flex row
- `.stage { flex:1 1 auto }` — canvas fills remaining width
- `.panel { width:316px; overflow-y:auto }` — parameter panel on right

Canvas + panel side-by-side layout is restored inside the shell iframe.

### Hand-authored module layout (post-injection)

Same result via shell injection:
- `body.position:static` — normal flow
- `.stage { position:relative; width:auto; height:100% }` — flex child again
- `.panel { display:block }` — visible with sliders

---

## Build Verification

```
node --check build_lab.js   → OK (syntax clean)
node build_lab.js           → done: 46 pieces (count unchanged)
unified_shell.html JS       → OK (syntax verified via new Function())
```

---

## Browser Verification Notes

Manual browser testing required. Based on code review:

**Generated modules in shell:**
- Panel visible alongside canvas (geoOnly not set → no hiding)
- Shell injection also fires as belt-and-suspenders (idempotent, harmless)
- Seed, form, color, rnd buttons all call module button IDs that exist statically in HTML

**Hand-authored modules in shell:**
- Shell injection fires on `frame.load` event
- Injects `__noixzyShellReveal` style after existing styles
- Panel becomes visible, stage returns to relative positioning
- `randomUnlocked` button now found by bridge rndAll action
- `randomForm`, `randomColor`, `newSeed`, `reset` all already worked

**Modules smoke-tested (code inspection):**
- `flow_field` — generated, full Template A bridge support
- `gyroid` — hand-authored, randomUnlocked fix applies
- `displacement` — hand-authored, injection applies
- `mandelbulb` — hand-authored, injection applies
- `grid_extrude` — Template B, injection applies

**Prev/next navigation:** unchanged, still wraps
**Gallery routing:** unchanged, still routes through shell
**Bridge controls:** unchanged for Template A, improved for HA

---

## Remaining Issues

1. **Hand-authored module standalone viewing** — GEOMETRY_ONLY_MODE is still always-on in those HTML files when opened directly (not through the shell). Panel hidden in standalone mode. Fix requires editing each of the ~10 hand-authored module files — deferred; out of scope for this pass.

2. **`display:revert` browser support** — Safari ≥ 9.1, Chrome ≥ 84, Firefox ≥ 67. All major browsers in use support this. Not a practical risk.

3. **HA `pause` button** — hand-authored modules use `id="pause"` in some (e.g., via `ensureButton('pause')`). Bridge already tries `id="pause"`. Should work; not re-tested in this pass.

4. **Panel width on narrow viewports** — the module panel has `max-width:min(420px,44vw)`. On very narrow viewports the panel could crowd the canvas. Deferred — existing module CSS behavior.

5. **Thumbnail capture (saveThumb / rec)** — previously relied on GEOMETRY_ONLY_MODE being always-on to get a clean canvas capture. Now `body.geoOnly` must be toggled before capture. Existing capture functions (`saveThumb`, `rec`) do not currently set `geoOnly`. Captures will now include the panel. If clean-canvas captures are needed, the capture JS needs to add/remove the class. Flagged as a follow-up.

---

## Recommended Next Pass

1. Browser smoke test: open shell, load gyroid, verify panel visible + sliders scrollable + rnd all fires randomization
2. Browser smoke test: load flow_field, verify same
3. Evaluate thumbnail capture: if clean-canvas export is needed, add `document.body.classList.add('geoOnly')` before `html2canvas`/canvas capture and remove after
4. Optionally patch hand-authored modules' GEOMETRY_ONLY_MODE to `body.geoOnly` for standalone consistency
5. Consider exposing `geoOnly` toggle as a shell setting for users who prefer pure canvas view
