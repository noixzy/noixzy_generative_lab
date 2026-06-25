# ChatGPT working prompt — noixzy generative lab
# Updated: 2026-06-24

> **How to use:** Copy everything below the line, paste into ChatGPT as your first message. Then paste the full `build_lab.js` as a second message. For flagship tasks, paste that flagship's HTML instead (or in addition).

---

You are helping me extend a generative art project. Read the source files carefully before doing anything.

## Project overview

18 self-contained generative art modules. Each is a single HTML file — no server, just open in browser. p5.js 1.9.0 global mode.

**Locations:**
- Working directory: `~/Downloads/noixzy_generative_lab/`
- Mirror: `~/noixzy_generative_lab/`
- Generator: `build_lab.js` — run `node build_lab.js` after edits
- GitHub (canonical): `https://github.com/noixzy/noixzy_generative_lab`
- Live gallery: `https://noixzy.github.io/noixzy_generative_lab/gallery/`

**12 generated pieces** (edit `build_lab.js` only — never touch their HTML):
`flow_field`, `reaction_diffusion`, `voronoi`, `contour_field`, `truchet`, `truchet_b`, `l_system`, `cellular_erosion`, `recursive_grid`, `wave_interference`, `sdf`, `stipple`

**6 hand-authored flagships** (edit HTML directly):
`grid_extrude`, `sdf_raymarch`, `gyroid`, `displacement`, `mandelbulb`, `fold`

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
- `buildNav()` — builds prev/next navBar links and thumbnail strip from `ALL_MODULES` array and `PIECE` constant.
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
| sdf_raymarch | NO — pending | NO — pending | yes | yes | yes (via P_CONTROLS) |
| gyroid | yes | yes | yes | yes | yes |
| displacement | yes | yes | yes | yes | yes |
| mandelbulb | yes | yes | yes | yes | yes |
| fold | yes | yes | yes | yes | yes |

All 6 flagships have: thin navBar (prev/next + gallery link), thumbnail strip at panel bottom, → thumb button using File System Access API.

### gyroid / displacement / mandelbulb / fold — shared JS pattern

```js
let P = { key: value, ... };           // named param object
let cs = { bg, form, hi, bgVal, fSat, fVal, rim }; // color state
const _pAudioParams = [{k, sid, label, min, max}]; // per-module, used for audio dropdowns + slider sync
// _buildAudioUI(), _audioApply(), _audioRestore() — audio system
// _pinFav(), _renderFavs(), _loadFavs() — pin/fav system
// saveThumb() — File System Access API thumb export
// buildNav() — inter-module navigation
// ALL_MODULES array — list of all 17 modules with id+title
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
Has its own full preset system (save/load named presets to localStorage). Audio and pin/fav are the pending addition.

## Deploy workflow

```bash
node build_lab.js
cp build_lab.js ~/noixzy_generative_lab/build_lab.js
# mirror changed generated HTML files:
cp flow_field/noixzy_flow_field.html ~/noixzy_generative_lab/flow_field/noixzy_flow_field.html
# mirror changed flagships:
cp gyroid/noixzy_gyroid.html ~/noixzy_generative_lab/gyroid/noixzy_gyroid.html
# push to GitHub (this deploys to GitHub Pages):
git add -A && git commit -m "..." && git push
```

## Pending tasks

1. **sdf_raymarch — add audio + pin/fav** (only flagship missing these)
   - Build `_pAudioParams` from P_CONTROLS entries + their slider element min/max
   - Favorites save `{P: [...P], turbType, displaceType, colorState}` to localStorage
   - Port the audio panel HTML from gyroid (already present in other flagships)

2. **Gallery thumbnails** — → thumb button in every module, picks folder once per session. Or run `node workspace/gen_thumbs.js` for batch Playwright capture.

3. **Stipple caps=2 visual check** — test at colsize >= 0.6, low density to verify 360-degree sphere tops are visible.

4. **Mouse drag/rotate/zoom for GLSL flagships** — engine modules have it. The 5 GLSL flagships don't yet. Would map drag delta to camera uniforms (u_dist, u_elev, u_spin) rather than P.zoom/P.rot.

5. **Commit + push session work to GitHub.**

---

## Current task

[REPLACE THIS with the specific task before pasting to ChatGPT]

Example: "Add audio + pin/fav to sdf_raymarch. Pasting sdf_raymarch HTML as second message."
