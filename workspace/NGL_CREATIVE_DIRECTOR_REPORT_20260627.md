# noixzy generative lab — creative director + systems architect report
# 2026-06-27

---

## PROJECT CONTEXT SUMMARY

**Branch:** `feature-hand-authored-preview-undo-redo`
**Last clean pushed commit:** `6937d65 Fade unified shell badge edges`
**Active polish target:** `unified_shell.html`
**Escrow shell path:** `workspace/module_escrow_20260627/escrow_shell.html`
**Candidate count:** 100 HTML modules in `workspace/module_escrow_20260627/candidates/`

### What was completed by prior agent passes

| Pass | Work |
|---|---|
| Randomization/geometry audit | Control-aware randomize patched across all 7 shared runtimes + 18 standalone modules. `Experimental Physics` toggle added to all candidates. |
| Batch 11 (Cosmos Nano Zen) | 10 nano-zen modules: boids ink, cellular rake, kintsugi, shodo, particle moss, wave sand, torii depth, bonsai circuit, pressure thread, zen caustic. |
| Batches 12–14 | 70+ architectural + math + unexplored candidates. Randomize wired to geometry, not just seed strings. |
| Cosmos collection scan | 9 Cosmos Blender experiments catalogued. Visual language extracted. 10-module escrow roadmap written. |
| Unified shell CRT/badge polish | Rail glow, badge edge fade, CRT noise layer, no colored wash. Locked at commit `6937d65`. |

### What is explicitly NOT done yet

- Camera controls (cx/cy for generated modules; orbit radius/elevation for SDF modules) — spec written in `CAMERA_CONTROLS_PLAN.md`, no code yet
- True volumetric extrude (Codex Task 1) — spec in `CODEX_TASK_volumetric_extrude.md`
- PBR map export (Codex Task 2)
- Loop/WebM export (Codex Task 3)
- Theme system (Codex Task 7)
- Audio-reactive mode (Codex stretch)
- Deep physics wiring (physics checkbox affects canvas transform only; not wired to particle positions or cell solvers)

### Production module count

48 modules registered in `modules.manifest.json`. Folders include:
cellular_bloom · cellular_erosion · contour_field · crater_field · crystal_growth · displacement · displacement_primitives · echo_contours · flow_field · fractal_tiles · glyph_field · grid_extrude · gyroid · hex_grid · interference_grid · kaleidoscope_field · l_system · lissajous_mesh · magnetic_dust · mandelbulb · metafluid · moire_field · neural_lattice · particle_orbitals · plasma_membrane · prism_moire · radial_noise · reaction_diffusion · recursive_grid · ribbon_flow · rose_curve · sdf · sdf_raymarch · signal_rain · signal_weave · spiral_lattice · stipple · terrain_slice · topographic_rings · torus_knot · truchet · truchet_b · vector_scope · voronoi · vortex_sheet · wave_interference · wave_lattice + more

---

## UNIFIED SHELL IMPROVEMENT REPORT

### What is solid

- Black/noir CRT rail treatment — committed and correct. No colored wash, no neon.
- Badge edge fade with outward wings — committed `6937d65`, working as designed.
- Monochrome grayscale thumbnail treatment via `filter: grayscale(1) contrast(1.08) brightness(.82)`.
- Translucent settings menu, no blue legacy accents.
- Fixed top rail iframe layout: `inset: var(--rail-h) 0 0` on `.stage`.

### Safe improvements to make now

**1. Module name label below thumbnails**
Currently no label appears on the thumb rail. Adding a 9px monospace label under each thumbnail improves navigation without touching layout critically.
Target: `.moduleButton` → add `<span class="moduleLabel">name</span>` below img, styled at `font-size:9px; opacity:.44; white-space:nowrap; overflow:hidden; text-overflow:ellipsis`.

**2. Scrollbar hide on desktop (keep behavior)**
Current scrollbar is a thin dark strip. On desktop, `scrollbar-width:none` on `.thumbRail` with `-webkit-overflow-scrolling:touch` makes it cleaner. Drag-scroll or keyboard left/right should still work.

**3. Active module indicator**
`[aria-selected="true"]` currently only boosts opacity to `.64`. Add a 1px white bottom border on `.moduleButton[aria-selected="true"]` to indicate active module more clearly.

**4. Keyboard navigation arrows (‹ ›) in shell**
No visible prev/next buttons in `unified_shell.html` (unlike escrow shell which has them). Adding simple left/right arrow buttons flanking the thumb rail would mirror the escrow shell's UX pattern and allow keyboard-less browsing. Low-risk HTML addition.

**5. Rail height breathing room**
`--rail-h: 78px` with `padding: 12px 14px`. The thumb height `--thumb-h: 48px` plus 12px padding = 72px, leaving 6px gap. If thumbnail labels are added (above), bump `--rail-h` to `92px` to give 14px head room.

### Improvements to DEFER (risky)

- Settings menu redesign — functional, don't touch
- moduleFrame `allow` attribute changes — risk breaking module iframe
- Logo SVG replacement — asset pipeline question; noixzy must supply new SVG
- Preset export/import — requires state architecture decision

---

## ESCROW SHELL IMPROVEMENT REPORT

