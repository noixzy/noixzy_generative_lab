# GPT handoff — noixzy generative lab
# Date: 2026-06-25 — valid through 2026-06-28

> Paste this entire file as your first message. Then paste the specific file(s) you're working on as follow-up messages. Always return the **complete updated file** — never a diff or snippet.

---

## What just happened (last session summary)

1. **metafluid** flagship module was built and committed (`c39ccce`) — GLSL SDF raymarched metaballs with polynomial smin blob merging, 32 spheres, AO, diffuse/rim/spec/fresnel/sss.
2. **New unified console layout** was prototyped in metafluid (`a51444e`) — stageTools bottom overlay on canvas, stageThumbs left vertical rail, cycleLine theme control, consoleBtns, presetStatus feedback line, video recording, save 2x, copy/paste state.
3. That layout was **ported to all 23 modules** — 12 via `build_lab.js` (`6b6cf9f`), 11 hand-authored (`8f42b95`).

**Current state: all 23 modules have the unified console layout. The main branch is clean.**

---

## Project identity

- Artist: noixzy (always lowercase)
- Working dir: `~/Downloads/noixzy_generative_lab/`
- Canonical mirror: `~/noixzy_generative_lab/` (keep in sync with `cp -r`)
- Gallery: `gallery/index.html`
- Generator: `node build_lab.js` — only for the 12 generated modules. Never hand-edit their HTML outputs.

---

## Module count: 23 total

### 12 generated modules — edit `build_lab.js` ONLY
`flow_field`, `reaction_diffusion`, `voronoi`, `contour_field`, `truchet`, `truchet_b`, `l_system`, `cellular_erosion`, `recursive_grid`, `wave_interference`, `sdf`, `stipple`

After any change: `node build_lab.js`

### 8 GLSL SDF flagships — hand-authored HTML
`grid_extrude`, `sdf_raymarch`, `gyroid`, `displacement`, `displacement_primitives`, `mandelbulb`, `fold`, `metafluid`

### 3 new GLSL + new standalone
`torus_knot` (GLSL), `hex_grid`, `rose_curve`, `lissajous_mesh` (p5.js 2D)

---

## Non-negotiable rules

1. Never hand-edit generated HTML — only `build_lab.js` → `node build_lab.js`.
2. p5.js 1.9.0 global mode. `setup()`, `draw()`, `noise()`, `lerp()`, `map()`, `random()` are globals. No `new p5(...)`.
3. UI binds in `setup()` ONLY — never in `DOMContentLoaded`.
4. No external deps beyond p5.js 1.9.0. Everything inline.
5. `mix()` is GLSL-only. In 2D modules: `const mix=(a,b,t)=>a+(b-a)*t;`
6. Return the complete updated file. Never a diff or snippet.
7. `_edgeMask(out,G)` before every `heightField()` return in generated modules.

---

## Unified console layout (ALL 23 modules now have this)

### Stage overlays (inside `<div id="stage" class="stage">`)

```html
<div class="stageTools" id="stageTools">
  <!-- bottom bar: pin, copy, paste, audio, export/clear favs,
       thumb, video rec+duration, save png, save 2x [, pbr for generated] -->
</div>
<div class="stageThumbs" id="stageThumbs">
  <!-- left vertical rail: ▲ arrow, .thumbRow vertical, ▼ arrow -->
</div>
```

### Panel structure (top of panel)

```html
<div class="cycleLine">
  <button id="themePrev" class="cycleBtn">‹</button>
  <select id="themeSelect"></select>
  <button id="themeNext" class="cycleBtn">›</button>
</div>
<div class="consoleBtns">
  <!-- reset, pause [, randomize, rnd color, new seed for generated] -->
</div>
<div id="presetStatus" class="presetStatus"></div>
<!-- params / groups below -->
```

### Key JS additions in every module

- `function _flashConsole(msg)` — sets `#presetStatus` text
- `buildNav()` — vertical rail, stopPropagation on stageThumbs, selectThumb helper, scrollIntoView
- `ALL_MODULES` — 23 entries, metafluid after fold

### ALL_MODULES (23 entries, exact order)

