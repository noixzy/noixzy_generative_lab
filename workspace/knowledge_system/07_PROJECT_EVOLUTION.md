# 07 — Project Evolution
# noixzy Generative Lab — A History of How the Project Became What It Is

> This document is a retrospective, not a changelog.
> It is written for someone joining the project a year from now — someone who wants
> to understand not just what exists, but why, and what it cost to get here.
> Read it once before reading any other document in the workspace.

---

## 1. Origins

The noixzy Generative Lab did not begin as a software project. It began as a production
problem.

The artist behind it — noixzy, a generative artist — was already producing work in Blender.
The gap was in the ideation and sourcing stage: there was no fast, hands-on way to generate
visual raw material that could feed into 3D scenes, music visuals, displacement textures, and
scatter fields. The kinds of things that take an hour to tune in a node editor could be
explored in minutes if there was a small, dedicated lab for it.

The earliest documented vision (`OVERVIEW.md`, 2026-06-23) is exact on this point:
*"You wanted a small, practical lab for making algorithmic art — things that can later become
Blender scenes, music visuals, stills, textures, or references. Not a big app, not a new
brand. Just a set of strong little visual machines you can play with and pull from."*

Three decisions were baked into this vision from the start, and they have never been revisited:

1. **Self-contained files.** Every module would be a single HTML file that opens by double-click.
No server, no build step, no npm. The friction between "want to see this" and "seeing it" had
to be zero.

2. **Production orientation.** The lab is a feeder, not a destination. Patterns made in the
browser become displacement maps in Blender. Voronoi cells become scatter fields. SDF blobs
rebuild as metaballs. The lab is the sourcing stage; 3D and video are where the output lands.

3. **Authored aesthetic.** The whole set would feel like one thing — dark, moody,
graphite-forward. Not a demonstration of algorithmic variety, but the expression of a single
visual sensibility. This was a creative line that would shape every technical decision
that followed.

The first module to feel "right" was `sdf_raymarch` — smooth metaballs merging and orbiting
in a ray-marched WebGL render. It established the tone: quiet, volumetric, industrial. Everything
built after it had to belong to the same world.

---

## 2. Stage-by-Stage Evolution

### Stage 0 — The Small Lab (11 modules, one generator)

The first stable state of the lab, documented in `READ_FIRST.md` and `HANDOFF.md` (both dated
2026-06-23), was 11 modules:

**Two flagships, hand-authored:**
- `grid_extrude` — isometric 2.5D extruded blocks; the most complete module, the reference
  for the full control stack
- `sdf_raymarch` — ray-marched metaballs; the emotional origin of the project

**Nine engine modules, generated from one source (`build_lab.js`):**
`flow_field`, `reaction_diffusion`, `voronoi`, `contour_field`, `truchet`, `l_system`,
`cellular_erosion`, `recursive_grid`, `sdf`

The generator was the central architectural achievement of this stage. By having one template
that produced all nine engine modules, the project ensured that every shared feature — the
material group, the look group, the motion group, the full-bleed translucent panel, the
palette system, the pin/favorites system, PNG export — appeared everywhere at once. When
something needed to change, it changed once. This was the decision that made growth without
chaos possible.

Every module shared the same controls, grouped identically: `system`, `material`, `depth`,
`frame`, `look`, `motion`. The palette was 10 moody presets. The panel floated semi-transparent
over the full-bleed canvas. Press `h` to hide.

The Blender pipeline was already proven end-to-end at this stage: `reaction_diffusion` and
`cellular_erosion` feeding displacement maps, `voronoi` feeding scatter points, `sdf` blobs
becoming Blender metaballs via the same smooth-union (`smin`) operation used in the shader.
Two Blender project files existed: `PROJ_LabToBlend_v01.blend` and `PROJ_SDFForm_v01.blend`.

**What was honest about this stage:** `HANDOFF.md` explicitly documented that the "extrude"
on full-coverage field modules was a subtle depth illusion, not genuine geometry. True
volumetric extrude was named as the next build. The project did not pretend to more geometry
than it had.

---

### Stage 1 — The SDF Expansion (15 → 22 modules)

Between the Stage 0 baseline and 2026-06-24, the hand-authored flagship family grew
substantially. `CHATGPT_BRIEF.md` captures an intermediate state with 15 modules: the
original 9 generated modules plus 6 hand-authored flagships (grid_extrude, sdf_raymarch,
gyroid, displacement, mandelbulb, fold).

Each new flagship pushed the genuine-3D geometry register further:
- `gyroid` — a triply-periodic minimal surface rendered as a WebGL SDF
- `displacement` — FBM-displaced sphere, real vertex geometry
- `mandelbulb` — power-N 3D fractal, sphere-march with orbit trap
- `fold` — Sierpinski IFS, kaleidoscopic folds

The pattern was consistent: each new SDF module was a complete, authored GLSL raymarcher with
an orbit camera, AO, diffuse/specular/rim lighting, and the same visual language as the
originals. They were not proof-of-concept sketches. They were finished instruments.

