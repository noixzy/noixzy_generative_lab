# noixzy generative lab — session bridge (cross-LLM continuity)

_Read this to pick up the build mid-stream. Tool-agnostic: written so ChatGPT, Codex, a fresh Claude session, or any LLM can resume without prior chat context._
_Last updated: 2026-06-25._

---

## What this file is

A **rolling continuity log + current focus**, separate from the static project docs:

| File | Role |
|---|---|
| `HANDOFF.md` | project truth — architecture, modules, how to run |
| `CHATGPT_PROMPT.md` | **start here for any ChatGPT session** — complete current-state prompt |
| `NEXT_MODULES.md` | new module specs + feature backlog |
| `CODEX_QUEUE.md` | older ordered task queue (partially stale — check SESSION_BRIDGE first) |

**Resume order for any LLM:** `CHATGPT_PROMPT.md` → this file → `NEXT_MODULES.md`

---

## Hard architecture facts (do not break)

- **22 modules total.** 12 generated (edit `build_lab.js` only, then `node build_lab.js`). 7 GLSL SDF flagships (hand-authored HTML). 4 new standalone modules (hand-authored HTML).
- p5.js 1.9.0 **GLOBAL mode** — `setup()`, `draw()`, `noise()`, `lerp()`, `map()`, `random()` are globals. Never `new p5(...)`.
- **UI binds in `setup()` only** — DOMContentLoaded silently kills controls.
- **Self-contained** — CDN script tag only. No npm, no bundler.
- `mix()` is GLSL-only — in p5.js 2D modules define `const mix=(a,b,t)=>a+(b-a)*t;` at top.
- After any change, verify in a real browser (open the HTML file directly).
- `ALL_MODULES` array has **22 entries** — update it in EVERY module when adding new ones.

### ALL_MODULES canonical order (22 entries)

```js
const ALL_MODULES=[
  {id:"grid_extrude",title:"grid extrude"},{id:"sdf_raymarch",title:"sdf raymarch"},
  {id:"gyroid",title:"gyroid"},{id:"displacement",title:"displacement"},
  {id:"displacement_primitives",title:"displacement primitives"},
  {id:"mandelbulb",title:"mandelbulb"},{id:"fold",title:"fold"},
  {id:"flow_field",title:"flow field"},{id:"reaction_diffusion",title:"reaction diffusion"},
  {id:"voronoi",title:"voronoi"},{id:"contour_field",title:"contour field"},
  {id:"truchet",title:"truchet"},{id:"truchet_b",title:"truchet // color"},
  {id:"l_system",title:"l-system"},{id:"cellular_erosion",title:"cellular erosion"},
  {id:"recursive_grid",title:"recursive grid"},{id:"wave_interference",title:"wave interference"},
  {id:"stipple",title:"stipple"},
  {id:"hex_grid",title:"hex grid"},{id:"rose_curve",title:"rose curve"},
  {id:"lissajous_mesh",title:"lissajous mesh"},{id:"torus_knot",title:"torus knot"},
];
```

---

## Current state (2026-06-25)

### What was built this session

- ✅ **4 new standalone modules** added and fully wired: `hex_grid`, `rose_curve`, `lissajous_mesh`, `torus_knot`
  - Each has: theme system, color pickers (bg/form/hi) + value sliders, `→ thumb` button, `ALL_MODULES` nav strip, prev/next nav
  - `hex_grid`: isometric extrude per cell — side faces at 0.60× (right) and 0.35× (left) brightness, `P.extrude` slider
  - `rose_curve`: `P.depth` — z-scale + y-offset per layer, back-to-front draw order
  - `lissajous_mesh`: same `P.depth` approach — z-scale + y-offset per curve
  - `torus_knot`: WEBGL GLSL SDF, color pickers wired to existing `cs` uniforms, camera orbit drag/scroll
- ✅ **Stray `}catch(e){_captureThumb()...}` syntax error** removed from all 5 GLSL flagships: `gyroid`, `sdf_raymarch`, `displacement`, `displacement_primitives`, `mandelbulb`. This bug silently killed their entire script — nothing rendered, thumb didn't work.
- ✅ **Gallery + build_lab.js** updated with all 22 module entries
- ✅ `mix()` crash fixed in `hex_grid` and `rose_curve` (GLSL built-in not available in p5.js 2D)
- ✅ `torus_knot` shader performance reduced ~3× (64 closest-point steps, tetrahedral normals, 2 AO samples, 60 march steps, `pixelDensity(1)`)

