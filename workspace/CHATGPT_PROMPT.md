# ChatGPT working prompt — noixzy generative lab
# Updated: 2026-06-25 (rev 2)

> **How to use:** Paste everything below the line as your first message to ChatGPT.
> Then paste the relevant file(s) as follow-up messages — either `build_lab.js` (for generated modules) or the specific flagship HTML file(s) you're working on.
> Always request the complete updated file back — never a diff or snippet.

---

You are helping extend a generative art project. Read everything in this prompt before doing anything.

## Project identity

- Artist: noixzy (always lowercase, never "Noixzy")
- Working dir: `~/Downloads/noixzy_generative_lab/`
- Canonical source: `~/noixzy_generative_lab/` (keep mirrored)
- Gallery: `~/Downloads/noixzy_generative_lab/gallery/index.html`
- Live: `https://noixzy.github.io/noixzy_generative_lab/gallery/`
- Generator: `node build_lab.js` (only for generated modules — see below)

## Module count: 22 total

### 12 generated modules — edit `build_lab.js` ONLY, never the HTML output

`flow_field`, `reaction_diffusion`, `voronoi`, `contour_field`, `truchet`, `truchet_b`, `l_system`, `cellular_erosion`, `recursive_grid`, `wave_interference`, `sdf`, `stipple`

After any change: `node build_lab.js` regenerates their HTML files. Hand-editing those HTML files is destructive — they get overwritten.

### 7 GLSL SDF flagships — hand-authored, edit HTML directly

`grid_extrude`, `sdf_raymarch`, `gyroid`, `displacement`, `displacement_primitives`, `mandelbulb`, `fold`

These use WEBGL + GLSL fragment shaders (raymarching / SDF). They have richer setups with camera orbit, audio, pins/favs. See "Flagship pattern" section below.

### 4 new standalone modules — hand-authored, edit HTML directly

`hex_grid`, `rose_curve`, `lissajous_mesh`, `torus_knot`

These follow a lighter pattern — no GLSL shader (except torus_knot), no audio, no pin/fav yet. See "New module pattern" section below.

## Non-negotiable rules

1. Never hand-edit generated HTML. Changes → `build_lab.js` → `node build_lab.js`.
2. p5.js 1.9.0 global mode. `setup()`, `draw()`, `noise()`, `lerp()`, `map()`, `random()` are globals. No `new p5(...)`.
3. UI binds in `setup()`, NEVER in `DOMContentLoaded` — that silently kills all controls.
4. No external deps beyond p5.js 1.9.0. Everything inline.
5. Always return the complete updated file. Never a diff, never a snippet.
6. `mix()` is GLSL-only. In p5.js 2D modules define: `const mix=(a,b,t)=>a+(b-a)*t;`

---

## Engine architecture (generated modules)

### Build system

`build_lab.js` contains a `PIECES` array. Each entry has `id`, `title`, `system[]` (custom params), and `code` (the render function body). The engine injects `SHARED` params, a full UI shell, theme/palette system, pins/favs, audio, and navigation.

### SHARED params (auto-injected into every generated module)

`metallic`, `rough`, `sheen`, `alpha`, `zoom`, `rot`, `cx`, `cy`, `mirror`, `contrast`, `vig`, `glow`, `speed`, `drift`

### Param field shape

```js
{ k:"key", label:"display", min:0, max:1, step:0.01, v:0.5 }
// Optional flags:
//   g:"groupname"  — groups: system / extrude / material / frame / look / motion
//   rr:true        — re-render on change without rebuild
//   sys:true       — full sim rebuild on change
```

### Slider IDs in generated HTML

`p_{k}` for the range input, `v_{k}` for the display span.

### Heightfield system

When `P.height > 0.01`, engine calls `heightField(G)` (G=220, returns `Float32Array(G*G)`) and `renderHeightfield()` instead of `render()`. `_pxQ(out, G)` — block-quantise helper, call before `return out`. `P.caps`: 0=flat, 1=semicircle, 2=360° sphere tops.

### Other engine globals