### Current state of escrow_shell.html

The escrow shell (`workspace/module_escrow_20260627/escrow_shell.html`) is a plain dark sidebar layout:
- `background: #0a0a0a` body, `#111` header, `#141414` sidebar
- 300px fixed sidebar, iframe preview panel
- Global ‹ › navigation buttons
- Module list with title, description, standalone link
- No thumbnails
- No CRT / noir treatment
- No badge / logo
- Header font is system sans, not monospace
- Teal (`#6aa`) link color — legacy, not consistent with noixzy monochrome

### What the escrow shell needs to approach unified shell quality

**1. Typography alignment**
Change `font-family` in body to match unified shell: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`. Costs nothing.

**2. Remove teal accent**
Replace `#6aa` (link color) with `rgba(255,255,255,.62)` for borders and `#e0e0e0` or `var(--ink)` for link text. Align with noir monochrome direction.

**3. Sidebar thumbnail strip**
Add a small `<img>` preview inside each `.candidate` card (if candidate has an associated PNG in a thumbs folder). Fall back gracefully to no image. This gives the escrow shell visual scanning parity with unified shell.

**4. Active module highlight**
Current active state: `background: #252525; border-color: #555`. Upgrade to left `border-left: 2px solid rgba(255,255,255,.44)` with a soft glow: `box-shadow: -2px 0 12px rgba(255,255,255,.06)`.

**5. Module count / batch header chips**
Each runtime batch (Batch 11–14, Cosmos, Candidate, Standalone) should have a visible section header chip. Currently all modules are flat-listed. Group them with section dividers: `<div class="batch-header">batch 11 · cosmos nano zen</div>`.

**6. Filter / search input**
100 modules is a lot to scroll. A minimal `<input type="search">` at the top of the sidebar filtering by module name would halve navigation time. No backend — pure DOM `textContent.includes()` filter.

**7. Keyboard shortcut display**
Small footer inside sidebar: `← prev · → next · space pause`. 10px monospace text at `opacity:.3`.

**8. Shell title treatment**
Replace `<h1>noixzy module escrow</h1>` with a styled badge matching the escrow aesthetic: lowercase, monospace, `letter-spacing:.12em`, `font-size: 11px`.

### What NOT to change in escrow shell

- Candidate file paths — runtimes reference them directly
- prev/next global nav — working correctly
- iframe isolation — candidates self-contain

---

## ESCROW MODULE SCAN REPORT

**Total candidates audited:** 100 HTML modules

### Runtime families

| Runtime | Modules | Theme |
|---|---|---|
| `noixzy_batch_11_runtime.js` | 10 | Cosmos nano zen (boids, zen, kintsugi, shodo, etc.) |
| `noixzy_batch_12_runtime.js` | 10 | Architectural facades (brise-soleil, section cut, shadow louver, etc.) |
| `noixzy_batch_12_math_runtime.js` | 10 | Math/signal systems (lenia, fourier, strange attractor, thin film, etc.) |
| `noixzy_batch_13_runtime.js` | 10 | Architectural systems (diagrid, courtyard, mashrabiya, parametric pavilion, etc.) |
| `noixzy_batch_14_unexplored_runtime.js` | 10 | Unexplored geometry (quasicrystal, IFS, Gosper, turmite, Wang tile, etc.) |
| `noixzy_candidate_runtime.js` | 22 | Algorithmic foundation (diff growth, WFC, apollonian, physarum, penrose, etc.) |
| `noixzy_cosmos_quick_runtime.js` | 10 | Cosmos quick cards (gate relic, baffle field, hidden chamber, hinge array, etc.) |
| Standalone | 18 | Brutalist massing variants, concrete relief, modernist facade, structural grid, etc. |

### Module quality tiers (post-audit)

**Tier 1 — Ready for promotion consideration**
- `noixzy_differential_growth.html` — rich geometry, good control surface, unique visual
- `noixzy_physarum_network.html` — agent simulation with emergent flow, strong visual
- `noixzy_torii_depth_lattice.html` — perspective depth, extrude controls, distinctly noixzy
- `noixzy_strange_attractor_dust.html` — long-exposure particle cloud, beautiful stills
- `noixzy_lenia_kernel_garden.html` — smooth cellular life, motion-native, showpiece quality
- `noixzy_zen_caustic_relief.html` — caustic relief, sand-rake texture, clear noixzy aesthetic
- `noixzy_shodo_vector_field.html` — calligraphic strokes, curl field, ink-painting quality
- `noixzy_brutalist_massing.html` + variants — strong 3D-illusion architectural forms

**Tier 2 — Solid, needs visual default tuning**
- All 10 Batch 12 architectural (brise-soleil, section cut, aperture field, etc.)
- All 10 Batch 13 systems (diagrid, courtyard, panelization, etc.)
- Fourier epicycles, Chladni plate, hitomezashi stitch, spectrogram ridge terrain

**Tier 3 — Conceptually strong, needs renderer polish**
- `noixzy_quasicrystal_diffraction_garden.html` — math is correct, visual density too uniform
- `noixzy_gosper_curve_city.html` — space-fill curve works, needs cityscape visual reading
- `noixzy_wang_tile_machine.html` — tiling logic solid, palette and contrast need tuning
- `noixzy_escher_tessellation_morph.html` — morph logic interesting, transitions rough
- `noixzy_nano_kitbash_lattice.html` — concept strong, needs geometry layering pass

