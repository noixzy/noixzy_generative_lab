# 02 — Project Philosophy
# noixzy Generative Lab — Purpose, Vision, Creative & Production Philosophy

---

## 1. Purpose

The noixzy Generative Lab is a **personal production instrument**, not a public app or a
gallery platform. It exists to feed real output: Blender scenes, music visuals, stills,
textures, displacement maps, and scatter fields that enter the noixzy body of work.

Every module is a "visual machine" — a small, contained algorithm that produces a pattern,
responds to parameters, and can be interrogated for its visual properties. The lab is the
thinking and sourcing stage; Blender and video are where the output lands.

*Sources: `OVERVIEW.md`, `HANDOFF.md`, `READ_FIRST.md`*

---

## 2. Long-Term Vision

### The direction in one sentence
A single, authored visual engine that generates the full range of noixzy's generative
language — field-based, architectural, simulation-based, and SDF-based — and feeds
every production format directly.

### Concrete targets named in the documents

- **Unified engine shell** — one app, all modules, consistent controls, theme shared across
  all of them, navigable from a left rail. The shell hosts modules in iframes; modules remain
  double-clickable standalone. This is "the proper noixzy visual app." (*`OVERVIEW.md`,
  `CODEX_TASK_engine_shell.md`, `NGL_PLAN_06062026.md`*)

- **Audio-reactive mode** — Web Audio FFT drives module params (bass→height/extrude,
  mids→density, highs→glow). The lab becomes the music-visuals instrument. Described as
  "the single biggest creative unlock" throughout multiple documents. (*`IDEAS_module_expansion.md`,
  `FUTURE_INSTALLMENTS.md`, `CODEX_QUEUE.md`*)

- **Blender bridge** — a module writes a small JSON (seed + params + sampled field);
  a Blender Python / Geo-Nodes script rebuilds it in 3D without manual PNG export.
  (*`FUTURE_INSTALLMENTS.md`, `IDEAS_module_expansion.md`*)

- **A living module library** — the escrow system stages candidates; tier 1 candidates
  graduate to the unified shell. The library grows by proven installments, not by
  bulk addition. (*`NGL_TOTAL_AUDIT_20260627.md`*)

---

## 3. Creative Philosophy

### Art direction over tool-building
The lab is authored. It should feel like a single designer's visual language —
restrained, moody, graphite-forward — not a sampler of every possible algorithm.
New modules are evaluated against this standard before they are promoted.

### The three-value structure
Every module's default should land on three luminance values:
- **Dark ground** (~10–15% luminance)
- **Mid field**
- **Small bright focal** (~85–95% luminance)

"Most flat-looking generative art is mid-grey soup; enforcing this one rule fixes
80% of it." (*`IDEAS_module_expansion.md` Part 3*)

### Negative space is first-class
Field modules should not fill the frame at default density. Roughly 30–50% of the
canvas should be open ground at default settings. Depth and form only read against
emptiness. (*`IDEAS_module_expansion.md` Part 3, `ARCHITECTURAL_ALGORITHMIC_MODULE_IDEAS_20260627.md`*)

### Palette discipline
Restrict each palette to a 3-value structure (bg / accent / ink). Two hues plus one
neutral beats five hues. A third hue should be rare and intentional. (*`IDEAS_module_expansion.md` Part 3*)

### Composition defaults
- One focal point, biased off-center toward a thirds intersection.
- Atmospheric depth: fade background elements toward bg color, bring focal forward.
- Value before color: if it works in greyscale, color only helps.
- An anchor line (horizon, baseline, ground plane) gives the eye somewhere to stand.

(*`IDEAS_module_expansion.md` Part 5*)

### The noixzy house look
- Dark, monochromatic, graphite-forward with an orange accent `#ed5700`.
- Restrained, moody — "never tech guy in a cinematic room."
- Finishing: high-ish contrast, subtle vignette (~0.2–0.3), light grain (~0.04–0.08,
  never 0 for the "shot on something" feel), gentle bloom on brightest 10% only.
- The CRT / noir rail of the unified shell extends this aesthetic into the UI.

(*`CHATGPT_BRIEF.md`, `IDEAS_module_expansion.md` Part 3, `NGL_UNIFIED_SHELL_HANDOFF_20260627.md`*)

### Production language, not decoration
Patterns and fields are raw material. The reaction-diffusion output becomes a displacement
map. The voronoi cells become scatter points. The SDF blobs rebuild as Blender metaballs.
"This isn't art for its own sake — it's a feeder for production." (*`OVERVIEW.md`*)

