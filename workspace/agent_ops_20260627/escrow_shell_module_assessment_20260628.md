# Escrow Shell Module Assessment
**Date:** 2026-06-28  
**Assessment type:** Read-only triage. No code was modified.  
**Scope:** `workspace/module_escrow_20260627/candidates/` — all candidate HTML files and their backing runtime JS files  
**Goal:** Geometry quality, final form quality, visual depth, production feel. Not UI chrome alignment.

---

## 1. Executive Summary

The escrow contains approximately 130 HTML candidate files. The headline figure is misleading. **Roughly 80% of these files are 1–12 line stubs** that delegate all rendering to one of eight shared JS runtime files. The actual implementation lives in those runtimes. This changes the assessment entirely.

The productive question is not "which modules are ready?" — it is "which runtime architectures have the geometry quality that belongs in the Unified Shell, and which do not?"

**The answer is stark:**

- **One runtime class has genuine 3D geometry:** the `brutalist_massing` family. It uses a real `isoPoint(x,y,z,cfg)` projection with back-to-front painter's algorithm, full 8-vertex box geometry, shadow casting, and inset/bevel detail. This is the only escrow class that generates forms with actual spatial volume.
- **Two runtimes have substantial algorithm implementations:** `noixzy_candidate_runtime.js` (1487 lines, 22 modules) and `noixzy_batch_13_runtime.js` (408 lines, 10 architectural systems modules). These are worth scrutiny.
- **Three batch runtimes are placeholder-class code:** batches 14, 15, and 16 average 51–116 lines for 10 modules each. That is 5–12 lines of render logic per module. These produce geometric sketches, not production outputs.
- **The Cosmos Quick runtime** operates from a single draw function branched across 10 modes, all sharing six identical controls. All 10 are uniformly thin.

**Immediate recommendation:** The escrow count should be understood as ~20 real candidates. The remaining ~110 are seeds, not modules.

---

## 2. Escrow Shell State

### Shell infrastructure
The `escrow_shell.html` uses `ui-monospace` fonts (upgraded to match Unified Shell), a 300px sidebar, dark-on-dark panel aesthetic, and a search input. This is the correct aesthetic direction.

### What it lacks vs Unified Shell
- No thumbnail display in sidebar (module entries are text only)
- No Template A control IDs — bridge actions (pause, reset, newSeed, randomForm, randomColor, randomAll, save) are not wired
- No SHARED params (`zoom`, `rot`, `mirror`, `cx`, `cy`, `metallic`, `rough`, `sheen`, etc.) — each runtime defines its own independent param set
- No `heightField()` interface — none of the 130 candidates produce a `Float32Array` for `renderHeightfield()`
- Panel layout incompatibility — escrow modules use a right-side `<aside>` that is incompatible with the Phase 1C GEOMETRY_ONLY_MODE fix (that fix only applied to modules loaded inside Unified Shell via iframe)
- No `_edgeMask()` calls — height-based extrusion would need this added during promotion

### Runtime architecture summary

| Runtime file | Modules | Lines | Lines/module | Architecture class |
|---|---|---|---|---|
| `noixzy_candidate_runtime.js` | 22 | 1487 | 68 | Algorithm runtime |
| `noixzy_batch_13_runtime.js` | 10 | 408 | 41 | Architectural 2D |
| `noixzy_batch_12_runtime.js` | 10 | 386 | 39 | Architectural 2D |
| `noixzy_cosmos_quick_runtime.js` | 10 | 214 | 21 | Shared mode runtime |
| `noixzy_batch_11_runtime.js` | 10 | 174 | 17 | Nano-Zen 2D |
| `noixzy_batch_12_math_runtime.js` | 10 | 130 | 13 | Math/simulation |
| `noixzy_batch_14_unexplored_runtime.js` | 10 | 116 | 12 | Unexplored sketch |
| `noixzy_batch_15_generated_runtime.js` | 10 | 51 | 5 | Placeholder |
| `noixzy_batch_16_generated_runtime.js` | 10 | 51 | 5 | Placeholder |
| Standalone HTML modules | 18 | 516–623 | — | Standalone |

