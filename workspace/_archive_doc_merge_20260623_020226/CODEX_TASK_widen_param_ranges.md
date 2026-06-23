# Codex task (add-on) — widen all parameter ranges

Paste this whole file to Codex. Self-contained; Codex has no prior chat. Read
`~/noixzy_generative_lab/workspace/HANDOFF.md` first for context.

---

## Goal

**Increase the range of every slider** across the lab so each control can push much further than
it does now — for more extreme, expressive looks. **Defaults do not change** — only the
min/max bounds widen. Existing looks must render identically until a slider is moved.

## Repo facts (do not break these)

- The 9 engine modules are **GENERATED** by `~/noixzy_generative_lab/build_lab.js`. **Edit the
  generator, then `node build_lab.js`.** Do NOT hand-edit generated HTML. `grid_extrude` and
  `sdf_raymarch` are hand-authored — edit their HTML directly.
- Self-contained (CDN only, double-click to open). UI binds in `setup()`, never
  `DOMContentLoaded`. p5 GLOBAL mode.
- After building, mirror changed files to `~/Downloads/noixzy_generative_lab/`.

## Required approach

1. Find every slider definition (across `system`, `material`, `depth`, `frame`, `look`, `motion`)
   in `build_lab.js` and in both flagships.
2. **Widen the min/max** on each — a good rule of thumb: roughly **2× the current usable span**
   (e.g. extend max upward, and lower the min where a negative/sub-zero value is meaningful, like
   contrast, displace, drift, rotate, zoom). Keep step sizes sensible (finer step where the new
   range is large).
3. **Leave the default value of every param exactly as it is.** Only the bounds move.
4. **Respect hard limits.** Do NOT push past values that would break or be invalid:
   - `opacity`, probabilities, and any normalized 0..1 param → keep clamped to `0..1`.
   - palette index / discrete selectors / symmetry-fold counts → leave as-is (not continuous).
   - anything used as an array length / grid resolution → widen but keep integer + a safe ceiling
     so it can't freeze the browser (cap so worst case still renders).
5. Where a wider range can produce NaN/Inf or a blank frame (e.g. extreme scale, zero division),
   add a clamp/guard in the render path so the canvas never goes empty or errors.

## Acceptance criteria

- Every continuous slider has a visibly larger range; pushing to the new extremes produces
  stronger looks **without console errors or blank frames**.
- At default positions, every module looks **identical to before** (defaults unchanged).
- `opacity` / normalized params still clamp to `0..1`; discrete selectors unchanged.
- `node build_lab.js` regenerates cleanly; both flagships updated the same way; files mirrored to
  `~/Downloads/noixzy_generative_lab/`. No regressions to pins, reset, save png, palettes,
  symmetry, motion.

## How to verify

`python3 -m http.server`, open a few modules from `~/Downloads/noixzy_generative_lab/<id>/`,
drag each slider to both new extremes, confirm it still renders and the console is clean. Reload
and confirm the default frame is unchanged.

## Out of scope

Don't change defaults, add params, add modules, or touch the volumetric-extrude / theme tasks,
the Blender projects, or the gallery. Keep it self-contained (no build step beyond
`node build_lab.js`). File-header author credit, if any: **Chris Tucker** only.