- `animT` — time in seconds
- `dirty` — set true to force re-render while paused
- Mouse: drag=pan (cx/cy), alt+drag=rotate, scroll=zoom — do not duplicate
- Double-click any slider → resets to default (wired in `buildUI()` via dblclick)
- Audio: Web Audio API, file upload + mic. `AMAP {bass,mid,high,presence}` → param keys. `ADEPTH` controls intensity.
- Pin/fav: star button saves `{P, theme}` to localStorage

### Engine helper: `_edgeMask(out, G)`

Called before every `heightField()` return. Multiplies heights by a smoothstep ramp — zero for the outer 15% border, smooth transition 15→30%, full value for the inner 70%. Keeps edges flat on all extruded modules. **Always call `_edgeMask(out,G)` before returning from any new `heightField()` function.**

### `buildNav()` scroll — use `strip.scrollLeft`, not `scrollIntoView`

Generated modules must use `strip.scrollLeft = offset` (horizontal-only) to center the active thumb. **Never use `el.scrollIntoView({block:...})` — it scrolls the panel vertically, making every module open at the bottom of the page.**

### Generated module current state

| Piece | Key params | Extrude | heightField | depth |
|---|---|---|---|---|
| flow_field | density (0–1, 80–6000 strands), scale, turbulence, pal | no | no | no |
| reaction_diffusion | feed, kill, spots, pix, pal | yes | yes | no |
| voronoi | cells, jitter, pix, pal | yes | yes | no |
| contour_field | scale, levels, turbulence, **depth**, pal | yes | yes | **yes** |
| truchet | density, weight, clustering, pal | yes | yes | no |
| truchet_b | same + color params | yes | yes | no |
| l_system | depth, angle, decay, pal | no | yes | no |
| cellular_erosion | density, erosion, speed, pix, pal | yes | yes | no |
| recursive_grid | depth, split, pal | no | no | no |
| wave_interference | sources, freq, pix, pal | yes | yes | no |
| sdf | sdf params, pix, pal | yes | yes | no |
| stipple | density, dotsize, softness, height, colsize, caps, hvar, light | yes | yes | no |

**contour_field depth detail:** each contour level gets z ∈ [−1,+1] (back→front). Points are transformed: `x' = cx + (x−cx)*scl`, `y' = cy + (y−cy)*scl + yOff`, where `scl = 1 − z*0.22*depth`, `yOff = z*cy*0.18*depth`. Alpha and stroke weight increase toward front. Chains sorted back-to-front. Level fraction `t` stored on segments and propagated through `chainContours`.

---

## Flagship pattern (GLSL SDF modules)

### Shared structure

```js
let P = { key: value, ... };                         // named param object
let cs = { bg:"#hex", form:"#hex", hi:"#hex",        // color state
           bgVal:1, fSat:1, fVal:1, rim:1 };
const PARAMS = [{id:"sId", vid:"vId", key:"k", fmt:v=>v.toFixed(2)}, ...];
function syncUI(){ PARAMS.forEach(c=>{...}); }
function applyTheme(name){ ... syncColorUI(); }      // always calls syncColorUI
function syncColorUI(){ /* sync color pickers to cs */ }
```

### Navigation (ALL 22 modules have this)

Every module defines `ALL_MODULES` (22 entries, exact order below) and `buildNav()`.

```js
const ALL_MODULES=[
  {id:"grid_extrude",   title:"grid extrude"},
  {id:"sdf_raymarch",   title:"sdf raymarch"},
  {id:"gyroid",         title:"gyroid"},
  {id:"displacement",   title:"displacement"},
  {id:"displacement_primitives", title:"displacement primitives"},
  {id:"mandelbulb",     title:"mandelbulb"},
  {id:"fold",           title:"fold"},
  {id:"flow_field",     title:"flow field"},
  {id:"reaction_diffusion", title:"reaction diffusion"},
  {id:"voronoi",        title:"voronoi"},
  {id:"contour_field",  title:"contour field"},
  {id:"truchet",        title:"truchet"},
  {id:"truchet_b",      title:"truchet // color"},
  {id:"l_system",       title:"l-system"},
  {id:"cellular_erosion",title:"cellular erosion"},
  {id:"recursive_grid", title:"recursive grid"},
  {id:"wave_interference",title:"wave interference"},
  {id:"stipple",        title:"stipple"},
  {id:"hex_grid",       title:"hex grid"},
  {id:"rose_curve",     title:"rose curve"},
  {id:"lissajous_mesh", title:"lissajous mesh"},
  {id:"torus_knot",     title:"torus knot"},
];
```

