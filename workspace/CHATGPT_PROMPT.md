# ChatGPT working prompt — noixzy generative lab
# Updated: 2026-06-24

> **How to use:** Copy everything below the line, paste into ChatGPT as your first message. Then paste the full `build_lab.js` as a second message. For flagship tasks, paste that flagship's HTML instead (or in addition).

---

You are helping me extend a generative art project. Read the source files carefully before doing anything.

## Project overview

19 self-contained generative art modules. Each is a single HTML file — no server, just open in browser. p5.js 1.9.0 global mode.

**Locations:**
- Working directory: `~/Downloads/noixzy_generative_lab/`
- Generator: `build_lab.js` — run `node build_lab.js` after edits
- GitHub (canonical): `https://github.com/noixzy/noixzy_generative_lab`
- Live gallery: `https://noixzy.github.io/noixzy_generative_lab/gallery/`

**12 generated pieces** (edit `build_lab.js` only — never touch their HTML):
`flow_field`, `reaction_diffusion`, `voronoi`, `contour_field`, `truchet`, `truchet_b`, `l_system`, `cellular_erosion`, `recursive_grid`, `wave_interference`, `sdf`, `stipple`

**7 hand-authored flagships** (edit HTML directly):
`grid_extrude`, `sdf_raymarch`, `gyroid`, `displacement`, `displacement_primitives`, `mandelbulb`, `fold`

## Non-negotiable rules

1. Never hand-edit generated HTML. Changes go in `build_lab.js` then `node build_lab.js`.
2. p5.js global mode. `setup()`, `draw()`, `noise()`, `random()`, `map()`, `lerp()` are globals. No `new p5(...)`.
3. UI must bind in `setup()`, never in `DOMContentLoaded`.
4. Each generated piece defines `build()`, `render(g, pal)`, and optionally `heightField(G)`.
5. `pal` is always `[[r,g,b],[r,g,b],[r,g,b]]` — 0=background, 1=mid, 2=highlight.
6. No external deps beyond p5.js. Everything inline.
7. Always return the complete updated file — never a diff or snippet.

## Engine architecture (generated modules)

- `PIECES` array in `build_lab.js` — each entry: `id`, `title`, `system[]`, `code`.
- `system[]` param fields: `k`, `label`, `min`, `max`, `step`, `v` (default), optional `g` (group), optional `rr:true` (re-render, no rebuild), optional `sys:true` (rebuild sim).
- `SHARED` params auto-injected: `metallic`, `rough`, `sheen`, `alpha`, `zoom`, `rot`, `cx`, `cy`, `mirror`, `contrast`, `vig`, `glow`, `speed`, `drift`. (grain is gone — removed.)
- Groups: `["system","extrude","material","frame","look","motion"]`.
- Slider IDs in generated HTML: `p_{k}` for value, `v_{k}` for display span.
- Heightfield: when `P.height > 0.01`, engine calls `heightField(G)` (G=220, returns `Float32Array(G*G)`) and `renderHeightfield()` instead of `render()`.
- `_pxQ(out, G)` — shared block-quantise helper using `P.pix`. Call before `return out` in heightField.
- `renderHeightfield()` supports `P.caps`: 0=flat, 1=semicircle, 2=360-degree sphere tops.
- `animT` — global time in seconds.
- `dirty` — set true by param changes; forces re-render while paused.
- Mouse controls built into engine draw loop: drag=pan (cx/cy), alt+drag=rotate, scroll=zoom. Do not duplicate.
- Double-click any slider resets to default — wired in `buildUI()` via dblclick listener using `p.v`.
- `buildNav()` — builds prev/next navBar links and thumbnail strip from `ALL_MODULES` array (18 entries) and `PIECE` constant. Called in setup after UI is ready. Every module has this.
- `saveThumb()` — File System Access API, saves 400x300 PNG to user-chosen folder. Falls back to download.
- Audio — Web Audio API, file upload primary, mic secondary. `_audioApply()`/`_audioRestore()` wrap renderScene(). `AMAP {bass,mid,high,presence}` maps bands to param keys. `ADEPTH` controls intensity.
- Pin/fav — star pin button saves `{P, theme}` to localStorage. Chips shown in panel.

## Generated piece current state

| Piece | Key params | Extrude | heightField | Notes |
|---|---|---|---|---|
| flow_field | density, scale, turbulence, pal | no | no | connected curveVertex splines, not dots |
| reaction_diffusion | feed, kill, spots, pix, pal | yes | yes | gray-scott simulation |
| voronoi | cells, jitter, pix, pal | yes | yes | |
| contour_field | threshold, frequency, smooth, pal | no | no | |
| truchet | density, weight, clustering, pal | yes | yes | |
| truchet_b | same + color params | yes | yes | |
| l_system | depth, angle, decay, pal | no | no | |
| cellular_erosion | density, erosion, speed, pix, pal | yes | yes | |
| recursive_grid | depth, split, pal | no | no | |
| wave_interference | sources, freq, pix, pal | yes | yes | |
| sdf | sdf params, pix, pal | yes | yes | |
| stipple | density, dotsize, softness, pal, height, colsize, caps, hvar, light | yes | yes | default palette=4 (graphite/b&w) |