On 2026-06-24, four new standalone modules were added simultaneously: `hex_grid`, `rose_curve`,
`lissajous_mesh`, and `torus_knot`. These diversified the module family into curve geometry:
- `hex_grid` — isometric cell extrude, each face shaded independently
- `rose_curve` — mathematical rose curves with layered z-depth
- `lissajous_mesh` — Lissajous curves rendered as a 3D mesh
- `torus_knot` — GLSL SDF tube-around-parametric-curve, true WebGL geometry

The `SESSION_BRIDGE.md` log for 2026-06-24 reads like a quick expansion week: four modules added,
the `ALL_MODULES` array updated to 22 entries across all modules simultaneously, gallery and
`build_lab.js` updated.

On 2026-06-25, `metafluid` was committed — a GLSL SDF raymarcher with 32 spheres, AO,
diffuse/rim/specular/fresnel/SSS, and polynomial `smin` blob merging. This brought the GLSL
SDF flagship count to 8 and the total module count to 23.

**What the session log revealed about Stage 1:** The expansion was fast, and that speed had a
hidden cost. The `SESSION_BRIDGE.md` 2026-06-25 log documents discovering a stray syntax error
— `}catch(e){_captureThumb()...}` — buried inside five SDF modules (gyroid, sdf_raymarch,
displacement, displacement_primitives, mandelbulb). The defensive error handling was catching
the module's render function and silently swallowing the entire script. Nothing rendered. The
thumb didn't work. No console error. This bug was pre-existing — the modules had been broken
at some point, committed, and used in that state. It was caught only because the next session
looked carefully.

This became a hard rule: the `}catch(e)` pattern is explicitly forbidden.

---

### Stage 2 — The Unified Console (23 modules, one console layout)

The GPT_HANDOFF_2026_06_25 captures a pivotal architectural moment: the unified console layout
was prototyped inside `metafluid`, then ported to all 23 modules simultaneously — 12 via
`build_lab.js`, 11 hand-authored modules manually.

The unified console introduced:
- `stageTools` — a bottom overlay inside the stage (pin, copy, paste, audio, export, thumb,
  video rec, save PNG, save 2x, PBR maps)
- `stageThumbs` — a left vertical rail (preview history thumbnails, navigation arrows)
- `cycleLine` — palette cycle (‹ select ›) at the top of the panel
- `consoleBtns` — reset, pause, randomize, new seed
- `presetStatus` — one-line feedback area

This was the first time every module — hand-authored SDF flagships and generated engine modules
alike — had literally the same visual layout. The feature parity was now visual and structural,
not merely conceptual.

The palette count grew from 10 to 12 at some point in this period: ember, mineral, violet,
amber, graphite, cyan, acid, magenta, gold, neutral, copper, ice. Index 4 (graphite) remained
the default. This was a taste decision, not a technical one.

---

### Stage 3 — The Scale Jump (23 → 47 → 58 modules)

The most dramatic phase of the project's growth. Between the GPT_HANDOFF_2026_06_25 state and
the NGL_PLAN_06062026 architectural audit, the module count grew from 23 to 47 gallery-listed
live modules — a near-doubling — and the generated module count grew from 12 to 35+ pieces
(with `node build_lab.js` reporting `done: 46 pieces` by 2026-06-27).

New generated modules added in this period include:
`cellular_bloom`, `crater_field`, `crystal_growth`, `echo_contours`, `fractal_tiles`,
`glyph_field`, `interference_grid`, `kaleidoscope_field`, `magnetic_dust`, `moire_field`,
`neural_lattice`, `particle_orbitals`, `plasma_membrane`, `prism_moire`, `radial_noise`,
`ribbon_flow`, `signal_rain`, `signal_weave`, `spiral_lattice`, `terrain_slice`,
`topographic_rings`, `vector_scope`, `vortex_sheet`, `wave_lattice`, and more.

By the time `modules.manifest.json` was formally audited (2026-06-27), it contained 58 entries
(57 enabled). The `fold` entry had a stale reference from before the session.

This scale jump revealed structural drift. The NGL_PLAN_06062026 architectural audit identified:
- Three template generations coexisting in the codebase (Template A, B, C) with different
  control ID conventions, making reliable shell integration impossible without fallback lookups
- Gallery metadata duplicated across `gallery/index.html`, `build_lab.js`, and
  `modules.manifest.json`, already drifting (the `sdf` module was listed in two but absent from
  the third)
- Hand-authored modules with "visual feature parity" but "inconsistent internal APIs" — some
  used `PARAMS`, some used bespoke arrays, some used direct DOM IDs

The architectural audit's conclusion was clear: *"A unified shell is feasible without reducing
functionality if it uses an iframe-hosted architecture and a thin module adapter/message bridge.
The shell should not merge render engines."*

This was the recommendation that set the direction for the next stage.

---

