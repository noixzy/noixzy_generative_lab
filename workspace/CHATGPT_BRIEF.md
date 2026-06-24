# noixzy generative lab — context brief for continuation

**What this is.** A set of 15 self-contained generative art modules. Each one is a single HTML file that runs standalone — no build step, no server, just double-click to open. The author is a generative artist named noixzy. The aesthetic is dark, monochromatic, graphite-forward with an orange accent (`#ed5700`).

---

## Architecture

There are two kinds of files:

**1. Engine-generated modules (9 pieces)** — all produced by running `node build_lab.js` from the project root. The generator stamps a shared engine (UI, theme system, recording, extrude renderer, color state) plus each piece's own render code into a self-contained HTML file.

```
flow_field / reaction_diffusion / voronoi / contour_field /
truchet / truchet_b / l_system / cellular_erosion / recursive_grid
```

**Rule: never hand-edit these HTML files.** Any change goes into `build_lab.js`, then you run `node build_lab.js` to regenerate all 9.

**2. Hand-authored flagships (6 pieces)** — edit directly:

```
grid_extrude/noixzy_grid_extrude.html       ← 2.5D isometric extrude, most complete
sdf_raymarch/noixzy_sdf_raymarch.html       ← metaball SDF, orbit camera
gyroid/noixzy_gyroid.html                   ← TPMS shell SDF, animated phase
displacement/noixzy_displacement.html       ← FBM-displaced sphere
mandelbulb/noixzy_mandelbulb.html           ← power-N fractal DE, orbit trap
fold/noixzy_fold.html                       ← Sierpinski IFS, kaleidoscopic folds
```

These are hand-authored WebGL/p5.js modules. New engine features added to `build_lab.js` do not automatically apply here — port manually as needed.

**Archived (not in gallery):**
```
_archive/sdf/   ← original SDF piece, archived due to rendering issues
```

---

## Current engine features (inside `build_lab.js`)

- **p5.js 1.9.0** global mode. Canvas fills a flex stage div. UI lives in a side panel.
- **Theme system** — 12 palettes (ember, mineral, violet, amber, graphite, cyan, acid, magenta, gold, neutral, copper, ice) stored in `localStorage` under key `"noixzy_lab_theme"`. Cycle with `[ / ]` keys.
- **Color state** — `colorState {bg, acc, ink}` with live color pickers per channel, tied to the active palette.
- **PALETTES** — array of 12 presets. Index 4 = graphite = `["#0c0c0c","#3a3a3a","#f2f2f2"]`.
- **GROUPS** — param groups: `["system","extrude","material","frame","look","motion"]`. First 2 groups open by default.
- **SHARED params** — injected into every piece: `zoom`, `rot`, `mirror`, `metallic`, `rough`, `sheen`, `alpha`, `contrast`, `vig`, `grain`, `glow`, `speed`, `drift`.
- **Per-piece params** — each piece declares a `system[]` array. Params with `g:"extrude"` land in the extrude section. `rr:true` = re-render on change. `sys:true` = rebuild simulation.
- **`animT`** — seconds elapsed, set in `draw()`, used for time-based animation.
- **`dirty` flag** — set to `true` on param change; triggers re-render while paused.
- **`renderHeightfield(g, heights, G, pal)`** — shared isometric extrude renderer. Takes a `Float32Array` of G×G heights (0–1).
- **`heightField(G)`** — pieces that support extrude define this; returns `Float32Array(G*G)`. Engine calls it automatically when `P.height > 0.01`.
- **Save buttons** — save PNG (1x), save 2x, PBR pack (albedo / normal / roughness / emissive), record WebM (2/4/8/16s).
- **Copy/paste params** — serializes `{seed, P, theme}` to clipboard as JSON.
- **Pin/favorites** — save and restore named param snapshots per piece.
- **Keyboard shortcuts** — `h` hide panel, `?` help overlay, `space` pause/play, `[ ]` cycle theme, `s` save.
- **Responsive** — stacks vertically on mobile (`max-width:900px`).

---

## Per-piece param groups