**Stipple:** rejection-sampled dots weighted by noise luminance. In extrude mode, each dot paints a circle into G*G heightfield at radius from `P.dotsize`. `P.colsize` drives block quantisation. `P.caps` 0/1/2 = flat/semicircle/sphere.

## Flagship current state

| Module | Audio | Pin/fav | thumb btn | Nav | dbl-click reset |
|---|---|---|---|---|---|
| grid_extrude | yes | yes | yes | yes | yes |
| sdf_raymarch | yes | yes | yes | yes | yes |
| gyroid | yes | yes | yes | yes | yes |
| displacement | yes | yes | yes | yes | yes |
| displacement_primitives | no | no | no | yes | no |
| mandelbulb | yes | yes | yes | yes | yes |
| fold | yes | yes | yes | yes | yes |

All 7 flagships have: thin navBar (prev/next + gallery link), thumbnail strip at panel bottom.
All except displacement_primitives have: audio panel, pin/fav, → thumb button, dbl-click reset.

### Nav system — ALL_MODULES (18 entries)

Every module (generated + flagship) defines the same `ALL_MODULES` array and `buildNav()` function. `buildNav()` is called in `setup()` after UI is bound. It populates `navPrev`/`navNext` hrefs and the `#moduleThumbStrip` scroll strip. The active module's thumb gets `.active` class and scrolls into view.

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
];
```

### gyroid / displacement / mandelbulb / fold — shared JS pattern

```js
let P = { key: value, ... };           // named param object
let cs = { bg, form, hi, bgVal, fSat, fVal, rim }; // color state
const _pAudioParams = [{k, sid, label, min, max}]; // per-module, used for audio dropdowns + slider sync
// _buildAudioUI(), _audioApply(), _audioRestore() — audio system
// _pinFav(), _renderFavs(), _loadFavs() — pin/fav system
// saveThumb() — File System Access API thumb export
// buildNav() — inter-module navigation
```

Slider wiring: gyroid/displacement use `paramCfg = [{id, vid, key}].forEach(...)`, mandelbulb/fold use inline `[[sid,vid,k]].forEach(...)`. Both have dblclick reset via `el.defaultValue`.

### sdf_raymarch — different architecture

Uses **numeric `P[]` array** (not named keys) and `P_CONTROLS` dict:
```js
let P = [0.5, 0.55, 0.35, ...]; // density, blend, turb, palette, spin, extrude, displace, spread, blob, ao, dist, elev
const P_CONTROLS = {
  p0: { index:0, out:"v0", rebuild:true },
  p1: { index:1, out:"v1" },
  // ...
};
```
Has its own full preset system (save/load named presets to localStorage). Audio: `_pAudioParams` uses `k` as P_CONTROLS key strings ('p5', 'p2' etc), `_audioApply` looks up array index via `P_CONTROLS[k].index`. Favorites save full `captureState()` snapshot, restore via `loadState()`.

### displacement_primitives — minimal flagship

Simpler than the others — no audio, no pin/fav, no thumb button yet. Has: theme system, 8 primitive types (sphere/box/rounded box/torus/capsule/cylinder/pyramid/flat plane), starter presets, navBar + buildNav().

## Deploy workflow

```bash
node build_lab.js        # regenerate all 12 engine modules
git add -A
git commit -m "..."
git push                 # deploys to GitHub Pages automatically
```

## Pending tasks

1. **displacement_primitives — add audio + pin/fav + thumb btn** (same pattern as displacement/gyroid)

2. **Gallery thumbnails** — → thumb button in every module, picks folder once per session. Use module's built-in → thumb button to save PNGs to `gallery/thumbs/`.

3. **Stipple caps=2 visual check** — test at colsize >= 0.6, low density to verify 360-degree sphere tops are visible.

4. **Mouse drag/rotate/zoom for GLSL flagships** — engine modules have it. The 7 GLSL flagships don't yet. Would map drag delta to camera uniforms (u_dist, u_elev, u_spin).

5. **New modules (queued):** hex grid, rose curve, lissajous mesh, torus knot — all via `build_lab.js` only.

---

## Current task

[REPLACE THIS with the specific task before pasting to ChatGPT]

Example: "Add audio + pin/fav + thumb to displacement_primitives. Pasting its HTML as second message."