```js
const ALL_MODULES=[
  {id:"grid_extrude",title:"grid extrude"},
  {id:"sdf_raymarch",title:"sdf raymarch"},
  {id:"gyroid",title:"gyroid"},
  {id:"displacement",title:"displacement"},
  {id:"displacement_primitives",title:"displacement primitives"},
  {id:"mandelbulb",title:"mandelbulb"},
  {id:"fold",title:"fold"},
  {id:"metafluid",title:"metafluid"},
  {id:"flow_field",title:"flow field"},
  {id:"reaction_diffusion",title:"reaction diffusion"},
  {id:"voronoi",title:"voronoi"},
  {id:"contour_field",title:"contour field"},
  {id:"truchet",title:"truchet"},
  {id:"truchet_b",title:"truchet // color"},
  {id:"l_system",title:"l-system"},
  {id:"cellular_erosion",title:"cellular erosion"},
  {id:"recursive_grid",title:"recursive grid"},
  {id:"wave_interference",title:"wave interference"},
  {id:"stipple",title:"stipple"},
  {id:"hex_grid",title:"hex grid"},
  {id:"rose_curve",title:"rose curve"},
  {id:"lissajous_mesh",title:"lissajous mesh"},
  {id:"torus_knot",title:"torus knot"},
];
```

---

## Priority task queue (do these in order)

### 1 — displacement_primitives: add audio + pin/fav + thumb

This module is still missing audio reactivity, pin/fav localStorage, and thumb saving. Copy the full pattern from `gyroid` or `displacement`. Feature matrix for reference:

| Feature | displacement_primitives |
|---|---|
| Audio | ✗ missing |
| Pin/fav | ✗ missing |
| Thumb (saveThumb) | ✗ missing |
| Camera orbit | ✓ |
| Theme | ✓ |

Paste `displacement_primitives/noixzy_displacement_primitives.html` and add all three. Follow `gyroid/noixzy_gyroid.html` as the reference.

### 2 — Gallery thumbnails

These modules are missing `gallery/thumbs/*.png`:
- `metafluid.png` (new)
- `hex_grid.png`
- `rose_curve.png`
- `lissajous_mesh.png`
- `torus_knot.png`

Open each in Chrome, let it run for a few seconds, click `→ thumb` in the stageTools bar, pick the `gallery/thumbs/` folder.

### 3 — New flagship modules (build one at a time)

Each is a new hand-authored HTML file in its own folder, added to `gallery/index.html` and to `ALL_MODULES` in every existing module's file (or batched via a find-replace across all 23). See NEXT_MODULES.md for full specs.

#### 3a — julia_set

- p5.js 2D pixel shader loop (NOT GLSL — use `loadPixels()`/`updatePixels()`)
- Complex iteration: `z → z² + c`, escape condition `|z| > 2`
- Params: `cx`, `cy` (real/imag of c, animated), `zoom`, `maxIter`, `colorShift`, `speed`
- Animate c along an ellipse in the complex plane: `c = (cx + A*cos(t), cy + B*sin(t))`
- Color by smooth iteration count: `t = iter - log2(log2(|z|))`, map to palette
- Pattern: same shell as hex_grid (2D, PALETTES array, syncColorUI, ALL_MODULES, buildNav)

#### 3b — fourier_epicycles

- p5.js 2D, no GLSL
- Discrete Fourier transform of a predefined path (star, heart, lemniscate, custom)
- Draw N rotating phasors (epicycles), trace the tip position
- Params: `nCircles` (how many frequencies), `speed`, `showCircles` (toggle), `pathChoice` (which curve), `trailLen`
- The drawn path is the Fourier reconstruction — elegant and meditative
- Pattern: same shell as hex_grid

#### 3c — particle_attractor

- p5.js 2D with persistent `pg` graphics buffer (trails accumulate)
- 10,000–30,000 particles integrated on a Clifford or Lorenz attractor
- Clifford: `xn+1 = sin(a*yn) + c*cos(a*xn)`, `yn+1 = sin(b*xn) + d*cos(b*yn)`
- Params: `a`, `b`, `c`, `d` (attractor coefficients), `nParticles`, `speed`, `trailFade`, `dotSize`
- Fade `pg` each frame with low-alpha background fill to create trails
- Pattern: same shell as rose_curve (persistent pg, same color approach)

#### 3d — substrate

- p5.js 2D
- Crack propagation: each crack walks at a noise-guided angle, spawning branches
- Crack front walks 1px per frame; at branch points a new crack spawns
- Params: `nCracks`, `branchProb`, `angleJitter`, `speed`, `lineWeight`
- Builds up over time into an organic vein network — very still-friendly
- Pattern: simple, no GLSL, no depth — same shell as l_system

#### 3e — menger_sponge

- WEBGL + GLSL fragment shader (raymarching)
- Box-fold IFS SDF: `for(i<4){ p=abs(p)-offset; if(length(p.xy)<r) p.xy*=scale; ... }`
- Or classic Menger: subtract 3-axis cross at each iteration
- Params: `iterations` (2–5), `scale`, `offset`, `ao`, `spin`, `dist`
- Camera orbit via `_initOrbit`
- Pattern: same shell as gyroid/fold (GLSL flagship)