### Stage 4 — The Unified Shell (production-quality hosting)

The concept of a unified shell predates Stage 4. `FUTURE_INSTALLMENTS.md` mentions it as a
future direction: "a single app that hosts all modules with a left rail switcher — the start of
a proper noixzy visual app." A static prototype (`noixzy_lab_shell_v1.html`) existed early.

But Stage 4 is when the shell became real.

The work documented in `NGL_UNIFIED_SHELL_HANDOFF_20260627.md` and the associated commit stack
(`470458b Add unified shell rail glow`, `f3d4258 Tune unified shell CRT rail overlay`,
`7a8bb90 Tune unified shell badge and grid`, `6937d65 Fade unified shell badge edges`) shows
a production-quality shell being polished to a definite aesthetic:

- Monochrome noir/CRT rail — no color wash, no teal, no neon
- CRT scanline texture on `.rail::after` with `@keyframes noixzyRailCrtNoise`
- Grayscale thumbnail treatment: `filter: grayscale(1) contrast(1.08) brightness(.82)`
- Logo badge with edge fade and outward wings
- Font locked to `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

The shell's interaction model was equally deliberate. Rather than building a postMessage bridge
protocol (which had been specified in `CODEX_TASK_engine_shell.md`), the implementation used
**iframe DOM access** — same-origin `file://` makes this safe and immediate. The bridge layer
tries multiple control IDs per action to accommodate all three template generations without
requiring module migration.

The `unified_shell_functionality_restoration_20260627.md` documents 756 lines of shell growing
to 1,013 after the controls pass — adding search/filter, keyboard navigation, 15 bridged control
actions, and module URL state management, all without touching a single module file.

The shell CRT aesthetic was not arbitrary decoration. It extended the project's restrained,
monochromatic visual language — the same "dark ground, open negative space, one focal accent"
discipline that governs every module — into the application layer itself. The UI became part of
the visual identity.

---

### Stage 5 — The Escrow System (100+ candidates, three tiers)

Parallel to the shell work, an escrow system emerged to manage module candidates that were not
yet ready for production.

The `workspace/module_escrow_20260627/` directory contains 100+ HTML module candidates organized
into seven runtime families and three quality tiers. The `NGL_TOTAL_AUDIT_20260627.md` documents
the scan:
- **Tier 1** (ready for promotion): brutalist massing family, modernist facade, differential
  growth, DLA frost, curl noise fluid — polished defaults, correct geometry behavior
- **Tier 2** (needs default tuning): most batch 11–14 modules — correct architecture, defaults
  need visual refinement
- **Tier 3** (needs renderer polish): falling sand, cyclic CA (high CPU), hyperbolic tiling
  (math correct, visualization needs work)

The escrow system solved a growth problem that had existed since Stage 3: how do you keep
experimenting at speed without contaminating the production modules? The answer was physical
separation. Candidates live in escrow. Promotion requires meeting explicit visual and technical
criteria.

The batch structure (Batches 11–16, Cosmos Nano Zen, various architecture families) reveals
how the ideation phase works: large thematic batches of candidates are generated, scanned,
tiered, and the strongest ones selected for eventual promotion. Most candidates never graduate.
The escrow shell exists to browse them.

---

### Stage 6 — Knowledge-Driven Development (the present)

The creation of this knowledge system (`workspace/knowledge_system/`) marks the beginning of
Stage 6 — though its significance may not be obvious as a technical event.

Every stage up to this point produced code, modules, shells, and handoff documents. Stage 6
produces the codification of what was learned. It is not a refactor. It is not a feature. It
is the project pausing to answer the question: *what do we actually know that we should never
have to re-derive?*

The answer spans six documents covering engineering standards, visual language, project
philosophy, conflicts, missing standards, and now this evolution document. These are not
summaries — they are the standards themselves. Future AI agents working on this project can
read them and immediately operate within established patterns, without inferring rules from
observed behavior or reconstructing design intent from scattered comments.

This stage also marks a shift in the nature of the project. Stage 6 is the first stage that
is primarily about *understanding* the project, not building it. That kind of pause only
happens when something has grown complex enough to require it.

---

## 3. Architectural Evolution

### The Generator Contract

The single most important architectural decision in the project's history is the
generator/artifact split: `build_lab.js` is the source of truth for all engine modules;
the generated HTML is the output, never edited by hand.

This decision was made in Stage 0, but its importance only compounds over time. By Stage 3,
the generator was producing 46 pieces from a single shared template. Without this contract,
46 independent module files would have diverged in every direction — different control groups,
different naming, different bugs, different features. The generator was the only thing that
made it possible to add a feature once and have it appear everywhere.

The contract has two boundaries. On the generator side: anything that affects all modules
goes into `build_lab.js`. On the flagship side: hand-authored modules are edited directly.
Shared features go into the engine first, then replicate into flagships. This is the direction
of knowledge flow — engine → flagships, never the reverse.

### Module Anatomy Stabilization