### Known issues / still pending

- ⏳ **`displacement_primitives`** — still missing: audio, pin/fav, `→ thumb` button. Has nav + camera orbit + theme. Priority task.
- ⏳ **Gallery thumbnails** for 4 new modules — need manual browser capture: open each, click `→ thumb`, pick `gallery/thumbs/` folder.
- ⏳ **Pin/fav + dbl-click reset** not yet on the 4 new modules (hex_grid, rose_curve, lissajous_mesh, torus_knot).
- ⏳ **Audio reactivity** not yet on the 4 new modules.
- ⏳ **New flagship modules** — not yet started (see `NEXT_MODULES.md`).

---

## Decisions / conventions in force

- **Author credit in script/file headers:** "Chris Tucker" only.
- **noixzy** is always lowercase.
- House look: dark ground / mid field / bright focal, restrained palette, open negative space.
- `saveThumb()` always uses `requestAnimationFrame()` wrapper — required for WEBGL buffer timing. Works fine for 2D too.
- Color state in GLSL flagships: `cs = {bg:"#hex", form:"#hex", hi:"#hex", bgVal, fSat, fVal, rim}` — hex strings.
- Color state in new 2D modules: `bgCol/fmCol/hiCol` as `[r,g,b]` arrays + `bgVal/fmVal/hiVal` float multipliers.
- `applyTheme()` must always call `syncColorUI()` — syncs color pickers to match loaded theme.
- Never put any code after the closing `}` of `saveThumb()` — prior bug pattern that breaks the script.

---

## Session log

### 2026-06-25 (continued)
- **flow_field density** — slider was capped at max:0.20 but render mapped 0→1; fixed to full 0→1 range, raised ceiling to 6000 strands
- **navBar gallery link** — generated modules showed module title as center link text; changed to "⊞ gallery" matching hand-authored modules. Also removed `pointer-events:none` so the link is clickable.
- **`_edgeMask(out,G)` engine helper** — added to build_lab.js, applied at every `heightField()` return point in all 12 generated modules. Heights fade to 0 within 15% of each edge (smoothstep 0.15→0.30), inner ~70% extrudes at full strength. Borders stay flat.
- **Modules opening from page bottom** — root cause: generated modules used `el.scrollIntoView({block:"nearest"})` in `buildNav()`, which scrolled the panel vertically to show the thumb strip. Fixed by switching to `strip.scrollLeft` horizontal-only offset (matching hand-authored modules).
- **`→ thumb` click listener missing** — gyroid, displacement, mandelbulb, fold all had the button in HTML and `saveThumb()` defined but no `addEventListener`. Added to all four.
- **contour_field extrude** — added `height`, `hvar`, `light` params + `heightField(G)` using the same 4-octave noise as the contour lines.
- **contour_field depth** — added `depth` slider. Each contour level gets z position (−1 back → +1 front): back levels scale smaller + shift up, front levels scale larger + shift down, alpha and stroke weight increase toward front. Chains sorted back-to-front. `t` stored on segments and propagated through `chainContours`.

### 2026-06-25 (earlier)
- Fixed stray `}catch(e){_captureThumb()...}` syntax error in gyroid, sdf_raymarch, displacement, displacement_primitives, mandelbulb — all were broken (blank canvas, thumb not working)
- Added isometric extrude (hex_grid), z-depth (rose_curve, lissajous_mesh), color pickers (all 4 new modules), torus_knot color controls
- Updated CHATGPT_PROMPT.md, SESSION_BRIDGE.md, NEXT_MODULES.md to reflect 22-module state

### 2026-06-24
- Added 4 new modules: hex_grid, rose_curve, lissajous_mesh, torus_knot (hand-authored, not via build_lab.js)
- Fixed mix() undefined crash in hex_grid and rose_curve
- Added → thumb button to all 4 new modules
- Reduced torus_knot shader cost ~3×
- Updated ALL_MODULES (22 entries) across all modules + build_lab.js + gallery

### 2026-06-23
- Prior session — see older entries if needed