---

## Features to add across modules

### Audio reactivity for new standalone modules

**hex_grid** — add full audio system (copy from gyroid):
- `bass → P.extrude` height boost
- `mid → P.freq` (noise frequency)
- `hi → P.speed` multiplier
- Add `btnAudio` wiring (already in stageTools HTML, just needs backend)
- Add `AMAP` array and `ADEPTH` param

**rose_curve** — add audio:
- `bass → P.scale` (overall size pulse)
- `mid → P.speed` (rotation rate)
- `hi → P.n` morph (subtly nudge n param)

**lissajous_mesh** — add audio:
- `bass → P.rx/ry` (amplitude pulse)
- `mid → P.speed`
- `hi → P.fa` nudge

### Pin/fav system for new standalone modules

All 4 (`hex_grid`, `rose_curve`, `lissajous_mesh`, `torus_knot`) currently have the stageTools pin button wired but the fav backend may be incomplete. Verify and add if missing:
- `_loadFavs()`, `_saveFavs()`, `pinFav()`, `renderFavs()` using localStorage
- Export/clear favs buttons (already in stageTools HTML)

### Double-click slider reset (all modules)

In the slider-building loop, after creating each `input[type=range]`, add:
```js
el.addEventListener("dblclick", () => { el.value = defaultValue; el.dispatchEvent(new Event("input")); });
```

### torus_knot: animated p/q morph

Add a `P.morphSpeed` param (0–1). When > 0, smoothly lerp between current and target p/q integer values over time using `smoothstep`. Target changes every N seconds. Creates hypnotic knot topology transitions.

---

## Experimental ideas

### Local preset save/load (per module)

Pattern from metafluid: up to 8 local preset slots saved to localStorage. In the panel:
```html
<div class="presetSlots">
  [1][2][3][4][5][6][7][8]   <!-- click = load, shift+click = save, right-click = delete -->
</div>
```
Each slot stores the full `_stateSnapshot()`. Flash presetStatus on save/load. Start with metafluid's implementation and copy to all flagships.

### Crossfade between modules

Add a `transitionTo(moduleId)` helper in each module that:
1. Screenshots the current canvas
2. Navigates to the new URL
3. New module starts with the screenshot as a fading overlay
This would require a shared URL param like `?from=gyroid` and a small transition init in each setup().

### Audio-reactive metafluid

metafluid currently has `u_seed` but no audio system. Add:
- `bass → blob count` (more spheres at high bass)
- `mid → spread param`
- `hi → k (smin smoothness)` — at high hi the blobs get sharper/spiky

### Depth-of-field post-process for GLSL flagships

Add a second render pass in gyroid/metafluid/mandelbulb:
- Render to offscreen framebuffer
- Sample with CoC (circle of confusion) based on depth buffer
- Params: `focusDist`, `aperture`
- p5.js supports `createGraphics(w,h,WEBGL)` for this

### Palette editor

A hidden panel section (click to expand) with:
- 6 color swatches for the current palette
- Drag to reorder, click to edit via color picker
- "save as theme" button stores to localStorage
- Would work in all modules since they share the PALETTES / THEMES structure

### Export pack

"Export bundle" button that:
1. Saves the current canvas as PNG (full res)
2. Saves a 2x PNG
3. Saves a JSON state file (`noixzy_MODULE_state.json`)
4. Packages all three into a zip (using JSZip inline, ~100KB)
5. Downloads as `noixzy_MODULE_YYYYMMDD.zip`

---

## Build & deploy

```bash
node build_lab.js          # regenerate 12 generated modules
git add -A
git commit -m "..."
git push                   # auto-deploys to GitHub Pages
```

Gallery entry format (`gallery/index.html` pieces array):
```js
["module_id","display title","short description","tag1 / tag2","h"],
// "h" = hand-authored (✦ authored badge), "e" = generated (◎ generated badge)
```

When adding a new module:
1. Create `module_id/noixzy_module_id.html`
2. Add entry to `gallery/index.html` pieces array
3. Add `{id:"module_id",title:"display title"}` to `ALL_MODULES` in ALL 23 existing module files (or use find-replace)
4. Add thumbnail to `gallery/thumbs/module_id.png`

---

## Current task

[REPLACE THIS with the specific task you're handing to GPT]

Example:
- "Add audio + pin/fav + thumb to displacement_primitives. Pasting its HTML."
- "Build julia_set module. Follow hex_grid as the shell pattern."
- "Add audio reactivity to hex_grid. Pasting its HTML."