`buildNav()` populates `#navPrev`, `#navNext` hrefs and `#moduleThumbStrip` scroll strip. Called in `setup()` after UI is ready. Active module thumb gets `.active` class + scrolls into view.

### Thumb saving (all modules)

```js
let _thumbDir=null, _pCanvas=null;
function saveThumb(){
  requestAnimationFrame(()=>{        // rAF required for WEBGL buffer timing
    const btn=document.getElementById("btnThumb");
    const src=_pCanvas||document.querySelector("canvas");
    const c=document.createElement("canvas"); c.width=400; c.height=300;
    c.getContext("2d").drawImage(src,0,0,400,300);
    c.toBlob(async b=>{
      try{
        if(!_thumbDir) _thumbDir=await window.showDirectoryPicker({mode:"readwrite",startIn:"downloads"});
        const fh=await _thumbDir.getFileHandle(PIECE+".png",{create:true});
        const w=await fh.createWritable(); await w.write(b); await w.close();
        if(btn){btn.textContent="✓ saved";setTimeout(()=>btn.textContent="→ thumb",1400);}
      }catch(e){
        if(e.name!=="AbortError"){
          const a=document.createElement("a"); a.href=URL.createObjectURL(b);
          a.download=PIECE+".png"; a.click();
          if(btn){btn.textContent="✓ dl";setTimeout(()=>btn.textContent="→ thumb",1400);}
        }
      }
    },"image/png");
  });
}
// In setup(): _pCanvas = c.elt;   (c is the p5 canvas Element)
```

WARNING: Do NOT have any stray `}catch(e){` or `_captureThumb()` code after the closing brace of `saveThumb()`. That was a prior bug that broke all the GLSL flagships — it creates a syntax error that silently kills the entire script.

### Flagship feature matrix

| Module | Audio | Pin/fav | Thumb | Camera orbit | Color pickers |
|---|---|---|---|---|---|
| grid_extrude | yes | yes | yes | yes (engine) | via palette |
| sdf_raymarch | yes | yes | yes | yes (engine) | via palette |
| gyroid | yes | yes | yes | yes (drag/scroll) | cs + pickers |
| displacement | yes | yes | yes | yes (drag/scroll) | cs + pickers |
| displacement_primitives | **no** | **no** | **no** | yes (drag/scroll) | theme only |
| mandelbulb | yes | yes | yes | yes (drag/scroll) | cs + pickers |
| fold | yes | yes | yes | yes (drag/scroll) | cs + pickers |

`displacement_primitives` is missing audio, pin/fav, and thumb — priority task.

---

## New module pattern (hex_grid, rose_curve, lissajous_mesh, torus_knot)

These are lighter standalone p5.js modules. No GLSL except torus_knot.

### Common structure

- `PALETTES` array (12 palettes), `THEME_NAMES`, `THEMEKEY` localStorage key
- `bgCol/fmCol/hiCol` as `[r,g,b]` arrays — NOT hex strings (unlike GLSL flagships)
- `bgVal/fmVal/hiVal` — float multipliers (0–2) applied in draw
- Color pickers (`<input type=color>`) + value sliders in panel
- `P` object with all params, `PARAMS` array for slider wiring
- `syncColorUI()` called from `applyTheme()`
- `rgbToHex(c)` + `hexToRGB(h)` helpers
- `const mix=(a,b,t)=>a+(b-a)*t;` defined at top (GLSL built-in not available in 2D)
- `→ thumb` button wired to `saveThumb()`
- `ALL_MODULES` + `buildNav()` identical to flagships

### Per-module specifics

**hex_grid** — p5.js 2D canvas, pointy-top hexagonal grid, noise-driven per-cell intensity
- `P.extrude` (0–1): isometric 3D height. Side faces drawn per cell: right face at 0.60× color brightness (edge v[1]→v[2], 30°→90°), left face at 0.35× (edge v[2]→v[3], 90°→150°). Top face elevated by `val * hexR * 1.2 * P.extrude`.
- `drawExtrudedHex(cx, cy, r, topR, topG, topB, topA, extH)`