The 18 standalone HTML files are entirely self-contained (516–623 lines each). All 18 are architectural: the `brutalist_massing` family (13 variants), `concrete_relief`, `modernist_facade`, `parametric_shell`, `entropy_mask_field`, and `structural_grid`.

---

## 3. Strongest Candidate Modules

These are the modules with the best geometry, deepest spatial form, and strongest production-readiness relative to the quality bar of the Unified Shell.

### 3.1 `noixzy_brutalist_massing.html` — Tier 1 (Promote After Interface Work)

**Why it leads:** This is the only escrow module with a genuine 3D spatial model. It uses `isoPoint(x,y,z,cfg)` — a configurable isometric projection with real x/y/z coordinates. Buildings are rendered as full 8-vertex boxes:

```
p000/p001/p010/p011/p100/p101/p110/p111
```

Faces are composited with per-face shading (top face lighter, right face shadow-offset). Shadow projection uses a correct directional bias. Inset details (window reveals, bevel cuts, recessed planes) are added as separate geometry above the roofline. The painter's algorithm is implicit in generation order (back-to-front z-sort).

**Controls are substantial:** slabs, void ratio, perspective, shadow strength, extrude, cantilever depth, and erosion. Randomization hits the extrude/depth/height biases correctly.

**Weakness:** The 13 variants (asymmetric, cantilever, chambers, cluster, folded, linear, mat, megaform, modular, slabs, split, towers) are nearly identical systems. Most are differentiated only by massing layout rules, not renderer quality. **Promote 3 variants, archive 10.**

---

### 3.2 `noixzy_brutalist_massing_towers.html` — Tier 1 (Distinct Vertical Form)

Generates tall vertical stacks rather than horizontal mat typologies. The vertical emphasis produces a meaningfully different silhouette. Towers with setbacks and bridging elements. Distinct from base variant.

---

### 3.3 `noixzy_brutalist_massing_cantilever.html` — Tier 1 (Spatial Tension)

Uses cantilever logic to generate hovering masses with overhang depth. The spatial tension of unsupported volumes makes this visually distinct. The overhang geometry is solved correctly with floating boxes above the ground plane.

---

### 3.4 `noixzy_concrete_relief.html` — Tier 2 (Strong Visual, Needs Depth Upgrade)

Uses `ctx.shadowColor`, `shadowBlur`, `shadowOffsetX` to produce bas-relief depth. Not genuine 3D, but the shadow-based illusion reads as convincing material depth — textured concrete panels with cast shadows. The aesthetic is consistent with the noixzy material language (rough=high, graphite base). Needs: heightField replacement for the shadow-depth approach before promotion.

---

### 3.5 `noixzy_structural_grid.html` — Tier 2 (Real Isometric Grid)

Uses `isoPoint()` for a 3D structural lattice. Generates horizontal floor plates, vertical columns, and diagonal braces in correct isometric space. The z-coordinate system and depth ordering are properly implemented. Strength: the structural logic produces clean geometric authority. Weakness: the output can read as diagrammatic rather than visceral — needs material finish (stroke weight hierarchy, glow on key members) before gallery promotion.

---

### 3.6 `noixzy_parametric_shell.html` — Tier 2 (Surface Geometry with Depth Sort)

Has a genuine z-coordinate computed per surface point (`pu*pu - pv*pv` curve factor). Uses a painter's sort: faces are computed and depth-sorted before drawing. The resulting surfaces have genuine sculptural curvature. Weakness: the render is incomplete — edge artifacts visible at fold transitions, no material finish on face faces. Needs renderer polish before promotion.

---

### 3.7 Clifford Attractor Loom (`batch_16: clifford`) — Tier 2 (Correct Attractor Math)

The Clifford map is implemented correctly: `nx = sin(a*y) + c*cos(a*x)`, `ny = sin(b*x) + d*cos(b*y)`. With up to 18,000 points per render and exposure-based accumulation (`rgba(255,255,255,.03)`), this produces genuine luminous attractor portraits. The chaotic structure gives it visual depth that line-based modules lack. Weakness: it's a flat point scatter with no extrusion. A heightfield pass over the density grid would make this a flagship candidate.

