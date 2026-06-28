# 04 — Visual Language
# noixzy Generative Lab — Form, Material, Motion, and Aesthetic Standards

---

## 1. Geometry Language

The lab produces work across three geometry registers. Every new module belongs to one:

### Register 1 — Genuine 3D geometry
Modules that produce real volumetric forms through raymarching or heightfield projection.

| Module | Mechanism |
|---|---|
| `grid_extrude` | Canvas 2D stacked rect layers, real Z-projection (isometric) |
| `sdf_raymarch` | WebGL ray-march against SDF, true volumetric metaballs |
| `gyroid` | WebGL triply-periodic surface SDF |
| `displacement` | WebGL heightfield vertex displacement |
| `mandelbulb` | WebGL 3D fractal SDF sphere-march |
| `fold` | WebGL iterative fold SDF |
| `metafluid` | GLSL SDF raymarched metaballs with polynomial smin blob merging |
| `torus_knot` | GLSL SDF tube-around-parametric-curve |

*Source: `NGL_TOTAL_AUDIT_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`*

### Register 2 — 2.5D illusion (legitimate canvas depth)
Canvas 2D modules that simulate depth via shading, line weight, perspective, and painter's
algorithm. Valuable as art; not genuine geometry. Should not be labeled "extrude" without
qualification.

| Module | Depth mechanism |
|---|---|
| `flow_field` | z-bias on path strokes |
| `reaction_diffusion` | pixel heightmap shading |
| `voronoi` | cell fill + drop shadow |
| `contour_field` | isoline rendering, depth stacking |
| `truchet` / `truchet_b` | arc tiling with depth hint |
| `l_system` | branching paths, flat |
| `cellular_erosion` | erosion via brightness |
| `recursive_grid` | subdivided rects with shading |

*Source: `NGL_TOTAL_AUDIT_20260627.md`*

### Register 3 — True volumetric heightfield (implemented / planned)
The `renderHeightfield()` engine function converts a `Float32Array(G×G)` into an
isometric extruded column field — back-to-front painter's algorithm, lit tops, shaded
sides. This is the planned upgrade for `voronoi`, `reaction_diffusion`, `cellular_erosion`,
and `sdf` when `P.extrude > 0.01`.

*Source: `CODEX_TASK_volumetric_extrude.md`, `CHATGPT_BRIEF.md`*

---

## 2. SDF Architecture

All WebGL SDF modules follow a shared architectural pattern.

### Shared shader structure

```glsl
// Orbit camera
vec3 ro = vec3(sin(a) * R, el, cos(a) * R);

// Scene SDF
float map(vec3 p) { ... }

// Normal estimation
vec3 calcNormal(vec3 p) { /* tetrahedron finite difference */ }

// Ambient occlusion
float calcAO(vec3 pos, vec3 nor) { /* distance sampling */ }

// Lighting model: diffuse + specular + AO + rim
```

### Uniforms (standard set)

| Uniform | Meaning |
|---|---|
| `u_time` | seconds elapsed |
| `u_spin` | auto-orbit speed |
| `u_ao` | AO strength |
| `u_pal` | palette index |
| `u_bg`, `u_acc`, `u_ink` | color channel RGB |
| `u_dist` *(planned)* | orbit radius (dolly) |
| `u_elev` *(planned)* | camera elevation angle |

*Source: `CHATGPT_BRIEF.md`, `CAMERA_CONTROLS_PLAN.md`*

---

## 3. SDF Philosophy

### Smooth union (smin)
The metafluid / sdf_raymarch modules use polynomial smooth-min (`smin`) to merge blob
forms. This same mathematical operation (smooth union of implicit surfaces) is the
conceptual bridge to Blender metaballs — the same `smin` coefficient drives both the
browser form and its 3D counterpart.

*Source: `HANDOFF.md`*

### SDF as displacement
For SDF modules, `P.displace` is a sine-ripple coefficient added to the SDF distance
function — genuine surface deformation, not a buffer-level effect. This makes displacement
on SDF modules qualitatively different from displacement on 2D canvas modules.

*Source: `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`*

### IFS / Box-fold SDF (Menger, fold)
The `fold` module uses Sierpinski IFS. The planned `menger_sponge` uses box-fold IFS:
`abs(p) - offset` → component sort → `p.x * scale - offset * (scale-1)`. 8 iterations
gives crisper lattice edges than 6 for box geometry.

*Source: `EXPANSION_V2.md`*

---

## 4. Materials

