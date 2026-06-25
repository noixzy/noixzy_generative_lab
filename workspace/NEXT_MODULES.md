# noixzy generative lab — next modules & feature backlog
# Updated: 2026-06-25

---

## New modules to build

All new modules follow the **new standalone pattern** (see CHATGPT_PROMPT.md "New module pattern"):
- Single HTML file in its own folder: `module_id/noixzy_module_id.html`
- p5.js 1.9.0 global mode, 2D canvas (or WEBGL for shader-based)
- Theme system (12 PALETTES), color pickers + value sliders
- `→ thumb` button, `ALL_MODULES` nav strip (22+ entries), prev/next navBar
- `const PIECE = "module_id";`
- After building: add entry to `gallery/index.html` pieces array AND to `ALL_MODULES` in every existing module file

---

### Priority 1 — Easy, high visual impact

**metafluid** (`metafluid/noixzy_metafluid.html`)
- Type: GLSL SDF flagship (WEBGL + fragment shader)
- 6–12 animated spheres with smooth-min blending (`smin = a + b - sqrt((a-b)^2 + k^2) * 0.5`)
- Params: `count` (# blobs), `radius` (blob size), `k` (smoothness/viscosity), `speed`, `spread`, `ao`
- Color: same `cs` + uniform pattern as gyroid/mandelbulb
- Camera orbit: drag azimuth, y-drag elev, scroll dist
- Visual: oily liquid globules merging and splitting, dark background, specular highlight

**julia set** (`julia_set/noixzy_julia_set.html`)
- Type: p5.js 2D, per-pixel iteration in draw() using `loadPixels()`
- Formula: z → z² + c, iterate to escape or max_iter
- Params: `cx` / `cy` (the complex constant c, animated), `zoom`, `max_iter`, `color_scale`, `speed`
- Color: map iteration count through palette gradient (bgCol → fmCol → hiCol)
- Depth: `P.depth` — controls how many palette cycles wrap over the iteration range
- No persistent buffer needed — redraws every frame (or on-change if paused)

**fourier epicycles** (`fourier_epicycles/noixzy_fourier_epicycles.html`)
- Type: p5.js 2D with persistent buffer for trace trail
- N rotating circles (phasors) at harmonic frequencies. The tip traces a closed path.
- Params: `harmonics` (# circles, 2–64), `speed`, `trail` (fade), `scale`, `wobble` (randomize amplitudes slightly)
- Each circle: radius = `1/n` (or custom weight), rotates at `n * speed * t`
- Visual: mechanical, clockwork, elegant

**particle attractor** (`particle_attractor/noixzy_particle_attractor.html`)
- Type: p5.js 2D, persistent buffer `pg` for accumulation
- Lorenz attractor (or Clifford/De Jong): thousands of points integrated forward each frame
- Params: `sigma`, `rho`, `beta` (Lorenz params), `count` (# particles), `step`, `trail`, `scale`
- Preset selector: Lorenz / Clifford / De Jong modes
- Color: particle density gradient bgCol → hiCol

---

### Priority 2 — Medium complexity

**menger sponge** (`menger_sponge/noixzy_menger_sponge.html`)
- Type: GLSL SDF flagship (WEBGL)
- Box-fold IFS SDF: 3–5 fold iterations, each folds+scales the space
- Params: `iterations` (2–5), `scale`, `fold_strength`, `tube` (slice thickness), `spin`, `ao`
- More reliable than Sierpinski; icon of mathematical art
- Same camera + color pattern as torus_knot

**substrate** (`substrate/noixzy_substrate.html`)
- Type: p5.js 2D, event-driven crack propagation
- Cracks grow along noise gradient directions. New branches sprout at intervals.
- Params: `cracks` (# simultaneous), `branch_rate`, `speed`, `noise_scale`, `thickness`, `trail`
- Visual: geological, organic, like dried mud or nerve networks

**sand dune** (`sand_dune/noixzy_sand_dune.html`)
- Type: p5.js 2D, contour lines over anisotropic noise field
- Anisotropic noise: `noise(x*0.8, y*2.4)` — stretched in one axis = dune ridgelines
- Params: `frequency`, `ridge_sharpness`, `wind_angle`, `layers`, `speed`, `color_spread`
- Color: warm sandy tones between form and highlight, each contour band slightly different

**neon strands** (`neon_strands/noixzy_neon_strands.html`)
- Type: p5.js 2D with `pg` persistent buffer
- Long curved strands following noise flow field. Glow via layered strokes (wide+dim, narrow+bright).
- Params: `count`, `length_steps`, `speed`, `flow_scale`, `glow_layers`, `thickness`, `trail`
- Color: hiCol for core, fmCol for glow halos, dark bg

---

### Priority 3 — Harder / experimental

**klein bottle / implicit surface** (`implicit_surface/noixzy_implicit_surface.html`)
- Type: GLSL SDF or implicit isosurface
- Parametric: `f(x,y,z) = 0` for genus-2 / Klein bottle / Boy surface
- Hard — may need fallback to parametric mesh approach

**voronoi 3D** (`voronoi_3d/noixzy_voronoi_3d.html`)
- Type: WEBGL + p5.js 3D geometry (not GLSL)
- Jittered 3D cell centers, draw Voronoi edges as lines in 3D space, camera orbit
- Params: `cells`, `jitter`, `lineweight`, `depth_fade`, `spin`

---

## Feature backlog (existing modules)

### displacement_primitives — MISSING (priority)
- Add audio panel + AMAP (same pattern as displacement/gyroid)
- Add pin/fav system
- Add `→ thumb` button

### All 4 new modules (hex_grid, rose_curve, lissajous_mesh, torus_knot)
- Add pin/fav system (localStorage, star button, chip display in panel)
- Add dbl-click reset to all sliders (set `el.defaultValue = P[key]` in PARAMS loop setup)
- Add audio reactivity:
  - hex_grid: bass → extrude, mid → freq, hi → speed
  - rose_curve: bass → scale R, mid → speed, hi → n morph
  - lissajous_mesh: bass → scale, mid → drift, hi → curves count
  - torus_knot: bass → tube radius, mid → spin, hi → ao

### torus_knot — p/q morph
- Add animated `morphTarget` param — when `P.morph > 0`, lerp p/q toward next integer values over time. Creates smooth knot-type transitions.
- Params: `morph_speed` (0–1), `morph_to_p` (2–9), `morph_to_q` (3–11)

### hex_grid — triangle / diamond grid variants
- Add `P.grid_type` selector: hex (current) / square / triangle
- Switch drawExtrudedHex to drawExtrudedTriangle or drawExtrudedSquare based on type

---

## Build checklist for any new module

1. Create folder: `module_id/`
2. Create `module_id/noixzy_module_id.html`
3. Add to `gallery/index.html` pieces array
4. Add to `ALL_MODULES` in ALL 22 existing module HTML files (+ the new one)
5. Add to `build_lab.js` ALL_MODULES array (if that's where the list lives)
6. Capture thumbnail: open in Chrome, `→ thumb`, save to `gallery/thumbs/module_id.png`
7. Browser verify: console clean, controls respond, pause/play, theme switch, save png