### Remaining weak spots (from geometry audit)

- Brutalist massing standalone variants: broad 2.5D massing, need per-variant unique controls (recursive terraces, bridge count, service cores, negative-space slicers)
- Physics checkbox: canvas-level transform only; not wired into particle positions or cell solvers
- Old stage-message compatibility code in some runtimes (inert, but should be cleaned)
- Export hooks preserved but not expanded

---

## GEOMETRY / FORM AUDIT

### Extrusion

| Module family | Extrusion type | Genuine geometry effect? |
|---|---|---|
| `grid_extrude` | Per-cell height offset, genuine Z displacement | YES — real per-cell height, light angle response |
| `sdf_raymarch` | Y-stretch in orbit camera | YES — affects 3D form, camera reads depth |
| `gyroid`, `displacement`, `mandelbulb` | Raymarch radial offset | YES — deforms 3D implicit surface |
| Batch 11 (boids, zen, etc.) | `bump`/`displace` controls → canvas scale breathing | PARTIAL — drift/breathing, not geometry rebuild |
| Batch 12–14 architectural | Extrude/depth → lineweight, offset, shadow simulation | PARTIAL — 2.5D illusion, not true mesh extrusion |
| Brutalist massing standalone | Block height/depth parameter → draw rect height | YES for 2D representation — orthographic projection |

**Verdict:** Genuine volumetric extrusion exists only in `grid_extrude` and the four SDF/raymarch modules. All other modules simulate depth via 2.5D shading, line weight, and perspective tricks. This is acceptable for 2D canvas — but any "extrude" slider that only changes canvas CSS transform is misleading and should be labeled "depth illusion" or "relief" instead.

### Displacement

- Field modules (flow_field, reaction_diffusion, voronoi, contour_field): displacement = noise warp on the render buffer, not geometry
- SDF modules: displacement = additive ripple on the SDF distance function = genuine surface deformation
- Escrow candidates: `displace` slider moves the canvas or modifies stroke density; not a heightfield deformation

**Priority fix:** In `sdf_raymarch` and `gyroid`, expose displacement amplitude as a slider that controls the sine-ripple coefficient in the fragment shader. This is already partway implemented via the shared `displace` param — verify it reaches the shader uniform.

### Stacking / Recursive Arrays

- Recursive arrays in `noixzy_recursive_kintsugi_array`, `noixzy_rib_vault_generator`, `noixzy_recursive_keystone_frame` — genuine recursive draw calls, depth-controlled
- Truchet and truchet_b — tile array is genuine multi-scale stacking
- `recursive_grid` — genuine nested subdivision
- Brutalist massing — `floor count` genuinely stacks blocks along Y axis

**Verdict:** Stacking and recursive arrays are genuinely geometry-affecting in these modules.

### Force Fields / Particles

- Particle systems in escrow batch 11 (particle moss, boids) — genuine force accumulation and velocity integration, not just CSS
- Production `flow_field` — vector field driving particle step integration — genuine
- Production `magnetic_dust` — force accumulation per particle — genuine
- Batch 12 math: `magnetic_dipole_linework` — Biot-Savart-style field lines — genuine
- `noixzy_physarum_network` — genuine slime-mold trail agent system

**Verdict:** Force fields and particles are genuine geometry operations in all cases. No false positives found.

---

## 3D CAMERA AUDIT

### What exists

| Module | Camera type | Orbit? | Depth/Elevation? |
|---|---|---|---|
| `sdf_raymarch` | Raymarched orbit + spin | YES | Hardcoded — needs slider |
| `gyroid` | Raymarched orbit | YES | Hardcoded |
| `displacement` | Raymarched orbit | YES | Hardcoded |
| `mandelbulb` | Raymarched orbit | YES | Hardcoded |
| `fold` | Raymarched orbit | YES | Hardcoded |
| `grid_extrude` | Orthographic top-down + zoom/pan | NO orbit | zoom + rot slider |
| Escrow batch 11 `torii_depth_lattice` | Perspective vanishing point simulation | NO orbit | `perspective` slider (0–100) |
| Escrow brutalist massing | Isometric/axonometric projection | NO orbit | `elevation` and `view angle` in some variants |
| All other 2D canvas modules | Flat 2D with zoom/rotate/pan | NO | frame controls only |

### Camera plan status

`CAMERA_CONTROLS_PLAN.md` is complete and correct. It defines:
- Phase 1: add `cx` / `cy` pan to SHARED params in `build_lab.js` (3-line change, zero risk)
- Phase 2: add `u_dist` (orbit radius) + `u_elev` (elevation) to each SDF module, one at a time

**This is the single highest-leverage camera improvement available.**

### 3D camera thinking — recommendations

**For 2D canvas modules:**
- cx/cy pan (Phase 1 plan) — implement now, all 9 generated modules benefit instantly
- Parallax depth layer: render a faint secondary version of the field at 0.88x scale and blend behind the main layer. Creates depth without geometry changes. Good for: contour_field, voronoi, flow_field.

