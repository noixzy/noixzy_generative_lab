# Codex task — true volumetric extrude for the field modules

Paste this whole file to Codex as the task. It is self-contained; Codex has no access to
prior chat. Read `~/noixzy_generative_lab/workspace/HANDOFF.md` first for context.

---

## Goal

Replace the weak "offset-stamp" extrude with **true volumetric (heightfield) extrude** on the
**field modules**, where the current stamp barely reads because they fill the frame:

- `voronoi`, `reaction_diffusion`, `cellular_erosion`, `sdf` (required)
- `contour_field` (nice-to-have), `flow_field` (skip — particle trails, no useful heightfield)

Leave `grid_extrude` (already real 3D), `sdf_raymarch` (already 3D), `truchet`, `l_system`,
`recursive_grid` on their current behavior.

When the **extrude** slider > 0, the module should render its output as an **isometric
extruded heightfield** (real columns with lit tops + shaded sides), not a flat image with
offset copies. At extrude = 0 it must look exactly like today (flat).

## Repo facts (do not break these)

- Modules live at `~/noixzy_generative_lab/<id>/noixzy_<id>.html`. The field modules are
  **generated** — edit `~/noixzy_generative_lab/build_lab.js` and run `node build_lab.js`.
  Do NOT hand-edit the generated HTML; it gets overwritten.
- Each module supplies `build()` (compute state from seed) and `render(g,pal)` (draw into a
  p5.Graphics buffer `g`). The shared engine handles material/depth/frame/look/motion, the
  full-bleed canvas, the translucent panel, pins/reset/palettes.
- `pal` is `[[r,g,b]bg, [r,g,b]accent, [r,g,b]ink]`. `P` is the live params object; key params:
  `P.extrude`, `P.displace`, `P.light` does not exist for field pieces (only grid_extrude) —
  add a sensible fixed light, or reuse `P.metallic`/`P.rough`/`P.sheen` for top shading.
- p5 GLOBAL mode. UI binds in `setup()`, never `DOMContentLoaded`. Self-contained HTML
  (CDN p5) so it opens by double-click. Keep it that way.
- After building, also copy changed files to `~/Downloads/noixzy_generative_lab/`.

## Required approach

1. **Per-module height source.** Add to each field module a `heightField(G)` that returns a
   `Float32Array(G*G)` of normalized heights 0..1 (from its existing `build()` state):
   - `voronoi`: each cell a **flat-top prism** — height = a per-cell constant (hash of cell
     index, or relaxed-cell area). Distance-to-edge can bevel if you want.
   - `reaction_diffusion`: height = clamp(a − b).
   - `cellular_erosion`: height = the already-computed distance-to-edge depth (CED/CE_MX).
   - `sdf`: height = clamp(−field) (depth inside blobs → domes).
   - `contour_field`: height = the layered noise value (optionally quantized to the `levels`
     param for stepped terraces).

2. **Shared iso renderer in the engine.** Add one function, e.g.
   `renderHeightfield(g, heights, G, pal, opts)`, that:
   - Downsamples to a grid `G` ≈ 120–150 (tune for 60fps; see perf below).
   - Uses an oblique/iso projection (e.g. screen `sx = x + z*0.5*depth`, `sy = y − h*depth`
     where `h` is height) — pick a clean fixed iso angle.
   - Draws cells **back-to-front** (painter's algorithm) as columns: a **top quad** (lit by
     height + palette, brighter with `P.metallic`/`(1−P.rough)` sheen) and the **visible side
     quads** (darker). Skip zero-height cells so negative space stays open.
   - Height in world units = `P.extrude * MAX_DEPTH`.
   - Honors palette (top = accent/ink ramp by height, sides = darkened base).

3. **Gate it.** In the engine render path, if the module has `volumetric:true` AND
   `P.extrude > 0.01`, call `renderHeightfield(...)` into the scene buffer instead of the flat
   `render()`. Otherwise keep the existing flat `render()` (and the existing stamp-extrude can
   stay for the non-field modules, or be removed for volumetric ones). Add `volumetric:true`
   to the field module configs.

4. **Displace still works.** `P.displace` should still warp the result (it's applied at
   composite). Frame/look/motion/material must keep working unchanged.

## Performance (important)

- The heightfield render is the heavy step. Render it **only on `dirty`** (param/seed change),
  into the cached scene buffer — NOT every frame. Motion (speed/drift) already animates via the
  shared composite transform, so the buffer can stay static. (If a module sets a per-frame
  animate flag, keep G small.)
- Target ≥ 50fps on a 1280×800 window. G≈130 → ~17k columns drawn once on change is fine.
- Use `g.quad()` fills, `g.noStroke()`. Avoid per-pixel `loadPixels` loops.

## Acceptance criteria

- voronoi / reaction_diffusion / cellular_erosion / sdf show clear 3D relief when extrude > 0,
  with lit tops and shaded sides, reading as real volume (not a flat image).
- extrude = 0 looks identical to current flat output.
- displace, symmetry, palette (all 10), material, look, motion, pins, reset, save png still work.
- No console errors. Controls bound (test: clicking "new seed" changes the on-canvas seed).
- `node build_lab.js` regenerates cleanly; changed files copied to `~/Downloads/...`.
- Refresh gallery thumbnails afterward: `node contact_sheet.js` (optional but nice).

## How to verify

Open each changed module from `~/Downloads/noixzy_generative_lab/<id>/noixzy_<id>.html` in a
browser, push **extrude** up, rotate via **frame > rotate**, and confirm it reads as 3D.
Check the console is clean and "new seed" / sliders respond.

## Out of scope

Don't touch grid_extrude, sdf_raymarch, the gallery layout, or the Blender projects.
Keep everything self-contained (no build step beyond `node build_lab.js`, no new deps).