### The `pal` shape
`[[r,g,b] bg, [r,g,b] accent, [r,g,b] ink]` — always three channels, always RGB arrays.
- Index 0 = background / dark ground
- Index 1 = mid accent
- Index 2 = brightest ink / focal element

*Source: `CHATGPT_BRIEF.md`, `HANDOFF.md`*

### Material params (SHARED)
- `metallic` — metallic sheen coefficient
- `rough` — surface roughness
- `sheen` — specular sheen
- `alpha` — opacity

These modulate the top-face brightness of heightfield columns and the specular response
of SDF surfaces. For the heightfield renderer, `(1 − P.rough) * P.metallic` drives the
top face brightness over the accent/ink ramp.

*Source: `CHATGPT_BRIEF.md`, `CODEX_TASK_volumetric_extrude.md`*

### GLSL flagship color state
SDF modules use `cs = {bg:"#hex", form:"#hex", hi:"#hex", bgVal, fSat, fVal, rim}` —
hex strings with value/saturation multipliers and a rim light coefficient.
2D standalone modules use `bgCol/fmCol/hiCol` as `[r,g,b]` arrays + float multipliers.

*Source: `SESSION_BRIDGE.md`*

### Palette bank (12 palettes, current)
ember · mineral · violet · amber · graphite · cyan · acid · magenta · gold · neutral · copper · ice

Index 4 = graphite = `["#0c0c0c","#3a3a3a","#f2f2f2"]` — the default.
Stored in `localStorage` under key `"noixzy_lab_theme"`.

*Source: `CHATGPT_BRIEF.md`*

---

## 5. Extrusion

### Two kinds of extrude (know the difference)

**Genuine heightfield extrude** (`renderHeightfield`)
- Isometric oblique projection: `sx = x + z*0.5*depth`, `sy = y − h*depth`
- Back-to-front painter's algorithm, column by column
- Top quad: lit by height + palette, brighter with metallic/sheen
- Visible side quads: darkened base color
- Zero-height cells skipped (negative space stays open)
- Performance gated: render only on `dirty`, G ≈ 120–150 at 50fps budget

**Stamp-offset extrude (2.5D, current default for most modules)**
- The existing engine stamp: multiple layers of the flat render offset in Y/X
- Reads as subtle on frame-filling modules — barely visible depth hint
- Will be replaced by `renderHeightfield` for `voronoi`, `reaction_diffusion`,
  `cellular_erosion`, `sdf` when `P.extrude > 0.01`

*Source: `HANDOFF.md`, `CODEX_TASK_volumetric_extrude.md`*

### Height sources per module

| Module | `heightField(G)` source |
|---|---|
| `voronoi` | per-cell constant (hash of cell index / relaxed-cell area) |
| `reaction_diffusion` | `clamp(a − b)` |
| `cellular_erosion` | distance-to-edge depth (CED/CE_MX) |
| `sdf` | `clamp(−field)` — depth inside blobs → domes |
| `contour_field` | layered noise value, optionally quantized to `levels` |
| `domain_marble` | FBM of domain-warped coordinates |

*Source: `CODEX_TASK_volumetric_extrude.md`, `EXPANSION_V2.md`*

---

## 6. Randomization

### Control-aware randomize (standard since 2026-06-27 audit)
Randomize does not just change the seed string — it pushes actual slider values into
meaningful visual ranges using control-label inspection:

- Density / count / grid / points / rings / cells → biased into visibly fuller ranges
- Extrude / depth / height / stack / layer / relief / bump / displace / subdivision /
  recursion → biased into geometry-forward ranges
- Offset / jitter / noise / field / twist / warp / phase / entropy / diffusion / morph /
  void → randomized across a wide midrange
- Line / stroke / shadow → altered enough to change silhouette without blowing out
- Palette / material → randomized across full range

*Source: `noixzy_randomization_geometry_audit_20260627.md`*

### Curated randomize (planned)
"New seed" should roll *within tasteful ranges*, not the full slider span. Pure random
gives mostly duds; constrained random gives mostly keepers. This is a planned upgrade
called "curated randomize" or "param lock."

*Source: `IDEAS_module_expansion.md` Part 4*

---

## 7. Animation

### Motion model
Engine modules use a baked buffer + animated transform model. The simulation renders once
on `dirty` into the scene buffer. The `draw()` loop applies canvas transforms:
`speed` drives rotation/translation, `drift` adds a slow wander. This is what enables
60fps — no per-frame re-simulation.