Early modules were less formally structured. Over time, a stable anatomy emerged for generated
modules: `build()` (compute state from seed + params), `render(g, pal)` (draw into a p5.Graphics
buffer), and optionally `heightField(G)` (return a `Float32Array(G*G)` of normalized heights).

The `pal` shape — `[[r,g,b] bg, [r,g,b] accent, [r,g,b] ink]` — was established early and
never changed. The `P` object (live params, always accessed via `P.key`), the `dirty` flag,
and `animT` (seconds elapsed) form the minimal state contract that all engine modules share.

The SHARED params array — `zoom`, `rot`, `mirror`, `cx`, `cy`, `metallic`, `rough`, `sheen`,
`alpha`, `contrast`, `vig`, `grain`, `glow`, `speed`, `drift` — grew over time as features
were added to the engine. Each addition was a one-shot change: add to SHARED, regenerate, done.

### The UI Binding Discovery

One of the earliest production bugs became one of the most permanent rules. At some point in
development, UI controls were bound in `DOMContentLoaded` instead of `setup()`. The controls
silently stopped responding. There was no error. The module appeared to load correctly. Only
careful testing revealed that the p5.js `setup()` lifecycle had not yet run when `DOMContentLoaded`
fired, so the controls had no state to bind to.

The fix was a one-line change. The rule became non-negotiable: all UI binds in `setup()`. It
is repeated in every handoff document because it has burned the project before and would burn
it again without the warning.

### The Three-Template Problem

By Stage 3, the module family had grown through multiple development sessions, and no formal
control ID standard had been maintained. The NGL_PLAN_06062026 audit found three distinct
template generations:
- **Template A** (47 modules): `save`, `save2x`, `thumb`, `rec`, `pause`, `reset`, `newSeed`,
  `randomAll`, `randomForm`, `randomColor`, `btnTransparentBg`, `btnUndo`, `btnRedo`
- **Template B** (1 module: grid_extrude): `btnSave2`, `btnSave2x2`, `btnThumb2`, `btnRec2`,
  `btnNewSeed`, `btnUndo`, `btnRedo`
- **Template C** (8–9 modules): `btnSave`, `btnSave2x`, `btnThumb`, `btnRec`, `btnCopy`, `btnPaste`

This was a direct consequence of growth outpacing standardization. The unified shell's bridge
layer handles it gracefully by trying IDs in priority order, but the underlying divergence
remains. The project recognized that migration toward Template A should happen module by module,
not as a big-bang refactor.

### The Manifest as Registry