**rose_curve** — p5.js 2D with persistent graphics buffer `pg` for trails
- Parametric rhodonea: `r = R * cos(n/d * θ)`, `n` and `d` integer params
- `P.depth` (0–1): z-depth per layer — back layers scale smaller + shift up, front layers larger + shift down + higher alpha + thicker stroke
- Layer order: i=0 back → i=layers-1 front (natural back-to-front for depth)

**lissajous_mesh** — p5.js 2D with persistent `pg`
- Lissajous figures: `x = rx * sin(fa*θ + phase)`, `y = ry * sin(fb*θ)`
- `P.depth` (0–1): same z-depth approach as rose_curve — scale `rx/ry` by `1 - z*0.25*depth`, y-offset by z, alpha + stroke weight increase front-to-back

**torus_knot** — WEBGL + GLSL fragment shader (SDF raymarching)
- Params: `p` (winds 2–9), `q` (loops 3–11), tube, scale, spin, dist, elev, ao
- Color via `cs = { bg:"#hex", form:"#hex", hi:"#hex", bgVal, fSat, fVal, rim }` — same as GLSL flagships (hex strings, not rgb arrays)
- Camera: mouse drag = azimuth, y-drag = elev; scroll = dist
- `saveThumb()` uses rAF wrapper (WEBGL buffer timing)

---

## Deploy

```bash
node build_lab.js        # only needed for generated modules
git add -A
git commit -m "..."
git push                 # auto-deploys to GitHub Pages
```

Gallery entry format (`gallery/index.html` pieces array):
```js
{id:"module_id", title:"display title", path:"../module_id/noixzy_module_id.html", thumb:"thumbs/module_id.png"}
```

---

## Pending tasks (priority order)

### 0 — Known engine rules (do not break)
- `_edgeMask(out,G)` before every `heightField()` return — keeps borders flat
- `buildNav()` uses `strip.scrollLeft` not `scrollIntoView` — prevents page-bottom scroll
- `→ thumb` button needs both: (a) `saveThumb()` function defined, AND (b) `getElementById("btnThumb").addEventListener("click", saveThumb)` in setup. Missing either = silent failure.
- No stray `}catch(e){` after the closing `}` of `saveThumb()` — causes syntax error, kills entire script

### 1 — displacement_primitives: add audio + pin/fav + thumb

Copy the pattern from `gyroid` or `displacement`. Paste `displacement_primitives` HTML as follow-up.

### 2 — New flagship modules

Build each as a new hand-authored HTML file in its own folder. See `NEXT_MODULES.md` for full specs. Top candidates:
- **metafluid** — smooth-min SDF, multiple animated spheres merging viscously. Easy.
- **menger sponge** — box-fold IFS SDF, iconic fractal form. Medium.
- **julia set** — 2D complex iteration, animated `c` parameter (not GLSL — p5.js 2D pixel shader loop). Easy.
- **fourier epicycles** — animated rotating phasors tracing a path. 2D, no shader. Easy.
- **particle attractor** — Lorenz/Clifford attractor, thousands of dots, persistent buffer. 2D. Medium.
- **substrate** — crack propagation along noise gradient, organic line network. 2D. Medium.

### 3 — New features for existing modules

- **hex_grid**: audio reactivity (bass → extrude height, mid → freq, hi → speed)
- **rose_curve**: audio reactivity (bass → scale, mid → speed, hi → n morph)
- **torus_knot**: animated p/q morph between knot types (lerp integers over time)
- **All 4 new modules**: pin/fav system (same localStorage pattern as gyroid)
- **All 4 new modules**: dbl-click slider reset (set `el.defaultValue` in PARAMS loop)

### 4 — Gallery thumbnails

Open each module in Chrome, let it render, click `→ thumb`, pick `gallery/thumbs/` folder. Files needed: `hex_grid.png`, `rose_curve.png`, `lissajous_mesh.png`, `torus_knot.png`.

---

## Current task

[REPLACE THIS with the specific task before pasting to ChatGPT]

Example tasks:
- "Add audio + pin/fav + thumb to displacement_primitives. Pasting its HTML."
- "Build a new metafluid module. Follow the new module pattern exactly."
- "Add pin/fav + dbl-click reset to all 4 new modules. Pasting hex_grid HTML."