*Source: `HANDOFF.md`*

### `animT` / time-based fields
`animT` (seconds elapsed) is passed into domain-warp, physarum, curl noise, and other
time-continuous modules. It is the standard time variable — do not use `millis()` directly
in render paths.

*Source: `CHATGPT_BRIEF.md`*

### SDF orbit animation
SDF modules auto-orbit via `a = u_spin * u_time`. The orbit is continuous, slow, and
cinematic by default. `spin = 0` gives a still frame.

### "Drift Mode" (formerly Experimental Physics)
The `Experimental Physics` checkbox applies a canvas-level CSS transform:
`translate3d(dx, dy, 0) scale(breathe)` with slow sinusoidal oscillation.
This is a visual drift effect, not geometry physics. It should be labeled
"Drift Mode" for honesty. It does not affect particle trajectories, cell states, or
mesh positions.

*Source: `NGL_TOTAL_AUDIT_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`*

---

## 8. Camera

### 2D canvas camera (Phase 1 — complete)
All 9 generated modules have `cx` / `cy` pan wired in SHARED params:
```js
translate(W/2 + P.cx * W * 0.45, H/2 - P.cy * H * 0.45)
```
Drag-to-pan is also wired. `grid_extrude` had pan before the shared phase.

*Source: `NGL_TOTAL_AUDIT_20260627.md`*

### SDF orbit camera (Phase 2 — planned)
For each SDF module, add `u_dist` (orbit radius, mapped to R_min–R_max) and
`u_elev` (elevation angle, mapped 0–80°). Implementation order:
`gyroid` → `displacement` → `mandelbulb` → `fold` → `sdf_raymarch` (most complex last).

Clamping rules:
- Minimum orbit radius: never allow R < 1.5× the object's bounding radius (avoid inside geometry)
- Maximum elevation: clamp at 0.9 (≈80°) to avoid up-vector collapse

*Source: `CAMERA_CONTROLS_PLAN.md`*

### Cinematic camera concepts (for future SDF modules)
- **Slow auto-orbit:** spin speed 0.003–0.006 for a turntable feel
- **Cinematic dolly:** animate from R_max to R_min over 8s, pause, reverse
- **Parallax shift:** on mouse move, shift 2D field by ±cursor_offset × 0.008

*Source: `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`*

---

## 9. Color

### The house palette — graphite baseline
Primary: `#0c0c0c` background, `#3a3a3a` field, `#f2f2f2` ink.
Accent: `#ed5700` orange — used sparingly as a focal accent.

*Source: `CHATGPT_BRIEF.md`*

### Three-value luminance discipline
- Dark ground: ~10–15% luminance
- Mid field: variable
- Small bright focal: ~85–95% luminance
Avoid mid-grey soup. Enforce this value structure in every default.

*Source: `IDEAS_module_expansion.md` Part 3*

### Palette discipline
- Maximum 2 hues + 1 neutral per palette
- A third hue is rare and intentional
- A "duotone" toggle that collapses any palette to two values produces the most
  cohesive looks

*Source: `IDEAS_module_expansion.md` Part 3*

### CRT / noir palette (unified shell)
- Black rail, white/gray CRT scanline texture
- No color wash, no teal/blue/green/neon
- Monochrome grayscale thumbnails: `filter: grayscale(1) contrast(1.08) brightness(.82)`
- Rail glow: `box-shadow: 0 0 18px rgba(255,255,255,.10), 0 10px 28px rgba(255,255,255,.055)`

