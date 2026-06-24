# ChatGPT working prompt — noixzy generative lab

> **How to use this:** Copy everything below the line, paste into ChatGPT as your first message. Then in a second message, paste the full contents of `build_lab.js` (the generator). If the task involves a hand-authored flagship, paste that HTML file instead (or in addition).

---

You are helping me extend a generative art project. I'm going to give you source files to read carefully before doing anything.

## Project overview

I have 15 self-contained generative art modules. Each is a single HTML file that runs in the browser with no server — just double-click. They use p5.js 1.9.0 in global mode.

**File locations on my machine:**
- Working directory: `~/Downloads/noixzy_generative_lab/`
- Canonical mirror: `~/noixzy_generative_lab/`
- Generator: `~/Downloads/noixzy_generative_lab/build_lab.js`
- Generated outputs: one folder per piece, e.g. `truchet/noixzy_truchet.html`
- Hand-authored flagships (NOT generated — edit directly): `grid_extrude`, `sdf_raymarch`, `gyroid`, `displacement`, `mandelbulb`, `fold`

**The 9 generated pieces** (produced by running `node build_lab.js`):
`flow_field`, `reaction_diffusion`, `voronoi`, `contour_field`, `truchet`, `truchet_b`, `l_system`, `cellular_erosion`, `recursive_grid`

**The 6 hand-authored flagships** (edit directly, never regenerate):
`grid_extrude`, `sdf_raymarch`, `gyroid`, `displacement`, `mandelbulb`, `fold`

## Non-negotiable rules

1. **Never hand-edit generated HTML files.** All changes go into `build_lab.js`. After editing, I run `node build_lab.js` and it regenerates all 9 pieces.
2. **p5.js global mode.** `setup()`, `draw()`, `noise()`, `random()`, `map()`, `lerp()` etc. are all globals. Do not wrap in a `new p5(...)` instance.
3. **UI binds in `setup()`**, never in `DOMContentLoaded`.
4. Each generated piece defines: `build()` (called once per seed), `render(g, pal)` (draws into offscreen buffer), and optionally `heightField(G)` (returns `Float32Array(G*G)` for isometric extrude).
5. `pal` is always `[[r,g,b],[r,g,b],[r,g,b]]` — index 0 = background, 1 = accent, 2 = ink.
6. No external dependencies beyond p5.js. Everything inline.
7. For hand-authored flagships: they share the same 12-palette PALETTES array and `localStorage` theme key (`"noixzy_lab_theme"`), but have their own UI and camera code. Do not try to use build_lab.js engine functions inside them.
8. After any change to `build_lab.js`, give me the **complete updated file** — not a diff, not a snippet. The full file, ready to paste and save.
9. After any change to a flagship HTML, give me the **complete updated HTML file**.

## How the generated engine works