---

### 3.8 Chladni Plate (`candidate_runtime: chladni_plate`) — Tier 2 (Unique Physics Geometry)

Chladni nodal lines are generated by particle rejection sampling: particles that land on a nodal line (where `sin(m*π*x)*sin(n*π*y) ≈ 0`) are accumulated. This is the correct algorithm. The resulting patterns are visually authoritative, with strong symmetry and organic node branching. This geometry type does not exist anywhere in the current Unified Shell. Unique value: strong.

---

### 3.9 Miura Fold (`batch_15: miura`) — Tier 2 (Clean Fold Mathematics)

The `rect3()` function in the batch 15/16 runtime computes a 3-face isometric box directly from (x, y, w, h, depth) — top face bright, right face shadow, front face mid. The miura module uses this to render fold tessellations with alternating mountain/valley depth. The fold angle and skew controls produce genuine geometric variation. Weakness: the rect3 helper is very lightweight (no vertex sorting, no painter's algorithm) so complex fold overlaps produce incorrect draw order.

---

### 3.10 Strange Attractor Dust (`batch_12_math: strange_attractor`) — Tier 2

Clifford and de Jong attractors with proper per-point iteration. The visual output has the luminous density that distinguishes attractor renders from noise fields. Same promotion path as the batch_16 clifford variant but with more preset range.

---

## 4. Weak / Redundant Modules

### 4.1 Brutalist Massing — 10 of 13 variants redundant

`asymmetric`, `chambers`, `cluster`, `folded`, `linear`, `mat`, `megaform`, `modular`, `slabs`, `split` — these are all the same isometric box renderer with minor layout rule changes. From a viewer's perspective they are indistinguishable at a glance. Keeping all 13 in the gallery creates clutter and dilutes the brand of the genuinely strong variants.

**Recommendation:** Promote base + towers + cantilever. Archive the remaining 10.

---

### 4.2 Batch 12 Architectural (flat drawing class)

`minimal_parti`, `quiet_grid`, `white_space_field`, `load_path`, `aperture_field` — these are plan-view 2D architectural drawings: orthogonal lines, hatched zones, axonometric floor plates without real z depth. The visual output reads as technical illustration, not generative art. They lack the spatial authority of the isometric modules and the optical richness of the simulation modules.

**Recommendation:** Keep in escrow indefinitely. Only promote if upgraded with genuine isometric extrusion.

---

### 4.3 Cosmos Quick (all 10 modules)

All 10 share a single draw function branched by `mode` string, with identical 6 controls (`density`, `offset`, `void`, `line`, `depth`, `tilt`). The concepts are evocative (`calibrated_gate_relic`, `misaligned_float_scaffold`, `frosted_baffle_field`) but the implementation does not match the concept names — each is a random geometric scatter with slightly different shape logic. These read as named placeholders rather than implemented modules.

**Recommendation:** Retire all 10. Re-implement the 2–3 most interesting concepts as proper standalone modules if the concepts are worth pursuing.

---

### 4.4 Batches 15 and 16 (50 lines of runtime for 20 modules)

At 5 render lines per module, these are concept sketches that happened to be deployed. The renders are functional (they draw something) but are not gallery-quality. The batch 16 `clifford` variant is the exception — that attractor math is correct even though the surrounding shell is thin.

**Recommendation:** Archive all except `clifford`. Extract `clifford` into a standalone or promote to batch 12 math alongside `strange_attractor_dust`.

---

### 4.5 `noixzy_modernist_facade.html` — Weaker than concrete_relief

Uses `ctx.shadowColor` for depth illusion like `concrete_relief` but produces a facade drawing (window grids, balcony slabs) rather than textural depth. The output reads as architectural diagram. Weaker spatial authority than the relief module. No geometric novelty beyond `concrete_relief`.

**Recommendation:** Archive or merge concept into `concrete_relief` as a layout variant.

---

### 4.6 `noixzy_entropy_mask_field.html` — Unclear output category

This module does not clearly belong to the isometric, simulation, or pattern families. The entropy mask approach (noise-seeded field with threshold masking) produces abstract fields that overlap conceptually with `reaction_diffusion` and `flow_field` in the Unified Shell. No distinct visual identity.

**Recommendation:** Keep in escrow for a taste pass. If defaults are not gallery-worthy after one tuning session, archive.

---

## 5. Promote Later (Post-Interface Work)

These modules have geometry and concept quality worth eventual promotion, but require meaningful engineering work before they belong in the Unified Shell.

**Promotion blockers for all of them:**
1. Add `heightField(G)` returning `Float32Array(G*G)` → enables `renderHeightfield()` extrusion
2. Add `_edgeMask(out, G)` call before returning heights
3. Add SHARED params: `zoom`, `rot`, `mirror`, `cx`, `cy`, `metallic`, `rough`, `sheen`, `alpha`, `contrast`, `vig`, `grain`, `glow`, `speed`, `drift`
4. Rename controls to Template A IDs for shell bridge compatibility
5. Bind all UI in `setup()` — not `DOMContentLoaded`, not inline
6. Browser-verify defaults are gallery-worthy (not just coded)

**Priority order for promotion engineering:**
1. `brutalist_massing` (base) — strongest geometry, clearest promotion path
2. `brutalist_massing_towers` — distinct vertical silhouette
3. `brutalist_massing_cantilever` — spatial tension, unique
4. `chladni_plate` — algorithm is unique within the whole lab, not just escrow
5. `clifford` attractor — correct math, just needs heightField density pass
6. `structural_grid` — isometric lattice, needs material finish
7. `parametric_shell` — surface geometry exists, needs render completion
8. `strange_attractor_dust` — same promotion path as clifford

---

## 6. Keep in Escrow

These have real algorithmic value but need taste-direction, defaults tuning, or fuller implementation before the promotion question is meaningful.

**Batch 13 architectural systems (10 modules)**  
`courtyard_plan`, `light_well`, `mashrabiya_modern`, `poche_generator`, `threshold_map`, `screen_block`, `diagrid_tower`, `parametric_pavilion`, `street_canyon`, `panelization_solver`  
→ The underlying systems are architecturally rich. `diagrid_tower` and `street_canyon` in particular have urban-scale geometry with meaningful depth hierarchy. They need defaults tuning and material finish before promotion.

**Candidate runtime algorithmic class**  
`differential_growth`, `physarum_network`, `apollonian_packing`, `urban_voronoi`, `substrate_cracks`, `rib_vault_generator`, `wfc_tile_pressure`, `penrose_deflation`, `hilbert_plan`, `catenary_arches`, `tensegrity_web`  
→ Strong concepts but the candidate_runtime implementations approximate the real algorithms rather than implementing them. `physarum_network` is a connected graph, not an agent+diffusion simulation. `differential_growth` is wobble-based curves, not true growth integration. Worth keeping as concept seeds for proper standalone implementations.

**Nano-Zen batch 11**  
`pressure_thread_physics`, `zen_caustic_light`, `wave_sand_ripple`, `cellular_rake_pattern`  
→ Four of the ten nano-zen modules have interesting animation or optical properties. Keep as mood palette while other work proceeds.

---

## 7. Archive / Retire

Modules that do not justify the escrow maintenance cost and should be explicitly removed from the active candidate list.

- **10 brutalist massing variants** (all except base, towers, cantilever)
- **Cosmos Quick — all 10 modules** (named placeholders, not implementations)
- **Batches 15 and 16 — 19 of 20 modules** (5 render lines per module; exception: `clifford`)
- **Batch 14 unexplored — all 10 modules** (116 lines for 10 modules; `bz_reaction`, `spectral_ribbon`, `nano_kitbash` are the most interesting concepts, worth a future standalone pass but not escrow candidates)
- **`modernist_facade`** (weaker version of `concrete_relief`)
- **Batch 12 flat architectural 2D: `minimal_parti`, `quiet_grid`, `white_space_field`** (no depth, no spatial authority)
- **Proto files: `noixzy_proto_standing_wave_pattern.html`** (basic parametric standing wave, no distinct identity)
- **`noixzy_proto_hyperbolic_tiling.html`** (concept overlap with `truchet` / `penrose` in Unified Shell)

---

## 8. Geometry + Form Assessment

### What the escrow does well

The **isometric/perspective projection family** (`brutalist_massing`, `structural_grid`, `parametric_shell`) produces forms with genuine spatial authority. The `isoPoint(x,y,z,cfg)` implementation is not a canvas CSS transform trick — it computes per-vertex 2D coordinates from true 3D positions. The results have the same spatial depth register as `grid_extrude` in the Unified Shell, but in a different architectural language.

The **attractor family** (`clifford`, `strange_attractor_dust`) produces optical depth through particle accumulation — density at focal points creates a luminosity gradient that reads as Z-depth even in 2D. This is a valid depth technique.

The **shadow-based relief family** (`concrete_relief`, `modernist_facade`) uses `ctx.shadowBlur` correctly but is fundamentally a 2D depth illusion. It works at small scales and moderate detail, but breaks down in animation and at high zoom. These are not heightfield candidates without significant rework.

### What the escrow is missing

**No module has a heightField() implementation.** This is the single most significant gap relative to the Unified Shell quality bar. The `renderHeightfield()` extrusion pipeline is one of the strongest visual features in the lab — it transforms 2D noise/simulation outputs into genuine bas-relief 3D forms with isometric projection. None of the 130 escrow candidates connect to this pipeline.

**No module has spatial layering.** The Unified Shell's strongest modules (`reaction_diffusion`, `gyroid`, `mandelbulb`) produce forms with multiple spatial registers simultaneously: foreground geometry, mid-field density, background field. The escrow modules generally produce one spatial layer.

**The simulation modules are approximations.** The `physarum_network` in the candidate_runtime is a graph traversal, not a slime mold simulation. The `differential_growth` is a wobble interpolation, not a growth force integration. The form outputs of these approximations are less distinctive than true simulations would be. The Unified Shell's `reaction_diffusion` uses a real reaction-diffusion kernel — the escrow simulation modules do not reach that bar.

---

## 9. Randomization + Parameter Assessment

### What the randomization audit added

The `noixzy_randomization_geometry_audit_20260627.md` introduced control-name-aware randomization across all escrow runtimes. This was a significant improvement: before the fix, `randomize` only reseeded the RNG string without changing any slider values, meaning the visual output did not change on randomize. The fix biases density/count/geometry controls into meaningful visual ranges.

### Remaining randomization weaknesses

**Cosmos Quick:** All 10 modules share the same 6 controls (`density`, `offset`, `void`, `line`, `depth`, `tilt`). Randomization is identical for all 10. The output variety is determined entirely by the mode branch, not by parameter space.

**Batch 13 architectural systems:** The `panelization_solver` and `street_canyon` have rich control sets but the randomization bias is generic (percentage-of-range). Architectural modules benefit from constraint-based randomization — e.g., `void_ratio` should be correlated with `density`, not independently randomized.

**Brutalist massing family:** The randomization correctly biases toward extrude/depth/height but does not vary the massing typology (slab/core/bridge/void selection). A randomize pass that changed the structural system type, not just the scale parameters, would produce far more varied outputs.

### Experimental Physics checkbox

The checkbox exists in all escrow runtimes and adds `translate3d` + `scale` breathing via CSS transform on the canvas. This is correctly documented as a visual drift effect, not real physics. Rename should happen to "Drift Mode" per the conflict report (C-01 in 05_CONFLICT_REPORT.md), but this is a label fix, not a functional concern.

---

## 10. Performance Risk Assessment

| Module / Class | Risk | Reason |
|---|---|---|
| `falling_sand_microphysics` (batch_12_math) | 🔴 High | Full per-cell physics simulation per frame, no requestAnimationFrame budget management |
| `cyclic_ca_spiral_reactor` (batch_12_math) | 🔴 High | Full grid CA update per frame; no cell-budget control |
| `lenia_kernel_garden` (batch_12_math) | 🟡 Medium-High | Convolution kernel over full canvas grid; iteration control helps but baseline is expensive |
| `clifford` + `strange_attractor_dust` | 🟡 Medium | Up to 18,000 points per frame; acceptable with `requestAnimationFrame` but will tax mobile |
| `physarum_network` (candidate) | 🟡 Medium | Agent + diffusion grid; actual simulation cost is O(agents × grid) per frame |
| `differential_growth` (candidate) | 🟡 Medium | N-body distance check on growth nodes; grows worse as node count increases |
| `apollonian_packing` (candidate) | ⚪ Low-Medium | Recursive circle packing; terminates naturally at depth limit |
| Brutalist massing family | ⚪ Low | Static geometry redrawn on demand; no per-frame simulation cost |
| Batch 13 architectural systems | ⚪ Low | Static 2D drawings, no simulation |
| Batch 15/16 | ⚪ Low | Render functions are too thin to be slow |

**Key risk:** The batch_12_math modules (`falling_sand`, `cyclic_ca`) have no animation loop budget management. If promoted, they will drop frames or hang on low-power devices. Before promotion, both need a `maxCellsPerFrame` cap or a worker thread.

---

## 11. Unified Shell Alignment Assessment

### UI/panel compatibility
The escrow shell uses `body { display: grid; grid-template-columns: minmax(0,1fr) 292px }` — the same layout convention as the Unified Shell's module panels. The panel HTML structure (`.control` divs, `.head`, `<b>` value display, accent-colored range inputs) is identical in spirit.

However, the panel lives **inside the escrow module's own HTML**, not inside the Unified Shell frame. When a module is loaded into the Unified Shell via `<iframe>`, the panel becomes the iframe document's panel — and GEOMETRY_ONLY_MODE (pre-Phase 1C) hid it. Phase 1C fixed this for generated modules in the Unified Shell, but the escrow modules were not regenerated. They would need to adopt the same `body.geoOnly`-prefixed CSS pattern before loading correctly in the Unified Shell iframe.

### Control bridge compatibility
None of the escrow modules use Template A control IDs. The bridge actions (`pause`, `reset`, `newSeed`, `randomForm`, `randomColor`, `randomAll`, `save`) require specific element IDs that the escrow runtimes do not implement. A module loaded into the Unified Shell would show the bridge buttons but none would work.

### SHARED params
The Unified Shell sliders for `zoom`, `rot`, `mirror`, `cx`, `cy`, `metallic`, `rough`, `sheen`, `alpha`, `contrast`, `vig`, `grain`, `glow`, `speed`, `drift` require the loaded module to respond to those IDs. Escrow modules do not. The shell's parameter bridge would attempt to write values to nonexistent inputs and fail silently.

### The bridge gap is a known, solvable problem
This is not a conceptual mismatch — it is a wiring task. The Phase 1C architecture shows exactly how to add SHARED params and Template A IDs to a module. Every escrow module that reaches Tier 1 readiness will need this wiring pass. It is not blocking the assessment, but it is a non-trivial engineering task and should be scoped before any individual module is scheduled for promotion.

---

## 12. Recommended Escrow Improvement Strategy

The escrow system's fundamental problem is **quantity over depth**. 130 candidates sounds like a rich library, but the implementation depth per module averages 5–68 lines. The Unified Shell's weakest generated modules are 400+ lines each. Quantity creates the illusion of breadth while depth creates actual visual variety.

**The recommended strategy is concentration, not expansion.**

### Phase A: Triage and archive (no code)
1. Tag 50+ modules as archived in the escrow index (cosmos quick × 10, batches 15/16 × 19, brutalist variants × 10, modernist_facade, proto_standing_wave, proto_hyperbolic)
2. This reduces the active candidate count to ~70 — still substantial but reviewable
3. Do not delete files; tag them `[ARCHIVED]` in the escrow shell sidebar

### Phase B: Isolate the 8 geometrically strongest candidates
`brutalist_massing` (base/towers/cantilever), `concrete_relief`, `structural_grid`, `chladni_plate`, `clifford_attractor`, `strange_attractor_dust`

For each:
1. Add `heightField(G)` function computing a Float32Array from the module's geometry
2. Add `_edgeMask(out, G)` before return
3. Add SHARED params block to the module's param list
4. Rename controls to Template A IDs
5. Bind UI in `setup()`
6. Browser-verify defaults are gallery-worthy

This produces 8 fully promotion-ready candidates without touching the other 120.

### Phase C: Elevate the two simulation approximations worth fixing
`differential_growth` and `physarum_network` are visually strong concepts with algorithmically weak implementations. Rewrite them as proper standalone HTML modules (not runtime-backed stubs) with real algorithm implementations. These belong in the Unified Shell but only if the underlying algorithm is correct. A wobble-approximation of differential growth does not belong next to real reaction-diffusion.

### Phase D: Defer everything else
The remaining candidates (batch 13 architectural systems, nano-zen, batch 14 unexplored) should remain in escrow until Phase B is complete and there is bandwidth for taste-direction work. They are not blocking anything.

---

## 13. Top 10 Concrete Next Actions for Codex/Copilot

These are implementation tasks in priority order. Each is scoped to a single file or function. None of these require architectural decisions — they are execution work.

**1. Add `heightField(G)` to `noixzy_brutalist_massing.html`**  
Sample the massing z-values (block heights) into a `Float32Array(G*G)`, apply `_edgeMask(out, G)`, return. This connects the strongest escrow geometry to the `renderHeightfield()` pipeline. Estimated scope: 30 lines.

**2. Add Template A control IDs to `brutalist_massing.html`**  
Rename the control element IDs to match the Template A standard: `#pauseBtn`, `#resetBtn`, `#newSeedBtn`, `#randomFormBtn`, `#randomColorBtn`, `#randomAllBtn`, `#saveBtn`. Add SHARED params: `zoom`, `rot`, `cx`, `cy`, `metallic`, `rough`, `sheen`, `alpha`, `contrast`, `vig`, `grain`, `glow`, `speed`. Bind all sliders in `setup()`.

**3. Repeat steps 1–2 for `brutalist_massing_towers.html` and `brutalist_massing_cantilever.html`**  
Same tasks, different layout logic. The underlying isoPoint renderer is the same.

**4. Add `heightField(G)` to `noixzy_structural_grid.html`**  
The grid already has z-coordinates per structural member. Sample the height field as node heights on the grid. Apply `_edgeMask`. Connect to `renderHeightfield()`.

**5. Implement correct `differential_growth` algorithm in `noixzy_candidate_runtime.js`**  
Replace the current wobble interpolation with a true growth integration: node insertion, spring forces, collision avoidance, and growth step. Reference: Nervous System differential growth implementation pattern. This is a substantial rewrite of the `differential_growth` render function.

**6. Implement correct `physarum_network` algorithm**  
Replace the current graph traversal with a true Physarum polycephalum agent simulation: agent array with sensor angles, turn rates, diffusion grid, deposit on move, decay per frame. This gives the output organic spatial authority the current version lacks.

**7. Add `heightField(G)` to `chladni_plate`**  
The nodal amplitude function `sin(m*π*x)*sin(n*π*y)` is a continuous field — sample it directly into a Float32Array. This produces a heightfield from the chladni equation, which `renderHeightfield()` can then render as extruded nodal geometry. High visual payoff for ~20 lines of code.

**8. Consolidate Clifford attractor variants**  
Extract the `clifford` module from `batch_16` into a proper standalone HTML file. The attractor render is the only high-quality output in that batch. Build a density grid: accumulate point hits into a `Float32Array(G*G)`, normalize, apply `_edgeMask`, return as `heightField()`. This makes the attractor promotable via the standard extrusion pipeline.

**9. Rename `Experimental Physics` checkbox to `Drift Mode` across all runtimes**  
Batch find/replace in all 8 runtime JS files. This resolves conflict C-01 from `05_CONFLICT_REPORT.md`. No logic changes — label only.

**10. Tag archived modules in escrow shell sidebar**  
Add an `archived: true` flag to the module objects for all 50+ archive-tier entries in each runtime. The escrow shell can then filter/dim these. This makes the escrow browsable without deleting anything.

---

## 14. What Not To Do

**Do not promote runtime-backed stubs directly.**  
Promoting a 2-line stub HTML file that points to `noixzy_batch_15_generated_runtime.js` to the Unified Shell is not a valid path. The module architecture is fundamentally incompatible with the Unified Shell's module contract. Every promoted module must be a standalone HTML file with `heightField()`, SHARED params, and Template A IDs.

**Do not rewrite all 130 modules at once.**  
The correct move is deep work on 8 modules, not shallow wiring of 130. The escrow's core problem is insufficient implementation depth. Adding interface wiring to a 5-line render function produces a polished empty shell. Geometry first, interface second.

**Do not keep all 13 brutalist massing variants.**  
The visual redundancy undermines the gallery experience. 13 modules that produce nearly identical isometric block fields dilutes the perceived range of the lab. Three strong variants are more compelling than thirteen similar ones.

**Do not implement "Experimental Physics" as real physics.**  
The CSS transform drift behavior is appropriate for the escrow's purpose: a gestural vitality hint. Implementing real force accumulation at the canvas level (as opposed to per-module particle physics) creates a maintenance burden with no visual payoff over the current CSS approach. Per-module physics belongs in the specific modules that warrant it (`pressure_thread_physics`, `falling_sand`).

**Do not add audio reactivity to escrow modules before SHARED params are wired.**  
The audio reactive mapping contract (MS-05 in `06_MISSING_STANDARDS.md`) depends on the SHARED params existing as named inputs. Adding audio to a module without SHARED params creates a parallel mapping scheme that will need to be refactored. Do the params pass first.

**Do not deploy batches 15 and 16 to the gallery.**  
These are concept sketches at 5 lines per module. They exist as a speculative ideation record, not as production candidates. The one exception — the `clifford` attractor in batch 16 — should be extracted and given a proper standalone implementation.

**Do not create more batch runtimes.**  
The batch runtime architecture (10 modules sharing one JS file) was useful for rapid concept seeding. That phase is over. Further expansion should happen via proper standalone modules or by promoting existing escrow candidates. Adding a batch 17 or 18 increases the triage burden without adding geometry quality.

---

## Appendix: Module Count by Implementation Class

| Class | Count | Notes |
|---|---|---|
| Standalone HTML (fully implemented) | 18 | Brutalist family × 13 + 5 others |
| Candidate runtime (22 in `noixzy_candidate_runtime.js`) | 22 | 2-line HTML stubs |
| Batch 11 nano-zen (10 in `batch_11_runtime.js`) | 10 | 2-line HTML stubs |
| Batch 12 architectural (10 in `batch_12_runtime.js`) | 10 | 2-line HTML stubs |
| Batch 12 math (10 in `batch_12_math_runtime.js`) | 10 | 2-line HTML stubs |
| Batch 13 architectural systems (10 in `batch_13_runtime.js`) | 10 | 2-line HTML stubs |
| Batch 14 unexplored (10 in `batch_14_runtime.js`) | 10 | 2-line HTML stubs |
| Batch 15 generated (10 in `batch_15_runtime.js`) | 10 | 2-line HTML stubs |
| Batch 16 generated (10 in `batch_16_runtime.js`) | 10 | 2-line HTML stubs |
| Cosmos Quick (10 in `noixzy_cosmos_quick_runtime.js`) | 10 | 1-line HTML stubs |
| Proto files (partial standalone implementations) | 5 | 163–237 lines each |
| **Total** | **125** | **~20 real candidates** |

---

*Assessment complete. No files were modified. No code was written. This is a read-only triage.*