**For SDF/raymarch modules:**
- Implement Phase 2: orbit radius (dolly) + elevation per module. The CAMERA_CONTROLS_PLAN.md spec is safe and correct. Implement gyroid first.
- Add FOV slider (deferred in the plan, but worth revisiting for mandelbulb where zoom dramatically changes the form reading).
- Depth of field: the `sdf_raymarch` module is the best candidate for a soft DoF blur (Bokeh radius uniform). Low risk since it's already WebGL.

**For escrow architectural modules:**
- Isometric ↔ perspective toggle: a single boolean that switches the projection matrix from ortho to a 60° FOV perspective. This is the most dramatic camera improvement possible for the brutalist massing family. Changes the entire reading of the form.
- Elevation slider (0°–80°): valid for all brutalist variants, diagrid tower, courtyard plan. Currently hardcoded or not present.

**For the escrow shell itself:**
- Add a global "camera mode" badge to the preview header (showing: ORTHO / PERSPECTIVE / ORBIT) based on module metadata. Purely informational. Helps orient the user.

**Cinematic presentation concepts:**
- Slow auto-orbit: all SDF modules should have a `cinematic` checkbox that sets spin speed to 0.003–0.006 (imperceptibly slow, barely perceptible orbit). This is the "Blender turntable" feel in browser.
- Push-through: animate dolly from R_max to R_min over 8 seconds, pause, reverse. A single `cinematicDolly` flag.
- Parallax scroll: on mouse move, shift the 2D field by `±cursor_offset * 0.008` for a subtle depth parallax on 2D canvas modules.

---

## PERFORMANCE AUDIT

### CPU/GPU risk assessment

| Module | Risk level | Notes |
|---|---|---|
| `reaction_diffusion` | MEDIUM | Double-buffer GL compute, but runs every frame. At high grid sizes can spike. |
| `lenia_kernel_garden` | MEDIUM-HIGH | Full convolution kernel per frame. Large radius = O(n²) per cell. |
| `physarum_network` | MEDIUM | Agent simulation with texture read-back. Trail diffusion pass is expensive at high agent counts. |
| `particle_orbitals` | LOW-MEDIUM | Pure JS force integration, scales with particle count. |
| `mandelbulb` | MEDIUM | GLSL raymarch with 6+ iterations per fragment. High resolution = heavy. |
| `sdf_raymarch` | LOW-MEDIUM | Well-optimized raymarch, short march steps. |
| `differential_growth` | LOW | Canvas 2D path ops, scales with colony count and node count. |
| `boids_ink_current` | LOW-MEDIUM | Per-frame velocity integration for 68 agents. |
| Brutalist massing family | LOW | Pure canvas rect ops. Zero simulation cost. |
| Batch 12 math: `fourier_epicycle_array` | LOW-MEDIUM | Trig-heavy per frame but few points. |
| `strange_attractor_dust` | MEDIUM | 10k+ points per frame, canvas2D globalAlpha trails. |
| `falling_sand_microphysics` | HIGH | Per-cell state machine with neighbor reads. Expensive at large canvas sizes. |
| `cyclic_ca_spiral_reactor` | HIGH | Full grid CA update per frame. Same class as reaction_diffusion. |

### Lighter alternatives for heavy modules

| Heavy module | Lighter alternative |
|---|---|
| `lenia_kernel_garden` at large radius | Reduce default radius to 9–12, cap max at 24. Add a "lite mode" that halves grid resolution. |
| `falling_sand_microphysics` | Subsample to 1/4 resolution canvas, scale up with CSS. Match existing `reaction_diffusion` pattern. |
| `cyclic_ca_spiral_reactor` | Run simulation at half canvas resolution. Upscale with `imageSmoothingEnabled: false` for crisp pixelation or `true` for smooth. |
| `physarum_network` at high agent count | Cap default at 800 agents. Add "performance mode" toggle that disables trail diffusion. |
| `strange_attractor_dust` | Use OffscreenCanvas and accumulate points over multiple frames instead of redrawing each frame. Trail persistence rather than brute force. |

### General performance recommendations

1. **Throttle idle modules** — when `unified_shell.html` has a module in the iframe, all other module canvases continue ticking in the background. Add `document.visibilitychange` + `requestAnimationFrame` cancellation when the page is hidden.
2. **Lazy init for escrow candidates** — the escrow shell loads all 100 module descriptions in the sidebar. Only the active iframe is alive, but DOM weight is high. Virtualize the sidebar list (only render visible items) if scroll performance suffers.
3. **OffscreenCanvas for compute-heavy modules** — `reaction_diffusion`, `cellular_erosion`, and `lenia` are best candidates. Move the simulation buffer to an OffscreenCanvas worker thread.

---

## PHYSICS AUDIT

### Current experimental physics implementation

The `Experimental Physics` checkbox (added in the geometry audit pass) currently does:

```js
function applyExperimentalPhysics() {
  const dx = experimentalPhysics ? Math.sin(frame * 0.017) * 4.5 : 0;
  const dy = experimentalPhysics ? Math.cos(frame * 0.013) * 3.5 : 0;
  const breathe = experimentalPhysics ? 1 + Math.sin(frame * 0.011) * 0.004 : 1;
  canvas.style.transform = experimentalPhysics ? `translate3d(${dx}px, ${dy}px, 0) scale(${breathe})` : "";
  canvas.style.filter = experimentalPhysics ? "contrast(1.06) saturate(1.08)" : "";
}
```

**Verdict:** Canvas-level CSS transform + filter only. Does not affect geometry positions, particle velocities, force accumulation, cell states, or mesh deformation. The "drift" and "breathe" are visual polish, not physics simulation.

### What "meaningful physics" should look like

**Tier A — Geometry-affecting physics (requires per-module integration):**
- Particle modules (`boids`, `particle_moss`, `physarum`): add a wind force vector `[Fx, Fy]` that accumulates into velocity each tick. User controls: `force X`, `force Y`, `turbulence`. Toggle enables the force; untoggle zeroes it.
- Spring/thread modules (`pressure_thread_physics`): stiffness and damping already exist. Adding external gravity `g` that pulls thread nodes downward is one line per node: `vy += g * dt`. Visually obvious.
- Reaction-diffusion: add a slow advection term (drift field) that carries the reaction product downstream. One additional texture blend per frame.

**Tier B — Bounded simulation (safe, bounded computation):**
- Per-module, cap all physics forces to ±1.0 normalized. Never let forces accumulate unbounded. Add a reset that zeroes velocities.
- Physics should have a visible "energy level" readout: 0–100% showing how active the simulation is. Easy to compute from mean particle speed.

**Tier C — Presentational (current implementation, refine it):**
- Rename the current checkbox from "Experimental Physics" to "Drift Mode" for honesty — it's not geometry physics, it's camera drift.
- Keep the drift effect but make it user-tunable: expose `drift amount` (0–100) and `drift speed` (0–100) sliders that appear only when the checkbox is on.

### Recommended implementation for Phase 1 physics

For `pressure_thread_physics` (safest first target — spring physics is already partially implemented):
```js
// Add inside tick():
if (experimentalPhysics) {
  nodes.forEach(n => {
    n.vy += 0.12; // gravity
    n.vx += Math.sin(frame * 0.019) * 0.04; // turbulence
  });
}
```
This is 3 lines, bounded, reversible, and visually dramatic on thread lattices.

---

## NEW UNIFIED SHELL MODULE CONCEPTS (30)

These are concepts for new production modules to be added to `unified_shell.html` via `build_lab.js` (or as new hand-authored HTML for WebGL-intensive modules). All preserve the lowercase noixzy naming pattern.

### Field / Terrain Systems
1. **noixzy_curl_noise_fluid** — Curl-noise vector field driving particle streamlines as flowing fluid ribbons. System: `turbulence`, `viscosity`, `ribbon count`, `fade length`. noixzy angle: liquid metal, magma currents.
2. **noixzy_erosion_terrain** — Hydraulic erosion simulation on a heightfield. System: `rain rate`, `carry capacity`, `erosion strength`, `sediment`. noixzy angle: worn stone surfaces for displacement maps.
3. **noixzy_voronoi_shatter** — Voronoi cells that fracture and drift apart with spring constraints. System: `crack speed`, `tension`, `fragment spin`, `gap`. noixzy angle: broken glass, concrete fracture, Blender cell-fracture input.
4. **noixzy_interference_field** — Multiple wave sources with adjustable phase, amplitude, wavelength creating interference moiré. System: `source count`, `wavelength`, `phase offset`, `damping`. noixzy angle: sonar, signal, water surface.
5. **noixzy_domain_marble** — Layered domain-warp curl noise with oil/marble/lava palette. System: `warp layers`, `warp scale`, `warp strength`, `octaves`. noixzy angle: direct tie to Blender MarbledFlux material.

### Particle + Agent Systems
6. **noixzy_plasma_stream** — Charged particle streams with magnetic deflection field. System: `charge count`, `field strength`, `trail decay`, `beam focus`. noixzy angle: plasma, aurora, particle accelerator.
7. **noixzy_murmuration_field** — Boid murmuration rendered as a single cloud silhouette with density heat map. System: `agent count`, `cohesion`, `turbulence`, `smear`. noixzy angle: starling murmurations, ink-cloud.
8. **noixzy_slime_path** — Physarum-style slime mold network forming transport roads. System: `agent count`, `sensor angle`, `deposit rate`, `decay`. noixzy angle: mycelium, root networks.
9. **noixzy_rain_static** — Vertical particle rain with static-electric branching when particles near ground. System: `density`, `branch prob`, `drift`, `arc width`. noixzy angle: signal_rain extended, electrical storm.
10. **noixzy_orbit_system** — N-body gravitational orbit simulation with long-exposure trails. System: `body count`, `G strength`, `trail length`, `mass variance`. noixzy angle: orbital mechanics, deep space.