*Source: `NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*

---

## 10. Motion Graphics Influences

The lab's visual language sits at the intersection of:

- **Generative / algorithmic art** — Perlin noise, reaction-diffusion, SDF forms,
  cellular automata as primary visual vocabulary
- **Blender / 3D production** — modules feed into real 3D pipelines; the "render"
  feel of the output should be legible as a Blender material reference
- **CRT / analog electronics** — the unified shell adopts a noir CRT monitor aesthetic:
  scanlines, phosphor glow, monochrome, the implied weight of old hardware
- **Music visualization** — the audio-reactive direction ties module output directly
  to frequency information; Chladni figures are explicitly called out as "the sound IS
  the image"
- **Architectural drawing** — the escrow candidates include plan drawings, section cuts,
  façade systems, isometric massing — this is not decoration but disciplined spatial logic

*Sources: `IDEAS_module_expansion.md`, `NGL_UNIFIED_SHELL_HANDOFF_20260627.md`, `OVERVIEW.md`,
`ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md`*

---

## 11. Historical / Conceptual Influences (named in the documents)

| Influence | Connection to the lab |
|---|---|
| Inigo Quilez domain warping | `domain_marble` module — f(p + f(p + f(p))) multi-pass warp |
| Gray-Scott reaction-diffusion | `reaction_diffusion` module; named preset bank planned |
| Lenia (Bert Wang-Chak Chan) | `lenia_life` prototype; ring kernel `bell(d, peak, rw)` over annular shell |
| Physarum polycephalum (Jeff Jones 2010) | `physarum_network`; sense–rotate–deposit–diffuse–decay model |
| Chladni / cymatic figures | `chladni_plate` escrow; nodal line particle rejection sampling |
| DLA (Diffusion-Limited Aggregation) | `dla_frost` prototype; frost/coral/lightning visual language |
| Voronoi / Delaunay (geometry) | `voronoi`, `delaunay_mesh_field`; Lloyd relaxation for organic evenness |
| Hopf fibration / torus knot topology | `torus_knot` module; p/q morph as topology transition |
| Gielis superformula | `superformula_shell_stack` escrow; alien botany / emblem generation |
| Penrose tiling / quasicrystal | `penrose_deflation`, `quasicrystal_diffraction_garden` |
| Frank Lloyd Wright spatial principles | `prairie_grid`, `hearth_plan`, `cantilever_stack` — horizontality, hearth/core, compression/release |
| Brutalism / concrete architecture | `brutalist_massing` family — mass, void, depth, shadow as primary language |
| Le Corbusier / Modulor proportion | `modulor_field` — rational grid as art machine |
| Poincaré disk hyperbolic tiling | `hyperbolic_tiling` prototype — Möbius transformation tessellation |

*Sources: `EXPANSION_V2.md`, `NGL_TOTAL_AUDIT_20260627.md`, `ALGORITHMIC_ARCHITECTURAL_ART.md`,
`ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md`, `IDEAS_module_expansion.md`*

---

## 12. Architectural / Style Registers (Escrow language)

The escrow shell organizes architectural modules into four style registers:

### Minimalist
- Few elements, strong margins, black/white/one-accent palettes
- Negative space is a first-class parameter — default to 70% empty ground
- Line hierarchy: construction lines / primary lines / poche / shadow
- Representative modules: `minimal_parti`, `quiet_grid`, `white_space_field`, `single_cut`

### Modern (Rationalist / Modernist)
- Rational grids, structural bays, curtain walls, pilotis, open plans
- Materials: glass, steel, concrete, warm wood, white planes
- "Drawing mode" vs "render mode" toggle where possible
- Representative modules: `modernist_facade`, `free_plan`, `curtain_wall_variations`, `brise_soleil`

### Brutalist
- Mass, void, depth, and shadow as primary formal language
- Concrete grain, board-form seams, weathering, bevels, hard sunlight
- 3D / axonometric / sectional modules preferred over decorative flat patterns
- Representative modules: `brutalist_massing`, `concrete_relief`, `megastructure`, `coffered_ceiling`

### Wright-inspired / Organic Modern
- Horizontality, hearth/core, terraces, overhangs, masonry rhythm, site integration, compression/release
- Warm neutrals: stone, wood, concrete, muted glass accents, long shadow bands
- Principle-based, not a replica generator
- Representative modules: `prairie_grid`, `hearth_plan`, `cantilever_stack`, `leaded_glass_grid`

*Source: `ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md`*

---

## 13. The House Look — Finishing Recipe

This is the shared finishing pass that makes every module feel like one authored set.

### Default look param values
- **contrast:** high-ish — start punchy, not neutral
- **vignette:** ~0.2–0.3 — subtle, to seat the focal
- **grain:** ~0.04–0.08 — never 0; light grain reads as "shot on something"
- **glow:** gentle bloom on the brightest 10% only

### Composition principles baked into defaults
- **One focal point** — bias the default so attention lands somewhere specific
- **Off-center** — near a thirds intersection, not dead center
- **Atmospheric depth** — fade distant elements toward bg, bring focal forward
- **Value before color** — tune value structure first, then apply palette
- **An anchor line** — horizon, baseline, or ground plane, even implied

*Source: `IDEAS_module_expansion.md` Parts 3 & 5*

### The noixzy word
"Restrained, moody. Dark ground / mid field / bright focal.
Never tech guy in a cinematic room."

*Source: `READ_FIRST.md`*