---

## 4. Production Philosophy

### Modules are self-contained deliverables
Every module opens by double-click, with no server, no build step, no dependencies beyond
p5.js from CDN. This is a hard constraint that enables offline use, direct Blender import,
and frictionless handoff. (*`READ_FIRST.md`, `HANDOFF.md`*)

### Two copies: working and use
- `~/noixzy_generative_lab/` — source of truth (working copy)
- `~/Downloads/noixzy_generative_lab/` — the open/use copy (kept in sync)

All changed files must be mirrored after any session. (*`READ_FIRST.md`, `HANDOFF.md`*)

### The generator contract
Nine (originally) engine modules are generated from one source (`build_lab.js`). When a
shared feature is added, all generated modules receive it at once. The generator is the
source of truth; the generated HTML is the artifact. **Never hand-edit generated HTML.**
(*`READ_FIRST.md`, `HANDOFF.md`, `CODEX_QUEUE.md`*)

### Flagship modules encode the full intention
`grid_extrude` is the hand-authored reference for the complete control stack — full
material, depth, frame, look, motion, pins, palettes. When a new feature is added to the
engine, it must eventually be replicated into the flagships too. (*`HANDOFF.md`,
`CODEX_TASK_theme_system.md`*)

### Installment-based growth
The project grows in bounded, tested installments. Each installment adds verified modules
and verified features — no half-finished implementations, no tasks started that cannot be
finished. (*`READ_FIRST.md`, `CODEX_QUEUE.md`*)

### Additive work — no regressions
Existing params, pins, reset, palettes, save PNG, full-bleed translucent UI, and the
gallery must not be broken by new work. Any change that removes existing capability is a
regression. (*`READ_FIRST.md`, `CODEX_QUEUE.md`*)

---

## 5. Engineering Philosophy

### One shared engine, two flagship exceptions
The lab is engineered around a single shared engine that generates the bulk of its modules.
Two architectural choices are deliberately outside the engine: `grid_extrude` (the isometric
reference implementation) and the SDF / WebGL flagships (per-module shaders). Both still
follow the same UI and visual language as the engine; they diverge only in render path.

### Static renders, animated transforms
Engine modules are **static** — the simulation computes on `dirty` (seed/param change) and
is cached into a scene buffer. Motion (speed/drift) animates a CSS/canvas transform on the
buffer, not a per-frame re-simulation. This is what enables 60fps. (*`HANDOFF.md`*)

### GPU compositing, not CPU pixel loops
Post-processing is GPU-composited (canvas filters + overlays), not a CPU pixel loop.
Per-pixel work on the CPU is reserved for simulation passes that have no GPU equivalent.
(*`HANDOFF.md`*)

### Separation of geometry and presentation
The `heightField(G)` function returns a `Float32Array` of normalized heights. The
`renderHeightfield()` function consumes it and draws it. These are separate concerns:
the geometry source and the renderer are decoupled so that future export paths (PBR maps,
SVG, Blender JSON) can consume the same geometry. (*`CODEX_TASK_volumetric_extrude.md`*)

### Genuine extrusion vs 2.5D illusion — be honest
The lab makes a clear distinction between genuinely volumetric rendering and 2.5D depth
illusion. Only `grid_extrude` and the four WebGL/SDF modules produce genuine geometry.
All other canvas 2D modules produce depth through shading, line weight, and perspective
tricks. Labeling a depth-illusion slider "extrude" is misleading; it should be labeled
"relief" or "depth illusion." (*`NGL_TOTAL_AUDIT_20260627.md`, `NGL_CREATIVE_DIRECTOR_REPORT_20260627.md`*)

### Verify in a real browser
A clean parse is not proof. Every change must be opened in a browser, rendered, and
confirmed: it renders, controls respond, console is clean. `python3 -m http.server` is
the standard verification server. (*`READ_FIRST.md`, `CODEX_QUEUE.md`*)

### Bounded performance
Every simulation must be bounded: cap particle counts, reduce grid resolution for heavy
CA modules, pre-allocate typed arrays (Float32Array, Uint32Array), never create new
arrays per frame in hot paths. High-CPU-risk modules (falling sand, cyclic CA) must have
fallback resolution or frame-skipping strategies. (*`NGL_TOTAL_AUDIT_20260627.md`*)