### Mathematical / Structural
11. **noixzy_apollonian_nest** — Apollonian circle packing with recursive tangent circles. System: `recursion depth`, `min radius`, `jitter`, `fill mode`. noixzy angle: bubble architecture, nested scales. SVG gold.
12. **noixzy_penrose_field** — De Bruijn pentagrid quasicrystal tiling with depth-tinted facets. System: `symmetry`, `wave count`, `phase`, `facet depth`. noixzy angle: aperiodic shimmer, ritual geometry.
13. **noixzy_lissajous_web** — Parametric Lissajous curves animating through frequency ratio space. System: `freq ratio`, `phase drift`, `harmonic count`, `line weight`. noixzy angle: analog oscilloscope, signal portrait.
14. **noixzy_superform_colony** — Superformula shapes (Gielis) nested and arrayed. System: `m`, `n1/n2`, `colony count`, `rotation drift`. noixzy angle: alien botany, emblem art, sigil building.
15. **noixzy_hilbert_terrain** — Hilbert curve with elevation-colored segments and 3D perspective lean. System: `order`, `lean angle`, `elevation range`, `line weight`. noixzy angle: terrain scan, vector plotter.

### Optical / Signal
16. **noixzy_crt_feedback** — Video feedback loop: zoom + rotate + hue-shift creating infinite tunnel. System: `zoom`, `rotate`, `hue cycle`, `decay`. noixzy angle: VHS trippy loop, motion-native.
17. **noixzy_datamosh_smear** — Directional pixel smear driven by an underlying flow field. System: `smear length`, `angle field`, `threshold`, `decay`. noixzy angle: glitch texture for Blender emission layers.
18. **noixzy_halftone_engine** — CMYK halftone / blue-noise dither engine. System: `dot pitch`, `screen angle`, `pattern type`, `levels`. noixzy angle: theSauceCode print heritage, risograph.
19. **noixzy_thin_film_iridescence** — Oil-slick iridescence from thin-film math. System: `film thickness`, `angle spread`, `noise warp`, `saturation`. noixzy angle: luxe iridescent backdrops, spectral release art.
20. **noixzy_signal_spectrogram** — Spectrogram of a dropped audio file rendered as a 3D ridge terrain. System: `time window`, `freq scale`, `height`, `smoothing`. noixzy angle: "song becomes object" — direct heightfield for Blender.

### Architectural / Structural
21. **noixzy_diagrid_shell** — Structural diagrid lattice extruded into a curved shell form. System: `grid density`, `curvature`, `extrude depth`, `joint size`. noixzy angle: parametric architecture, Blender geodesic cage.
22. **noixzy_cellular_vault** — Voronoi cells solidified into an organic vault structure with ribs. System: `cell count`, `rib width`, `vault height`, `aperture size`. noixzy angle: bone structure, Gothic vault, architectural texture.
23. **noixzy_tensile_membrane** — Minimal surface soap-film simulation between fixed anchors. System: `anchor count`, `tension`, `relaxation steps`, `material`. noixzy angle: tensile architecture, membrane structure.
24. **noixzy_stacked_sections** — Building section cuts stacked at intervals showing floor plates, voids, cores. System: `floor count`, `void prob`, `core radius`, `section gap`. noixzy angle: architectural drawing, Blender building generator input.
25. **noixzy_masonry_bond** — Brick/block masonry bond patterns with mortar joints, texture, depth. System: `bond type`, `mortar width`, `course height`, `roughness`. noixzy angle: material texture for Blender displacement.

### Organism / Growth
26. **noixzy_dla_frost** — Diffusion-limited aggregation: frost, coral, lightning dendrites. System: `walker count`, `stickiness`, `seed shape`, `branch weight`. noixzy angle: growth/decay duality. Root systems, crystal frost.
27. **noixzy_mycelium_net** — Mycorrhizal network: nodes linked by decaying thread channels. System: `node count`, `thread density`, `decay rate`, `pulse speed`. noixzy angle: fungal architecture, root/web imagery.
28. **noixzy_eden_spread** — Eden growth model: colony spreads cell-by-cell with anisotropy. System: `spread prob`, `anisotropy`, `seed count`, `edge rough`. noixzy angle: contamination, lichen, spreading stain.
29. **noixzy_lenia_life** — Lenia continuous cellular automaton producing drifting organisms. System: `kernel radius`, `growth center`, `growth width`, `timestep`. noixzy angle: living alien organism. Showpiece motion module.
30. **noixzy_crystal_facet** — Crystal facet growth simulation: anisotropic attachment probabilities. System: `facets`, `growth rate`, `anisotropy`, `roughness`. noixzy angle: mineral texture, gemstone slices, Blender crystal scatter.

---

## NEW ESCROW SHELL MODULE CONCEPTS (30)

These are candidates for `workspace/module_escrow_20260627/candidates/`. They follow the existing escrow runtime pattern (single HTML, sidebar controls, canvas preview).

### Architectural Deep Cuts
1. **noixzy_bearing_wall_plan** — Load-bearing wall structural plan with apertures, beams, and moment connections drawn as architectural linework. Sliders: wall density, aperture ratio, beam count, lineweight.
2. **noixzy_lattice_truss_section** — Cross-section of a Pratt/Warren/Vierendeel truss with node stress coloring. Sliders: bay count, truss type, load factor, section depth.
3. **noixzy_folded_plate** — Origami-derived folded plate roof structure. Sliders: fold count, angle, depth, rhythm.
4. **noixzy_hanging_cable_net** — Catenary cable net structure with support points. Sliders: cable count, sag ratio, support spacing, load distribution.
5. **noixzy_pneumatic_bubble_field** — Pneumatic air-supported structure bubbles, overlapping forms. Sliders: bubble count, pressure, overlap, membrane weight.