The `modules.manifest.json` file grew into the canonical module registry as the shell needed a
stable index of what existed. But it was always one of three sources of truth (the others being
`gallery/index.html` and `build_lab.js`'s PIECES array), and all three drift independently.

The `sdf` module — one of the original 11 — illustrates the problem: it exists as a generated
module, was listed in the original `HANDOFF.md`, is produced by `build_lab.js`, but was found
absent from the gallery during the Stage 3 audit. Three years of parallel metadata maintenance
had produced a gap.

Consolidating to a single manifest consumed by all three systems is recognized as future work.
It has not been done.

### The Extrude Honesty Moment

One of the most architecturally honest decisions in the project's history was the explicit
classification of genuine-3D vs 2.5D illusion modules in the 2026-06-27 total audit.

The audit produced a table:
- Grid extrude: YES — canvas 2D stacked rect layers, real z-projection
- SDF modules: YES — genuine WebGL raymarching
- Everything else: 2.5D illusion — depth through shading, line weight, perspective

This was not damning — 2.5D depth illusion is legitimate art-making and produces beautiful
output. But the audit forced the project to stop calling the stamp-offset "extrude" without
qualification. The slider exists; it should be renamed "relief" when the genuine heightfield
renderer eventually replaces it. Until then, agents working on the project know what they are
actually working with.

---

## 4. Creative Evolution

### The Aesthetic Core

The visual language of the lab was established in the first session and has not fundamentally
changed. Dark ground, mid field, small bright focal. Orange accent `#ed5700` against graphite.
Restrained, moody. Never "tech guy in a cinematic room."

What has changed is depth — how many different ways the lab expresses this language. In Stage 0,
the vocabulary was nine field/simulation modules plus two geometric flagship pieces. By Stage 5,
it includes genuine 3D fractal surfaces, gyroid minimal surfaces, torus knots, lissajous meshes,
brutalist architectural forms, modernist facades, Japanese-influenced ink simulations, physarum
networks, and Chladni figures.

The language grew, but the grammar stayed the same.

### The Geometry Registers

The project's creative vocabulary divides naturally into three registers:

**Field-based simulation:** reaction_diffusion, voronoi, flow_field, contour_field, cellular
erosion, physarum, lenia — these are generative processes observed from above. Their beauty
is in emergence. Controlled by feed rates, diffusion coefficients, agent behaviors.

**Mathematical structure:** truchet tiling, hex grids, rose curves, lissajous meshes, Penrose
deflation, quasicrystal lattices, superformula shells — these are equations made visible.
Orderly, geometric, often bilateral or radial. The parameter space is the mathematical space
of the underlying equation.

**Volumetric form:** the SDF/WebGL flagship family (sdf_raymarch, gyroid, mandelbulb, fold,
metafluid, torus_knot) — these are three-dimensional objects illuminated in space. The visual
vocabulary is the vocabulary of light on surfaces: ambient occlusion, specular highlights,
rim lighting, fresnel response. These modules feel most like renders.

The architectural modules in the escrow system added a fourth register that had not been
formally named at Stage 0: **spatial abstraction** — modules organized around the logic of
buildings, plans, sections, and facades. Brutalist massing, modernist facades, Frank Lloyd
Wright-inspired horizontality and hearth-core compositions. These are not architectural drawings;
they are algorithmic structures that think in spatial terms.

### The Blender Connection as Creative Philosophy

The Blender pipeline is not just a technical feature — it is a statement about what the art is
for. The lab is not the final destination. It is a machine for generating raw material that is
richer, stranger, and more formally complex than anything that would be produced by starting
directly in Blender.

A reaction-diffusion field fed through `make_displacement_map.js` becomes a terrain that could
not have been hand-sculpted. A voronoi field that looked flat on screen becomes a scatter field
that seeds a Blender scene with thousands of objects in positions that carry the logic of the
original algorithm. SDF blobs rendered in a browser rebuild in Blender as metaballs because
both use `smin` — the same mathematical operation drives both representations.

This is the deepest version of what the project is doing: maintaining a continuous line between
the algorithm and the final 3D/video output, where every step is principled rather than
arbitrary.

### Architecture and Minimalism

The architectural direction — formalized in `ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md`
and the escrow batch system — represents the project's most intellectually specific creative
territory.

The four architectural style registers (minimalist, modernist, brutalist, Wright-inspired) each
have precise formal rules drawn from the actual architectural traditions they reference:
- Minimalist: negative space as a parameter, 70% empty ground at default, construction lines /
  primary lines / poche / shadow hierarchy
- Brutalist: mass, void, depth, and shadow as primary formal language — not decoration
- Wright-inspired: horizontality, hearth-core, compression-then-release spatial sequence

What is notable is that these are not "architecture-themed patterns." They are modules that
think in the actual formal logic of the traditions. The `prairie_grid` module enforces the
Wright horizontal emphasis algorithmically. The `brutalist_massing` family works in the
vocabulary of concrete and void, not the vocabulary of repeating surface patterns.

### The Japanese Influence

Several escrow modules explicitly draw from Japanese aesthetic traditions: boids_ink_current
(sumi-e ink movement), kintsugi (gold-repair fracture patterns), shodo (calligraphic stroke
velocity), torii_depth (shrine gate geometry), zen_caustic (water caustic light fields),
wave_sand (raked sand patterns), bonsai_circuit (constrained growth forms).

The Cosmos Nano Zen batch (Batch 11) treats these not as surface decoration but as distinct
compositional logics. Kintsugi operates on fracture and repair as formal principles. Shodo
treats velocity and weight as primary variables. These modules import their aesthetic rules
from the traditions they reference.

This is the visual language becoming historically literate.

---

## 5. Turning Points

### The Generator Contract (Stage 0)

The decision to have `build_lab.js` produce all engine modules rather than maintaining nine
separate HTML files was the project's single most consequential architectural choice. Every
shared feature since then — the look group, the extrude group, the pin/favorites system, the
`_edgeMask()` convention, the camera pan controls, `animT`, the `dirty` flag — landed in all
engine modules simultaneously because of this contract.

Without it, the Stage 3 module count explosion would have produced an unmaintainable collection
of slightly-different files. With it, it produced a consistent family.

### The `setup()` Rule (Stage 0–1 boundary)

The UI binding bug was a small fix with a permanent lesson. `DOMContentLoaded` was familiar
and seemingly correct. It silently killed controls. The rule — UI binds in `setup()`, always —
is now one of five non-negotiable rules listed at the top of `READ_FIRST.md`. It has been
re-stated in every handoff document since. The lesson was not that the original code was wrong;
it was that *certain patterns will silently kill the module with no error*, and those patterns
must be listed explicitly and enforced by convention.

### The `}catch(e)` Discovery (2026-06-25)

The stray `}catch(e){_captureThumb()...}` pattern is worth examining carefully because it
reveals a class of failure mode specific to this project.

The pattern was defensive: it tried to catch errors in the save flow and fall back to a thumb
capture. It was wrong in a subtle way — it closed the module's core function and attached a
catch block to something that should not have been catchable. The result was that the entire
module script silently stopped executing. Five flagship modules (gyroid, sdf_raymarch,
displacement, displacement_primitives, mandelbulb) were broken — blank canvas, no render — and
had been committed in that state.

The discovery required a careful reading of the code, not a visible failure mode. This is why
`READ_FIRST.md` states "verify in a real browser before declaring done" as a non-negotiable rule.
A clean parse is not proof. A module that does not render is not a rendering error — it may be
a syntax error producing no visible exception.

### The Unified Shell Decision (Stage 3–4 boundary)

The NGL_PLAN_06062026 architectural audit represented a choice. The module family had grown to
47 pieces. There were three options:
1. Continue maintaining standalone modules only, accept navigation fragmentation
2. Merge all modules into a single runtime (would have destroyed the standalone use case)
3. Build a shell that hosts modules in iframes (preserves both standalone and hosted use)

The audit recommended option 3 explicitly, and the reasoning was architectural: *"The shell
should not merge render engines. It should centralize navigation, toolbar, schemas, presets,
randomization, exports, audio mapping, transparency, thumbnail capture, and metadata while
preserving standalone module files."*

This was correct. The iframe approach meant every module could be used in isolation (double-click,
no server) and also hosted within the shell without modification. The two use cases did not
conflict. The shell became additive rather than replacing.

### The Geometry Honesty Audit (2026-06-27)

The explicit classification of genuine-3D vs 2.5D illusion modules was a creative turning point
more than a technical one. It forced clarity about what the project was claiming.

The `extrude` slider on field modules produces a depth illusion via stamp-offset. It was labeled
"extrude." The audit named this as misleading. The rename to "relief" has not happened at the
code level, but the understanding has — agents who read the audit know what they are working with.

This kind of honesty about what the project actually does (versus what it might appear to do) is
a maturity marker. Stage 0 was too early for this audit. Stage 4 was when it became necessary.

### The Escrow System (Stage 5)

The escrow system represents a growth model that the project had not previously had: a staging
layer between "experiment" and "production." Before the escrow system, candidates had to either
be production-ready or not built at all. After it, candidates can exist in various states of
completion, organized into tiers, browsable via the escrow shell, and promoted only when they
meet explicit criteria.

The three-tier model (tier 1 = ready, tier 2 = needs defaults, tier 3 = needs renderer polish)
gives every candidate a position in a queue rather than a binary in/out status. This is more
honest about the nature of creative development — things are rarely finished or unstarted; they
exist in gradations of readiness.

---

## 6. Dead Ends

### `DOMContentLoaded` for UI Binding

Not a dead end in the catastrophic sense — it was corrected early. But the pattern was tried,
failed silently, and became a hard prohibition. Any agent who assumes UI binding can happen
anywhere will rediscover this failure. The lesson is that p5.js lifecycle order is strict and
counterintuitive.

### The `}catch(e)` Pattern

As described above: defensive error handling that closed the wrong scope and silently killed five
flagship modules. The lesson is not "don't use try/catch" but specifically that adding a catch
block around module render code will break the module in a way that produces no error message
and no visible failure other than a blank canvas.

### `loading="lazy"` on Gallery Thumbnails

An optimization that broke in backgrounded tabs. Lazy-loaded images do not load when the page
is not visible, so thumbnails captured in background tabs (a common workflow) would simply not
appear. The rule — never use `loading="lazy"` on thumbnails — is a one-line guard against this
failure mode recurring.

### The Static Shell Prototype (`noixzy_lab_shell_v1.html`)

The first attempt at a unified shell was a static mockup. It demonstrated what the shell could
look like but was never wired to actually host modules. Multiple early documents refer to it
as "the shell prototype" or "the design reference." It still exists in the project directory
but was bypassed by the real production shell (`unified_shell.html`), which was built with
different architecture (iframe hosting instead of a static layout).

The lesson is not that prototypes are bad — the prototype clarified the aesthetic direction.
The lesson is that a visual prototype and an architectural implementation are different artifacts,
and neither should be confused for the other.

### The Three-Template Drift

The coexistence of Template A, B, and C control ID conventions was not a deliberate decision
— it was the accumulated result of development sessions where new modules were built without
consulting an ID standard that had not yet been formally written.

This is the archetype of technical debt in this project: something that appears to work fine
in isolation, but becomes a burden when a shell tries to interact with all modules uniformly.
The bridge layer's multi-ID fallback lookup is the workaround. The resolution — migrating
Template C modules to Template A IDs, one by one — is deferred but recognized.

### The Three-Source-of-Truth Problem

`gallery/index.html`, `build_lab.js` PIECES, and `modules.manifest.json` are three independent
registries that must stay synchronized. They have already drifted — the `sdf` module gap is
documented. The problem gets worse with every new module added.

The ideal resolution (one manifest consumed by all three) has been recommended but not
implemented. Until it is, every module addition requires three separate updates.

---

## 7. Emerging Principles

These are the principles that have been proven repeatedly across the project's history — not
invented in a planning session, but observed in the evidence of what worked and what did not.

**1. Edit the generator, not the output.**
Every time a generated module HTML file was hand-edited, either the edit was overwritten by the
next `node build_lab.js` run or it diverged from the other modules. The generator contract
eliminates an entire category of maintenance burden.

**2. One source of truth per layer of the system.**
The generator is the truth for engine modules. Individual HTML files are the truth for flagships.
The manifest is the truth for the module registry (or should be). When multiple sources of truth
exist for the same information, they drift. The `sdf` gallery gap is the cost.

**3. A clean parse is not proof.**
Two separate bugs — the `DOMContentLoaded` binding failure and the `}catch(e)` scope collapse —
were invisible to parsers and only caught by running the module in a real browser and observing
its behavior. The verification requirement is not bureaucratic caution; it is the only method
that detects this class of failure.

**4. Additive work prevents accumulation of invisible breakage.**
Every feature added to the project was tested against what already existed. No params were
removed. No palettes were dropped. No UI elements were silently renamed without a bridge. This
discipline is why the project at Stage 6 can still run every module from Stage 0.

**5. Self-contained files pay compound interest over time.**
The decision to make every module a single double-clickable HTML file, with no server, no npm,
and no build step, was the lowest-friction possible path at the time. Four years of new modules
have been added without that decision ever becoming a liability. CDN delivery and inline GLSL
are enough for everything the lab needs to do.

**6. Visual language must be authored, not assembled.**
Every module in the production family belongs to the same restrained aesthetic. This is not
because there is a style guide with hex codes — it is because every module was made by the same
artist with the same sensibility. The emerging principle is that algorithmic variety (which is
bottomless) is only valuable when filtered through consistent authorship. The escrow system's
tier criteria is partly a technical quality bar and partly an aesthetic fit test.

**7. Honesty about geometry registers avoids creative confusion.**
Labeling stamp-offset depth "extrude" is technically wrong and creatively misleading. The project
recognized this and named it. Modules that claim to be things they are not erode trust in the
vocabulary. When a slider says "extrude," it should produce extrusion. When it produces a
depth illusion, it should be called "relief." The distinction matters for the Blender pipeline
(you cannot export a depth illusion as a heightfield) and for creative communication.

**8. Randomization should produce keepers, not noise.**
The randomization audit (2026-06-27) revealed that early randomization was purely seed-based —
it changed the seed string but not the slider values, so every "random" variation was the same
parameters with a different noise seed. The upgrade to control-aware randomization — biasing
density/count/depth sliders into visually meaningful ranges — transformed randomization from
a shuffle into a directed exploration. The principle is: randomization should express the range
of what the module can do, not expose the flat center of its parameter space.

**9. Parameter quality beats parameter quantity.**
The standard module anatomy (4 system sliders + palette + SHARED) is a deliberate constraint.
The system sliders are the variables that most meaningfully transform the module's visual output.
More sliders do not produce more interesting outputs — they produce more complexity without more
signal. Every time a new module was designed, the question was not "what can be parameterized?"
but "what should be parameterized?"

**10. Document what is surprising, not what is obvious.**
The most valuable content in the project's workspace documents is not descriptions of what the
code does (the code does that). It is the record of what broke, why it broke, and what the rule
is now. The `DOMContentLoaded` rule, the `}catch(e)` prohibition, the `loading="lazy"` rule,
the `setup()` binding rule — these are all cases where something surprising happened and became
permanent knowledge.

---

## 8. Identity Today

The noixzy Generative Lab is an **authored visual engine** — a set of algorithmic instruments,
unified by a common aesthetic and connected to a production pipeline, that generates raw material
for noixzy's work in 3D, motion, and music visuals.

It is not a gallery platform, a tool for others, or a demonstration of algorithmic variety.
Every decision from the beginning has been made for one artist's production workflow.

What it has become is more than its parts suggest. The individual modules are interesting on
their own. But the system as a whole is something different: a set of production instruments
that share a visual vocabulary, can be driven by the same parameters and palette system, and
can feed into a real 3D and video pipeline without manual translation. The Blender connection
is proven end-to-end. The shell hosts 57 modules in a consistent interface. The escrow system
stages 100+ candidates.

More than any of its technical properties, the lab has a *voice.* The restrained, monochromatic,
graphite-forward aesthetic is not a theme or a setting — it is the author's sensibility expressed
in algorithmic form. The orange accent that appears across modules, the negative space that
prevents overcrowding, the three-value luminance discipline, the CRT/noir rail of the unified
shell — these are not design choices that could be changed without changing what the project is.

The lab is the visual engine of a creative practice. That is what it has grown into.

---

## 9. The Next Evolution

The lab's trajectory points toward three converging directions that were each present in the
earliest documents but have never fully materialized.

### The Audio Instrument

Audio-reactive mode has been called "the single biggest creative unlock" across multiple
documents, and the description is accurate. When the `AnalyserNode` drives module parameters
— bass raising `extrude`, mids controlling `density`, highs lifting `glow` — the lab stops
being a static visual machine and becomes a music-visual instrument. The pattern closes: the
same parameters that make the still beautiful would make the motion beautiful when driven by the
track.

Chladni figures (`chladni_plate`) represent the most philosophically complete version of this:
the resonant frequency of the plate physically shapes the pattern. The sound *is* the image.
Audio-reactive mode at this level is not a feature — it is a different artistic medium.

The architecture for this is ready. The modules have the parameters. The engine has the `animT`
time variable. The missing piece is the Web Audio bridge and the per-module band mappings that
translate frequency bands into meaningful visual changes for each module's specific logic.

### The Blender Bridge Closed

The current pipeline requires manual steps: export PNG from browser, import to Blender, apply
as texture. The Blender bridge — a module that writes a structured JSON (seed, params, sampled
heightfield, scatter points, palette) and a Blender Python/Geo-Nodes script that rebuilds it
in 3D — closes this loop.

When this exists, the lab workflow changes: design the form in the browser, click export, and
it rebuilds in 3D without any manual translation. The algorithms that currently live in the
browser would have Blender counterparts that speak the same language. The `smin` coefficient
that drives the SDF shader would drive the Blender metaballs. The `heightField()` output would
drive the displacement modifier.

The Blender connection is not incidental to the project — it is the production pipeline the
lab was built to feed. Closing it is the completion of the original vision.

### The Living Module Library

The escrow system stages 100+ candidates, and the production family has 57+ modules. The library
is already large enough that navigation, discoverability, and quality consistency are real
concerns. The next stage of the library is not more modules — it is better organization and
sharper promotion criteria.

A formal module manifest schema (proposed in `06_MISSING_STANDARDS.md`) with capability flags,
tier status, and tags would make the library navigable by visual type, technique, production
use, and quality tier. The gallery would become a genuine catalog rather than a flat list.

What the next evolution looks like, taken together, is a **creative operating system**: a single
application that generates visual material across every technique the project has mastered,
driven by music or by hand, exportable directly into 3D, browsable by visual type, and
organized by a consistent aesthetic intelligence. The individual modules are already there. The
infrastructure is mostly there. The missing piece is the connective tissue that makes it feel
like one instrument rather than a collection of tools.

---

## 10. Reflection

The noixzy Generative Lab has matured in a way that is rare in personal creative projects: it
has grown without losing coherence.

This is not obvious or automatic. Most creative software projects that grow at this speed — from
11 modules to 57+ in roughly the span between the original handoff and the current state —
become incoherent. Features accumulate without a consistent logic. Different conventions persist
in different parts of the codebase. The aesthetic drifts as new influences are incorporated
without a clear editorial voice.

The lab avoided this because several things were true simultaneously: the generator contract
prevented drift in the engine modules; the aesthetic principle ("dark ground, mid field, bright
focal; authored, not assembled") was held consistently; the additive work rule prevented
regressions; and the documentation discipline — unusual in a personal creative project — kept
the accumulated knowledge accessible between sessions and across different AI agents.

The knowledge system this document belongs to is itself a sign of maturity. It is the project
saying: we know enough now that we should write it down, not for publication, but for the
project itself — so that what was learned in one session is available in the next, so that
hard-won rules about UI binding and error handling don't have to be rediscovered, so that the
creative principles that make the work feel authored rather than generated are as explicit as
the technical contracts.

What has emerged is an architecture that is genuinely elegant: one generator for the engine,
individual files for the flagships, a shell that hosts both without merging them, an escrow
system for candidates, a manifest for the registry, and a knowledge system for the accumulated
wisdom. Every layer has a clear purpose and a clear boundary.

What has also emerged is a visual language that is genuinely distinct: the three-value luminance
structure, the palette discipline, the negative space principle, the CRT/noir shell aesthetic,
the architectural spatial logic of the newest escrow modules. These are not random aesthetic
choices — they are the expression of a particular creative sensibility worked out across dozens
of algorithmic instruments.

The project began as a small lab for making visual raw material. It has become something more
precise: a rigorous, authored, production-connected creative engine with its own language, its
own rules, and its own history. That history is what this document records.

---

*Sources: `READ_FIRST.md`, `OVERVIEW.md`, `HANDOFF.md`, `SESSION_BRIDGE.md`,
`CHATGPT_BRIEF.md`, `GPT_HANDOFF_2026_06_25.md`, `NGL_PLAN_06062026.md`,
`NGL_TOTAL_AUDIT_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`,
`NGL_UNIFIED_SHELL_HANDOFF_20260627.md`, `unified_shell_functionality_restoration_20260627.md`,
`IDEAS_module_expansion.md`, `EXPANSION_V2.md`, `ALGORITHMIC_ARCHITECTURAL_ART.md`,
`ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md`, `FUTURE_INSTALLMENTS.md`,
`CODEX_QUEUE.md`, `noixzy_randomization_geometry_audit_20260627.md`,
`workspace/knowledge_system/01_KNOWLEDGE_INDEX.md` through
`workspace/knowledge_system/06_MISSING_STANDARDS.md`*