| Piece | System params | Extrude group? | heightField? |
|---|---|---|---|
| flow_field | density, curl, speed, pal | no | no |
| reaction_diffusion | feed, kill, speed, pal | yes (height/hvar/light) | yes |
| voronoi | density, jitter, speed, pal | yes | yes |
| contour_field | threshold, frequency, smooth, pal | no | no |
| truchet | density, weight, clustering, pal | yes | yes |
| truchet_b | density, weight, clustering, pal + color params | yes | yes |
| l_system | depth, angle, decay, pal | no | no |
| cellular_erosion | density, erosion, speed, pal | yes | yes |
| recursive_grid | depth, split, pal | no | no |

---

## Hand-authored flagship architecture (SDF modules)

All five SDF/raymarch modules share the same pattern:

- **WebGL fragment shader** — fullscreen quad, `vUv` from vertex shader, raymarcher in `main()`
- **Orbit camera** — `vec3 ro = vec3(sin(a)*R, el, cos(a)*R)` where `a` is driven by `u_spin` + time
- **`map(vec3 p)`** — scene SDF (or DE for fractal modules)
- **`calcNormal()`** — tetrahedron finite difference normals
- **`calcAO()`** — ambient occlusion by distance sampling
- **Lighting** — diffuse + specular + AO + rim
- **PALETTES** — same 12-entry array as generated modules, synced via `localStorage`
- **Uniforms** — `u_time`, `u_spin`, `u_ao`, `u_pal` (palette index), `u_bg`/`u_acc`/`u_ink` (color channels), plus per-module params

**grid_extrude** is different — it's a 2.5D isometric renderer, not a raymarcher. It already has `zoom`, `cx`, `cy`, `rot`, and symmetry mode fully implemented.

---

## Gallery

`gallery/index.html` — a grid of 15 cards with thumbnails. All thumbnails exist in `gallery/thumbs/`. Opens directly in browser.

Current order in gallery:
1. grid_extrude ★
2. sdf_raymarch
3. gyroid
4. displacement
5. mandelbulb
6. fold
7. flow_field
8. reaction_diffusion
9. voronoi
10. contour_field
11. truchet
12. truchet_b
13. l_system
14. cellular_erosion
15. recursive_grid

---

## Build and mirror workflow

```bash
# After editing build_lab.js:
node build_lab.js

# Mirror one piece to the canonical copy:
cp truchet/noixzy_truchet.html ~/noixzy_generative_lab/truchet/noixzy_truchet.html

# Mirror build file:
cp build_lab.js ~/noixzy_generative_lab/build_lab.js
```

The canonical source lives at `~/noixzy_generative_lab/`. The working copy lives at `~/Downloads/noixzy_generative_lab/`. Keep both in sync after changes.

---

## Coding conventions

- p5.js **global mode** — `setup()`, `draw()`, `noise()`, `random()`, `map()`, etc. are all globals.
- UI binds in `setup()`, never `DOMContentLoaded`.
- Each generated piece has `build()`, `render(g, pal)`, and optionally `heightField(G)`.
- `pal` is always `[[r,g,b], [r,g,b], [r,g,b]]` — `[0]` = background, `[1]` = accent, `[2]` = ink.
- No external deps beyond p5.js CDN. Everything inline.
- No comments explaining what code does — only comments for non-obvious WHY.
- Never add error handling for things that can't fail.

---

## Next task: camera / framing controls

Full plan in `workspace/CAMERA_CONTROLS_PLAN.md`. Summary:

**Phase 1 — generated modules** (edit `build_lab.js` only):
- Add `cx` (center X) and `cy` (center Y) to SHARED params
- Apply as pan offset in `draw()`: `translate(W/2 + P.cx*W*0.45, H/2 - P.cy*H*0.45)`
- Run `node build_lab.js`, verify in browser (flow_field, truchet, reaction_diffusion)

**Phase 2 — SDF modules** (one file at a time, in order):
- gyroid → displacement → mandelbulb → fold → sdf_raymarch
- Add `u_dist` (orbit radius) and `u_elev` (elevation angle) uniforms to each
- Add sliders to panel HTML, wire `setUniform` calls in JS

**Do not touch:** grid_extrude (already complete), gallery, thumbnails, metallic/sheen params (separate pass).

---

## Known issues / deferred

- **truchet_b duplicate speed key** — `k:"speed"` exists in both truchet_b's system array AND SHARED params. Two speed sliders appear. Fix in `build_lab.js`.
- **fold thumbnail** — fold.png may still show the structure too small. The ambient light fix (`col += baseCol * 0.25` before `col *= ao`) was pending when the last session ended. Retake thumbnail after confirming the fix.