### Computational Geometry
6. **noixzy_delaunay_mesh_field** — Delaunay triangulation of a random point field with terrain coloring. Sliders: point count, jitter, elevation range, edge weight.
7. **noixzy_power_diagram** — Weighted Voronoi / power diagram with radius-scaled cells. Sliders: cell count, weight variance, jitter, fill mode.
8. **noixzy_gabriel_graph** — Gabriel graph proximity network (subset of Delaunay). Sliders: node count, density, edge weight, locality.
9. **noixzy_minimum_spanning_tree** — Euclidean MST drawn on a point set with branch animation. Sliders: node count, jitter, animation speed, line weight.
10. **noixzy_convex_hull_layers** — Successive convex hulls of a shrinking point set (peeled layers). Sliders: point count, layers, jitter, color depth.

### Signal / Frequency
11. **noixzy_standing_wave_pattern** — 2D standing wave modes on a square membrane. Sliders: m mode, n mode, amplitude, decay.
12. **noixzy_wavelet_decomposition** — Multi-scale wavelet decomposition visualized as layered frequency bands. Sliders: scales, threshold, orientation, blend.
13. **noixzy_resonance_map** — Room resonance mode map: standing waves in a rectangular space. Sliders: room ratio, mode count, frequency, decay.
14. **noixzy_cymatics_nodal** — Chladni figure nodal line patterns from plate vibration modes. Sliders: m/n mode, damping, particle count, plate shape.
15. **noixzy_interference_ripple** — Circular wave interference from N sources with adjustable phase and lambda. Sliders: source count, wavelength, phase, damping.

### Material / Surface
16. **noixzy_concrete_aggregate** — Exposed aggregate concrete surface with particle inclusions and cracks. Sliders: aggregate density, crack density, texture scale, darkening.
17. **noixzy_wabi_crack_field** — Wabi-sabi inspired craquelure crack network over a surface. Sliders: crack density, branching, gap width, fill color.
18. **noixzy_oxidation_bloom** — Oxidation/rust bloom spreading from seed points on a metal surface. Sliders: bloom radius, spread rate, saturation, edge softness.
19. **noixzy_grain_slab** — Stone slab grain pattern: parallel/curved grain lines with knots. Sliders: grain density, curvature, knot count, contrast.
20. **noixzy_wood_growth_rings** — Cross-section of wood with irregular annual growth rings and ray cells. Sliders: ring count, eccentricity, roughness, ray density.

### Topological / Abstract
21. **noixzy_knot_diagram** — Mathematical knot diagrams (trefoil, figure-8, etc.) with crossing resolution. Sliders: knot type, crossings, strand weight, color.
22. **noixzy_genus_surface** — Topological genus-n surface (torus, pretzel) as wireframe projection. Sliders: genus, resolution, rotation, line weight.
23. **noixzy_hyperbolic_tiling** — Poincaré disk hyperbolic tiling (5-4, 7-3, etc.). Sliders: symmetry p, symmetry q, depth, line weight.
24. **noixzy_klein_bottle_cross** — Klein bottle cross-section projected as a 2D linework. Sliders: resolution, tube radius, rotation, depth.
25. **noixzy_hopf_fibration_slice** — 2D slice of the Hopf fibration showing fiber circles. Sliders: fiber count, radius, phase, color gradient.

### Ecological / Organic
26. **noixzy_root_system** — Fractal root system with depth tapering and soil layering. Sliders: root branches, depth, taper rate, soil horizon.
27. **noixzy_lichen_colony** — Lichen colony growth simulation with distinct thallus morphology. Sliders: colony count, growth rate, branching, color type.
28. **noixzy_coral_skeleton** — Coral branching skeleton (Acropora-type). Sliders: branch generations, angle variance, thickness taper, density.
29. **noixzy_pollen_grain** — Microscopic pollen grain with apertures, spines, and surface texture. Sliders: spine density, aperture count, spine length, shape.
30. **noixzy_sand_dune_field** — Aeolian sand dune field from physics — slip-face avalanching. Sliders: wind speed, sand supply, dune count, time steps.

---

## PROTOTYPE CANDIDATES CREATED

New prototype HTML files were created in two separate folders:

### Unified Shell prototypes
`workspace/unified_shell_prototypes_20260627/`
- `noixzy_proto_curl_noise_fluid.html` — curl noise fluid ribbons
- `noixzy_proto_dla_frost.html` — diffusion-limited aggregation
- `noixzy_proto_lenia_life.html` — Lenia continuous cellular life
- `noixzy_proto_voronoi_shatter.html` — cracking Voronoi with spring constraints
- `noixzy_proto_domain_marble.html` — domain-warp marble / lava