- `PIECES` array at the bottom of `build_lab.js` — each entry has `id`, `title`, `system[]` (param definitions), and `code` (template literal with the piece's render functions).
- `system[]` params: `k` (key), `label`, `min`, `max`, `step`, `v` (default), optional `g` (group), optional `rr:true` (re-render on change), optional `sys:true` (rebuild simulation on change).
- **SHARED params** — injected into every piece automatically: `zoom`, `rot`, `mirror`, `metallic`, `rough`, `sheen`, `alpha`, `contrast`, `vig`, `grain`, `glow`, `speed`, `drift`.
- Groups: `["system","extrude","material","frame","look","motion"]`.
- `renderHeightfield(g, heights, G, pal)` — shared isometric renderer. Pieces that want extrude define `heightField(G)` and add `height`, `hvar`, `light` params with `g:"extrude"`.
- `animT` — global seconds counter, incremented in `draw()`.
- `dirty` — set to `true` by param changes to force re-render while paused.
- `colorState {bg, acc, ink}` — live-editable colors. `getPal()` converts them to the `pal` array.
- Theme system — 12 palettes (ember, mineral, violet, amber, graphite, cyan, acid, magenta, gold, neutral, copper, ice) persisted in `localStorage`.

## How the SDF flagship modules work

All five SDF modules (sdf_raymarch, gyroid, displacement, mandelbulb, fold) share this pattern:

- **WebGL fragment shader** — fullscreen quad via p5.js WEBGL mode, `quad(-1,-1,1,-1,1,1,-1,1)`
- **Orbit camera** — `vec3 ro = vec3(sin(a)*R, el, cos(a)*R)` where `a` is time × u_spin
- **`map(vec3 p)`** — scene SDF or fractal DE
- **`calcNormal()`** — tetrahedron finite difference normals
- **`calcAO()`** — ambient occlusion
- **Lighting** — diffuse + specular + AO + rim
- **Uniforms** — `u_time`, `u_spin`, `u_ao`, `u_pal`, `u_bg`/`u_acc`/`u_ink`, plus per-module params
- **Same 12-palette PALETTES array** as generated modules, synced via localStorage

## Current state of each generated piece

| Piece | Params | Extrude group | heightField |
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

## Current state of each flagship

| Module | Camera | Special controls |
|---|---|---|
| grid_extrude | zoom, cx, cy, rot, mirror | symmetry mode, fully complete — do not disturb |
| sdf_raymarch | spin (time-driven) | AO, bg/form/highlight color |
| gyroid | spin (time-driven) | scale, threshold, phase, ao |
| displacement | spin (time-driven) | amount, freq, roughness, speed, ao |
| mandelbulb | spin (time-driven) | power, morph, detail, glow, ao |
| fold | spin (time-driven) | scale, offset, twist, morph, ao |

## After every code change I will:

```bash
node build_lab.js
# then mirror:
cp build_lab.js ~/noixzy_generative_lab/build_lab.js
cp flow_field/noixzy_flow_field.html ~/noixzy_generative_lab/flow_field/noixzy_flow_field.html
# (repeat for whatever pieces changed)
```

---

## What I want to build — current task

### Phase 1: Add cx / cy pan to generated modules (edit build_lab.js)

The SHARED params array already has `zoom` and `rot`. I want to add `cx` (center X) and `cy` (center Y) pan controls so the composition can be reframed.

**What to do:**
1. Add to SHARED params array (in the `frame` group, after `zoom` and `rot`):
   ```js
   {k:"cx", label:"center x", g:"frame", min:-1, max:1, step:0.01, v:0},
   {k:"cy", label:"center y", g:"frame", min:-1, max:1, step:0.01, v:0},
   ```
2. In `draw()`, change the existing `translate(W/2, H/2)` to apply the pan offset:
   ```js
   translate(W/2 + P.cx * W * 0.45, H/2 - P.cy * H * 0.45)
   ```
   (Invert cy so positive = up. Pan must come before scale/rotate in the transform chain.)
3. Return the complete updated `build_lab.js`.

**Constraints:**
- Defaults are 0 so all existing renders are unchanged.
- Do not touch anything else in the engine.
- Do not touch the flagship HTML files.

---

### Phase 2: Add distance + elevation to SDF modules (edit one flagship at a time)

After Phase 1 is verified, I want to add `u_dist` (orbit radius) and `u_elev` (elevation angle) to each SDF flagship.

**Order:** gyroid → displacement → mandelbulb → fold → sdf_raymarch

For each module:
1. Add `u_dist` and `u_elev` uniforms to the fragment shader
2. Replace hardcoded orbit radius and elevation with:
   ```glsl
   float R  = mix(R_min, R_max, u_dist);   // replace hardcoded R
   float el = mix(0.2, 1.1, u_elev);       // replace hardcoded el
   ```
   (Use module-appropriate R_min/R_max — e.g. gyroid uses 4.8, so R_min=2.5 R_max=7.0)
3. Add sliders to the panel HTML (in the camera section, near the spin slider)
4. Add `setUniform("u_dist", P.dist)` and `setUniform("u_elev", P.elev)` in JS draw()
5. Return the complete updated HTML file

**Start with gyroid** — I'll paste `gyroid/noixzy_gyroid.html` as the second message.

---

Please confirm you understand the architecture, then tell me if you need the source file(s) before starting.