### Escrow shell prototypes
`workspace/module_escrow_20260627/candidates/` (prefixed `noixzy_proto_`)
- `noixzy_proto_delaunay_mesh_field.html`
- `noixzy_proto_standing_wave_pattern.html`
- `noixzy_proto_hyperbolic_tiling.html`
- `noixzy_proto_root_system.html`
- `noixzy_proto_cymatics_nodal.html`

---

## FILES CHANGED

None. This session does not modify existing production files.

## FILES CREATED

- `workspace/NGL_CREATIVE_DIRECTOR_REPORT_20260627.md` (this file)
- `workspace/unified_shell_prototypes_20260627/noixzy_proto_curl_noise_fluid.html`
- `workspace/unified_shell_prototypes_20260627/noixzy_proto_dla_frost.html`
- `workspace/unified_shell_prototypes_20260627/noixzy_proto_lenia_life.html`
- `workspace/unified_shell_prototypes_20260627/noixzy_proto_voronoi_shatter.html`
- `workspace/unified_shell_prototypes_20260627/noixzy_proto_domain_marble.html`
- `workspace/module_escrow_20260627/candidates/noixzy_proto_delaunay_mesh_field.html`
- `workspace/module_escrow_20260627/candidates/noixzy_proto_standing_wave_pattern.html`
- `workspace/module_escrow_20260627/candidates/noixzy_proto_hyperbolic_tiling.html`
- `workspace/module_escrow_20260627/candidates/noixzy_proto_root_system.html`
- `workspace/module_escrow_20260627/candidates/noixzy_proto_cymatics_nodal.html`

---

## RISKY TASKS DEFERRED

| Task | Risk | Reason |
|---|---|---|
| Camera Phase 2: SDF orbit radius/elevation on all 5 modules | Medium | sdf_raymarch has complex preset system; easy to break serialization. Must be done per-module with browser verify between each. |
| True volumetric extrude (Codex Task 1) | High | Requires `sampleField` + `renderHeightfield` in `build_lab.js` — large template change. One bad tag breaks all 9 generated modules. |
| Physics wiring into particle positions | High | Requires per-module integration; different for every simulation type. Cannot be done as a shared CSS pass. |
| Escrow shell sidebar virtualization | Medium | Requires rewriting the sidebar render loop. Risk of breaking module click handler. |
| Promoting escrow candidates to production | High | Requires build_lab.js integration or hand-authoring, contact_sheet thumbnail, manifest update. Multi-step, must be done with browser verify. |
| Audio-reactive mode | High | Web Audio FFT plumbing + cross-module param mapping. Codex stretch — entire separate session. |
| Loop/WebM export | Medium | MediaRecorder API works but loop period detection is per-module. |

---

## FINAL DELEGATION RECOMMENDATIONS

### Immediate — safe to delegate now

1. **Camera Phase 1: cx/cy in build_lab.js** — 3-line change, all 9 generated modules get pan. Follow `CAMERA_CONTROLS_PLAN.md` exactly. Run `node build_lab.js` after. Verify in browser: flow_field first.

2. **Unified shell improvements (low-risk):** Module name labels below thumbnails, active module bottom border indicator, keyboard shortcut ‹ › nav buttons. Scope: `unified_shell.html` only. Explicit adds only in git.

3. **Escrow shell visual upgrades:** Typography fix (monospace), teal accent removal, batch section headers, search/filter input, keyboard shortcut footer. Scope: `workspace/module_escrow_20260627/escrow_shell.html` only.

4. **Escrow shell isometric ↔ perspective toggle for brutalist massing family:** Add a projection mode toggle to `noixzy_brutalist_massing.html` and its variants. Draws the same geometry in two projection modes. No external dependencies.

5. **Physics upgrade for pressure_thread_physics:** Add gravity + turbulence force accumulation (3 lines) when Experimental Physics is enabled. Scope: `workspace/module_escrow_20260627/candidates/noixzy_pressure_thread_physics.html` only.

### Next session — requires browser verify between steps

6. **Camera Phase 2: gyroid orbit radius/elevation** — implement `u_dist` and `u_elev` in `gyroid/noixzy_gyroid.html`. Verify in browser. Then propagate to displacement → mandelbulb → fold → sdf_raymarch.

7. **Lenia life module development** — start from `noixzy_proto_lenia_life.html` prototype created in this session. Develop into a production-quality module. Lenia is the highest-impact new module concept.

8. **DLA frost module development** — start from `noixzy_proto_dla_frost.html`. DLA is highly noixzy: frost/coral/lightning visual language, clean single algorithm, audio-reactive-friendly.

### Full session — complex, requires sustained context

9. **True volumetric extrude (Codex Task 1)** — full spec in `CODEX_TASK_volumetric_extrude.md`. Must be done in full before Tasks 2 and 5.

10. **Theme system (Codex Task 7)** — full spec in `CODEX_TASK_theme_system.md`. Can be done alongside Task 6 (default looks pass).

11. **Audio-reactive mode** — start with Web Audio AnalyserNode plumbing. Wire to `chladni_plate` or `wave_sand_interference` first (both are audio-native by design). Then propagate mapping to other modules.

---

_Report authored: 2026-06-27 — Creative Director pass_
_Do not redo completed work from the randomization/geometry audit pass._
_Preserve lowercase noixzy naming throughout._
